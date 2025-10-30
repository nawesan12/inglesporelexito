import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DealStage } from "@/generated/client";

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

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const dealId = sanitizeString(payload.id ?? payload.dealId);

    if (!dealId) {
      return NextResponse.json(
        { error: "No se pudo identificar la oportunidad" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    const title = sanitizeString(payload.title);
    const notes = sanitizeString(payload.notes);

    if (title !== undefined) updateData.title = title;
    if (notes !== undefined) updateData.notes = notes;

    if (typeof payload.value !== "undefined") {
      const numericValue = Number(payload.value);
      if (!Number.isNaN(numericValue)) {
        updateData.value = numericValue;
      }
    }

    if (typeof payload.probability !== "undefined") {
      const probability = Number(payload.probability);
      if (!Number.isNaN(probability)) {
        updateData.probability = probability;
      }
    }

    if (payload.expectedClose === null) {
      updateData.expectedClose = null;
    } else if (typeof payload.expectedClose === "string") {
      updateData.expectedClose = new Date(payload.expectedClose);
    }

    if (
      typeof payload.stage === "string" &&
      STAGE_VALUES.has(payload.stage as DealStage)
    ) {
      updateData.stage = payload.stage;
    }

    if (typeof payload.contactId === "string") {
      updateData.contactId = payload.contactId;
    }

    if (payload.companyId === null) {
      updateData.companyId = null;
    } else if (typeof payload.companyId === "string") {
      updateData.companyId = payload.companyId;
    }

    const deal = await prisma.deal.update({
      where: { id: dealId },
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
        company: true,
        tasks: true,
        interactions: true,
      },
    });

    return NextResponse.json({ deal });
  } catch (error) {
    console.error("Failed to update deal", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la oportunidad" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const dealId =
      payload && typeof payload.id === "string"
        ? sanitizeString(payload.id)
        : payload && typeof payload.dealId === "string"
          ? sanitizeString(payload.dealId)
          : undefined;

    if (!dealId) {
      return NextResponse.json(
        { error: "No se pudo identificar la oportunidad" },
        { status: 400 }
      );
    }

    await prisma.deal.delete({ where: { id: dealId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete deal", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la oportunidad" },
      { status: 500 }
    );
  }
}
