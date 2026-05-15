"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useTheme } from "@/lib/theme";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [approved, setApproved] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthenticated(true);
        // Check if user has been approved (exists in members table)
        const { data: member } = await supabase
          .from("members")
          .select("id")
          .eq("auth_id", user.id)
          .single();
        setApproved(!!member);
      }
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
            className="px-5 py-2.5 border rounded-full transition-all duration-300"
            style={{
              borderColor: theme.border,
              color: theme.textMuted,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.55")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2.5 border rounded-full transition-all duration-300"
            style={{
              borderColor: theme.border,
              color: theme.textMuted,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.55")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Request access
          </Link>
        </div>
      </div>
    );
  }

  if (!approved) {
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
          className="mb-6 max-w-sm transition-colors duration-500"
          style={{ color: theme.textMuted }}
        >
          Your application is being reviewed. You'll have access once you've been approved.
        </p>
        <p
          className="text-sm max-w-sm transition-colors duration-500"
          style={{ color: theme.textFaint }}
        >
          We review every application personally. This usually doesn't take long.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
