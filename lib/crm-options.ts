import type {
  ContactStatus,
  DealStage,
  TaskPriority,
  TaskStatus,
} from "@/generated/client";

export const CONTACT_STATUS_OPTIONS = [
  "LEAD",
  "ACTIVE",
  "CHURNED",
] as const satisfies readonly ContactStatus[];

export const DEAL_STAGE_OPTIONS = [
  "QUALIFICATION",
  "NEEDS_ANALYSIS",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const satisfies readonly DealStage[];

export const TASK_STATUS_OPTIONS = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
] as const satisfies readonly TaskStatus[];

export const TASK_PRIORITY_OPTIONS = [
  "LOW",
  "MEDIUM",
  "HIGH",
] as const satisfies readonly TaskPriority[];

export type ContactStatusOption = (typeof CONTACT_STATUS_OPTIONS)[number];
export type DealStageOption = (typeof DEAL_STAGE_OPTIONS)[number];
export type TaskStatusOption = (typeof TASK_STATUS_OPTIONS)[number];
export type TaskPriorityOption = (typeof TASK_PRIORITY_OPTIONS)[number];
