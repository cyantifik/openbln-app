"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme";
import { supabase } from "@/lib/supabase";

export default function FeedbackWidget() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Feedback");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Pre-fill name from logged-in user
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.name) {
          setName(user.user_metadata.name);
        }
      } catch {}
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      await fetch("/api/admin/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, message }),
      });
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setMessage("");
        setCategory("Feedback");
      }, 2000);
    } catch (err) {
      console.error("Feedback failed:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button — bottom right */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
        style={{
          backgroundColor: theme.text,
          color: theme.bg,
        }}
        aria-label="Send feedback"
        title="Send feedback"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Collar */}
            <path d="M10 2h4v2h-4z" />
            {/* Shoulders and body */}
            <path d="M10 4v4L4 20a1 1 0 001 1h14a1 1 0 001-1L14 8V4" />
            {/* Lapel lines */}
            <path d="M10 4l2 6 2-6" />
            {/* Pocket */}
            <rect x="13" y="14" width="3" height="2" rx="0.5" />
            {/* Buttons */}
            <circle cx="12" cy="13" r="0.5" fill="currentColor" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Feedback panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-48px)] rounded-xl border shadow-xl overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
        >
          {sent ? (
            <div className="p-8 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: theme.text }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold" style={{ color: theme.text }}>
                Thank you!
              </p>
              <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
                We got your message.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="p-5 pb-3">
                <h3 className="font-semibold text-base mb-1" style={{ color: theme.text }}>
                  Share your thoughts
                </h3>
                <p className="text-xs mb-4" style={{ color: theme.textFaint }}>
                  Feedback, feature ideas, or bug reports — all welcome.
                </p>

                {/* Category pills */}
                <div className="flex gap-2 mb-4">
                  {["Feedback", "Feature idea", "Bug"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className="px-3 py-1.5 text-xs rounded-full border transition-all duration-200 cursor-pointer"
                      style={{
                        backgroundColor: category === cat ? theme.text : "transparent",
                        color: category === cat ? theme.bg : theme.textMuted,
                        borderColor: category === cat ? theme.text : theme.border,
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Name (pre-filled, editable) */}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full px-3 py-2 text-sm rounded-lg border mb-3 bg-transparent outline-none transition-colors duration-200"
                  style={{
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                />

                {/* Message */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border bg-transparent outline-none resize-none transition-colors duration-200"
                  style={{
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                />
              </div>

              <div
                className="px-5 py-3 border-t flex justify-end"
                style={{ borderTopColor: theme.border }}
              >
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="px-5 py-2 text-sm font-medium rounded-lg transition-opacity duration-200 disabled:opacity-40 cursor-pointer"
                  style={{
                    backgroundColor: theme.text,
                    color: theme.bg,
                  }}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
