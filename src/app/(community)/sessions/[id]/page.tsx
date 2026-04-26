"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useTheme } from "@/lib/theme";
import { getSessionById, SESSIONS } from "@/lib/sessions-data";

function SessionDetail() {
  const { theme } = useTheme();
  const params = useParams();
  const session = getSessionById(params.id as string);

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p style={{ color: theme.textMuted }}>Session not found.</p>
        <Link href="/sessions" className="text-sm underline mt-4 inline-block" style={{ color: theme.textFaint }}>
          Back to Sessions
        </Link>
      </div>
    );
  }

  // Find prev/next sessions
  const currentIndex = SESSIONS.findIndex((s) => s.id === session.id);
  const prevSession = currentIndex > 0 ? SESSIONS[currentIndex - 1] : null;
  const nextSession = currentIndex < SESSIONS.length - 1 ? SESSIONS[currentIndex + 1] : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/sessions"
        className="text-sm mb-8 inline-block transition-colors duration-300"
        style={{ color: theme.textFaint }}
        onMouseEnter={(e) => (e.currentTarget.style.color = theme.text)}
        onMouseLeave={(e) => (e.currentTarget.style.color = theme.textFaint)}
      >
        ← Sessions
      </Link>

      {/* Header */}
      <div className="mb-12">
        <p
          className="text-xs tracking-widest uppercase mb-2 transition-colors duration-500"
          style={{ color: theme.textFaint }}
        >
          {session.subtitle}
        </p>
        <h1
          className="text-3xl font-bold mb-2 transition-colors duration-500"
          style={{ color: theme.text }}
        >
          {session.title}
        </h1>
        <p
          className="text-sm mb-6 transition-colors duration-500"
          style={{ color: theme.textMuted }}
        >
          {session.date} · {session.venue}
        </p>
        <p
          className="leading-relaxed transition-colors duration-500"
          style={{ color: theme.textMuted }}
        >
          {session.summary}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {session.sections.map((section, i) => (
          <div key={i}>
            <h2
              className="text-xs tracking-widest uppercase mb-4 font-semibold transition-colors duration-500"
              style={{ color: theme.textFaint }}
            >
              {section.title}
            </h2>

            {section.type === "text" && (
              <p
                className="leading-relaxed transition-colors duration-500"
                style={{ color: theme.textMuted }}
              >
                {section.content}
              </p>
            )}

            {section.type === "list" && section.items && (
              <div className="space-y-3">
                {section.items.map((item, j) => (
                  <div
                    key={j}
                    className="p-4 rounded-lg transition-colors duration-500"
                    style={{ backgroundColor: theme.tagBg }}
                  >
                    <p
                      className="text-sm leading-relaxed transition-colors duration-500"
                      style={{ color: theme.textMuted }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.type === "tags" && section.items && (
              <div className="flex flex-wrap gap-2">
                {section.items.map((tag, j) => (
                  <span
                    key={j}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-500"
                    style={{
                      backgroundColor: theme.tagBg,
                      color: theme.tagText,
                      border: `1px solid ${theme.tagBorder}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {section.type === "agenda" && section.agendaItems && (
              <div className="space-y-1">
                {section.agendaItems.map((item, j) => (
                  <div
                    key={j}
                    className="flex gap-4 p-4 rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: j === 0 ? theme.tagBg : "transparent",
                    }}
                  >
                    <div
                      className="text-sm font-medium w-14 flex-shrink-0 transition-colors duration-500"
                      style={{ color: theme.textFaint }}
                    >
                      {item.time}
                    </div>
                    <div>
                      <p
                        className="font-semibold text-sm mb-1 transition-colors duration-500"
                        style={{ color: theme.text }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-sm transition-colors duration-500"
                        style={{ color: theme.textMuted }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prev/Next navigation */}
      <div
        className="mt-16 pt-8 flex justify-between"
        style={{ borderTop: `1px solid ${theme.separator}` }}
      >
        {prevSession ? (
          <Link
            href={`/sessions/${prevSession.id}`}
            className="text-sm transition-colors duration-300"
            style={{ color: theme.textFaint }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.textFaint)}
          >
            ← {prevSession.title}
          </Link>
        ) : (
          <span />
        )}
        {nextSession ? (
          <Link
            href={`/sessions/${nextSession.id}`}
            className="text-sm transition-colors duration-300"
            style={{ color: theme.textFaint }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.textFaint)}
          >
            {nextSession.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <AuthGuard>
      <SessionDetail />
    </AuthGuard>
  );
}
