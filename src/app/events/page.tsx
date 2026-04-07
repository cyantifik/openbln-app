"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { getUpcomingEventsDB } from "@/lib/data";
import type { Event } from "@/lib/data";
import { EVENT_ARCHIVE } from "@/lib/event-archive";

export default function EventsPage() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
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
        setUpcoming(upcomingEvents);
      } catch (error) {
        console.error("Error loading events:", error);
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
        <h1 className="text-4xl font-light tracking-tight mb-16">Events</h1>

        {/* Upcoming — only shown when there are real upcoming events from Supabase */}
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

        {/* Event Archive — always shown */}
        <section>
          <div className="space-y-6">
            {[...EVENT_ARCHIVE].reverse().map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="block border-l border-white/10 pl-6 py-3 transition-all duration-300 hover:border-white/30 group"
              >
                <div className="flex items-baseline gap-4 mb-1">
                  <span className="text-xs text-white/15 tracking-widest">
                    #{event.number}
                  </span>
                  <h3 className="text-lg font-light text-white/40 group-hover:text-white/70 transition-colors duration-300">
                    {event.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/20">
                  <span>{event.date}</span>
                  <span>{event.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer variant="dark" />
    </div>
  );
}
