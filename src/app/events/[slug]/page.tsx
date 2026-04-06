"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getEventBySlug, EVENT_ARCHIVE } from "@/lib/event-archive";

/* ── Reveal-on-scroll hook ── */
function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const event = getEventBySlug(slug);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Nav variant="dark" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/50 mb-6">Event not found.</p>
            <Link
              href="/events"
              className="text-xs tracking-widest uppercase text-white/30 border border-white/15 px-6 py-3 rounded-full hover:text-white/60 hover:border-white/40 transition-all duration-300"
            >
              Back to events
            </Link>
          </div>
        </main>
        <Footer variant="dark" />
      </div>
    );
  }

  // Find prev/next events for navigation
  const currentIndex = EVENT_ARCHIVE.findIndex((e) => e.slug === slug);
  const prevEvent = currentIndex > 0 ? EVENT_ARCHIVE[currentIndex - 1] : null;
  const nextEvent =
    currentIndex < EVENT_ARCHIVE.length - 1
      ? EVENT_ARCHIVE[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Nav variant="dark" />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-20 sm:py-28 w-full">
        {/* Back link */}
        <FadeIn>
          <Link
            href="/events"
            className="inline-block text-xs tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors duration-300 mb-12"
          >
            &larr; All events
          </Link>
        </FadeIn>

        {/* Event header */}
        <FadeIn delay={100}>
          <div className="mb-16">
            <p className="text-white/20 text-xs tracking-widest uppercase mb-4">
              Event #{event.number}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-3">
              {event.title}
            </h1>
            <p className="text-white/40 text-base font-light mb-8">
              {event.subtitle}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/30">
              <span>{event.date}</span>
              <span>{event.time}</span>
              <span>{event.location}</span>
            </div>
          </div>
        </FadeIn>

        {/* Description paragraphs */}
        {event.description.map((para, i) => (
          <FadeIn key={i} className="mb-8" delay={200 + i * 100}>
            <p className="text-base text-white/50 leading-relaxed font-light">
              {para}
            </p>
          </FadeIn>
        ))}

        {/* Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <FadeIn
            className="mt-12 mb-16 border-l border-white/10 pl-6"
            delay={500}
          >
            <p className="text-xs tracking-widest uppercase text-white/20 mb-4">
              Highlights
            </p>
            <div className="space-y-2">
              {event.highlights.map((h, i) => (
                <p key={i} className="text-sm text-white/40 font-light">
                  {h}
                </p>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Luma link if available */}
        {event.lumaUrl && (
          <FadeIn className="mb-16" delay={600}>
            <a
              href={event.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs tracking-widest uppercase text-white/20 hover:text-white/40 transition-colors duration-300"
            >
              View on Luma &rarr;
            </a>
          </FadeIn>
        )}

        {/* Prev / Next navigation */}
        <FadeIn delay={700}>
          <div className="border-t border-white/10 pt-8 mt-12 flex justify-between items-center">
            {prevEvent ? (
              <Link
                href={`/events/${prevEvent.slug}`}
                className="text-xs tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors duration-300"
              >
                &larr; #{prevEvent.number}
              </Link>
            ) : (
              <span />
            )}
            {nextEvent ? (
              <Link
                href={`/events/${nextEvent.slug}`}
                className="text-xs tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors duration-300"
              >
                #{nextEvent.number} &rarr;
              </Link>
            ) : (
              <span />
            )}
          </div>
        </FadeIn>
      </main>

      <Footer variant="dark" />
    </div>
  );
}
