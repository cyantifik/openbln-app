"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Member } from "@/lib/data";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    bio: "",
    skills_offered: "",
    skills_needed: "",
    links: {} as Record<string, string>,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check user auth
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
          setFormData({
            name: memberData.name || "",
            role: memberData.role || "",
            company: memberData.company || "",
            bio: memberData.bio || "",
            skills_offered: (memberData.skills_offered || []).join(", "),
            skills_needed: (memberData.skills_needed || []).join(", "),
            links: memberData.links || {},
          });
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLinkChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      links: {
        ...formData.links,
        [key]: value,
      },
    });
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

      // Prepare data
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
      };

      if (member) {
        // Update existing member
        const { error: updateError } = await supabase
          .from("members")
          .update(updateData)
          .eq("id", member.id);

        if (updateError) throw updateError;
      } else {
        // Create new member
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

      setSuccess("Profile updated successfully!");
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
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>
        <div className="card mb-6">
          <p className="text-gray-600 mb-4">You must be logged in to view your profile.</p>
        </div>
        <Link href="/auth/login" className="text-sm text-gray-600 hover:text-black">
          ← Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600">Update your profile information and skills</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            placeholder="Your name"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-2">Role / Title</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Product Designer, Frontend Developer"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="input"
            placeholder="Your company or studio"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="input"
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        {/* Skills Offered */}
        <div>
          <label className="block text-sm font-medium mb-2">Skills Offered</label>
          <textarea
            name="skills_offered"
            value={formData.skills_offered}
            onChange={handleChange}
            className="input"
            placeholder="Separate with commas: Design, Mentorship, React"
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
        </div>

        {/* Skills Needed */}
        <div>
          <label className="block text-sm font-medium mb-2">Skills Needed</label>
          <textarea
            name="skills_needed"
            value={formData.skills_needed}
            onChange={handleChange}
            className="input"
            placeholder="Separate with commas: Marketing, Backend Development"
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
        </div>

        {/* Links */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">Social Links</h2>

          {["linkedin", "twitter", "github", "portfolio"].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium mb-2 capitalize">{platform}</label>
              <input
                type="url"
                value={formData.links[platform] || ""}
                onChange={(e) => handleLinkChange(platform, e.target.value)}
                className="input"
                placeholder={`https://${platform}.com/yourprofile`}
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <button type="submit" className="button-primary w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <div className="mt-8 border-t border-gray-200 pt-8">
        <Link href="/" className="text-sm text-gray-600 hover:text-black">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
