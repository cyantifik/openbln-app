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
            <style>{`
              @keyframes b1 { 0%,100% { transform: translateY(0); opacity: 0.8; } 50% { transform: translateY(-3px); opacity: 0; } }
              @keyframes b2 { 0%,100% { transform: translateY(0); opacity: 0.6; } 60% { transform: translateY(-4px); opacity: 0; } }
              @keyframes b3 { 0%,100% { transform: translateY(0); opacity: 0.7; } 55% { transform: translateY(-2.5px); opacity: 0; } }
              .bub1 { animation: b1 2.4s ease-in-out infinite; }
              .bub2 { animation: b2 3.1s ease-in-out infinite 0.8s; }
              .bub3 { animation: b3 2.7s ease-in-out infinite 1.5s; }
            `}</style>
            <path d="M9 3h6" />
            <path d="M10 3v7.4a2 2 0 01-.6 1.4L4.6 16.6a2 2 0 00-.6 1.4V19a2 2 0 002 2h12a2 2 0 002-2v-1a2 2 0 00-.6-1.4l-4.8-4.8a2 2 0 01-.6-1.4V3" />
            <circle className="bub1" cx="10" cy="17" r="1" fill="currentColor" stroke="none" />
            <circle className="bub2" cx="13" cy="18" r="0.7" fill="currentColor" stroke="none" />
            <circle className="bub3" cx="11.5" cy="19" r="0.8" fill="currentColor" stroke="none" />
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
                  placeholder={
                    category === "Feedback" ? "What do you have in mind?" :
                    category === "Feature idea" ? "Tell us all about it!" :
                    category === "Bug" ? "What did you catch?" :
                    "What's on your mind?"
                  }
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
