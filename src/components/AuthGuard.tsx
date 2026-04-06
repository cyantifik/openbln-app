"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthenticated(!!user);
      setLoading(false);
    };
    check();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl mb-3">
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
        </h2>
        <p className="text-gray-400 mb-8 max-w-sm">
          This area is for community members. Sign in to access, or request an invite to join.
        </p>
        <div className="flex gap-4 text-sm">
          <Link
            href="/auth/login"
            className="px-6 py-3 border border-gray-200 rounded-full text-gray-600 hover:text-black hover:border-gray-400 transition-all duration-300"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300"
          >
            Request access
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
