import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON;
  return createClient(url, key);
}

// Zoho Mail sends a GET request to verify the webhook URL
export async function GET() {
  return NextResponse.json(
    { status: "ok", message: "Zoho Mail webhook endpoint active" },
    { status: 200 }
  );
}

// Zoho Mail sends POST requests with email event data
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload;

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      // Zoho may send form-encoded data
      const text = await request.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { raw: text };
      }
    }

    // Log the webhook event for debugging
    console.log("[Zoho Mail Webhook] Event received:", JSON.stringify(payload, null, 2));

    // Process the webhook based on entity type
    const eventType = payload.eventType || payload.event_type || "unknown";
    const fromAddress = payload.fromAddress || payload.from || "";
    const subject = payload.subject || "";
    const summary = payload.summary || payload.content || "";

    // Store notification in Supabase
    try {
      const supabase = getSupabase();
      await supabase.from("zoho_mail_webhooks").insert({
        event_type: eventType,
        from_address: fromAddress,
        subject,
        summary,
        payload,
        received_at: new Date().toISOString(),
      });
    } catch (dbError) {
      // If the table doesn't exist yet, just log it
      console.log("[Zoho Mail Webhook] DB insert skipped:", dbError);
    }

    // Return 200 to acknowledge receipt (required by Zoho)
    return NextResponse.json(
      { received: true, event: eventType },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Zoho Mail Webhook] Error processing:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
