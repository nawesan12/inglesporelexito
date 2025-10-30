export const CONTACT_STATUS_OPTIONS = [
  "LEAD",
  "ACTIVE",
  "CHURNED",
] as const;

export const DEAL_STAGE_OPTIONS = [
  "QUALIFICATION",
  "NEEDS_ANALYSIS",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

export const TASK_STATUS_OPTIONS = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

export const TASK_PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"] as const;

export type ContactStatusOption = (typeof CONTACT_STATUS_OPTIONS)[number];
export type DealStageOption = (typeof DEAL_STAGE_OPTIONS)[number];
export type TaskStatusOption = (typeof TASK_STATUS_OPTIONS)[number];
export type TaskPriorityOption = (typeof TASK_PRIORITY_OPTIONS)[number];
