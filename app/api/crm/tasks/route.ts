import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskPriority, TaskStatus } from "@prisma/client";

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
