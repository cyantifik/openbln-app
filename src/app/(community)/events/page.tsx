"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUpcomingEventsDB, getPastEvents, EVENTS } from "@/lib/data";
import { useTheme } from "@/lib/theme";
import type { Event } from "@/lib/data";

export default function EventsPage() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    // Load events
    const loadEvents = async () => {
      try {
        const upcomingEvents = await getUpcomingEventsDB();
        const pastEvents = await getPastEvents();
        setUpcoming(upcomingEvents);
        setPast(pastEvents);
      } catch (error) {
        console.error("Error loading events:", error);
        const today = new Date();
        const upcomingFallback = EVENTS.filter(
          (event) => new Date(event.date) >= today
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const pastFallback = EVENTS.filter((event) => new Date(event.date) < today).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setUpcoming(upcomingFallback);
        setPast(pastFallback);
      }
    };

    loadEvents();

    return () => subscription.unsubscribe();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-12">Events</h1>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section className="mb-16">
          <h2 className={`text-2xl font-bold mb-8 ${isDark ? "text-white" : "text-black"}`}>Upcoming</h2>
          <div className="space-y-6">
            {upcoming.map((event) => (
              <div
                key={event.id}
                className={`card border-l-4 ${isDark ? "card-dark border-l-white" : "border-l-black"}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <span className={`text-sm font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>
                    {event.attendance_count} attending
                  </span>
                </div>
                {event.description && (
                  <p className={`mb-4 ${isDark ? "text-white/50" : "text-gray-600"}`}>{event.description}</p>
                )}
                <div className={`flex items-center justify-between text-sm ${isDark ? "text-white/40" : "text-gray-500"}`}>
                  <div className="flex items-center gap-6">
                    <span>{formatDate(event.date)}</span>
                    {event.location && <span>{event.location}</span>}
                  </div>
                  {isAuthenticated ? (
                    <button
                      className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-300 ${
                        isDark
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      RSVP
                    </button>
                  ) : (
                    <a
                      href="/auth/login"
                      className={`text-xs tracking-widest uppercase ${isDark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"} transition-colors`}
                    >
                      Sign in to RSVP
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <section>
          <h2 className={`text-2xl font-bold mb-8 ${isDark ? "text-white/50" : "text-gray-600"}`}>Past</h2>
          <div className="space-y-6">
            {past.map((event) => (
              <div key={event.id} className={`card opacity-60 ${isDark ? "card-dark" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <span className={`text-sm font-medium ${isDark ? "text-white/30" : "text-gray-400"}`}>
                    {event.attendance_count} attended
                  </span>
                </div>
                {event.description && (
                  <p className={`mb-4 ${isDark ? "text-white/40" : "text-gray-600"}`}>{event.description}</p>
                )}
                <div className={`flex items-center gap-6 text-sm ${isDark ? "text-white/30" : "text-gray-500"}`}>
                  <span>{formatDate(event.date)}</span>
                  {event.location && <span>{event.location}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No Events */}
      {upcoming.length === 0 && past.length === 0 && (
        <div className={`card text-center py-12 ${isDark ? "card-dark text-white/40" : "text-gray-500"}`}>
          <p>No events yet. Stay tuned.</p>
        </div>
      )}
    </div>
  );
}
