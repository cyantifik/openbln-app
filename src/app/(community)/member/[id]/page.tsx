"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BookingWidget from "@/components/BookingWidget";
import AuthGuard from "@/components/AuthGuard";
import { useTheme } from "@/lib/theme";
import { supabase } from "@/lib/supabase";
import type { Member } from "@/lib/data";
import { IdCardIcon, ToolboxIcon, LookingForIcon, MentorshipIcon, LinksIcon } from "@/components/AnimatedIcons";

function MemberProfileContent() {
  const { theme } = useTheme();
  const params = useParams();
  const id = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [isMentorWithCalendar, setIsMentorWithCalendar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMember = async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setMember(data);

        // Check if mentor has availability set
        if (data?.is_mentor) {
          const { data: availability } = await supabase
            .from("mentor_availability")
            .select("id")
            .eq("mentor_id", id)
            .limit(1);
          setIsMentorWithCalendar((availability && availability.length > 0) || false);
        }
      } catch (err) {
        console.error("Error loading member:", err);
        // Fallback to static data
        const { getMemberById } = await import("@/lib/data");
        const staticMember = getMemberById(id);
        if (staticMember) setMember(staticMember);
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p style={{ color: theme.textMuted }}>Loading...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p style={{ color: theme.textMuted }}>Member not found.</p>
        <Link href="/community" className="text-sm mt-4 inline-block" style={{ color: theme.textFaint }}>
          ← Back to Space
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back Link */}
      <Link
        href="/community"
        className="text-sm mb-8 inline-block transition-colors"
        style={{ color: theme.textMuted }}
      >
        ← Back to Space
      </Link>

      {/* Header Section — stacks on mobile */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={member.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                style={{ border: `1px solid ${theme.cardBorder}` }}
              />
            ) : (
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center font-semibold text-2xl sm:text-3xl"
                style={{
                  backgroundColor: `${theme.textFaint}22`,
                  color: theme.textMuted,
                  border: `1px solid ${theme.cardBorder}`,
                }}
              >
                {getInitials(member.name)}
              </div>
            )}
          </div>

          {/* Name and Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
              <h1
                className="text-2xl sm:text-4xl font-bold"
                style={{ color: theme.text }}
              >
                {member.name}
              </h1>
              <IdCardIcon size={28} color={theme.textFaint} />
              {member.is_admin && (
                <span
                  className="px-2.5 py-1 text-xs font-semibold rounded"
                  style={{ backgroundColor: theme.accent, color: theme.accentText }}
                >
                  Admin
                </span>
              )}
              {member.is_mentor && (
                <span
                  className="px-2.5 py-1 text-xs font-semibold rounded"
                  style={{
                    backgroundColor: `${theme.textFaint}18`,
                    color: theme.textMuted,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  Mentor
                </span>
              )}
            </div>

            <p className="text-lg mb-1" style={{ color: theme.textMuted }}>
              {member.role}
            </p>
            <p style={{ color: theme.textFaint }}>{member.company}</p>

            {/* Contact — paper plane */}
            {(member as any).email && (
              <a
                href={`mailto:${(member as any).email}`}
                className="inline-flex items-center gap-2 mt-4 group"
                title="Get in touch"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.textMuted}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-200"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
                <span
                  className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: theme.textMuted }}
                >
                  Get in touch
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <p
            className="leading-relaxed max-w-2xl"
            style={{ color: theme.textMuted }}
          >
            {member.bio}
          </p>
        )}
      </div>

      {/* Two-column layout on desktop: info + booking */}
      <div className={`${isMentorWithCalendar ? "grid grid-cols-1 lg:grid-cols-5 gap-8" : ""}`}>
        {/* Left column: details */}
        <div className={isMentorWithCalendar ? "lg:col-span-3" : ""}>
          {/* Toolbox */}
          {member.skills_offered && member.skills_offered.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
                  Toolbox
                </h2>
                <ToolboxIcon size={20} color={theme.textFaint} />
              </div>
              <div className="flex flex-wrap gap-2">
                {member.skills_offered.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-md text-sm border"
                    style={{
                      backgroundColor: theme.tagBg,
                      color: theme.tagText,
                      borderColor: theme.tagBorder,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Looking For */}
          {member.skills_needed && member.skills_needed.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
                  Looking For
                </h2>
                <LookingForIcon size={20} color={theme.textFaint} />
              </div>
              <div className="flex flex-wrap gap-2">
                {member.skills_needed.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-md text-sm border"
                    style={{
                      borderColor: theme.cardBorder,
                      color: theme.textMuted,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mentorship Section */}
          {(member.is_mentor || member.is_mentee) && (
            <div
              className="mb-10 p-5 rounded-lg border"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
            >
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
                  Mentorship
                </h2>
                <MentorshipIcon size={20} color={theme.textFaint} />
              </div>

              {member.is_mentor && member.mentor_topics && member.mentor_topics.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                    Mentoring on
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.mentor_topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1.5 rounded-md text-sm border"
                        style={{
                          backgroundColor: `${theme.textFaint}10`,
                          borderColor: theme.border,
                          color: theme.text,
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.is_mentee && member.mentee_topics && member.mentee_topics.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                    Looking for help with
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.mentee_topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1.5 rounded-md text-sm border"
                        style={{
                          borderColor: theme.cardBorder,
                          color: theme.textMuted,
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Links */}
          {member.links && Object.keys(member.links).length > 0 && (
            <div
              className="pt-8 border-t"
              style={{ borderTopColor: theme.border }}
            >
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
                  Links
                </h2>
                <LinksIcon size={20} color={theme.textFaint} />
              </div>
              <div className="space-y-3">
                {Object.entries(member.links).map(([key, value]) => (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-colors"
                    style={{ color: theme.textMuted }}
                  >
                    <span className="capitalize font-medium">{key}</span>
                    <span style={{ color: theme.textFaint }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: booking widget (sticky on desktop) */}
        {isMentorWithCalendar && (
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <BookingWidget mentorId={member.id} mentorName={member.name} />
            </div>
          </div>
        )}
      </div>

      {/* Mentor without calendar message */}
      {member.is_mentor && !isMentorWithCalendar && (
        <div
          className="mt-8 p-4 rounded-lg border"
          style={{
            backgroundColor: `${theme.textFaint}08`,
            borderColor: theme.cardBorder,
          }}
        >
          <p className="text-sm" style={{ color: theme.textFaint }}>
            This mentor hasn't set up booking yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default function MemberProfile() {
  return (
    <AuthGuard>
      <MemberProfileContent />
    </AuthGuard>
  );
}
