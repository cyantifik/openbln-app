"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useTheme } from "@/lib/theme";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { theme } = useTheme();

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
        <div className="text-sm transition-colors duration-500" style={{ color: theme.textFaint }}>Loading...</div>
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
        <p
          className="text-sm tracking-widest uppercase mb-8 transition-colors duration-500"
          style={{ color: theme.textFaint }}
        >
          The Space
        </p>
        <p
          className="mb-8 max-w-sm transition-colors duration-500"
          style={{ color: theme.textFaint }}
        >
          This area is for members. Sign in to access, or request an invite to join.
        </p>
        <div className="flex gap-3 text-xs tracking-widest uppercase">
          <Link
            href="/auth/login"
            className="px-4 py-2 border rounded-full transition-all duration-300"
            style={{
              borderColor: theme.border,
              color: theme.textMuted,
            }}
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: theme.accent,
              color: theme.accentText,
            }}
          >
            Request access
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
