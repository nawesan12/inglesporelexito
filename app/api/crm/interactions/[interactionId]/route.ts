import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function PATCH(
  request: Request,
  { params }: { params: { interactionId: string } }
) {
  try {
    const payload = await request.json();
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
      where: { id: params.interactionId },
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

export async function DELETE(
  _request: Request,
  { params }: { params: { interactionId: string } }
) {
  try {
    await prisma.interaction.delete({ where: { id: params.interactionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete interaction", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la interacción" },
      { status: 500 }
    );
  }
}
