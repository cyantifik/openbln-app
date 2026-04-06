"use client";

import Link from "next/link";
import { Member } from "@/lib/data";
import { useTheme } from "@/lib/theme";

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
        {/* Admin Badge */}
        {member.is_admin && (
          <div className="mb-3">
            <span
              className="inline-block px-2 py-1 text-xs font-semibold rounded"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}
            >
              Admin
            </span>
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
        </div>

        {/* Company */}
        {member.company && (
          <p className="text-sm mb-4 ml-16" style={{ color: theme.textFaint }}>{member.company}</p>
        )}

        {/* Skills */}
        <div className="mt-auto pt-4 border-t" style={{ borderTopColor: theme.border }}>
          <div className="flex flex-wrap gap-2">
            {member.skills_offered.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="inline-block px-3 py-1 text-sm rounded-full border transition-colors duration-500"
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
      </div>
    </Link>
  );
}
