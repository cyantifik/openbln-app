"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/lib/theme";

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
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Screening
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>([]);
  const [screeningAnswers, setScreeningAnswers] = useState<string[]>([]);
  const [showScreening, setShowScreening] = useState(false);
  const [mentorTopics, setMentorTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Load screening questions + mentor topics
  useEffect(() => {
    const loadMentorInfo = async () => {
      try {
        // Get screening questions
        const { data: profile } = await supabase
          .from("mentor_profiles")
          .select("screening_questions")
          .eq("member_id", mentorId)
          .single();

        if (profile?.screening_questions) {
          setScreeningQuestions(profile.screening_questions);
          setScreeningAnswers(new Array(profile.screening_questions.length).fill(""));
        }

        // Get mentor topics
        const { data: member } = await supabase
          .from("members")
          .select("mentor_topics")
          .eq("id", mentorId)
          .single();

        if (member?.mentor_topics) {
          setMentorTopics(member.mentor_topics);
        }
      } catch (err) {
        console.error("Error loading mentor info:", err);
      }
    };

    loadMentorInfo();
  }, [mentorId]);

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

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    // If there are screening questions, show them
    if (screeningQuestions.length > 0) {
      setShowScreening(true);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return;

    // Validate screening answers
    if (screeningQuestions.length > 0) {
      const unanswered = screeningAnswers.some((a) => !a.trim());
      if (unanswered) {
        setError("Please answer all questions before submitting.");
        return;
      }
    }

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

      // Build screening answers with questions
      const answers = screeningQuestions.map((q, i) => ({
        question: q,
        answer: screeningAnswers[i],
      }));

      const res = await fetch("/api/calendar/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId,
          menteeAuthId: user.id,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          notes: selectedTopic
            ? `Topic: ${selectedTopic}${notes ? `\n${notes}` : ""}`
            : notes,
          screeningAnswers: answers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setBookingResult("confirmed");
      setSelectedSlot(null);
      setShowScreening(false);
      setNotes("");
      setSelectedTopic("");
      setScreeningAnswers(new Array(screeningQuestions.length).fill(""));

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

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 28);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div
      className="rounded-2xl border p-5 sm:p-6 transition-colors duration-500"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.cardBorder,
      }}
    >
      <h3 className="text-lg font-semibold mb-1" style={{ color: theme.text }}>
        Book a session
      </h3>
      <p className="text-sm mb-5" style={{ color: theme.textMuted }}>
        30-min 1:1 with {mentorName.split(" ")[0]}
      </p>

      {/* Topic selection */}
      {mentorTopics.length > 0 && !showScreening && (
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
            I am interested in
          </label>
          <div className="flex flex-wrap gap-2">
            {mentorTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(selectedTopic === topic ? "" : topic)}
                className="px-3 py-1.5 rounded-full text-sm border transition-all"
                style={{
                  backgroundColor: selectedTopic === topic ? theme.text : "transparent",
                  color: selectedTopic === topic ? theme.bg : theme.text,
                  borderColor: selectedTopic === topic ? theme.text : theme.cardBorder,
                }}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date Picker */}
      {!showScreening && (
        <>
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              max={maxDateStr}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-transparent"
              style={{
                borderColor: theme.cardBorder,
                color: theme.text,
              }}
            />
            {selectedDate && (
              <p className="text-xs mt-1" style={{ color: theme.textFaint }}>
                {formatDateDisplay(selectedDate)}
              </p>
            )}
          </div>

          {/* Time Slots */}
          {loading ? (
            <p className="text-sm" style={{ color: theme.textFaint }}>
              Loading available times...
            </p>
          ) : error ? (
            <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
          ) : availableSlots.length === 0 && selectedDate ? (
            <p className="text-sm" style={{ color: theme.textFaint }}>
              No available slots on this date. Try another day.
            </p>
          ) : (
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                Time (Berlin)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot?.start === slot.start;
                  return (
                    <button
                      key={slot.start}
                      onClick={() => handleSelectSlot(slot)}
                      className="px-2 py-2.5 rounded-lg text-sm font-medium transition-all border"
                      style={{
                        backgroundColor: isSelected ? theme.text : "transparent",
                        color: isSelected ? theme.bg : theme.text,
                        borderColor: isSelected ? theme.text : theme.cardBorder,
                      }}
                    >
                      {formatTime(slot.start)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* If no screening questions, show simple confirm */}
          {selectedSlot && screeningQuestions.length === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                  Topic (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-transparent resize-none"
                  style={{ borderColor: theme.cardBorder, color: theme.text }}
                  rows={2}
                  placeholder="Portfolio review, career advice..."
                />
              </div>
              <button
                onClick={handleBook}
                disabled={booking}
                className="w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: theme.text, color: theme.bg }}
              >
                {booking ? "Sending request..." : `Request ${formatTime(selectedSlot.start)} on ${formatDateDisplay(selectedDate)}`}
              </button>
            </div>
          )}
        </>
      )}

      {/* Screening Questions */}
      {showScreening && selectedSlot && (
        <div className="space-y-5">
          <div
            className="flex items-center justify-between pb-3 border-b"
            style={{ borderBottomColor: theme.cardBorder }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {formatDateDisplay(selectedDate)} at {formatTime(selectedSlot.start)}
              </p>
              {selectedTopic && (
                <p className="text-xs" style={{ color: theme.textFaint }}>
                  {selectedTopic}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setShowScreening(false);
                setSelectedSlot(null);
              }}
              className="text-xs"
              style={{ color: theme.textFaint }}
            >
              Change
            </button>
          </div>

          <p className="text-sm" style={{ color: theme.textMuted }}>
            {mentorName.split(" ")[0]} would like to know a bit about you before the session.
          </p>

          {screeningQuestions.map((question, i) => (
            <div key={i}>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                {question}
              </label>
              <textarea
                value={screeningAnswers[i] || ""}
                onChange={(e) => {
                  const updated = [...screeningAnswers];
                  updated[i] = e.target.value;
                  setScreeningAnswers(updated);
                }}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-transparent resize-none"
                style={{ borderColor: theme.cardBorder, color: theme.text }}
                rows={2}
                required
              />
            </div>
          ))}

          {error && (
            <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
          )}

          <button
            onClick={handleBook}
            disabled={booking}
            className="w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: theme.text, color: theme.bg }}
          >
            {booking ? "Sending request..." : "Submit Request"}
          </button>
        </div>
      )}

      {/* Success */}
      {bookingResult === "confirmed" && (
        <div
          className="mt-4 p-4 rounded-xl"
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <p className="text-sm font-medium" style={{ color: "#10b981" }}>
            Request sent! {mentorName.split(" ")[0]} will review and confirm your session.
          </p>
        </div>
      )}
    </div>
  );
}
