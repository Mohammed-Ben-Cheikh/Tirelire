// src/utils/constants.js

const USER_ROLES = {
  PARTICULIER: "particulier",
  ADMIN: "admin",
};

const KYC_STATUS = {
  PENDING: "pending",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const GROUP_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const GROUP_MEMBER_STATUS = {
  INVITED: "invited",
  ACTIVE: "active",
  INACTIVE: "inactive",
  LEFT: "left",
};

const GROUP_MEMBER_ROLE = {
  ADMIN: "admin",
  MEMBER: "member",
};

const TURN_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  OVERDUE: "overdue",
};

const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  CONFIRMED: "confirmed",
  DISPUTED: "disputed",
  CANCELLED: "cancelled",
};

const MESSAGE_TYPE = {
  TEXT: "text",
  AUDIO: "audio",
  SYSTEM: "system",
};

const NOTIFICATION_TYPE = {
  NEW_TURN: "new_turn",
  PAYMENT_REMINDER: "payment_reminder",
  PAYMENT_RECEIVED: "payment_received",
  PAYMENT_CONFIRMED: "payment_confirmed",
  PAYMENT_OVERDUE: "payment_overdue",
  NEW_MESSAGE: "new_message",
  GROUP_INVITATION: "group_invitation",
  KYC_APPROVED: "kyc_approved",
  KYC_REJECTED: "kyc_rejected",
  TICKET_RESPONSE: "ticket_response",
};

const TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

const TICKET_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

const SORTING_METHOD = {
  RANDOM: "random",
  BY_SCORE: "by_score",
  MANUAL: "manual",
};

const FREQUENCY_TYPE = {
  DAILY: "daily",
  WEEKLY: "weekly",
  BIWEEKLY: "biweekly",
  MONTHLY: "monthly",
};

export default {
  USER_ROLES,
  KYC_STATUS,
  GROUP_STATUS,
  GROUP_MEMBER_STATUS,
  GROUP_MEMBER_ROLE,
  TURN_STATUS,
  PAYMENT_STATUS,
  MESSAGE_TYPE,
  NOTIFICATION_TYPE,
  TICKET_STATUS,
  TICKET_PRIORITY,
  SORTING_METHOD,
  FREQUENCY_TYPE,
};
