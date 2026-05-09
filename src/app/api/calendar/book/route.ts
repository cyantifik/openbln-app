import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  refreshAccessToken,
  createCalendarEvent,
} from "@/lib/google-calendar";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mentorId, menteeAuthId, startTime, endTime, notes } = body;

    if (!mentorId || !menteeAuthId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get mentor profile
    const { data: mentorProfile, error: profileError } = await supabaseAdmin
      .from("mentor_profiles")
      .select("*, member_id")
      .eq("member_id", mentorId)
      .single();

    if (profileError || !mentorProfile) {
      return NextResponse.json(
        { error: "Mentor profile not found" },
        { status: 404 }
      );
    }

    // Get mentor member details
    const { data: mentor } = await supabaseAdmin
      .from("members")
      .select("name")
      .eq("id", mentorId)
      .single();

    // Get mentee member details
    const { data: mentee } = await supabaseAdmin
      .from("members")
      .select("id, name, auth_id")
      .eq("auth_id", menteeAuthId)
      .single();

    if (!mentee) {
      return NextResponse.json(
        { error: "Mentee not found" },
        { status: 404 }
      );
    }

    // Get mentee email from auth
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
      menteeAuthId
    );
    const menteeEmail = authUser?.user?.email;

    // Create Google Calendar event
    let googleEventId = null;
    if (mentorProfile.google_refresh_token) {
      try {
        const accessToken = await refreshAccessToken(
          mentorProfile.google_refresh_token
        );

        const event = await createCalendarEvent(
          accessToken,
          mentorProfile.google_calendar_id || "primary",
          {
            summary:
              mentorProfile.session_title ||
              `1:1 Mentoring: ${mentor?.name} + ${mentee.name}`,
            description: `OPEN BLN Mentoring Session\n\nMentor: ${mentor?.name}\nMentee: ${mentee.name}${notes ? `\n\nNotes: ${notes}` : ""}`,
            start: startTime,
            end: endTime,
            attendeeEmail: menteeEmail,
            timezone: mentorProfile.timezone || "Europe/Berlin",
          }
        );

        googleEventId = event.id;
      } catch (calError) {
        console.error("Error creating calendar event:", calError);
        // Continue anyway — booking still saved in DB
      }
    }

    // Save booking in database
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        mentor_id: mentorId,
        mentee_id: mentee.id,
        mentor_auth_id: mentorProfile.auth_id,
        mentee_auth_id: menteeAuthId,
        start_time: startTime,
        end_time: endTime,
        status: "confirmed",
        google_event_id: googleEventId,
        notes: notes || null,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Error saving booking:", bookingError);
      return NextResponse.json(
        { error: "Failed to save booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
      calendarEventCreated: !!googleEventId,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
