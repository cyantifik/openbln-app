import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  refreshAccessToken,
  createCalendarEvent,
} from "@/lib/google-calendar";

// POST: Create a booking request (pending approval)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mentorId, menteeAuthId, startTime, endTime, notes, screeningAnswers } = body;

    if (!mentorId || !menteeAuthId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get mentor member details
    const { data: mentor } = await supabaseAdmin
      .from("members")
      .select("id, name, auth_id")
      .eq("id", mentorId)
      .single();

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    // Get mentee member details
    const { data: mentee } = await supabaseAdmin
      .from("members")
      .select("id, name, auth_id")
      .eq("auth_id", menteeAuthId)
      .single();

    if (!mentee) {
      return NextResponse.json({ error: "Mentee not found" }, { status: 404 });
    }

    // Save booking as PENDING
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        mentor_id: mentorId,
        mentee_id: mentee.id,
        mentor_auth_id: mentor.auth_id,
        mentee_auth_id: menteeAuthId,
        start_time: startTime,
        end_time: endTime,
        status: "pending",
        notes: notes || null,
        screening_answers: screeningAnswers || [],
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
      status: "pending",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PATCH: Approve or decline a booking
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, action, mentorAuthId } = body;

    if (!bookingId || !action || !mentorAuthId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "decline") {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'decline'" },
        { status: 400 }
      );
    }

    // Get the booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*, mentor_id, mentee_id")
      .eq("id", bookingId)
      .eq("mentor_auth_id", mentorAuthId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status !== "pending") {
      return NextResponse.json(
        { error: "Booking is not pending" },
        { status: 400 }
      );
    }

    if (action === "decline") {
      await supabaseAdmin
        .from("bookings")
        .update({ status: "declined", updated_at: new Date().toISOString() })
        .eq("id", bookingId);

      return NextResponse.json({ success: true, status: "declined" });
    }

    // APPROVE: create calendar event
    let googleEventId = null;

    const { data: mentorProfile } = await supabaseAdmin
      .from("mentor_profiles")
      .select("*")
      .eq("member_id", booking.mentor_id)
      .single();

    const { data: mentor } = await supabaseAdmin
      .from("members")
      .select("name")
      .eq("id", booking.mentor_id)
      .single();

    const { data: mentee } = await supabaseAdmin
      .from("members")
      .select("name")
      .eq("id", booking.mentee_id)
      .single();

    // Get mentee email
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
      booking.mentee_auth_id
    );
    const menteeEmail = authUser?.user?.email;

    if (mentorProfile?.google_refresh_token) {
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
              `1:1 Mentoring: ${mentor?.name} + ${mentee?.name}`,
            description: `OPEN BLN Mentoring Session\n\nMentor: ${mentor?.name}\nMentee: ${mentee?.name}${booking.notes ? `\n\nNotes: ${booking.notes}` : ""}`,
            start: booking.start_time,
            end: booking.end_time,
            attendeeEmail: menteeEmail,
            timezone: mentorProfile.timezone || "Europe/Berlin",
          }
        );

        googleEventId = event.id;
      } catch (calError) {
        console.error("Error creating calendar event:", calError);
        // Still approve even if calendar fails
      }
    }

    await supabaseAdmin
      .from("bookings")
      .update({
        status: "confirmed",
        google_event_id: googleEventId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    return NextResponse.json({
      success: true,
      status: "confirmed",
      calendarEventCreated: !!googleEventId,
    });
  } catch (error) {
    console.error("Booking approval error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
