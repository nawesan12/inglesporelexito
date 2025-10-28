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
