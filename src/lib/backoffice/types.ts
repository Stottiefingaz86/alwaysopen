export type ClientStatus = "active" | "paused" | "churned" | "prospect";
export type PaymentStatus = "current" | "overdue" | "unpaid" | "paid";
export type HealthStatus = "healthy" | "warning" | "failed" | "unknown";

export type OnboardingChecklist = {
  contract_signed: boolean;
  setup_fee_paid: boolean;
  agent_created: boolean;
  knowledge_base_added: boolean;
  elevenlabs_tool_configured: boolean;
  n8n_workflow_created: boolean;
  calendar_connected: boolean;
  phone_forwarding_tested: boolean;
  sms_tested: boolean;
  email_tested: boolean;
  voc_report_enabled: boolean;
  client_live: boolean;
};

export const DEFAULT_ONBOARDING: OnboardingChecklist = {
  contract_signed: false,
  setup_fee_paid: false,
  agent_created: false,
  knowledge_base_added: false,
  elevenlabs_tool_configured: false,
  n8n_workflow_created: false,
  calendar_connected: false,
  phone_forwarding_tested: false,
  sms_tested: false,
  email_tested: false,
  voc_report_enabled: false,
  client_live: false,
};

export type Client = {
  id: string;
  business_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  business_type: string | null;
  package_name: string | null;
  monthly_fee: number;
  setup_fee: number;
  included_minutes: number;
  overage_rate: number;
  status: string;
  payment_status: string | null;
  notes: string | null;
  onboarding_checklist: OnboardingChecklist;
  voc_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type ClientIntegration = {
  id: string;
  client_id: string;
  elevenlabs_agent_id: string | null;
  elevenlabs_agent_url: string | null;
  elevenlabs_phone_number_id: string | null;
  n8n_booking_workflow_url: string | null;
  n8n_cancel_workflow_url: string | null;
  n8n_voc_workflow_url: string | null;
  google_calendar_id: string | null;
  twilio_number: string | null;
  zadarma_number: string | null;
  whatsapp_status: string | null;
  booking_platform: string | null;
  booking_platform_notes: string | null;
};

export type ClientCredential = {
  id: string;
  client_id: string;
  platform_name: string;
  login_url: string | null;
  username: string | null;
  encrypted_password: string | null;
  encrypted_api_key: string | null;
  notes: string | null;
  owner: string | null;
  last_updated: string;
};

export type ClientPayment = {
  id: string;
  client_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  amount: number | null;
  status: string;
  invoice_url: string | null;
  due_date: string | null;
  paid_date: string | null;
  setup_fee_paid: boolean;
};

export type UsageLog = {
  id: string;
  client_id: string;
  month: string;
  elevenlabs_agent_id: string | null;
  elevenlabs_minutes: number;
  elevenlabs_synced_at: string | null;
  included_minutes: number;
  overage_minutes: number;
  overage_cost: number;
  sms_sent: number;
  emails_sent: number;
  bookings_created: number;
  cancellations_created: number;
  failed_workflows: number;
};

export type WorkflowHealth = {
  id: string;
  client_id: string;
  workflow_name: string;
  workflow_type: string | null;
  workflow_url: string | null;
  last_run: string | null;
  status: string | null;
  error_message: string | null;
  health_status: string | null;
};

export type ClientVocReport = {
  id: string;
  client_id: string;
  month: string;
  public_token: string | null;
  public_url: string | null;
  status: string;
  report_json: unknown;
  sent_at: string | null;
};

export type ClientBooking = {
  id: string;
  client_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  booking_date: string | null;
  booking_type: string | null;
  status: string | null;
  created_at: string;
};

export type ClientWithRelations = Client & {
  client_integrations: ClientIntegration | null;
  usage_logs: UsageLog[];
  client_payments: ClientPayment[];
  workflow_health: WorkflowHealth[];
};
