"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/lib/theme";

interface Slot {
  start: string;
  end: string;
  available: boolean;
}

interface AvailableDate {
  date: string; // YYYY-MM-DD
  dayShort: string; // "TUE"
  dayNum: string; // "13"
  monthShort: string; // "May"
  dow: number; // 0-6
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

  // Contact info (mandatory)
  const [contactEmail, setContactEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Recurring availability
  const [availableDaysOfWeek, setAvailableDaysOfWeek] = useState<number[]>([]);
  const [dayTimeWindows, setDayTimeWindows] = useState<Record<number, string>>({});
  const [daysLoading, setDaysLoading] = useState(true);
  const [showAllDates, setShowAllDates] = useState(false);

  // Default screening questions (used when mentor hasn't set custom ones)
  const defaultScreeningQuestions = [
    "What would you like to get out of this session?",
    "Tell us a bit about yourself and what you're working on.",
  ];

  // Load mentor's available days + time windows
  useEffect(() => {
    const loadAvailableDays = async () => {
      setDaysLoading(true);
      try {
        const { data } = await supabase
          .from("mentor_availability")
          .select("day_of_week, start_time, end_time")
          .eq("mentor_id", mentorId);

        if (data && data.length > 0) {
          const days = [...new Set(data.map((d: { day_of_week: number }) => d.day_of_week))].sort();
          setAvailableDaysOfWeek(days);

          // Merge all windows per day into one clean time range
          const windowsByDay: Record<number, string[]> = {};
          for (const row of data) {
            if (!windowsByDay[row.day_of_week]) windowsByDay[row.day_of_week] = [];
            // Collect all start and end times as HH:MM
            windowsByDay[row.day_of_week].push(
              row.start_time.slice(0, 5),
              row.end_time.slice(0, 5)
            );
          }

          const windows: Record<number, string> = {};
          for (const [dow, times] of Object.entries(windowsByDay)) {
            times.sort();
            const earliest = times[0];
            const latest = times[times.length - 1];
            windows[Number(dow)] = `${earliest}–${latest}`;
          }
          setDayTimeWindows(windows);
        }
      } catch (err) {
        console.error("Error loading available days:", err);
      } finally {
        setDaysLoading(false);
      }
    };

    loadAvailableDays();
  }, [mentorId]);

  // Generate upcoming available dates (next 4 weeks)
  const upcomingDates: AvailableDate[] = useMemo(() => {
    if (availableDaysOfWeek.length === 0) return [];

    const dates: AvailableDate[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 28; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dow = d.getDay();

      if (availableDaysOfWeek.includes(dow)) {
        const dateStr = d.toISOString().split("T")[0];
        dates.push({
          date: dateStr,
          dayShort: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
          dayNum: String(d.getDate()),
          monthShort: d.toLocaleDateString("en-US", { month: "short" }),
          dow,
        });
      }
    }
    return dates;
  }, [availableDaysOfWeek]);

  // Auto-select first available date
  useEffect(() => {
    if (upcomingDates.length > 0 && !selectedDate) {
      setSelectedDate(upcomingDates[0].date);
    }
  }, [upcomingDates, selectedDate]);

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

        if (profile?.screening_questions && profile.screening_questions.length > 0) {
          setScreeningQuestions(profile.screening_questions);
          setScreeningAnswers(new Array(profile.screening_questions.length).fill(""));
        } else {
          // Use default screening questions
          setScreeningQuestions(defaultScreeningQuestions);
          setScreeningAnswers(new Array(defaultScreeningQuestions.length).fill(""));
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
        // Still set defaults on error
        setScreeningQuestions(defaultScreeningQuestions);
        setScreeningAnswers(new Array(defaultScreeningQuestions.length).fill(""));
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
    // Always show screening step (contact info is always required)
    setShowScreening(true);
  };

  const handleBook = async () => {
    if (!selectedSlot) return;

    // Validate contact info
    if (!contactEmail.trim() || !linkedinUrl.trim()) {
      setError("Please provide your email and LinkedIn profile.");
      return;
    }
    if (!linkedinUrl.includes("linkedin.com/")) {
      setError("Please enter a valid LinkedIn profile URL.");
      return;
    }

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
          contactEmail: contactEmail.trim(),
          linkedinUrl: linkedinUrl.trim(),
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
      setContactEmail("");
      setLinkedinUrl("");
      setScreeningAnswers(
        new Array(screeningQuestions.length > 0 ? screeningQuestions.length : defaultScreeningQuestions.length).fill("")
      );

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
            Topics
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

      {/* Date & Time Selection */}
      {!showScreening && (
        <>
          {/* Date cards */}
          <div className="mb-5">
            {daysLoading ? (
              <p className="text-sm" style={{ color: theme.textFaint }}>
                Loading schedule...
              </p>
            ) : upcomingDates.length > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                    {(showAllDates ? upcomingDates : upcomingDates.slice(0, 4)).map((d) => {
                      const isSelected = selectedDate === d.date;
                      const timeWindow = dayTimeWindows[d.dow];
                      return (
                        <button
                          key={d.date}
                          type="button"
                          onClick={() => setSelectedDate(d.date)}
                          className="flex flex-col items-center min-w-[72px] px-3 py-3 rounded-xl border transition-all"
                          style={{
                            backgroundColor: isSelected ? theme.text : "transparent",
                            borderColor: isSelected ? theme.text : theme.cardBorder,
                          }}
                        >
                          <span
                            className="text-[10px] font-semibold tracking-wider mb-1"
                            style={{ color: isSelected ? theme.bg : theme.textFaint }}
                          >
                            {d.dayShort}
                          </span>
                          <span
                            className="text-lg font-bold leading-tight"
                            style={{ color: isSelected ? theme.bg : theme.text }}
                          >
                            {d.dayNum}
                          </span>
                          <span
                            className="text-[10px] mt-0.5"
                            style={{ color: isSelected ? theme.bg : theme.textFaint }}
                          >
                            {d.monthShort}
                          </span>
                          {timeWindow && (
                            <span
                              className="text-[10px] mt-1.5 font-medium"
                              style={{
                                color: isSelected ? `${theme.bg}bb` : theme.textMuted,
                              }}
                            >
                              {timeWindow}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {upcomingDates.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllDates(!showAllDates)}
                      className="text-xs whitespace-nowrap font-medium flex-shrink-0"
                      style={{ color: theme.textMuted }}
                    >
                      {showAllDates ? "Less" : `View all`}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm" style={{ color: theme.textFaint }}>
                No upcoming availability. Check back soon.
              </p>
            )}
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <>
              {loading ? (
                <p className="text-sm mb-5" style={{ color: theme.textFaint }}>
                  Loading times...
                </p>
              ) : error ? (
                <p className="text-sm mb-5" style={{ color: "#ef4444" }}>{error}</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm mb-5" style={{ color: theme.textFaint }}>
                  No open times on this date.
                </p>
              ) : (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                    Available times
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
                  <p className="text-[11px] mt-2" style={{ color: theme.textFaint }}>
                    Times shown in Berlin (CET)
                  </p>
                </div>
              )}
            </>
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
            Please share your contact info so {mentorName.split(" ")[0]} can reach you.
          </p>

          {/* Mandatory contact fields */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Your email *
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none bg-transparent"
              style={{ borderColor: theme.cardBorder, color: theme.text }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              LinkedIn profile *
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none bg-transparent"
              style={{ borderColor: theme.cardBorder, color: theme.text }}
              placeholder="https://linkedin.com/in/yourprofile"
              required
            />
          </div>

          {/* Screening questions */}
          {screeningQuestions.length > 0 && (
            <div
              className="pt-5 mt-1 border-t"
              style={{ borderTopColor: theme.cardBorder }}
            >
              <p className="text-sm mb-5" style={{ color: theme.textMuted }}>
                A few questions before booking:
              </p>
            </div>
          )}

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
