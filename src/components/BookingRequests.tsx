"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ScreeningAnswer {
  question: string;
  answer: string;
}

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  screening_answers: ScreeningAnswer[];
  contact_email: string | null;
  linkedin_url: string | null;
  mentee_id: string;
  mentee_name?: string;
  created_at: string;
}

interface BookingRequestsProps {
  mentorId: string;
  mentorAuthId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
}

export default function BookingRequests({ mentorId, mentorAuthId, theme }: BookingRequestsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        // Get bookings for this mentor
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("mentor_id", mentorId)
          .in("status", ["pending", "confirmed"])
          .order("start_time", { ascending: true });

        if (error) throw error;

        // Get mentee names
        const menteeIds = [...new Set((data || []).map((b) => b.mentee_id))];
        let menteeMap: Record<string, string> = {};

        if (menteeIds.length > 0) {
          const { data: mentees } = await supabase
            .from("members")
            .select("id, name")
            .in("id", menteeIds);

          if (mentees) {
            menteeMap = Object.fromEntries(mentees.map((m) => [m.id, m.name]));
          }
        }

        setBookings(
          (data || []).map((b) => ({
            ...b,
            mentee_name: menteeMap[b.mentee_id] || "Unknown",
          }))
        );
      } catch (err) {
        console.error("Error loading bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [mentorId]);

  const handleAction = async (bookingId: string, action: "approve" | "decline") => {
    setProcessing(bookingId);
    try {
      const res = await fetch("/api/calendar/book", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          action,
          mentorAuthId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: action === "approve" ? "confirmed" : "declined" }
            : b
        ).filter((b) => b.status !== "declined")
      );
    } catch (err) {
      console.error("Error processing booking:", err);
    } finally {
      setProcessing(null);
    }
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "Europe/Berlin",
    }) +
      " at " +
      d.toLocaleTimeString("en-DE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Berlin",
      });
  };

  if (loading) {
    return <p className="text-sm" style={{ color: theme.textFaint }}>Loading requests...</p>;
  }

  const pending = bookings.filter((b) => b.status === "pending");
  const confirmed = bookings.filter((b) => b.status === "confirmed");

  if (bookings.length === 0) {
    return (
      <p className="text-sm" style={{ color: theme.textFaint }}>
        No booking requests yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: theme.textFaint }}>
            Pending
          </p>
          {pending.map((booking) => (
            <div
              key={booking.id}
              className="p-5 rounded-xl border"
              style={{ borderColor: theme.cardBorder }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.text }}>
                    {booking.mentee_name}
                  </p>
                  <p className="text-sm" style={{ color: theme.textMuted }}>
                    {formatDateTime(booking.start_time)}
                  </p>
                  {(booking.contact_email || booking.linkedin_url) && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {booking.contact_email && (
                        <a
                          href={`mailto:${booking.contact_email}`}
                          className="text-xs underline"
                          style={{ color: theme.textMuted }}
                        >
                          {booking.contact_email}
                        </a>
                      )}
                      {booking.linkedin_url && (
                        <a
                          href={booking.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline"
                          style={{ color: theme.textMuted }}
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                  {booking.notes && (
                    <p className="text-xs mt-1" style={{ color: theme.textFaint }}>
                      {booking.notes}
                    </p>
                  )}
                  {booking.screening_answers && booking.screening_answers.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {booking.screening_answers.map((sa, i) => (
                        <div key={i}>
                          <p className="text-xs font-medium" style={{ color: theme.textFaint }}>
                            {sa.question}
                          </p>
                          <p className="text-sm" style={{ color: theme.textMuted }}>
                            {sa.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction(booking.id, "approve")}
                    disabled={processing === booking.id}
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ backgroundColor: theme.text, color: theme.bg }}
                  >
                    {processing === booking.id ? "..." : "Approve"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(booking.id, "decline")}
                    disabled={processing === booking.id}
                    className="px-4 py-2 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmed */}
      {confirmed.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: theme.textFaint }}>
            Upcoming
          </p>
          {confirmed.map((booking) => (
            <div
              key={booking.id}
              className="p-4 rounded-xl flex items-center justify-between"
              style={{ backgroundColor: `${theme.textFaint}08` }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: theme.text }}>
                  {booking.mentee_name}
                </p>
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  {formatDateTime(booking.start_time)}
                </p>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                }}
              >
                Confirmed
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
