import {
  workflow,
  trigger,
  node,
  switchCase,
  ifElse,
  expr,
  newCredential,
  sticky,
} from '@n8n/workflow-sdk';

/**
 * ElevenLabs → webhook body:
 * - confirmation_channel: "whatsapp" | "email" (agent asks caller)
 * - customer_email required when channel is email
 * - action: check_availability | book | cancel
 */
const webhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'ElevenLabs Webhook',
    parameters: {
      httpMethod: 'POST',
      path: 'cursor-test',
      responseMode: 'responseNode',
      authentication: 'none',
    },
    position: [240, 400],
  },
  output: [
    {
      body: {
        action: 'book',
        client_id: '00000000-0000-0000-0000-000000000001',
        confirmation_channel: 'whatsapp',
        start: '2026-05-21T10:00:00Z',
        end: '2026-05-21T11:00:00Z',
        customer_name: 'Jane Doe',
        customer_phone: '+447700900000',
        customer_email: 'jane@example.com',
        service_id: 'haircut',
        party_size: 1,
        event_id: 'example_event_id',
      },
    },
  ],
});

const timelyApiBase = expr('={{ ($env.RINGSAWAY_API_BASE_URL ?? "https://ringsaway.com") + "/api/integrations/timely" }}');
const notificationsApiBase = expr(
  '={{ ($env.RINGSAWAY_API_BASE_URL ?? "https://ringsaway.com") + "/api/integrations/notifications" }}',
);
const marketingApiBase = expr(
  '={{ ($env.RINGSAWAY_API_BASE_URL ?? "https://ringsaway.com") + "/api/integrations/marketing" }}',
);

const routeAction = switchCase({
  version: 3.2,
  config: {
    name: 'Route by action',
    parameters: {
      mode: 'rules',
      rules: {
        values: [
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
              conditions: [
                {
                  leftValue: '={{ $json.body?.action ?? $json.action }}',
                  rightValue: 'check_availability',
                  operator: { type: 'string', operation: 'equals' },
                },
              ],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'Check availability',
          },
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
              conditions: [
                {
                  leftValue: '={{ $json.body?.action ?? $json.action }}',
                  rightValue: 'book',
                  operator: { type: 'string', operation: 'equals' },
                },
              ],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'Book appointment',
          },
          {
            conditions: {
              options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
              conditions: [
                {
                  leftValue: '={{ $json.body?.action ?? $json.action }}',
                  rightValue: 'cancel',
                  operator: { type: 'string', operation: 'equals' },
                },
              ],
              combinator: 'and',
            },
            renameOutput: true,
            outputKey: 'Cancel appointment',
          },
        ],
      },
      options: { fallbackOutput: 'extra', ignoreCase: true },
    },
    position: [520, 400],
  },
});

const emailConfirmationCondition = {
  options: { caseSensitive: false, leftValue: '', typeValidation: 'strict' },
  conditions: [
    {
      leftValue:
        '={{ ($("ElevenLabs Webhook").item.json.body?.confirmation_channel ?? $("ElevenLabs Webhook").item.json.confirmation_channel ?? "whatsapp").toLowerCase() }}',
      rightValue: 'email',
      operator: { type: 'string', operation: 'equals' },
    },
  ],
  combinator: 'and',
};

const bookEmailConfirmation = ifElse({
  version: 2.2,
  config: {
    name: 'Book — email confirmation?',
    parameters: { conditions: emailConfirmationCondition },
    position: [1080, 360],
  },
});

const cancelEmailConfirmation = ifElse({
  version: 2.2,
  config: {
    name: 'Cancel — email confirmation?',
    parameters: { conditions: emailConfirmationCondition },
    position: [1080, 640],
  },
});

const timelyCheckAvailability = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Timely — check availability',
    parameters: {
      method: 'POST',
      url: timelyApiBase,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(
        '={{ Object.assign({}, $("ElevenLabs Webhook").item.json.body ?? $("ElevenLabs Webhook").item.json, { action: "check_availability" }) }}',
      ),
    },
    credentials: { httpHeaderAuth: newCredential('RingsAway API') },
    position: [800, 160],
  },
  output: [{ success: true, available: true }],
});

const timelyBookAppointment = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Timely — book appointment',
    parameters: {
      method: 'POST',
      url: timelyApiBase,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(
        '={{ Object.assign({}, $("ElevenLabs Webhook").item.json.body ?? $("ElevenLabs Webhook").item.json, { action: "book" }) }}',
      ),
    },
    credentials: { httpHeaderAuth: newCredential('RingsAway API') },
    position: [800, 400],
  },
  output: [{ success: true, event_id: 'booking_uuid' }],
});

const timelyCancelAppointment = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Timely — cancel appointment',
    parameters: {
      method: 'POST',
      url: timelyApiBase,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(
        '={{ Object.assign({}, $("ElevenLabs Webhook").item.json.body ?? $("ElevenLabs Webhook").item.json, { action: "cancel" }) }}',
      ),
    },
    credentials: { httpHeaderAuth: newCredential('RingsAway API') },
    position: [800, 640],
  },
  output: [{ success: true, cancelled: true }],
});

const whatsAppBookingConfirmation = node({
  type: 'n8n-nodes-base.whatsApp',
  version: 1.1,
  config: {
    name: 'WhatsApp booking confirmation',
    parameters: {
      resource: 'message',
      operation: 'send',
      phoneNumberId: expr(
        '={{ $("ElevenLabs Webhook").item.json.body?.whatsapp_phone_number_id ?? $("ElevenLabs Webhook").item.json.whatsapp_phone_number_id }}',
      ),
      recipientPhoneNumber: expr(
        '={{ $("ElevenLabs Webhook").item.json.body?.customer_phone ?? $("ElevenLabs Webhook").item.json.customer_phone }}',
      ),
      messageType: 'text',
      textBody: expr(
        '={{ "Hi " + ($("ElevenLabs Webhook").item.json.body?.customer_name ?? $("ElevenLabs Webhook").item.json.customer_name ?? "there") + "! Your appointment is confirmed for " + ($("ElevenLabs Webhook").item.json.body?.start ?? $("ElevenLabs Webhook").item.json.start) + ". Reference: " + $("Timely — book appointment").item.json.event_id + "." }}',
      ),
    },
    credentials: { whatsAppApi: newCredential('WhatsApp account') },
    position: [1320, 280],
  },
  output: [{ messages: [{ id: 'wamid.example' }] }],
});

const emailBookingConfirmation = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Email booking confirmation',
    parameters: {
      method: 'POST',
      url: notificationsApiBase,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(
        '={{ { type: "booking_confirmation", customer_name: $("ElevenLabs Webhook").item.json.body?.customer_name ?? $("ElevenLabs Webhook").item.json.customer_name, customer_email: $("ElevenLabs Webhook").item.json.body?.customer_email ?? $("ElevenLabs Webhook").item.json.customer_email, start: $("ElevenLabs Webhook").item.json.body?.start ?? $("ElevenLabs Webhook").item.json.start, end: $("ElevenLabs Webhook").item.json.body?.end ?? $("ElevenLabs Webhook").item.json.end, event_id: $("Timely — book appointment").item.json.event_id } }}',
      ),
    },
    credentials: { httpHeaderAuth: newCredential('RingsAway API') },
    position: [1320, 120],
  },
  output: [{ success: true, channel: 'email' }],
});

const whatsAppCancellationNotice = node({
  type: 'n8n-nodes-base.whatsApp',
  version: 1.1,
  config: {
    name: 'WhatsApp cancellation notice',
    parameters: {
      resource: 'message',
      operation: 'send',
      phoneNumberId: expr(
        '={{ $("ElevenLabs Webhook").item.json.body?.whatsapp_phone_number_id ?? $("ElevenLabs Webhook").item.json.whatsapp_phone_number_id }}',
      ),
      recipientPhoneNumber: expr(
        '={{ $("ElevenLabs Webhook").item.json.body?.customer_phone ?? $("ElevenLabs Webhook").item.json.customer_phone }}',
      ),
      messageType: 'text',
      textBody: expr(
        '={{ "Hi " + ($("ElevenLabs Webhook").item.json.body?.customer_name ?? $("ElevenLabs Webhook").item.json.customer_name ?? "there") + ", your appointment has been cancelled. Reference: " + ($("ElevenLabs Webhook").item.json.body?.event_id ?? $("ElevenLabs Webhook").item.json.event_id) + "." }}',
      ),
    },
    credentials: { whatsAppApi: newCredential('WhatsApp account') },
    position: [1320, 720],
  },
  output: [{ messages: [{ id: 'wamid.example' }] }],
});

const emailCancellationNotice = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Email cancellation notice',
    parameters: {
      method: 'POST',
      url: notificationsApiBase,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(
        '={{ { type: "cancellation", customer_name: $("ElevenLabs Webhook").item.json.body?.customer_name ?? $("ElevenLabs Webhook").item.json.customer_name, customer_email: $("ElevenLabs Webhook").item.json.body?.customer_email ?? $("ElevenLabs Webhook").item.json.customer_email, event_id: $("ElevenLabs Webhook").item.json.body?.event_id ?? $("ElevenLabs Webhook").item.json.event_id } }}',
      ),
    },
    credentials: { httpHeaderAuth: newCredential('RingsAway API') },
    position: [1320, 560],
  },
  output: [{ success: true, channel: 'email' }],
});

const wait30DaysMarketing = node({
  type: 'n8n-nodes-base.wait',
  version: 1.1,
  config: {
    name: 'Wait 30 days — marketing',
    parameters: {
      resume: 'timeInterval',
      amount: 30,
      unit: 'days',
    },
    position: [1080, 520],
  },
  output: [{}],
});

const triggerMarketingCampaign = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Trigger 30-day rebook campaign',
    parameters: {
      method: 'POST',
      url: marketingApiBase,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(
        '={{ { action: "send_follow_up", campaign: "30_day_rebook", client_id: $("ElevenLabs Webhook").item.json.body?.client_id ?? $("ElevenLabs Webhook").item.json.client_id, customer_name: $("ElevenLabs Webhook").item.json.body?.customer_name ?? $("ElevenLabs Webhook").item.json.customer_name, customer_email: $("ElevenLabs Webhook").item.json.body?.customer_email ?? $("ElevenLabs Webhook").item.json.customer_email, customer_phone: $("ElevenLabs Webhook").item.json.body?.customer_phone ?? $("ElevenLabs Webhook").item.json.customer_phone, event_id: $("Timely — book appointment").item.json.event_id, booking_start: $("ElevenLabs Webhook").item.json.body?.start ?? $("ElevenLabs Webhook").item.json.start } }}',
      ),
    },
    credentials: { httpHeaderAuth: newCredential('RingsAway API') },
    position: [1320, 520],
  },
  output: [{ success: true, campaign: '30_day_rebook' }],
});

const respondAvailability = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond availability',
    parameters: {
      respondWith: 'json',
      responseBody: expr(
        '={{ { success: $json.success ?? true, action: "check_availability", available: $json.available, slots: $json.slots } }}',
      ),
    },
    position: [1080, 160],
  },
});

const respondBooked = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond booked',
    parameters: {
      respondWith: 'json',
      responseBody: expr(
        '={{ { success: true, action: "book", event_id: $("Timely — book appointment").item.json.event_id, confirmation_channel: $("ElevenLabs Webhook").item.json.body?.confirmation_channel ?? $("ElevenLabs Webhook").item.json.confirmation_channel ?? "whatsapp", notification_sent: true, marketing_scheduled_days: 30 } }}',
      ),
    },
    position: [1560, 360],
  },
});

const respondCancelled = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond cancelled',
    parameters: {
      respondWith: 'json',
      responseBody: expr(
        '={{ { success: true, action: "cancel", event_id: $("ElevenLabs Webhook").item.json.body?.event_id ?? $("ElevenLabs Webhook").item.json.event_id, confirmation_channel: $("ElevenLabs Webhook").item.json.body?.confirmation_channel ?? $("ElevenLabs Webhook").item.json.confirmation_channel ?? "whatsapp", notification_sent: true } }}',
      ),
    },
    position: [1560, 640],
  },
});

const respondUnknownAction = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond unknown action',
    parameters: {
      respondWith: 'json',
      options: { responseCode: 400 },
      responseBody: expr(
        '={{ { success: false, error: "Unknown action", received: $json.body?.action ?? $json.action } }}',
      ),
    },
    position: [800, 860],
  },
});

export default workflow('cursor-test', 'cursor test')
  .add(
    sticky(
      '## Confirmation + marketing\n\n**Agent asks:** `confirmation_channel` = `whatsapp` or `email`\n\n- Email needs `customer_email`\n- After book: **Wait 30 days** → rebook email (needs email on file)\n\nParallel branch runs in background; webhook responds immediately after confirmation.',
      [webhook, bookEmailConfirmation, wait30DaysMarketing],
      { color: 5, position: [200, 40], width: 480, height: 200 },
    ),
  )
  .add(webhook)
  .to(
    routeAction
      .onCase(0, timelyCheckAvailability.to(respondAvailability))
      .onCase(
        1,
        timelyBookAppointment.to(
          bookEmailConfirmation
            .onTrue(emailBookingConfirmation.to(respondBooked))
            .onFalse(whatsAppBookingConfirmation.to(respondBooked)),
        ),
      )
      .onCase(
        2,
        timelyCancelAppointment.to(
          cancelEmailConfirmation
            .onTrue(emailCancellationNotice.to(respondCancelled))
            .onFalse(whatsAppCancellationNotice.to(respondCancelled)),
        ),
      ),
  )
  .add(timelyBookAppointment.to(wait30DaysMarketing.to(triggerMarketingCampaign)))
  .add(routeAction.output(3).to(respondUnknownAction));
