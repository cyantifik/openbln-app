"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Slot {
  start: string;
  end: string;
  available: boolean;
}

interface BookingWidgetProps {
  mentorId: string;
  mentorName: string;
}

export default function BookingWidget({
  mentorId,
  mentorName,
}: BookingWidgetProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Fetch availability when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      setSelectedSlot(null);
      try {
        const res = await fetch(
          `/api/calendar/availability?mentorId=${mentorId}&date=${selectedDate}`
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load availability");
        }
        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load availability"
        );
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, mentorId]);

  const handleBook = async () => {
    if (!selectedSlot) return;

    setBooking(true);
    setBookingResult(null);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in to book a session.");
        return;
      }

      const res = await fetch("/api/calendar/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId,
          menteeAuthId: user.id,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setBookingResult("confirmed");
      setSelectedSlot(null);
      setNotes("");

      // Refresh slots
      const refreshRes = await fetch(
        `/api/calendar/availability?mentorId=${mentorId}&date=${selectedDate}`
      );
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setSlots(refreshData.slots || []);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to book session"
      );
    } finally {
      setBooking(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Berlin",
    });
  };

  const formatDateDisplay = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const availableSlots = slots.filter((s) => s.available);

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];
  // Max date: 4 weeks out
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 28);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="border border-gray-200 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-1">
        Book a session with {mentorName.split(" ")[0]}
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        30-minute 1:1 mentoring session
      </p>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={today}
          max={maxDateStr}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400"
        />
        {selectedDate && (
          <p className="text-xs text-gray-400 mt-1">
            {formatDateDisplay(selectedDate)}
          </p>
        )}
      </div>

      {/* Time Slots */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading available times...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : availableSlots.length === 0 && selectedDate ? (
        <p className="text-sm text-gray-400">
          No available slots on this date. Try another day.
        </p>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available times (Berlin)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.start}
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSlot?.start === slot.start
                    ? "bg-black text-white"
                    : "border border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {formatTime(slot.start)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes + Confirm */}
      {selectedSlot && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to discuss? (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400 resize-none"
              rows={3}
              placeholder="e.g., Portfolio review, career advice, design feedback..."
            />
          </div>

          <button
            onClick={handleBook}
            disabled={booking}
            className="w-full py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {booking
              ? "Booking..."
              : `Confirm — ${formatTime(selectedSlot.start)} on ${formatDateDisplay(selectedDate)}`}
          </button>
        </div>
      )}

      {/* Success */}
      {bookingResult === "confirmed" && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-sm text-emerald-700 font-medium">
            Session booked! You will receive a calendar invite shortly.
          </p>
        </div>
      )}
    </div>
  );
}
