import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON;
  return createClient(url, key);
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

// Zoho Mail sends a GET request to verify the webhook URL
export async function GET() {
  return NextResponse.json(
    { status: "ok", message: "Zoho Mail webhook endpoint active" },
    { status: 200, headers: CORS_HEADERS }
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
      // Zoho may send form-encoded or plain text data
      const text = await request.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { raw: text };
      }
    }

    console.log("[Zoho Mail Webhook] Event received:", JSON.stringify(payload, null, 2));

    const eventType = payload.eventType || payload.event_type || "unknown";
    const fromAddress = payload.fromAddress || payload.from || "";
    const subject = payload.subject || "";
    const summary = payload.summary || payload.content || "";

    // Store in Supabase
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
      console.log("[Zoho Mail Webhook] DB insert skipped:", dbError);
    }

    // Return 200 to acknowledge receipt (required by Zoho)
    return NextResponse.json(
      { received: true, event: eventType },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("[Zoho Mail Webhook] Error processing:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
