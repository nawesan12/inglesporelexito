import { prisma } from "@/lib/prisma";
import {
  ContactStatus,
  DealStage,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";

export async function getCRMOverview() {
  const [contacts, deals, tasks] = await Promise.all([
    prisma.contact.findMany({
      include: {
        company: true,
        deals: true,
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.deal.findMany({
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
    }),
    prisma.task.findMany({
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
    }),
  ]);

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const openDeals = deals.filter(
    (deal) => ![DealStage.WON, DealStage.LOST].includes(deal.stage)
  );
  const activeContacts = contacts.filter(
    (contact) => contact.status === ContactStatus.ACTIVE
  );
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    if (task.status === TaskStatus.COMPLETED) return false;
    return task.dueDate.getTime() < Date.now();
  });

  return {
    contacts,
    deals,
    tasks,
    summary: {
      totalPipelineValue,
      openDeals: openDeals.length,
      activeContacts: activeContacts.length,
      overdueTasks: overdueTasks.length,
    },
  };
}

export type CRMOverview = Awaited<ReturnType<typeof getCRMOverview>>;
export type CRMContact = CRMOverview["contacts"][number];
export type CRMDeal = CRMOverview["deals"][number];
export type CRMTask = CRMOverview["tasks"][number];
export type CRMSummary = CRMOverview["summary"];

export const CONTACT_STATUS_OPTIONS = Object.values(ContactStatus);
export const DEAL_STAGE_OPTIONS = Object.values(DealStage);
export const TASK_STATUS_OPTIONS = Object.values(TaskStatus);
export const TASK_PRIORITY_OPTIONS = Object.values(TaskPriority);
