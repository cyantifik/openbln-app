import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { refreshAccessToken, getFreeBusy } from "@/lib/google-calendar";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const mentorId = url.searchParams.get("mentorId");
    const date = url.searchParams.get("date"); // YYYY-MM-DD

    if (!mentorId || !date) {
      return NextResponse.json(
        { error: "Missing mentorId or date" },
        { status: 400 }
      );
    }

    // Get mentor profile with calendar token
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("mentor_profiles")
      .select("*")
      .eq("member_id", mentorId)
      .single();

    if (profileError || !profile || !profile.google_refresh_token) {
      return NextResponse.json(
        { error: "Mentor calendar not connected" },
        { status: 404 }
      );
    }

    // Get fresh access token
    const accessToken = await refreshAccessToken(profile.google_refresh_token);

    // Build time range for the requested date (full day in mentor's timezone)
    const timeMin = `${date}T08:00:00`;
    const timeMax = `${date}T20:00:00`;

    // Convert to ISO with timezone offset for Berlin (simplified)
    const timeMinISO = new Date(`${timeMin}+02:00`).toISOString();
    const timeMaxISO = new Date(`${timeMax}+02:00`).toISOString();

    // Get busy times from Google Calendar
    const busySlots = await getFreeBusy(
      accessToken,
      profile.google_calendar_id || "primary",
      timeMinISO,
      timeMaxISO
    );

    // Also get existing bookings from our DB for this mentor on this date
    const dayStart = `${date}T00:00:00+00:00`;
    const dayEnd = `${date}T23:59:59+00:00`;
    const { data: existingBookings } = await supabaseAdmin
      .from("bookings")
      .select("start_time, end_time")
      .eq("mentor_id", mentorId)
      .eq("status", "confirmed")
      .gte("start_time", dayStart)
      .lte("start_time", dayEnd);

    // Generate available 30-min slots from 9am to 6pm
    const duration = profile.session_duration || 30;
    const slots: { start: string; end: string; available: boolean }[] = [];

    for (let hour = 9; hour < 18; hour++) {
      for (let min = 0; min < 60; min += duration) {
        if (hour === 17 && min + duration > 60) continue; // Don't overflow past 6pm

        const slotStart = new Date(`${date}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:00+02:00`);
        const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

        // Check if slot conflicts with Google Calendar busy times
        const isGoogleBusy = busySlots.some(
          (busy: { start: string; end: string }) => {
            const busyStart = new Date(busy.start).getTime();
            const busyEnd = new Date(busy.end).getTime();
            return slotStart.getTime() < busyEnd && slotEnd.getTime() > busyStart;
          }
        );

        // Check if slot conflicts with existing bookings
        const isBooked = (existingBookings || []).some(
          (booking: { start_time: string; end_time: string }) => {
            const bookStart = new Date(booking.start_time).getTime();
            const bookEnd = new Date(booking.end_time).getTime();
            return slotStart.getTime() < bookEnd && slotEnd.getTime() > bookStart;
          }
        );

        // Don't show past slots
        const isPast = slotStart.getTime() < Date.now();

        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          available: !isGoogleBusy && !isBooked && !isPast,
        });
      }
    }

    return NextResponse.json({
      slots,
      timezone: profile.timezone || "Europe/Berlin",
      sessionDuration: duration,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
