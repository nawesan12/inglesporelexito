import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DealStage } from "@prisma/client";

const STAGE_VALUES = new Set(Object.values(DealStage));

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: true,
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error("Failed to fetch deals", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las oportunidades" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const title = sanitizeString(payload.title);
    const contactId = sanitizeString(payload.contactId);
    const value = Number(payload.value) || 0;

    if (!title || !contactId) {
      return NextResponse.json(
        { error: "El título y el contacto son obligatorios" },
        { status: 400 }
      );
    }

    const stage =
      typeof payload.stage === "string" && STAGE_VALUES.has(payload.stage as DealStage)
        ? (payload.stage as DealStage)
        : DealStage.QUALIFICATION;

    let companyId: string | undefined = undefined;
    if (payload.companyId) {
      companyId = payload.companyId;
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        contactId,
        value,
        stage,
        probability: payload.probability ? Number(payload.probability) : null,
        expectedClose: payload.expectedClose ? new Date(payload.expectedClose) : null,
        notes: sanitizeString(payload.notes),
        companyId,
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
        company: true,
        tasks: true,
      },
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error("Failed to create deal", error);
    return NextResponse.json(
      { error: "No se pudo crear la oportunidad" },
      { status: 500 }
    );
  }
}
