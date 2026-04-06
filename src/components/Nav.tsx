"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
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

    // Subscribe to auth changes
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="logo logo-animated text-xl tracking-tight">
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/community"
            className="text-sm text-gray-700 hover:text-black transition-colors"
          >
            Community
          </Link>
          <Link
            href="/events"
            className="text-sm text-gray-700 hover:text-black transition-colors"
          >
            Events
          </Link>

          {/* Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-gray-300 border border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center text-gray-600 text-sm cursor-pointer"
              aria-label="User menu"
            >
              •
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-sm z-1000">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors first:pt-2 last:pb-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/admin"
                      className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors first:pt-2 last:pb-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin
                    </Link>
                    <button
                      className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-200 first:pt-2 last:pb-2 bg-transparent cursor-pointer"
                      onClick={() => {
                        handleSignOut();
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors first:pt-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors last:pb-2"
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
      </div>
    </nav>
  );
}
