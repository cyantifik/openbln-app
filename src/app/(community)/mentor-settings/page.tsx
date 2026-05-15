"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useTheme } from "@/lib/theme";
import { supabase } from "@/lib/supabase";

function MentorSettingsContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [isMentor, setIsMentor] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("1:1 Mentoring Session");
  const [sessionDuration, setSessionDuration] = useState(30);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [memberId, setMemberId] = useState<string | null>(null);
  const [authId, setAuthId] = useState<string | null>(null);

  const success = searchParams.get("success");
  const error = searchParams.get("error");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        setAuthId(user.id);

        // Get member record
        const { data: member } = await supabase
          .from("members")
          .select("id, is_mentor")
          .eq("auth_id", user.id)
          .single();

        if (member) {
          setMemberId(member.id);
          setIsMentor(member.is_mentor || false);

          // Get mentor profile if exists
          const { data: profile } = await supabase
            .from("mentor_profiles")
            .select("*")
            .eq("member_id", member.id)
            .single();

          if (profile) {
            setIsCalendarConnected(profile.is_calendar_connected || false);
            setSessionTitle(profile.session_title || "1:1 Mentoring Session");
            setSessionDuration(profile.session_duration || 30);
          }
        }
      } catch (err) {
        console.error("Error loading mentor settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (success === "connected") {
      setMessage("Google Calendar connected successfully!");
      setIsCalendarConnected(true);
      setIsMentor(true);
    }
    if (error) {
      const errorMessages: Record<string, string> = {
        access_denied: "Calendar access was denied.",
        missing_params: "Something went wrong. Please try again.",
        no_refresh_token: "Could not get calendar access. Please try again.",
        member_not_found: "Member profile not found.",
        save_failed: "Failed to save calendar connection.",
        callback_failed: "Something went wrong. Please try again.",
      };
      setMessage(errorMessages[error] || "An error occurred.");
    }
  }, [success, error]);

  const handleToggleMentor = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !memberId) return;

      const newValue = !isMentor;

      await supabase
        .from("members")
        .update({ is_mentor: newValue })
        .eq("id", memberId);

      if (newValue) {
        // Create mentor profile if it doesn't exist
        await supabase.from("mentor_profiles").upsert(
          {
            member_id: memberId,
            auth_id: user.id,
            session_title: sessionTitle,
            session_duration: sessionDuration,
          },
          { onConflict: "auth_id" }
        );
      }

      setIsMentor(newValue);
    } catch (err) {
      console.error("Error toggling mentor status:", err);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("mentor_profiles")
        .update({
          session_title: sessionTitle,
          session_duration: sessionDuration,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_id", user.id);

      setMessage("Settings saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p style={{ color: theme.textMuted }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p
          className="text-xs tracking-widest uppercase mb-2"
          style={{ color: theme.textFaint }}
        >
          Settings
        </p>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: theme.text }}
        >
          Mentor Booking
        </h1>
        <p style={{ color: theme.textMuted }}>
          Offer 1:1 sessions to the community. Connect your Google Calendar and
          members can book time with you.
        </p>
      </div>

      {message && (
        <div
          className="mb-8 p-4 rounded-lg text-sm"
          style={{
            backgroundColor: success
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(239, 68, 68, 0.1)",
            color: success ? "#10b981" : "#ef4444",
            border: `1px solid ${success ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
          }}
        >
          {message}
        </div>
      )}

      {/* Mentor Toggle */}
      <div
        className="p-6 rounded-lg border mb-6"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-lg font-semibold mb-1"
              style={{ color: theme.text }}
            >
              I am a mentor
            </h2>
            <p className="text-sm" style={{ color: theme.textMuted }}>
              Enable this to appear as a bookable mentor in the community
            </p>
          </div>
          <button
            onClick={handleToggleMentor}
            className="relative w-12 h-7 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: isMentor ? theme.text : theme.cardBorder,
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform duration-200"
              style={{
                transform: isMentor ? "translateX(20px)" : "translateX(0)",
              }}
            />
          </button>
        </div>
      </div>

      {isMentor && (
        <>
          {/* Google Calendar Connection */}
          <div
            className="p-6 rounded-lg border mb-6"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
          >
            <h2
              className="text-lg font-semibold mb-1"
              style={{ color: theme.text }}
            >
              Google Calendar
            </h2>
            <p className="text-sm mb-4" style={{ color: theme.textMuted }}>
              {isCalendarConnected
                ? "Your Google Calendar is connected. Available slots are shown based on your calendar."
                : "Connect your Google Calendar so members can see when you are free."}
            </p>

            {isCalendarConnected ? (
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Connected
                </span>
                <a
                  href={`/api/calendar/connect?userId=${authId}`}
                  className="text-sm underline"
                  style={{ color: theme.textMuted }}
                >
                  Reconnect
                </a>
              </div>
            ) : (
              <a
                href={`/api/calendar/connect?userId=${authId}`}
                className="inline-block px-6 py-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: theme.text,
                  color: theme.bg,
                }}
              >
                Connect Google Calendar
              </a>
            )}
          </div>

          {/* Session Settings */}
          <div
            className="p-6 rounded-lg border mb-6"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
          >
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text }}
            >
              Session Settings
            </h2>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textMuted }}
              >
                Session Title
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-transparent text-sm outline-none"
                style={{
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
                placeholder="e.g., 1:1 Mentoring Session"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textMuted }}
              >
                Duration
              </label>
              <select
                value={sessionDuration}
                onChange={(e) => setSessionDuration(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                style={{
                  borderColor: theme.cardBorder,
                  color: theme.text,
                  backgroundColor: theme.cardBg,
                }}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{
                backgroundColor: theme.text,
                color: theme.bg,
              }}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </>
      )}

      <div className="mt-8">
        <Link
          href="/community"
          className="text-sm"
          style={{ color: theme.textMuted }}
        >
          ← Back to Space
        </Link>
      </div>
    </div>
  );
}

export default function MentorSettingsPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto px-6 py-16">
            <p className="text-gray-500">Loading...</p>
          </div>
        }
      >
        <MentorSettingsContent />
      </Suspense>
    </AuthGuard>
  );
}
