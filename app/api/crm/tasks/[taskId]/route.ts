import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskPriority, TaskStatus } from "@/generated/client";

const STATUS_VALUES = new Set(Object.values(TaskStatus));
const PRIORITY_VALUES = new Set(Object.values(TaskPriority));

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function PATCH(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const payload = await request.json();
    const updateData: Record<string, unknown> = {};

    const title = sanitizeString(payload.title);
    const description = sanitizeString(payload.description);

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    if (payload.dueDate === null) {
      updateData.dueDate = null;
    } else if (typeof payload.dueDate === "string") {
      updateData.dueDate = new Date(payload.dueDate);
    }

    if (typeof payload.status === "string" && STATUS_VALUES.has(payload.status as TaskStatus)) {
      updateData.status = payload.status;
    }

    if (typeof payload.priority === "string" && PRIORITY_VALUES.has(payload.priority as TaskPriority)) {
      updateData.priority = payload.priority;
    }

    if (payload.contactId === null) {
      updateData.contactId = null;
    } else if (typeof payload.contactId === "string") {
      updateData.contactId = payload.contactId;
    }

    if (payload.dealId === null) {
      updateData.dealId = null;
    } else if (typeof payload.dealId === "string") {
      updateData.dealId = payload.dealId;
    }

    const task = await prisma.task.update({
      where: { id: params.taskId },
      data: updateData,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Failed to update task", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la tarea" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    await prisma.task.delete({ where: { id: params.taskId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la tarea" },
      { status: 500 }
    );
  }
}
