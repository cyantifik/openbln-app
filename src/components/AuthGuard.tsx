"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useTheme } from "@/lib/theme";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        <div className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="logo logo-float text-5xl sm:text-6xl md:text-8xl tracking-tight mb-2" style={{ letterSpacing: "-0.03em" }}>
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
        </h2>
        <p className={`text-sm tracking-widest uppercase mb-8 ${isDark ? "text-white/40" : "text-gray-400"}`}>The Space</p>
        <p className={`mb-8 max-w-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>
          This area is for members. Sign in to access, or request an invite to join.
        </p>
        <div className="flex gap-4 text-sm">
          <Link
            href="/auth/login"
            className={`px-6 py-3 border rounded-full transition-all duration-300 ${
              isDark
                ? "border-white/20 text-white/60 hover:text-white hover:border-white/50"
                : "border-gray-200 text-gray-600 hover:text-black hover:border-gray-400"
            }`}
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className={`px-6 py-3 rounded-full transition-all duration-300 ${
              isDark
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Request access
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
