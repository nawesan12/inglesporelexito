import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactStatus, DealStage, TaskStatus } from "@prisma/client";

export async function GET() {
  try {
    const [
      totalContacts,
      activeContacts,
      openDeals,
      wonDealsValue,
      overdueTasks,
      recentInteractions,
    ] = await Promise.all([
        prisma.contact.count(),
        prisma.contact.count({ where: { status: ContactStatus.ACTIVE } }),
        prisma.deal.count({
          where: { NOT: { stage: { in: [DealStage.WON, DealStage.LOST] } } },
        }),
        prisma.deal.aggregate({
          where: { stage: DealStage.WON },
          _sum: { value: true },
        }),
        prisma.task.count({
          where: {
            status: { not: TaskStatus.COMPLETED },
            dueDate: { lt: new Date() },
          },
        }),
        prisma.interaction.count({
          where: {
            occurredAt: {
              gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

    return NextResponse.json({
      summary: {
        totalContacts,
        activeContacts,
        openDeals,
        wonDealsValue: wonDealsValue._sum.value ?? 0,
        overdueTasks,
        recentInteractions,
      },
    });
  } catch (error) {
    console.error("Failed to generate CRM summary", error);
    return NextResponse.json(
      { error: "No se pudo calcular el resumen" },
      { status: 500 }
    );
  }
}
