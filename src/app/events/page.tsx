"use client";

import { useEffect, useState } from "react";
import { getUpcomingEventsDB, getPastEvents, EVENTS } from "@/lib/data";
import type { Event } from "@/lib/data";

export default function Events() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);

  useEffect(() => {
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
          <h2 className="text-2xl font-bold mb-8 text-black">Upcoming Events</h2>
          <div className="space-y-6">
            {upcoming.map((event) => (
              <div key={event.id} className="card border-l-4 border-l-black">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <span className="text-sm font-medium text-gray-500">
                    {event.attendance_count}{" "}
                    {event.attendance_count === 1 ? "attending" : "attending"}
                  </span>
                </div>
                {event.description && (
                  <p className="text-gray-600 mb-4">{event.description}</p>
                )}
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>{formatDate(event.date)}</span>
                  {event.location && <span>{event.location}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-8 text-gray-600">Past Events</h2>
          <div className="space-y-6">
            {past.map((event) => (
              <div key={event.id} className="card opacity-75">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <span className="text-sm font-medium text-gray-400">
                    {event.attendance_count}{" "}
                    {event.attendance_count === 1 ? "attended" : "attended"}
                  </span>
                </div>
                {event.description && (
                  <p className="text-gray-600 mb-4">{event.description}</p>
                )}
                <div className="flex items-center gap-6 text-sm text-gray-500">
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
        <div className="card text-center text-gray-500 py-12">
          <p>No events found.</p>
        </div>
      )}
    </div>
  );
}
