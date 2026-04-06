"use client";

import { useState, useEffect } from "react";
import MemberCard from "@/components/MemberCard";
import AuthGuard from "@/components/AuthGuard";
import { getMembers, searchMembersDB, MEMBERS } from "@/lib/data";
import type { Member } from "@/lib/data";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(MEMBERS);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        if (searchQuery) {
          const results = await searchMembersDB(searchQuery);
          setFilteredMembers(results);
        } else {
          const members = await getMembers();
          setFilteredMembers(members);
        }
      } catch (error) {
        console.error("Error loading members:", error);
        setFilteredMembers(MEMBERS);
      }
    };

    const debounceTimer = setTimeout(() => {
      loadMembers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <AuthGuard>
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Floating logotype */}
      <div className="text-center mb-16 pt-8">
        <h1 className="logo logo-float text-6xl sm:text-7xl md:text-8xl tracking-tight mb-4" style={{ letterSpacing: "-0.03em" }}>
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase">The Space</p>
      </div>

      {/* Directory */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Directory</h2>
        <p className="text-gray-600 mb-8">
          Find and connect with designers, developers, and creative professionals
          in Berlin. Search by name, role, company, or skill.
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, skill, role, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input mb-2 max-w-md"
        />
        <p className="text-sm text-gray-500">
          {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"} found
        </p>
      </div>

      {/* Members Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="card text-center text-gray-500 py-12">
          <p className="mb-2">No members found matching your search.</p>
          <p className="text-sm">Try a different keyword or browse all members.</p>
        </div>
      )}
    </div>
    </AuthGuard>
  );
}
