"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Application {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  working_on: string;
  can_help_with: string;
  how_heard: string;
  attended_before: string | null;
  status: string;
  created_at: string;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndLoadApps = async () => {
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

        // Check if user is admin
        const { data: memberData } = await supabase
          .from("members")
          .select("is_admin")
          .eq("auth_id", user.id)
          .single();

        if (memberData?.is_admin) {
          setIsAdmin(true);

          // Load pending applications
          const { data: appsData, error } = await supabase
            .from("applications")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: true });

          if (error) throw error;
          setApplications(appsData || []);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadApps();
  }, []);

  const handleApprove = async (app: Application) => {
    setActionLoading(app.id);
    try {
      // Create member from application
      const { error: memberError } = await supabase.from("members").insert({
        auth_id: app.auth_id,
        name: app.name,
        role: "Community Member",
        company: "",
        bio: app.working_on,
        skills_offered: app.can_help_with.split(",").map((s) => s.trim()),
        skills_needed: [],
        is_admin: false,
        achievements: [],
        status: "approved",
      });

      if (memberError) throw memberError;

      // Update application status
      const { error: appError } = await supabase
        .from("applications")
        .update({
          status: "approved",
          reviewed_by: user?.id,
        })
        .eq("id", app.id);

      if (appError) throw appError;

      // Reload applications
      const { data: appsData } = await supabase
        .from("applications")
        .select("*")
        .eq("status", "pending");

      setApplications(appsData || []);
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (appId: string) => {
    setActionLoading(appId);
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: "rejected",
          reviewed_by: user?.id,
        })
        .eq("id", appId);

      if (error) throw error;

      // Reload applications
      const { data: appsData } = await supabase
        .from("applications")
        .select("*")
        .eq("status", "pending");

      setApplications(appsData || []);
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
        <div className="card mb-6">
          <p className="text-gray-600 mb-4">You must be logged in to access the admin panel.</p>
        </div>
        <Link href="/auth/login" className="text-sm text-gray-600 hover:text-black">
          ← Sign In
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
        <div className="card mb-6">
          <p className="text-gray-600 mb-4">You don't have permission to access the admin panel.</p>
        </div>
        <Link href="/" className="text-sm text-gray-600 hover:text-black">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Pending Applications</h2>

        {applications.length === 0 ? (
          <div className="card text-center text-gray-500 py-12">
            <p>No pending applications.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="card">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">{app.name}</h3>
                  <p className="text-sm text-gray-600">{app.email}</p>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Working on</p>
                    <p className="text-gray-600">{app.working_on}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Can help with</p>
                    <p className="text-gray-600">{app.can_help_with}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">How heard</p>
                    <p className="text-gray-600">{app.how_heard}</p>
                  </div>
                  {app.attended_before && (
                    <div>
                      <p className="font-medium text-gray-900">Attended before</p>
                      <p className="text-gray-600">{app.attended_before}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(app)}
                    disabled={actionLoading === app.id}
                    className="button-primary flex-1"
                  >
                    {actionLoading === app.id ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    disabled={actionLoading === app.id}
                    className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {actionLoading === app.id ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/" className="text-sm text-gray-600 hover:text-black">
        ← Back to Home
      </Link>
    </div>
  );
}
