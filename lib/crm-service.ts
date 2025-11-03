import { prisma } from "@/lib/prisma";
import {
  ContactStatus,
  DealStage,
  TaskStatus,
  Prisma,
} from "@/generated/client";

type ContactWithRelations = Prisma.ContactGetPayload<{
  include: {
    company: true;
    deals: true;
    tasks: true;
  };
}>;

type DealWithRelations = Prisma.DealGetPayload<{
  include: {
    contact: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
      };
    };
    company: true;
    tasks: true;
  };
}>;

type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    contact: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
      };
    };
    deal: {
      select: {
        id: true;
        title: true;
      };
    };
  };
}>;

type InteractionWithRelations = Prisma.InteractionGetPayload<{
  include: {
    contact: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
      };
    };
    deal: {
      select: {
        id: true;
        title: true;
      };
    };
  };
}>;

export type CRMOverview = {
  contacts: ContactWithRelations[];
  deals: DealWithRelations[];
  tasks: TaskWithRelations[];
  interactions: InteractionWithRelations[];
  summary: {
    totalPipelineValue: number;
    openDeals: number;
    activeContacts: number;
    overdueTasks: number;
    recentInteractions: number;
  };
};

const emptyOverview: CRMOverview = {
  contacts: [],
  deals: [],
  tasks: [],
  interactions: [],
  summary: {
    totalPipelineValue: 0,
    openDeals: 0,
    activeContacts: 0,
    overdueTasks: 0,
    recentInteractions: 0,
  },
};

export async function getCRMOverview(): Promise<CRMOverview> {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "DATABASE_URL is not configured. Returning empty CRM overview for build time compatibility."
      );
    }

    return emptyOverview;
  }

  try {
    const [contacts, deals, tasks, interactions] = await Promise.all([
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
      prisma.interaction.findMany({
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
      }),
    ]);

    const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const closedStages: DealStage[] = [DealStage.WON, DealStage.LOST];
    const openDeals = deals.filter(
      (deal) => !closedStages.includes(deal.stage)
    );
    const activeContacts = contacts.filter(
      (contact) => contact.status === ContactStatus.ACTIVE
    );
    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      if (task.status === TaskStatus.COMPLETED) return false;
      return task.dueDate.getTime() < Date.now();
    });
    const recentInteractions = interactions.filter((interaction) => {
      const occurredAt = interaction.occurredAt;
      const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
      return occurredAt.getTime() >= cutoff;
    });

    return {
      contacts,
      deals,
      tasks,
      interactions,
      summary: {
        totalPipelineValue,
        openDeals: openDeals.length,
        activeContacts: activeContacts.length,
        overdueTasks: overdueTasks.length,
        recentInteractions: recentInteractions.length,
      },
    };
  } catch (error) {
    console.error("Failed to load CRM overview data", error);
    return emptyOverview;
  }
}

export type CRMContact = CRMOverview["contacts"][number];
export type CRMDeal = CRMOverview["deals"][number];
export type CRMTask = CRMOverview["tasks"][number];
export type CRMInteraction = CRMOverview["interactions"][number];
export type CRMSummary = CRMOverview["summary"];

export {
  CONTACT_STATUS_OPTIONS,
  DEAL_STAGE_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "@/lib/crm-options";
