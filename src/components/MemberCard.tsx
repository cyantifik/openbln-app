"use client";

import Link from "next/link";
import { Member } from "@/lib/data";
import { useTheme } from "@/lib/theme";
import { BookingChevronIcon } from "@/components/AnimatedIcons";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  const { theme } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link href={`/member/${member.id}`}>
      <div
        className="rounded-lg border p-6 cursor-pointer h-full flex flex-col transition-all duration-300 hover:scale-[1.02]"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        {/* Badges */}
        {(member.is_admin || member.is_mentor || member.is_mentee) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {member.is_admin && (
              <span
                className="inline-block px-2 py-1 text-xs font-semibold rounded"
                style={{ backgroundColor: theme.accent, color: theme.accentText }}
              >
                Admin
              </span>
            )}
            {member.is_mentor && (
              <span
                className="inline-block px-2 py-1 text-xs font-semibold rounded"
                style={{
                  backgroundColor: `${theme.textFaint}18`,
                  color: theme.textMuted,
                  border: `1px solid ${theme.border}`,
                }}
              >
                Mentor
              </span>
            )}
            {member.is_mentee && (
              <span
                className="inline-block px-2 py-1 text-xs font-semibold rounded"
                style={{
                  backgroundColor: `${theme.textFaint}18`,
                  color: theme.textMuted,
                  border: `1px solid ${theme.border}`,
                }}
              >
                Mentee
              </span>
            )}
          </div>
        )}

        {/* Avatar and Header */}
        <div className="flex items-start gap-4 mb-4">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
              style={{ backgroundColor: `${theme.textFaint}22`, color: theme.textMuted }}
            >
              {getInitials(member.name)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
            <p className="text-sm" style={{ color: theme.textMuted }}>{member.role}</p>
          </div>
          {/* Contact paper plane */}
          {(member as any).email && (
            <a
              href={`mailto:${(member as any).email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 p-1.5 rounded-full transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
              title="Get in touch"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={theme.textFaint}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </a>
          )}
        </div>

        {/* Company */}
        {member.company && (
          <p className="text-sm mb-4 ml-16" style={{ color: theme.textFaint }}>{member.company}</p>
        )}

        {/* Groups */}
        {member.groups && member.groups.length > 0 && (
          <div className="mt-auto pt-3">
            <div className="flex flex-wrap gap-1.5">
              {member.groups.map((group) => (
                <span
                  key={group.id}
                  className="inline-block px-2.5 py-1 text-xs rounded-md transition-colors duration-500"
                  style={{
                    backgroundColor: `${theme.textFaint}12`,
                    color: theme.textMuted,
                  }}
                >
                  {group.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        <div className={`${member.groups && member.groups.length > 0 ? 'pt-3' : 'mt-auto pt-4'} border-t`} style={{ borderTopColor: theme.border }}>
          <div className="flex flex-wrap gap-2">
            {member.skills_offered.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="inline-block px-3 py-1 text-sm rounded-md border transition-colors duration-500"
                style={{
                  backgroundColor: theme.tagBg,
                  color: theme.tagText,
                  borderColor: theme.tagBorder,
                }}
              >
                {skill}
              </span>
            ))}
            {member.skills_offered.length > 3 && (
              <span className="text-xs self-center" style={{ color: theme.textFaint }}>
                +{member.skills_offered.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Mentor CTA */}
        {member.is_mentor && (
          <div className="mt-4 pt-4 border-t" style={{ borderTopColor: theme.border }}>
            <span
              className="block w-full text-center py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: theme.text,
                color: theme.bg,
              }}
            >
              Book a session
              <BookingChevronIcon size={14} color={theme.bg} />
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
