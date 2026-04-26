"use client";

import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useTheme } from "@/lib/theme";
import { SESSIONS } from "@/lib/sessions-data";

function SessionsList() {
  const { theme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p
          className="text-xs tracking-widest uppercase mb-2 transition-colors duration-500"
          style={{ color: theme.textFaint }}
        >
          Memory Lane
        </p>
        <h1
          className="text-3xl font-bold mb-3 transition-colors duration-500"
          style={{ color: theme.text }}
        >
          Sessions
        </h1>
        <p
          className="transition-colors duration-500"
          style={{ color: theme.textMuted }}
        >
          Every gathering builds on the last. Here is where we've been and where we're going.
        </p>
      </div>

      <div className="space-y-4">
        {SESSIONS.map((session) => (
          <Link
            key={session.id}
            href={`/sessions/${session.id}`}
            className="block p-6 rounded-xl border transition-all duration-300"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.borderHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.cardBorder;
            }}
          >
            <p
              className="text-xs tracking-widest uppercase mb-1 transition-colors duration-500"
              style={{ color: theme.textFaint }}
            >
              {session.subtitle}
            </p>
            <h2
              className="text-xl font-semibold mb-1 transition-colors duration-500"
              style={{ color: theme.text }}
            >
              {session.title}
            </h2>
            <p
              className="text-sm transition-colors duration-500"
              style={{ color: theme.textMuted }}
            >
              {session.date} · {session.venue}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SessionsPage() {
  return (
    <AuthGuard>
      <SessionsList />
    </AuthGuard>
  );
}
