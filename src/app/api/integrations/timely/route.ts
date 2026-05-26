import { getBackofficeDb } from "@/lib/backoffice/db";
import { NextResponse } from "next/server";

type TimelyAction = "check_availability" | "book" | "cancel";

type TimelyRequestBody = {
  action?: TimelyAction;
  client_id?: string;
  start?: string;
  end?: string;
  service_id?: string;
  staff_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  party_size?: number;
  notes?: string;
  event_id?: string;
};

function authorize(request: Request): boolean {
  const secret = process.env.WORKFLOW_LOG_SECRET?.trim();
  if (!secret) return true;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function forwardToTimelyApi(
  path: string,
  init: RequestInit,
): Promise<Response | null> {
  const base = process.env.TIMELY_API_BASE_URL?.trim();
  const key = process.env.TIMELY_API_KEY?.trim();
  if (!base || !key) return null;

  const url = `${base.replace(/\/$/, "")}${path}`;
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      ...(init.headers ?? {}),
    },
  });
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: TimelyRequestBody;
  try {
    body = (await request.json()) as TimelyRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action;
  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "check_availability") {
    const upstream = await forwardToTimelyApi("/availability", {
      method: "POST",
      body: JSON.stringify({
        start: body.start,
        end: body.end,
        service_id: body.service_id,
        staff_id: body.staff_id,
      }),
    });

    if (upstream) {
      const data = await upstream.json().catch(() => ({}));
      return NextResponse.json(
        { success: upstream.ok, action, source: "timely_api", ...data },
        { status: upstream.ok ? 200 : upstream.status },
      );
    }

    return NextResponse.json({
      success: true,
      action,
      source: "ringsaway",
      configured: false,
      available: null,
      message:
        "Timely salon API is not configured (set TIMELY_API_BASE_URL + TIMELY_API_KEY). Use Innovate plan Zapier key when Timely provides your HTTP base URL.",
      start: body.start ?? null,
      end: body.end ?? null,
    });
  }

  const clientId = body.client_id?.trim();
  if (!clientId) {
    return NextResponse.json({ error: "client_id is required" }, { status: 400 });
  }

  if (action === "book") {
    const upstream = await forwardToTimelyApi("/appointments", {
      method: "POST",
      body: JSON.stringify({
        start: body.start,
        end: body.end,
        service_id: body.service_id,
        staff_id: body.staff_id,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email,
        notes: body.notes,
        party_size: body.party_size,
      }),
    });

    if (upstream?.ok) {
      const data = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
      const eventId = String(data.id ?? data.appointment_id ?? data.booking_id ?? "");

      const db = getBackofficeDb();
      await db.from("client_bookings").insert({
        client_id: clientId,
        customer_name: body.customer_name ?? null,
        customer_email: body.customer_email ?? null,
        customer_phone: body.customer_phone ?? null,
        booking_date: body.start ?? null,
        booking_type: body.service_id ?? "voice",
        calendar_event_id: eventId || null,
        status: "confirmed",
      });

      return NextResponse.json({
        success: true,
        action,
        source: "timely_api",
        event_id: eventId,
        ...data,
      });
    }

    const db = getBackofficeDb();
    const { data: row, error } = await db
      .from("client_bookings")
      .insert({
        client_id: clientId,
        customer_name: body.customer_name ?? null,
        customer_email: body.customer_email ?? null,
        customer_phone: body.customer_phone ?? null,
        booking_date: body.start ?? null,
        booking_type: body.service_id ?? "voice",
        status: "pending_timely",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      action,
      source: "ringsaway_ledger",
      event_id: row.id,
      message:
        "Booking saved in RingsAway. Add to Timely calendar manually until TIMELY_API_BASE_URL is configured.",
      start: body.start ?? null,
      end: body.end ?? null,
    });
  }

  if (action === "cancel") {
    const eventId = body.event_id?.trim();
    if (!eventId) {
      return NextResponse.json({ error: "event_id is required" }, { status: 400 });
    }

    const upstream = await forwardToTimelyApi(`/appointments/${encodeURIComponent(eventId)}`, {
      method: "DELETE",
    });

    if (upstream?.ok) {
      const db = getBackofficeDb();
      await db
        .from("client_bookings")
        .update({ status: "cancelled" })
        .eq("client_id", clientId)
        .or(`calendar_event_id.eq.${eventId},id.eq.${eventId}`);

      return NextResponse.json({
        success: true,
        action,
        source: "timely_api",
        event_id: eventId,
        cancelled: true,
      });
    }

    const db = getBackofficeDb();
    const { error } = await db
      .from("client_bookings")
      .update({ status: "cancelled" })
      .eq("client_id", clientId)
      .or(`calendar_event_id.eq.${eventId},id.eq.${eventId}`);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      action,
      source: "ringsaway_ledger",
      event_id: eventId,
      cancelled: true,
      message:
        "Marked cancelled in RingsAway. Cancel in Timely manually if TIMELY_API_BASE_URL is not set.",
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
