"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const [formData, setFormData] = useState({
    invite_code: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    working_on: "",
    can_help_with: "",
    how_heard: "",
    attended_before: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate invite code
    const validCodes = ["OPENBLN2026", "BERLINSPACE", "CREATIVEBLN"];
    if (!validCodes.includes(formData.invite_code.trim().toUpperCase())) {
      setError("Invalid invite code. You need an invite to join OPEN BLN.");
      return;
    }

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.working_on || !formData.can_help_with || !formData.how_heard) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Create application record
      if (data.user) {
        const { error: appError } = await supabase.from("applications").insert({
          auth_id: data.user.id,
          name: formData.name,
          email: formData.email,
          working_on: formData.working_on,
          can_help_with: formData.can_help_with,
          how_heard: formData.how_heard,
          attended_before: formData.attended_before || null,
          status: "pending",
        });

        if (appError) {
          console.error("Error creating application:", appError);
        }
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl mb-4">
              <span className="font-bold">Got it!</span>
            </h1>
            <p className="text-gray-600 mb-4">
              Thanks for applying, <strong>{formData.name}</strong>.
            </p>
            <p className="text-gray-500 mb-6">
              We&apos;ll review your info and you&apos;ll hear back from us soon.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
              <p>
                We also sent a confirmation link to <strong>{formData.email}</strong>. Click it to verify your email while you wait.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-black text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl mb-2"><span className="font-bold">Request</span> <span className="font-light">Access</span></h1>
          <p className="text-gray-400">
            <span className="font-bold">OPEN</span> <span className="font-light">BLN</span> is invite-only. Enter your invite code to apply.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invite Code */}
          <div>
            <label className="block text-sm font-medium mb-2">Invite Code</label>
            <input
              type="text"
              name="invite_code"
              required
              value={formData.invite_code}
              onChange={handleChange}
              className="input"
              placeholder="Enter your invite code"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {/* Vetting Questions */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm font-medium text-gray-600 mb-6">
              Help us get to know you better
            </p>

            {/* Question 1 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What are you currently working on or figuring out in your life or career?
              </label>
              <textarea
                name="working_on"
                required
                value={formData.working_on}
                onChange={handleChange}
                className="input"
                placeholder="Share what's on your mind..."
                rows={3}
              />
            </div>

            {/* Question 2 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What's one thing you could help someone else with right now?
              </label>
              <textarea
                name="can_help_with"
                required
                value={formData.can_help_with}
                onChange={handleChange}
                className="input"
                placeholder="What's your superpower?"
                rows={3}
              />
            </div>

            {/* Question 3 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                How did you hear about OPEN BLN?
              </label>
              <input
                type="text"
                name="how_heard"
                required
                value={formData.how_heard}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Friend, Twitter, Event..."
              />
            </div>

            {/* Question 4 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Have you attended an OPEN BLN event before? If yes, which one?
              </label>
              <input
                type="text"
                name="attended_before"
                value={formData.attended_before}
                onChange={handleChange}
                className="input"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="button-primary w-full" disabled={loading}>
            {loading ? "Submitting..." : "Request Access"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm">
          <span className="text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold hover:text-black">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
