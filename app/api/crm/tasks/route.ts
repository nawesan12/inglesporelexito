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

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
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
      orderBy: [
        { status: "asc" },
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Failed to fetch tasks", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las tareas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const title = sanitizeString(payload.title);

    if (!title) {
      return NextResponse.json(
        { error: "El título de la tarea es obligatorio" },
        { status: 400 }
      );
    }

    const status =
      typeof payload.status === "string" && STATUS_VALUES.has(payload.status as TaskStatus)
        ? (payload.status as TaskStatus)
        : TaskStatus.OPEN;

    const priority =
      typeof payload.priority === "string" && PRIORITY_VALUES.has(payload.priority as TaskPriority)
        ? (payload.priority as TaskPriority)
        : TaskPriority.MEDIUM;

    const task = await prisma.task.create({
      data: {
        title,
        description: sanitizeString(payload.description),
        dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
        status,
        priority,
        contactId: sanitizeString(payload.contactId),
        dealId: sanitizeString(payload.dealId),
      },
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

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task", error);
    return NextResponse.json(
      { error: "No se pudo crear la tarea" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const taskId = sanitizeString(payload.id ?? payload.taskId);

    if (!taskId) {
      return NextResponse.json(
        { error: "No se pudo identificar la tarea" },
        { status: 400 }
      );
    }

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

    if (
      typeof payload.status === "string" &&
      STATUS_VALUES.has(payload.status as TaskStatus)
    ) {
      updateData.status = payload.status;
    }

    if (
      typeof payload.priority === "string" &&
      PRIORITY_VALUES.has(payload.priority as TaskPriority)
    ) {
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
      where: { id: taskId },
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

export async function DELETE(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const taskId =
      payload && typeof payload.id === "string"
        ? sanitizeString(payload.id)
        : payload && typeof payload.taskId === "string"
          ? sanitizeString(payload.taskId)
          : undefined;

    if (!taskId) {
      return NextResponse.json(
        { error: "No se pudo identificar la tarea" },
        { status: 400 }
      );
    }

    await prisma.task.delete({ where: { id: taskId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la tarea" },
      { status: 500 }
    );
  }
}
