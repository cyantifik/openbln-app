import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { applicationId, authId, name, workingOn, canHelpWith } = await request.json();

    // Verify the caller is an admin using their auth token
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const userClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user } } = await userClient.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if caller is admin
    const { data: callerMember } = await supabaseAdmin
      .from("members")
      .select("is_admin")
      .eq("auth_id", user.id)
      .single();

    if (!callerMember?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create or update member (using service role to bypass RLS)
    const skillsOffered = canHelpWith
      ? canHelpWith.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const { error: memberError } = await supabaseAdmin.from("members").upsert({
      auth_id: authId,
      name: name,
      role: "Member",
      company: "",
      bio: workingOn || "",
      skills_offered: skillsOffered,
      skills_needed: [],
      is_admin: false,
      achievements: [],
      status: "approved",
    }, { onConflict: "auth_id" });

    if (memberError) {
      console.error("Member upsert error:", memberError);
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    // Get the admin's member id for reviewed_by
    const { data: adminMember } = await supabaseAdmin
      .from("members")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    // Update application status
    const { error: appError } = await supabaseAdmin
      .from("applications")
      .update({
        status: "approved",
        reviewed_by: adminMember?.id || null,
      })
      .eq("id", applicationId);

    if (appError) {
      console.error("Application update error:", appError);
      return NextResponse.json({ error: appError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
