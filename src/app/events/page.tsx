"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { getUpcomingEventsDB, getPastEvents, EVENTS } from "@/lib/data";
import type { Event } from "@/lib/data";

export default function EventsPage() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

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
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Nav variant="dark" />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <h1 className="text-4xl font-bold mb-16">Events</h1>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mb-20">
            <h2 className="text-lg font-semibold text-white/50 tracking-widest uppercase mb-8">Upcoming</h2>
            <div className="space-y-8">
              {upcoming.map((event) => (
                <div
                  key={event.id}
                  className="border-l-2 border-white/30 pl-6 py-2 transition-all hover:border-white/60"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <span className="text-sm text-white/30">
                      {event.attendance_count} attending
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-white/50 mb-4">{event.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-white/30">
                    <div className="flex items-center gap-6">
                      <span>{formatDate(event.date)}</span>
                      {event.location && <span>{event.location}</span>}
                    </div>
                    {isAuthenticated ? (
                      <button className="px-5 py-2 rounded-full text-xs tracking-widest uppercase bg-white text-black hover:bg-gray-200 transition-all duration-300">
                        RSVP
                      </button>
                    ) : (
                      <a
                        href="https://space.open-bln.com/auth/login"
                        className="text-xs tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors"
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

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white/30 tracking-widest uppercase mb-8">Past</h2>
            <div className="space-y-6">
              {past.map((event) => (
                <div key={event.id} className="border-l border-white/10 pl-6 py-2 opacity-50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <span className="text-sm text-white/20">
                      {event.attendance_count} attended
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-white/30 mb-3">{event.description}</p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-white/20">
                    <span>{formatDate(event.date)}</span>
                    {event.location && <span>{event.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {upcoming.length === 0 && past.length === 0 && (
          <div className="text-center text-white/30 py-20">
            <p>No events yet. Stay tuned.</p>
          </div>
        )}
      </main>

      <Footer variant="dark" />
    </div>
  );
}
