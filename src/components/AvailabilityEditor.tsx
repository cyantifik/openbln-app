"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AvailabilityWindow {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface AvailabilityEditorProps {
  mentorId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
}

export default function AvailabilityEditor({ mentorId, theme }: AvailabilityEditorProps) {
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // New window form
  const [newDay, setNewDay] = useState(1); // Monday
  const [newStart, setNewStart] = useState("10:00");
  const [newEnd, setNewEnd] = useState("14:00");

  useEffect(() => {
    const loadWindows = async () => {
      try {
        const { data, error } = await supabase
          .from("mentor_availability")
          .select("*")
          .eq("mentor_id", mentorId)
          .order("day_of_week")
          .order("start_time");

        if (error) throw error;
        setWindows(data || []);
      } catch (err) {
        console.error("Error loading availability:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWindows();
  }, [mentorId]);

  const handleAdd = async () => {
    setSaving(true);
    setMessage("");
    try {
      const { data, error } = await supabase
        .from("mentor_availability")
        .insert({
          mentor_id: mentorId,
          day_of_week: newDay,
          start_time: newStart,
          end_time: newEnd,
        })
        .select()
        .single();

      if (error) throw error;
      setWindows([...windows, data]);
      setMessage("Added!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error adding availability:", err);
      setMessage("Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("mentor_availability")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setWindows(windows.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Error removing availability:", err);
    }
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    return `${h}:${m}`;
  };

  // Group by day
  const byDay: Record<number, AvailabilityWindow[]> = {};
  windows.forEach((w) => {
    if (!byDay[w.day_of_week]) byDay[w.day_of_week] = [];
    byDay[w.day_of_week].push(w);
  });

  if (loading) {
    return <p className="text-sm" style={{ color: theme.textFaint }}>Loading availability...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Current windows */}
      {windows.length > 0 ? (
        <div className="space-y-2">
          {Object.entries(byDay)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([day, dayWindows]) => (
              <div key={day} className="flex flex-wrap items-center gap-2">
                <span
                  className="text-sm font-medium w-10"
                  style={{ color: theme.textMuted }}
                >
                  {SHORT_DAYS[Number(day)]}
                </span>
                {dayWindows.map((w) => (
                  <span
                    key={w.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border"
                    style={{
                      borderColor: theme.cardBorder,
                      color: theme.text,
                    }}
                  >
                    {formatTime(w.start_time)} – {formatTime(w.end_time)}
                    <button
                      type="button"
                      onClick={() => w.id && handleRemove(w.id)}
                      className="opacity-40 hover:opacity-100 transition-opacity"
                      style={{ color: theme.textMuted }}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: theme.textFaint }}>
          No availability set. Add your open hours below.
        </p>
      )}

      {/* Add new */}
      <div
        className="flex flex-wrap items-end gap-3 pt-2"
      >
        <div>
          <label className="block text-xs mb-1" style={{ color: theme.textFaint }}>
            Day
          </label>
          <select
            value={newDay}
            onChange={(e) => setNewDay(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{
              borderColor: theme.cardBorder,
              color: theme.text,
              backgroundColor: theme.cardBg,
            }}
          >
            {DAYS.map((day, i) => (
              <option key={i} value={i}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs mb-1" style={{ color: theme.textFaint }}>
            From
          </label>
          <input
            type="time"
            value={newStart}
            onChange={(e) => setNewStart(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{
              borderColor: theme.cardBorder,
              color: theme.text,
              backgroundColor: "transparent",
            }}
          />
        </div>

        <div>
          <label className="block text-xs mb-1" style={{ color: theme.textFaint }}>
            To
          </label>
          <input
            type="time"
            value={newEnd}
            onChange={(e) => setNewEnd(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{
              borderColor: theme.cardBorder,
              color: theme.text,
              backgroundColor: "transparent",
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={saving}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{
            backgroundColor: theme.text,
            color: theme.bg,
          }}
        >
          {saving ? "..." : "Add"}
        </button>
      </div>

      {message && (
        <p className="text-xs" style={{ color: "#10b981" }}>{message}</p>
      )}
    </div>
  );
}
