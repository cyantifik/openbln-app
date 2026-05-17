import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { name, category, message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const categoryLabel = category || "General";
    const senderName = name || "Anonymous";

    // Always save to database
    const { error: dbError } = await supabaseAdmin.from("feedback").insert({
      name: senderName,
      category: categoryLabel,
      message: message.trim(),
    });

    if (dbError) {
      console.error("Feedback DB error:", dbError);
    }

    // Also try to send email via Resend (will work once domain is verified)
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const fromAddress = process.env.RESEND_FROM_EMAIL || "OPEN BLN <onboarding@resend.dev>";

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: ["v@open-bln.com", "admin@open-bln.com"],
            subject: `[${categoryLabel}] from ${senderName}`,
            html: `
              <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
                <h2 style="font-size: 18px; margin-bottom: 24px;">${categoryLabel}</h2>
                <p style="color: #666; margin-bottom: 4px;"><strong>From:</strong> ${senderName}</p>
                <div style="margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">
                  ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </div>
              </div>
            `,
          }),
        });

        const resBody = await res.json();
        if (!res.ok) {
          console.error("Resend feedback error (non-blocking):", resBody);
        }
      } catch (emailErr) {
        console.error("Email send failed (non-blocking):", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// GET: view all feedback (for admin)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
