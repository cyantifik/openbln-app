import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { exchangeCodeForTokens } from "@/lib/google-calendar";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // auth_id
    const error = url.searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL("/profile?error=access_denied", request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/profile?error=missing_params", request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      return NextResponse.redirect(
        new URL("/profile?error=no_refresh_token", request.url)
      );
    }

    // Find the member by auth_id
    const { data: member, error: memberError } = await supabaseAdmin
      .from("members")
      .select("id")
      .eq("auth_id", state)
      .single();

    if (memberError || !member) {
      return NextResponse.redirect(
        new URL("/profile?error=member_not_found", request.url)
      );
    }

    // Upsert mentor_profile with the refresh token
    const { error: upsertError } = await supabaseAdmin
      .from("mentor_profiles")
      .upsert(
        {
          member_id: member.id,
          auth_id: state,
          google_refresh_token: refreshToken,
          is_calendar_connected: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "auth_id" }
      );

    if (upsertError) {
      console.error("Error saving mentor profile:", upsertError);
      return NextResponse.redirect(
        new URL("/profile?error=save_failed", request.url)
      );
    }

    // Also mark member as mentor
    await supabaseAdmin
      .from("members")
      .update({ is_mentor: true })
      .eq("auth_id", state);

    return NextResponse.redirect(
      new URL("/profile?success=connected", request.url)
    );
  } catch (error) {
    console.error("Calendar callback error:", error);
    return NextResponse.redirect(
      new URL("/profile?error=callback_failed", request.url)
    );
  }
}
