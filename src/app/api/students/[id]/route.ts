import { NextRequest } from "next/server"
import { apiError, apiSuccess } from "@/lib/api-response"
import { getErrorMessage, isUniqueViolation } from "@/lib/error-utils"
import { getSessionUser } from "@/lib/session"
import {
  createAuditLog,
  deleteStudent,
  getStudentById,
  setStudentActive,
  updateStudent,
} from "@/db/queries"
import { updateStudentSchema } from "@/db/validations"
import { tryClassKeyFromRoll } from "@/lib/class-key"
import { parseRollNumber } from "@/lib/roll-number"

export const dynamic = "force-dynamic"

const studentUpdateSchema = updateStudentSchema.pick({
  firstName: true,
  lastName: true,
  rollNumber: true,
  email: true,
  department: true,
  division: true,
  year: true,
  isActive: true,
})

function validationMessage(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "Invalid student data"
}

export type StudentUpdateInput = {
  firstName?: string
  lastName?: string
  rollNumber?: string
  email?: string | null
  department?: string
  division?: string | null
  year?: string
}

export function buildStudentUpdatePayload(
  data: StudentUpdateInput,
  existing: {
    rollNumber: string
    email: string | null
    classKey: string | null
    department: string
    division: string | null
  }
) {
  const rollNumber =
    data.rollNumber !== undefined
      ? data.rollNumber.trim().toUpperCase()
      : existing.rollNumber
  const rollNumberChanged =
    data.rollNumber !== undefined && rollNumber !== existing.rollNumber

  const department =
    data.department !== undefined
      ? data.department.trim().toUpperCase()
      : existing.department
  const division =
    data.division !== undefined
      ? data.division
        ? data.division.toUpperCase()
        : null
      : existing.division

  const payload: Partial<{
    firstName: string
    lastName: string
    rollNumber: string
    email: string | null
    department: string
    division: string | null
    year: string
    classKey: string | null
  }> = {}

  if (data.firstName !== undefined) {
    payload.firstName = data.firstName.trim()
  }
  if (data.lastName !== undefined) {
    payload.lastName = data.lastName.trim()
  }
  if (data.rollNumber !== undefined) {
    payload.rollNumber = rollNumber
  }
  if (data.department !== undefined) {
    payload.department = department
  }
  if (data.division !== undefined) {
    payload.division = division
  }
  if (data.year !== undefined) {
    payload.year = data.year
  }
  if (data.email !== undefined) {
    payload.email =
      data.email && data.email.trim() ? data.email.trim().toLowerCase() : null
  }
  if (rollNumberChanged) {
    payload.classKey = tryClassKeyFromRoll(rollNumber)
  }

  return {
    rollNumber,
    rollNumberChanged,
    department,
    division,
    payload,
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser()
    if (!user) return apiError("Unauthorized", 401)
    if (user.tier !== "super_admin") return apiError("Forbidden", 403)

    const { id } = await params
    const existing = await getStudentById(id, true)
    if (!existing) return apiError("Student not found", 404)

    const parsed = studentUpdateSchema.safeParse(await request.json())
    if (!parsed.success) return apiError(validationMessage(parsed.error), 400)
    const { isActive, ...data } = parsed.data
    if (isActive !== undefined && Object.keys(data).length === 0) {
      if (isActive === existing.isActive) return apiSuccess(existing)
      const updated = await setStudentActive(id, isActive)
      if (!updated) return apiError("Student not found", 404)
      await createAuditLog({
        action: isActive ? "student.reactivated" : "student.deactivated",
        actorId: user.id,
        targetType: "student",
        targetId: id,
        details: { rollNumber: existing.rollNumber },
      })
      return apiSuccess(updated)
    }
    if (Object.keys(data).length === 0) {
      return apiError("No fields to update", 400)
    }

    const {
      rollNumber,
      department,
      division,
      payload: updatePayload,
    } = buildStudentUpdatePayload(data, existing)

    try {
      const roll = parseRollNumber(rollNumber)
      if (roll.department && roll.department !== department) {
        return apiError(
          `Department does not match roll number (roll says ${roll.department})`,
          400
        )
      }
      if (division && roll.division !== division) {
        return apiError(
          `Division does not match roll number (roll says ${roll.division})`,
          400
        )
      }
    } catch (error) {
      return apiError(
        error instanceof Error ? error.message : "Invalid roll number",
        400
      )
    }

    const updated = await updateStudent(id, updatePayload)
    if (!updated) return apiError("Student not found", 404)

    await createAuditLog({
      action: "student.updated",
      actorId: user.id,
      targetType: "student",
      targetId: id,
      details: { changed: Object.keys(data) },
    })
    return apiSuccess(updated)
  } catch (error) {
    if (isUniqueViolation(error)) {
      return apiError(
        "A student with that roll number or email already exists",
        409
      )
    }
    return apiError(getErrorMessage(error, "Could not update student"), 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser()
    if (!user) return apiError("Unauthorized", 401)
    if (user.tier !== "super_admin") return apiError("Forbidden", 403)

    const { id } = await params
    const existing = await getStudentById(id, true)
    if (!existing) return apiError("Student not found", 404)
    const deleted = await deleteStudent(id)
    if (!deleted) return apiError("Student not found", 404)

    await createAuditLog({
      action: "student.deleted",
      actorId: user.id,
      targetType: "student",
      targetId: id,
      details: { rollNumber: existing.rollNumber, isActive: existing.isActive },
    })
    return apiSuccess({ id, deleted: true })
  } catch (error) {
    return apiError(getErrorMessage(error, "Could not delete student"), 500)
  }
}
