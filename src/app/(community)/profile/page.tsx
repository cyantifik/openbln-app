"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/lib/theme";
import AuthGuard from "@/components/AuthGuard";
import type { User } from "@supabase/supabase-js";
import type { Member, AccountabilityGroup } from "@/lib/data";
import { getAccountabilityGroups, getMemberGroups, joinGroup, leaveGroup } from "@/lib/data";
import AvailabilityEditor from "@/components/AvailabilityEditor";
import BookingRequests from "@/components/BookingRequests";
import ScreeningQuestionsEditor from "@/components/ScreeningQuestionsEditor";

function Toggle({
  checked,
  onChange,
  theme,
}: {
  checked: boolean;
  onChange: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
      style={{ backgroundColor: checked ? theme.text : theme.cardBorder }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200"
        style={{
          transform: checked ? "translateX(20px)" : "translateX(0)",
          backgroundColor: theme.bg,
        }}
      />
    </button>
  );
}

function ProfileContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // Basic info
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    bio: "",
    skills_offered: "",
    skills_needed: "",
    links: {} as Record<string, string>,
  });

  // Mentorship
  const [memberId, setMemberId] = useState<string | null>(null);
  const [isMentor, setIsMentor] = useState(false);
  const [isMentee, setIsMentee] = useState(false);
  const [mentorTopics, setMentorTopics] = useState("");
  const [menteeTopics, setMenteeTopics] = useState("");
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>([]);

  // Accountability Groups
  const [allGroups, setAllGroups] = useState<AccountabilityGroup[]>([]);
  const [myGroupIds, setMyGroupIds] = useState<string[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

  // Check for calendar connection success/error from redirect
  const calendarSuccess = searchParams.get("success");
  const calendarError = searchParams.get("error");

  useEffect(() => {
    if (calendarSuccess === "connected") {
      setSuccess("Google Calendar connected successfully!");
      setIsCalendarConnected(true);
      setIsMentor(true);
    }
    if (calendarError) {
      setError("Failed to connect Google Calendar. Please try again.");
    }
  }, [calendarSuccess, calendarError]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (!user) {
          setLoading(false);
          return;
        }

        // Load member profile
        const { data: memberData, error: memberError } = await supabase
          .from("members")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        if (memberError && memberError.code !== "PGRST116") {
          throw memberError;
        }

        if (memberData) {
          setMember(memberData);
          setMemberId(memberData.id);
          setAvatarUrl(memberData.avatar_url || "");
          setFormData({
            name: memberData.name || "",
            role: memberData.role || "",
            company: memberData.company || "",
            bio: memberData.bio || "",
            skills_offered: (memberData.skills_offered || []).join(", "),
            skills_needed: (memberData.skills_needed || []).join(", "),
            links: memberData.links || {},
          });
          setIsMentor(memberData.is_mentor || false);
          setIsMentee(memberData.is_mentee || false);
          setMentorTopics((memberData.mentor_topics || []).join(", "));
          setMenteeTopics((memberData.mentee_topics || []).join(", "));

          // Check calendar connection + load screening questions
          if (memberData.is_mentor) {
            const { data: profile } = await supabase
              .from("mentor_profiles")
              .select("is_calendar_connected, screening_questions")
              .eq("member_id", memberData.id)
              .single();
            setIsCalendarConnected(profile?.is_calendar_connected || false);
            setScreeningQuestions(profile?.screening_questions || []);
          }

          // Load accountability groups
          const [groups, memberGroupsList] = await Promise.all([
            getAccountabilityGroups(),
            getMemberGroups(memberData.id),
          ]);
          setAllGroups(groups);
          setMyGroupIds(memberGroupsList.map((g) => g.id));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (key: string, value: string) => {
    setFormData({ ...formData, links: { ...formData.links, [key]: value } });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError("");
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      if (!user) {
        setError("You must be logged in to upload an avatar");
        return;
      }

      setUploading(true);

      const ext = file.name.split(".").pop();
      const timestamp = Date.now();
      const filename = `${user.id}/${timestamp}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filename, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
      const publicUrl = data.publicUrl;

      setAvatarUrl(publicUrl);

      if (member) {
        const { error: updateError } = await supabase
          .from("members")
          .update({ avatar_url: publicUrl })
          .eq("id", member.id);
        if (updateError) throw updateError;
      }

      setSuccess("Avatar uploaded!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!user) {
        setError("You must be logged in");
        return;
      }

      const updateData = {
        name: formData.name,
        role: formData.role,
        company: formData.company,
        bio: formData.bio,
        skills_offered: formData.skills_offered
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        skills_needed: formData.skills_needed
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        links: formData.links,
        is_mentor: isMentor,
        is_mentee: isMentee,
        mentor_topics: mentorTopics
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        mentee_topics: menteeTopics
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      if (member) {
        const { error: updateError } = await supabase
          .from("members")
          .update(updateData)
          .eq("id", member.id);
        if (updateError) throw updateError;

        // Create/update mentor profile if needed
        if (isMentor) {
          const { error: mentorError } = await supabase.from("mentor_profiles").upsert(
            {
              member_id: member.id,
              auth_id: user.id,
              session_title: "1:1 Mentoring Session",
              session_duration: 30,
              screening_questions: screeningQuestions,
            },
            { onConflict: "auth_id" }
          );
          if (mentorError) {
            console.error("Mentor profile upsert error:", mentorError);
            // Don't block the save — mentor profile will be created on calendar connect
          }
        }
      } else {
        const { error: createError } = await supabase.from("members").insert({
          auth_id: user.id,
          ...updateData,
          is_admin: false,
          achievements: [],
          avatar_url: "",
          status: "approved",
        });
        if (createError) throw createError;
      }

      setSuccess("Profile saved!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p style={{ color: theme.textMuted }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4" style={{ color: theme.text }}>
          Profile
        </h1>
        <p className="mb-4" style={{ color: theme.textMuted }}>
          You must be logged in to view your profile.
        </p>
        <Link href="/auth/login" className="text-sm" style={{ color: theme.textFaint }}>
          ← Sign In
        </Link>
      </div>
    );
  }

  const inputStyle = {
    backgroundColor: "transparent",
    borderColor: theme.cardBorder,
    color: theme.text,
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p
          className="text-xs tracking-widest uppercase mb-2"
          style={{ color: theme.textFaint }}
        >
          Settings
        </p>
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
          Your Profile
        </h1>
        <p style={{ color: theme.textMuted }}>
          How the community sees you.
        </p>
      </div>

      {error && (
        <div
          className="mb-6 p-4 rounded-xl text-sm"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="mb-6 p-4 rounded-xl text-sm"
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ─── Avatar ─── */}
        <div className="flex flex-col items-center mb-2">
          <div className="mb-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={formData.name || "Avatar"}
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: `1px solid ${theme.cardBorder}` }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center font-semibold text-lg"
                style={{
                  backgroundColor: `${theme.textFaint}22`,
                  color: theme.textMuted,
                }}
              >
                {getInitials(formData.name) || "?"}
              </div>
            )}
          </div>
          <div>
            <input
              ref={(input) => {
                if (input) input.style.display = "none";
              }}
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
            <label
              htmlFor="avatar-input"
              className="cursor-pointer text-sm font-medium px-4 py-2 rounded-lg border transition-opacity hover:opacity-70"
              style={{
                borderColor: theme.cardBorder,
                color: theme.textMuted,
              }}
            >
              {uploading ? "Uploading..." : "Change Photo"}
            </label>
          </div>
        </div>

        {/* ─── Basic Info ─── */}
        <div
          className="p-6 sm:p-8 rounded-xl border space-y-6"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            About You
          </h2>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none"
              style={inputStyle}
              placeholder="Your name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                Role / Title
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none"
                style={inputStyle}
                placeholder="e.g., Product Designer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none"
                style={inputStyle}
                placeholder="Your company or studio"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none resize-none"
              style={inputStyle}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </div>

        {/* ─── Skills ─── */}
        <div
          className="p-6 sm:p-8 rounded-xl border space-y-6"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            Skills
          </h2>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
              What you offer
            </label>
            <textarea
              name="skills_offered"
              value={formData.skills_offered}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none resize-none"
              style={inputStyle}
              placeholder="Design, Mentorship, React, Brand Strategy"
              rows={2}
            />
            <p className="text-xs mt-1" style={{ color: theme.textFaint }}>
              Separate with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
              What you need
            </label>
            <textarea
              name="skills_needed"
              value={formData.skills_needed}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none resize-none"
              style={inputStyle}
              placeholder="Marketing, Backend Development"
              rows={2}
            />
            <p className="text-xs mt-1" style={{ color: theme.textFaint }}>
              Separate with commas
            </p>
          </div>
        </div>

        {/* ─── Mentorship ─── */}
        <div
          className="p-6 sm:p-8 rounded-xl border space-y-7"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          <div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: theme.text }}>
              Mentorship
            </h2>
            <p className="text-sm" style={{ color: theme.textFaint }}>
              Choose your role in the community. You can be both.
            </p>
          </div>

          {/* Mentor toggle */}
          <div
            className="p-5 rounded-xl border"
            style={{
              borderColor: isMentor ? theme.text : theme.cardBorder,
              backgroundColor: isMentor ? `${theme.textFaint}08` : "transparent",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-medium" style={{ color: theme.text }}>
                  I am a mentor
                </h3>
                <p className="text-sm" style={{ color: theme.textFaint }}>
                  Offer 1:1 sessions to the community
                </p>
              </div>
              <Toggle checked={isMentor} onChange={() => setIsMentor(!isMentor)} theme={theme} />
            </div>

            {isMentor && (
              <div className="mt-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                    What I mentor on
                  </label>
                  <textarea
                    value={mentorTopics}
                    onChange={(e) => setMentorTopics(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none resize-none"
                    style={inputStyle}
                    placeholder="Portfolio reviews, Career transitions, Design leadership, Job search strategy"
                    rows={3}
                  />
                  <p className="text-xs mt-1" style={{ color: theme.textFaint }}>
                    Separate with commas
                  </p>
                </div>

                {/* Availability windows */}
                <div
                  className="p-5 rounded-xl"
                  style={{ backgroundColor: `${theme.textFaint}08` }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Your Availability
                  </p>
                  <p className="text-sm mb-3" style={{ color: theme.textFaint }}>
                    Set the hours you are open for mentoring. Mentees can only request slots within these windows.
                  </p>
                  {memberId && (
                    <AvailabilityEditor mentorId={memberId} theme={theme} />
                  )}
                </div>

                {/* Screening Questions */}
                <div
                  className="p-5 rounded-xl"
                  style={{ backgroundColor: `${theme.textFaint}08` }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Screening Questions
                  </p>
                  <p className="text-sm mb-3" style={{ color: theme.textFaint }}>
                    Mentees must answer these before requesting a session. Saved with your profile.
                  </p>
                  <ScreeningQuestionsEditor
                    questions={screeningQuestions}
                    onChange={setScreeningQuestions}
                    theme={theme}
                  />
                </div>

                {/* Google Calendar (for event creation on approval) */}
                <div
                  className="p-5 rounded-xl"
                  style={{ backgroundColor: `${theme.textFaint}08` }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Google Calendar
                  </p>
                  <p className="text-sm mb-3" style={{ color: theme.textFaint }}>
                    {isCalendarConnected
                      ? "Connected. Approved sessions will be added to your calendar automatically."
                      : "Optional: connect your calendar so approved sessions are added automatically."}
                  </p>
                  {isCalendarConnected ? (
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          color: "#10b981",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Connected
                      </span>
                      <a
                        href={`/api/calendar/connect?userId=${user?.id}`}
                        className="text-xs underline"
                        style={{ color: theme.textFaint }}
                      >
                        Reconnect
                      </a>
                    </div>
                  ) : (
                    <a
                      href={`/api/calendar/connect?userId=${user?.id}`}
                      className="inline-block px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: theme.text,
                        color: theme.bg,
                      }}
                    >
                      Connect Google Calendar
                    </a>
                  )}
                </div>

                {/* Booking requests */}
                <div
                  className="p-5 rounded-xl"
                  style={{ backgroundColor: `${theme.textFaint}08` }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Booking Requests
                  </p>
                  <p className="text-sm mb-3" style={{ color: theme.textFaint }}>
                    Review and approve session requests from mentees.
                  </p>
                  {memberId && user && (
                    <BookingRequests mentorId={memberId} mentorAuthId={user.id} theme={theme} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mentee toggle */}
          <div
            className="p-5 rounded-xl border"
            style={{
              borderColor: isMentee ? theme.text : theme.cardBorder,
              backgroundColor: isMentee ? `${theme.textFaint}08` : "transparent",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-medium" style={{ color: theme.text }}>
                  I am seeking mentorship
                </h3>
                <p className="text-sm" style={{ color: theme.textFaint }}>
                  Let mentors know what you are looking for
                </p>
              </div>
              <Toggle checked={isMentee} onChange={() => setIsMentee(!isMentee)} theme={theme} />
            </div>

            {isMentee && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                  What I am looking for
                </label>
                <textarea
                  value={menteeTopics}
                  onChange={(e) => setMenteeTopics(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none resize-none"
                  style={inputStyle}
                  placeholder="Career advice, Breaking into product design, Interview prep"
                  rows={2}
                />
                <p className="text-xs mt-1" style={{ color: theme.textFaint }}>
                  Separate with commas
                </p>
              </div>
            )}
          </div>

          {/* Accountability Groups */}
          <div
            className="p-5 rounded-xl border"
            style={{
              borderColor: theme.cardBorder,
            }}
          >
            <div className="mb-1">
              <h3 className="font-medium" style={{ color: theme.text }}>
                Accountability Groups
              </h3>
              <p className="text-sm" style={{ color: theme.textFaint }}>
                Pick up to two groups to find your people. You can change these anytime.
              </p>
            </div>

            {allGroups.length > 0 ? (
              <div className="mt-4 space-y-3">
                {allGroups.map((group) => {
                  const isJoined = myGroupIds.includes(group.id);
                  return (
                    <button
                      key={group.id}
                      type="button"
                      disabled={groupsLoading}
                      onClick={async () => {
                        if (!memberId) return;
                        setGroupsLoading(true);
                        if (isJoined) {
                          const ok = await leaveGroup(memberId, group.id);
                          if (ok) setMyGroupIds((prev) => prev.filter((id) => id !== group.id));
                        } else {
                          const ok = await joinGroup(memberId, group.id);
                          if (ok) setMyGroupIds((prev) => [...prev, group.id]);
                        }
                        setGroupsLoading(false);
                      }}
                      className="w-full text-left p-4 rounded-xl border transition-all duration-200 disabled:opacity-50"
                      style={{
                        borderColor: isJoined ? theme.text : theme.cardBorder,
                        backgroundColor: isJoined ? `${theme.textFaint}08` : "transparent",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: theme.text }}>
                            {group.name}
                          </p>
                          <p className="text-sm mt-0.5" style={{ color: theme.textFaint }}>
                            {group.description}
                          </p>
                        </div>
                        {isJoined && (
                          <span
                            className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-3"
                            style={{
                              backgroundColor: `${theme.text}12`,
                              color: theme.text,
                              border: `1px solid ${theme.cardBorder}`,
                            }}
                          >
                            Joined
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm mt-3" style={{ color: theme.textFaint }}>
                Loading groups...
              </p>
            )}
          </div>
        </div>

        {/* ─── Social Links ─── */}
        <div
          className="p-6 sm:p-8 rounded-xl border space-y-5"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            Links
          </h2>

          {["linkedin", "instagram"].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium mb-2 capitalize" style={{ color: theme.textMuted }}>
                {platform}
              </label>
              <input
                type="url"
                value={formData.links[platform] || ""}
                onChange={(e) => handleLinkChange(platform, e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none"
                style={inputStyle}
                placeholder={
                  platform === "linkedin"
                    ? "https://linkedin.com/in/yourprofile"
                    : "https://instagram.com/yourhandle"
                }
              />
            </div>
          ))}
        </div>

        {/* ─── Save ─── */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
          style={{
            backgroundColor: success ? "rgba(16, 185, 129, 0.15)" : theme.text,
            color: success ? "#10b981" : theme.bg,
            border: success ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid transparent",
          }}
        >
          {saving ? "Saving..." : success ? "Saved ✓" : "Save Profile"}
        </button>

        {/* View Profile */}
        {memberId && (
          <Link
            href={`/member/${memberId}`}
            className="block w-full py-3.5 rounded-xl text-sm font-medium text-center transition-opacity hover:opacity-70 border"
            style={{
              borderColor: theme.cardBorder,
              color: theme.textMuted,
            }}
          >
            View My Profile
          </Link>
        )}
      </form>

      <div className="mt-8 text-center">
        <Link href="/community" className="text-sm" style={{ color: theme.textFaint }}>
          ← Back to Space
        </Link>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto px-6 py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </AuthGuard>
  );
}
