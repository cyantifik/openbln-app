import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Handle OAuth code exchange
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("Error exchanging code for session:", error);
    }
  }

  // Handle token_hash verification (password reset, email confirmation)
  if (token_hash && type) {
    try {
      await supabase.auth.verifyOtp({
        token_hash,
        type: type as "recovery" | "signup" | "email",
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  }

  // If this is a password recovery flow, redirect to update password page
  if (type === "recovery") {
    return NextResponse.redirect(new URL("/auth/update-password", request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
