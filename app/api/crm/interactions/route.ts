import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET() {
  try {
    const interactions = await prisma.interaction.findMany({
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { occurredAt: "desc" },
    });

    return NextResponse.json({ interactions });
  } catch (error) {
    console.error("Failed to fetch interactions", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las interacciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const channel = sanitizeString(payload.channel);
    const summary = sanitizeString(payload.summary);

    if (!channel || !summary) {
      return NextResponse.json(
        { error: "El canal y el resumen son obligatorios" },
        { status: 400 }
      );
    }

    const occurredAt = payload.occurredAt
      ? new Date(payload.occurredAt)
      : new Date();

    const interaction = await prisma.interaction.create({
      data: {
        channel,
        summary,
        occurredAt,
        contactId: sanitizeString(payload.contactId),
        dealId: sanitizeString(payload.dealId),
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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

    return NextResponse.json({ interaction }, { status: 201 });
  } catch (error) {
    console.error("Failed to create interaction", error);
    return NextResponse.json(
      { error: "No se pudo registrar la interacción" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const interactionId = sanitizeString(payload.id ?? payload.interactionId);

    if (!interactionId) {
      return NextResponse.json(
        { error: "No se pudo identificar la interacción" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    const channel = sanitizeString(payload.channel);
    const summary = sanitizeString(payload.summary);

    if (channel !== undefined) updateData.channel = channel;
    if (summary !== undefined) updateData.summary = summary;

    if (payload.occurredAt === null) {
      updateData.occurredAt = new Date();
    } else if (typeof payload.occurredAt === "string") {
      updateData.occurredAt = new Date(payload.occurredAt);
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

    const interaction = await prisma.interaction.update({
      where: { id: interactionId },
      data: updateData,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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

    return NextResponse.json({ interaction });
  } catch (error) {
    console.error("Failed to update interaction", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la interacción" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const interactionId =
      payload && typeof payload.id === "string"
        ? sanitizeString(payload.id)
        : payload && typeof payload.interactionId === "string"
          ? sanitizeString(payload.interactionId)
          : undefined;

    if (!interactionId) {
      return NextResponse.json(
        { error: "No se pudo identificar la interacción" },
        { status: 400 }
      );
    }

    await prisma.interaction.delete({ where: { id: interactionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete interaction", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la interacción" },
      { status: 500 }
    );
  }
}
