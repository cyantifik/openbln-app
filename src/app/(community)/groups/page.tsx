"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useTheme } from "@/lib/theme";
import {
  getAccountabilityGroups,
  getGroupMembers,
  type AccountabilityGroup,
  type Member,
} from "@/lib/data";

function GroupsContent() {
  const { theme } = useTheme();
  const [groups, setGroups] = useState<AccountabilityGroup[]>([]);
  const [membersByGroup, setMembersByGroup] = useState<Record<string, Member[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const groupsList = await getAccountabilityGroups();
        setGroups(groupsList);

        // Load members for all groups in parallel
        const entries = await Promise.all(
          groupsList.map(async (g) => {
            const members = await getGroupMembers(g.id);
            return [g.id, members] as [string, Member[]];
          })
        );
        setMembersByGroup(Object.fromEntries(entries));
      } catch (error) {
        console.error("Error loading groups:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

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
          className="text-xs tracking-widest uppercase mb-2 transition-colors duration-500"
          style={{ color: theme.textFaint }}
        >
          Find Your People
        </p>
        <h1
          className="text-3xl font-bold mb-3 transition-colors duration-500"
          style={{ color: theme.text }}
        >
          Accountability Groups
        </h1>
        <p
          className="transition-colors duration-500"
          style={{ color: theme.textMuted }}
        >
          Five groups, five shared goals. Pick up to two from your{" "}
          <Link href="/profile" className="underline" style={{ color: theme.text }}>
            profile
          </Link>{" "}
          and start connecting.
        </p>
      </div>

      <div className="space-y-4">
        {groups.map((group) => {
          const members = membersByGroup[group.id] || [];
          const isExpanded = expandedGroup === group.id;

          return (
            <div
              key={group.id}
              className="rounded-lg border transition-all duration-300"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: isExpanded ? theme.text : theme.cardBorder,
              }}
            >
              {/* Group header */}
              <button
                type="button"
                onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                className="w-full text-left p-6 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="text-lg font-semibold mb-1 transition-colors duration-500"
                      style={{ color: theme.text }}
                    >
                      {group.name}
                    </h2>
                    <p
                      className="text-sm transition-colors duration-500"
                      style={{ color: theme.textFaint }}
                    >
                      {group.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${theme.textFaint}12`,
                        color: theme.textMuted,
                      }}
                    >
                      {members.length} {members.length === 1 ? "member" : "members"}
                    </span>
                    <span
                      className="text-sm transition-transform duration-200"
                      style={{
                        color: theme.textFaint,
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        display: "inline-block",
                      }}
                    >
                      ▾
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded member list */}
              {isExpanded && members.length > 0 && (
                <div
                  className="px-6 pb-6 border-t"
                  style={{ borderTopColor: theme.cardBorder }}
                >
                  <div className="pt-4 space-y-3">
                    {members.map((member) => (
                      <Link
                        key={member.id}
                        href={`/member/${member.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: `${theme.textFaint}06` }}
                      >
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0"
                            style={{
                              backgroundColor: `${theme.textFaint}22`,
                              color: theme.textMuted,
                            }}
                          >
                            {getInitials(member.name)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ color: theme.text }}
                          >
                            {member.name}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: theme.textMuted }}
                          >
                            {member.role}{member.company ? ` · ${member.company}` : ""}
                          </p>
                        </div>
                        {member.is_mentor && (
                          <span
                            className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                            style={{
                              backgroundColor: `${theme.textFaint}18`,
                              color: theme.textMuted,
                              border: `1px solid ${theme.border}`,
                            }}
                          >
                            Mentor
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {isExpanded && members.length === 0 && (
                <div
                  className="px-6 pb-6 border-t"
                  style={{ borderTopColor: theme.cardBorder }}
                >
                  <p className="pt-4 text-sm" style={{ color: theme.textFaint }}>
                    No members yet. Be the first to join from your{" "}
                    <Link href="/profile" className="underline" style={{ color: theme.text }}>
                      profile
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GroupsPage() {
  return (
    <AuthGuard>
      <GroupsContent />
    </AuthGuard>
  );
}
