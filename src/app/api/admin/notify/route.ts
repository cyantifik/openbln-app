import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, workingOn } = await request.json();

    // Send notification email to admin via Supabase's built-in email
    // Using Supabase Edge Function or direct SMTP isn't available,
    // so we'll use a simple approach: insert into a notifications table
    // OR use Resend/other service. For now, use Supabase's auth.admin
    // to send a magic link style email.

    // Simplest approach: use fetch to send via Resend (free tier)
    // If RESEND_API_KEY is not set, skip silently
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      // Use verified domain if available, otherwise Resend's default sender
      const fromAddress = process.env.RESEND_FROM_EMAIL || "OPEN BLN <onboarding@resend.dev>";

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: ["cyantifik@gmail.com"],
          subject: `New application: ${name}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
              <h2 style="font-size: 18px; margin-bottom: 24px;">New Application</h2>
              <p><strong>${name}</strong> just applied to join OPEN BLN.</p>
              <p style="color: #666; margin-top: 12px;"><strong>Email:</strong> ${email}</p>
              <p style="color: #666;"><strong>Working on:</strong> ${workingOn || "Not specified"}</p>
              <div style="margin-top: 32px;">
                <a href="https://space.open-bln.com/admin" style="display: inline-block; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 14px;">Review Application</a>
              </div>
            </div>
          `,
        }),
      });

      const resBody = await res.json();
      if (!res.ok) {
        console.error("Resend error:", resBody);
      }
    } else {
      console.error("RESEND_API_KEY not set — skipping notification");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Don't block signup if notification fails
    console.error("Notification error:", error);
    return NextResponse.json({ success: true });
  }
}
