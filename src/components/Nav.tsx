"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useTheme, THEME_STOPS } from "@/lib/theme";

type NavVariant = "light" | "dark";

interface NavProps {
  variant?: NavVariant;
  showToggle?: boolean;
}

export default function Nav({ variant = "light", showToggle }: NavProps) {
  const { stop, theme: themeColors, setStop } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // When showToggle is true, derive colors from the theme context
  // Otherwise, use the static variant prop (for homepage, events, etc.)
  const isDark = showToggle ? stop >= 3 : variant === "dark";
  const colors = showToggle ? themeColors : (variant === "dark" ? THEME_STOPS[4] : THEME_STOPS[0]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 border-b transition-colors duration-300"
      style={{
        backgroundColor: showToggle ? colors.bg : (isDark ? "transparent" : "#ffffff"),
        borderBottomColor: colors.border,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="https://open-bln.com"
          className="logo logo-animated text-xl tracking-tight transition-colors duration-300"
          style={{ color: colors.text }}
        >
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="nav-links hidden md:flex items-center gap-6">
          <a
            href="https://space.open-bln.com"
            className="nav-link text-xs tracking-widest uppercase transition-colors duration-200"
            style={{ color: colors.textMuted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.textMuted)}
          >
            Space
          </a>
          <span style={{ color: colors.separator }} className="nav-sep">|</span>
          <a
            href="https://instagram.com/open.bln"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-xs tracking-widest uppercase transition-colors duration-200"
            style={{ color: colors.textMuted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.textMuted)}
          >
            IG
          </a>
          <span style={{ color: colors.separator }} className="nav-sep">|</span>
          <a
            href="https://www.linkedin.com/company/open-bln"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-xs tracking-widest uppercase transition-colors duration-200"
            style={{ color: colors.textMuted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.textMuted)}
          >
            LI
          </a>
          <span style={{ color: colors.separator }} className="nav-sep">|</span>
          <a
            href="mailto:hallo@open-bln.com"
            className="nav-link text-xs tracking-widest uppercase transition-colors duration-200"
            style={{ color: colors.textMuted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.textMuted)}
          >
            @
          </a>

          {/* Theme Scale Slider */}
          {showToggle && (
            <>
              <span style={{ color: colors.separator }} className="nav-sep">|</span>
              <div className="flex items-center" title={`Theme: ${THEME_STOPS[stop].label}`}>
                <input
                  type="range"
                  min={0}
                  max={4}
                  step={1}
                  value={stop}
                  onChange={(e) => setStop(parseInt(e.target.value, 10))}
                  className="theme-slider"
                  style={{
                    // CSS custom properties for dynamic coloring
                    "--slider-track": colors.border,
                    "--slider-fill": colors.text,
                    "--slider-thumb": colors.text,
                  } as React.CSSProperties}
                  aria-label="Theme brightness"
                />
              </div>
            </>
          )}

          {/* Avatar Dropdown */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="nav-avatar w-8 h-8 rounded-full border flex items-center justify-center text-sm cursor-pointer transition-colors duration-300"
              style={{
                backgroundColor: `${colors.textFaint}33`,
                borderColor: colors.border,
                color: colors.textMuted,
              }}
              aria-label="User menu"
            >
              &bull;
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-40 border rounded-md shadow-sm z-[1000] transition-colors duration-300"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                }}
              >
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block w-full px-4 py-3 text-left text-sm transition-colors"
                      style={{ color: colors.textMuted }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/admin"
                      className="block w-full px-4 py-3 text-left text-sm transition-colors"
                      style={{ color: colors.textMuted }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin
                    </Link>
                    <button
                      className="block w-full px-4 py-3 text-left text-sm transition-colors border-t bg-transparent cursor-pointer"
                      style={{ color: colors.textMuted, borderTopColor: colors.border }}
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block w-full px-4 py-3 text-left text-sm transition-colors"
                      style={{ color: colors.textMuted }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block w-full px-4 py-3 text-left text-sm transition-colors"
                      style={{ color: colors.textMuted }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 transition-transform"
            style={{ backgroundColor: colors.text }}
          />
          <span
            className={`block w-6 h-0.5 transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
            style={{ backgroundColor: colors.text }}
          />
          <span
            className="block w-6 h-0.5 transition-transform"
            style={{ backgroundColor: colors.text }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-4 transition-colors duration-300"
          style={{ backgroundColor: colors.bg }}
        >
          <a href="https://space.open-bln.com" className="text-xs tracking-widest uppercase" style={{ color: colors.textMuted }} onClick={() => setMobileOpen(false)}>Space</a>
          <a href="https://instagram.com/open.bln" target="_blank" rel="noopener noreferrer" className="text-xs tracking-widest uppercase" style={{ color: colors.textMuted }} onClick={() => setMobileOpen(false)}>IG</a>
          <a href="https://www.linkedin.com/company/open-bln" target="_blank" rel="noopener noreferrer" className="text-xs tracking-widest uppercase" style={{ color: colors.textMuted }} onClick={() => setMobileOpen(false)}>LI</a>
          <a href="mailto:hallo@open-bln.com" className="text-xs tracking-widest uppercase" style={{ color: colors.textMuted }} onClick={() => setMobileOpen(false)}>@</a>

          {/* Mobile theme slider */}
          {showToggle && (
            <div className="flex items-center py-1">
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={stop}
                onChange={(e) => setStop(parseInt(e.target.value, 10))}
                className="theme-slider theme-slider-mobile"
                style={{
                  "--slider-track": colors.border,
                  "--slider-fill": colors.text,
                  "--slider-thumb": colors.text,
                } as React.CSSProperties}
                aria-label="Theme brightness"
              />
            </div>
          )}

          <div className="border-t pt-3 mt-1" style={{ borderTopColor: colors.border }}>
            {user ? (
              <>
                <Link href="/profile" className="block text-xs tracking-widest uppercase py-2" style={{ color: colors.textMuted }} onClick={() => setMobileOpen(false)}>Profile</Link>
                <button className="text-xs tracking-widest uppercase text-left py-2 bg-transparent cursor-pointer" style={{ color: colors.textMuted }} onClick={() => { handleSignOut(); setMobileOpen(false); }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-xs tracking-widest uppercase py-2" style={{ color: colors.textMuted }} onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/auth/signup" className="block text-xs tracking-widest uppercase py-2" style={{ color: colors.textMuted }} onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
