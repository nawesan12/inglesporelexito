import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@/generated/client";

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        company: true,
        deals: true,
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Failed to fetch contacts", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los contactos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const firstName = sanitizeString(payload.firstName);
    const lastName = sanitizeString(payload.lastName);
    const email = sanitizeString(payload.email);

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Nombre, apellido y email son obligatorios" },
        { status: 400 }
      );
    }

    let companyId: string | undefined = undefined;
    const companyName = sanitizeString(
      payload.company?.name ?? payload.companyName
    );
    const companyIndustry = sanitizeString(
      payload.company?.industry ?? payload.companyIndustry
    );
    const companyWebsite = sanitizeString(
      payload.company?.website ?? payload.companyWebsite
    );

    if (payload.companyId) {
      companyId = payload.companyId;
    } else if (companyName) {
      const company = await prisma.company.upsert({
        where: { name: companyName },
        update: {
          industry: companyIndustry,
          website: companyWebsite,
        },
        create: {
          name: companyName,
          industry: companyIndustry,
          website: companyWebsite,
        },
      });
      companyId = company.id;
    }

    const status =
      typeof payload.status === "string" && payload.status in ContactStatus
        ? (payload.status as ContactStatus)
        : ContactStatus.LEAD;

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: sanitizeString(payload.phone),
        position: sanitizeString(payload.position),
        source: sanitizeString(payload.source),
        notes: sanitizeString(payload.notes),
        status,
        companyId,
      },
      include: {
        company: true,
        deals: true,
        tasks: true,
      },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("Failed to create contact", error);
    return NextResponse.json(
      { error: "No se pudo crear el contacto" },
      { status: 500 }
    );
  }
}
