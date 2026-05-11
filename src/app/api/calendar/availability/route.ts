import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

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

    // Get the day of week for the requested date (0=Sunday, 6=Saturday)
    const requestedDate = new Date(date + "T12:00:00");
    const dayOfWeek = requestedDate.getDay();

    console.log("[availability] date:", date, "dayOfWeek:", dayOfWeek, "mentorId:", mentorId);

    // Get mentor's availability windows for this day
    const { data: windows, error: windowError } = await supabaseAdmin
      .from("mentor_availability")
      .select("start_time, end_time")
      .eq("mentor_id", mentorId)
      .eq("day_of_week", dayOfWeek);

    console.log("[availability] windows:", JSON.stringify(windows), "error:", windowError);

    if (windowError) {
      console.error("Error fetching availability:", windowError);
      return NextResponse.json(
        { error: "Failed to fetch availability" },
        { status: 500 }
      );
    }

    if (!windows || windows.length === 0) {
      return NextResponse.json({
        slots: [],
        timezone: "Europe/Berlin",
        sessionDuration: 30,
      });
    }

    // Get mentor's session duration
    const { data: profile } = await supabaseAdmin
      .from("mentor_profiles")
      .select("session_duration")
      .eq("member_id", mentorId)
      .single();

    const duration = profile?.session_duration || 30;

    // Get existing bookings (pending or confirmed) for this date
    const dayStart = `${date}T00:00:00+00:00`;
    const dayEnd = `${date}T23:59:59+00:00`;
    const { data: existingBookings } = await supabaseAdmin
      .from("bookings")
      .select("start_time, end_time")
      .eq("mentor_id", mentorId)
      .in("status", ["pending", "confirmed"])
      .gte("start_time", dayStart)
      .lte("start_time", dayEnd);

    // Generate slots from availability windows
    const slots: { start: string; end: string; available: boolean }[] = [];

    for (const window of windows) {
      // Parse HH:MM:SS time strings
      const [startH, startM] = window.start_time.split(":").map(Number);
      const [endH, endM] = window.end_time.split(":").map(Number);

      let hour = startH;
      let min = startM;

      while (hour < endH || (hour === endH && min < endM)) {
        const slotStart = new Date(
          `${date}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:00+02:00`
        );
        const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

        // Check end doesn't exceed window
        const windowEnd = new Date(`${date}T${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00+02:00`);
        if (slotEnd.getTime() > windowEnd.getTime()) break;

        // Check if already booked
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
          available: !isBooked && !isPast,
        });

        // Advance by duration
        min += duration;
        while (min >= 60) {
          min -= 60;
          hour++;
        }
      }
    }

    return NextResponse.json({
      slots,
      timezone: "Europe/Berlin",
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
