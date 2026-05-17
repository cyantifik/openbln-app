"use client";

import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useTheme } from "@/lib/theme";
import { SESSIONS } from "@/lib/sessions-data";
import { PhotoStripIcon } from "@/components/AnimatedIcons";

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
        <div className="flex items-center gap-3 mb-3">
          <h1
            className="text-3xl font-bold transition-colors duration-500"
            style={{ color: theme.text }}
          >
            Sessions
          </h1>
          <PhotoStripIcon size={28} color={theme.textMuted} />
        </div>
        <p
          className="transition-colors duration-500"
          style={{ color: theme.textMuted }}
        >
          Every gathering builds on the last. Here is where we've been and where we're going.
        </p>
      </div>

      <div className="space-y-4">
        {[...SESSIONS].reverse().map((session) => (
          <Link
            key={session.id}
            href={`/sessions/${session.id}`}
            className="block p-6 rounded-lg border transition-all duration-300"
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
