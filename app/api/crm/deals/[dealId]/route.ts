import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DealStage } from "@/generated/client";

const STAGE_VALUES = new Set(Object.values(DealStage));

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET(
  _request: Request,
  { params }: { params: { dealId: string } }
) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.dealId },
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

    if (!deal) {
      return NextResponse.json(
        { error: "Oportunidad no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ deal });
  } catch (error) {
    console.error("Failed to fetch deal", error);
    return NextResponse.json(
      { error: "No se pudo obtener la oportunidad" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { dealId: string } }
) {
  try {
    const payload = await request.json();
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

    if (typeof payload.stage === "string" && STAGE_VALUES.has(payload.stage as DealStage)) {
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
      where: { id: params.dealId },
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

export async function DELETE(
  _request: Request,
  { params }: { params: { dealId: string } }
) {
  try {
    await prisma.deal.delete({ where: { id: params.dealId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete deal", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la oportunidad" },
      { status: 500 }
    );
  }
}
