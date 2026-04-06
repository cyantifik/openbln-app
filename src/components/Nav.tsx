"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useTheme } from "@/lib/theme";

type NavVariant = "light" | "dark";

interface NavProps {
  variant?: NavVariant;
  showToggle?: boolean;
}

export default function Nav({ variant = "light", showToggle }: NavProps) {
  const { toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = variant === "dark";

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

  // Color classes based on variant
  const navBg = isDark
    ? "bg-transparent border-b border-white/10"
    : "bg-white border-b border-gray-200";
  const logoColor = isDark ? "text-white" : "text-black";
  const linkColor = isDark
    ? "text-white/60 hover:text-white"
    : "text-gray-700 hover:text-black";
  const avatarClasses = isDark
    ? "bg-white/20 border-white/30 hover:border-white/50 text-white/70"
    : "bg-gray-300 border-gray-300 hover:border-gray-400 text-gray-600";
  const dropdownBg = isDark
    ? "bg-gray-900 border-white/10"
    : "bg-white border-gray-200";
  const dropdownItem = isDark
    ? "text-white/70 hover:bg-white/10"
    : "text-gray-700 hover:bg-gray-50";
  const dropdownBorder = isDark ? "border-white/10" : "border-gray-200";
  const hamburgerColor = isDark ? "bg-white" : "bg-black";

  return (
    <nav className={`${navBg} sticky top-0 z-50`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="https://open-bln.com"
          className={`logo logo-animated text-xl tracking-tight ${logoColor}`}
        >
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
        </a>

        {/* Desktop Nav Links — SPACE | IG | LI | @ */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="https://space.open-bln.com"
            className={`text-xs tracking-widest uppercase transition-colors ${linkColor}`}
          >
            Space
          </a>
          <span className={`${isDark ? "text-white/20" : "text-gray-300"}`}>|</span>
          <a
            href="https://instagram.com/open.bln"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs tracking-widest uppercase transition-colors ${linkColor}`}
          >
            IG
          </a>
          <span className={`${isDark ? "text-white/20" : "text-gray-300"}`}>|</span>
          <a
            href="https://www.linkedin.com/company/open-bln"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs tracking-widest uppercase transition-colors ${linkColor}`}
          >
            LI
          </a>
          <span className={`${isDark ? "text-white/20" : "text-gray-300"}`}>|</span>
          <a
            href="mailto:hallo@open-bln.com"
            className={`text-xs tracking-widest uppercase transition-colors ${linkColor}`}
          >
            @
          </a>

          {/* Theme Toggle */}
          {showToggle && (
            <>
              <span className={`${isDark ? "text-white/20" : "text-gray-300"}`}>|</span>
              <button
                onClick={toggleTheme}
                className={`text-xs tracking-widest uppercase transition-colors cursor-pointer ${linkColor}`}
                aria-label="Toggle theme"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? "☀" : "☽"}
              </button>
            </>
          )}

          {/* Avatar Dropdown */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`w-8 h-8 rounded-full border transition-colors flex items-center justify-center text-sm cursor-pointer ${avatarClasses}`}
              aria-label="User menu"
            >
              &bull;
            </button>

            {dropdownOpen && (
              <div
                className={`absolute top-full right-0 mt-2 w-40 border rounded-md shadow-sm z-[1000] ${dropdownBg}`}
              >
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className={`block w-full px-4 py-3 text-left text-sm transition-colors ${dropdownItem}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/admin"
                      className={`block w-full px-4 py-3 text-left text-sm transition-colors ${dropdownItem}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin
                    </Link>
                    <button
                      className={`block w-full px-4 py-3 text-left text-sm transition-colors border-t bg-transparent cursor-pointer ${dropdownItem} ${dropdownBorder}`}
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className={`block w-full px-4 py-3 text-left text-sm transition-colors ${dropdownItem}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className={`block w-full px-4 py-3 text-left text-sm transition-colors ${dropdownItem}`}
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
          <span className={`block w-6 h-0.5 ${hamburgerColor} transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 ${hamburgerColor} transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 ${hamburgerColor} transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden px-6 pb-6 flex flex-col gap-4 ${isDark ? "bg-black/90" : "bg-white"}`}>
          <a
            href="https://space.open-bln.com"
            className={`text-xs tracking-widest uppercase transition-colors ${linkColor}`}
            onClick={() => setMobileOpen(false)}
          >
            Space
          </a>
          <a
            href="https://instagram.com/open.bln"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs tracking-widest uppercase transition-colors ${linkColor}`}
            onClick={() => setMobileOpen(false)}
          >
            IG
          </a>
          <a
            href="https://www.linkedin.com/company/open-bln"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs tracking-widest uppercase transition-colors ${linkColor}`}
            onClick={() => setMobileOpen(false)}
          >
            LI
          </a>
          <a
            href="mailto:hallo@open-bln.com"
            className={`text-xs tracking-widest uppercase transition-colors ${linkColor}`}
            onClick={() => setMobileOpen(false)}
          >
            @
          </a>
          {showToggle && (
            <button
              onClick={toggleTheme}
              className={`text-xs tracking-widest uppercase transition-colors cursor-pointer text-left ${linkColor} bg-transparent`}
            >
              {isDark ? "☀ Light mode" : "☽ Dark mode"}
            </button>
          )}
          <div className={`border-t pt-3 mt-1 ${isDark ? "border-white/10" : "border-gray-200"}`}>
            {user ? (
              <>
                <Link href="/profile" className={`block text-xs tracking-widest uppercase transition-colors py-2 ${linkColor}`} onClick={() => setMobileOpen(false)}>Profile</Link>
                <button className={`text-xs tracking-widest uppercase text-left transition-colors py-2 ${linkColor} bg-transparent cursor-pointer`} onClick={() => { handleSignOut(); setMobileOpen(false); }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={`block text-xs tracking-widest uppercase transition-colors py-2 ${linkColor}`} onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/auth/signup" className={`block text-xs tracking-widest uppercase transition-colors py-2 ${linkColor}`} onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
