import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getGoogleAuthUrl } from "@/lib/google-calendar";

export async function GET(request: Request) {
  try {
    // Get auth token from cookie/header
    const authHeader = request.headers.get("cookie") || "";
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { cookie: authHeader },
        },
      }
    );

    // Verify user is authenticated
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use user ID as state param for the OAuth callback
    const authUrl = getGoogleAuthUrl(user.id);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error initiating calendar connection:", error);
    return NextResponse.json(
      { error: "Failed to initiate calendar connection" },
      { status: 500 }
    );
  }
}
