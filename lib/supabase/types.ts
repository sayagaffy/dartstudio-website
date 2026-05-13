export type ContactSubmission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  collaboration_model:
    | "technology-partner"
    | "architecture-consultant"
    | "strategic-investor"
    | "not-sure"
    | "open-discussion"
    | "other";
  message: string;
  budget_range: string | null;
  start_timeline: string | null;
  locale: "id" | "en";
  ip_address: string | null;
  user_agent: string | null;
  resend_message_id: string | null;
  status: "received" | "replied" | "declined" | "spam";
};

export type WaitlistSignup = {
  id: string;
  created_at: string;
  product_slug: string;
  email: string;
  name: string | null;
  locale: "id" | "en";
  ip_address: string | null;
  user_agent: string | null;
  notified_at: string | null;
};
