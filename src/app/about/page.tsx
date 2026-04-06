"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/* ── Reveal-on-scroll hook ── */
function useReveal(threshold = 0.25) {
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

/* ── Section wrapper with fade-in ── */
function Section({
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
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 1s ease-out ${delay}ms, transform 1s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Nav variant="dark" />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-20 sm:py-28 w-full">
        {/* Title */}
        <Section>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4">
            Our story
          </h1>
          <p className="text-white/25 text-sm tracking-widest uppercase mb-20">
            Born March 8, 2025
          </p>
        </Section>

        {/* ── Chapter 1: The beginning ── */}
        <Section className="mb-16">
          <p className="text-lg sm:text-xl font-light text-white/80 leading-relaxed">
            OPEN BLN was born on International Women&apos;s Day, out of a strong
            calling to build something independent — something that couldn&apos;t
            be taken away.
          </p>
        </Section>

        <Section className="mb-16" delay={100}>
          <p className="text-base text-white/50 leading-relaxed">
            After pouring heart and soul into a community on someone else&apos;s
            ground, the founder learned how fragile that can feel. So we started
            fresh — with our own identity, rooted in mentorship and open to
            possibilities.
          </p>
        </Section>

        {/* ── Chapter 2: The quiet year ── */}
        <Section className="mb-16 border-l border-white/10 pl-6" delay={100}>
          <p className="text-base text-white/50 leading-relaxed">
            That first year was quieter than expected. We said no to things that
            didn&apos;t align, and the more we did, the quieter the noise got.
            Instead of forcing something, we stayed still and listened.
          </p>
        </Section>

        <Section className="mb-16" delay={100}>
          <p className="text-base text-white/50 leading-relaxed">
            In the meantime, the work continued — mentoring, connecting, building,
            even through extraordinarily challenging personal times. And a
            realization emerged: the act of being that voice for someone else,
            even when searching for one yourself, was the whole point.
          </p>
        </Section>

        {/* ── Pull quote ── */}
        <Section className="mb-20 py-8">
          <p className="text-2xl sm:text-3xl font-light text-white/90 leading-snug text-center max-w-lg mx-auto">
            There are so many of us who carry that same heart and desire to do
            more for our communities.
          </p>
        </Section>

        {/* ── Chapter 3: Face to face ── */}
        <Section className="mb-16" delay={100}>
          <p className="text-base text-white/50 leading-relaxed">
            When the platforms we trusted let us down, people were left wondering:
            where do we go from here? We didn&apos;t want to leave anyone in the
            cold. So we started simple — face to face, one conversation at a time.
          </p>
        </Section>

        <Section className="mb-16" delay={100}>
          <p className="text-base text-white/50 leading-relaxed">
            The more we do, the more we feel how much the community is longing for
            this. Real mentorship. Real connection. Real intention. In a world full
            of noise, those things got buried. So that&apos;s what we&apos;re
            building: a space where people come together with purpose, not just
            proximity.
          </p>
        </Section>

        {/* ── Chapter 4: What we believe ── */}
        <Section className="mb-20 py-8 border-t border-b border-white/10">
          <div className="space-y-6 py-4">
            <p className="text-lg font-light text-white/70 leading-relaxed">
              We believe in mentorship over networking.
            </p>
            <p className="text-lg font-light text-white/70 leading-relaxed">
              In showing up with intention, not just attendance.
            </p>
            <p className="text-lg font-light text-white/70 leading-relaxed">
              In building slowly, honestly, on our own terms.
            </p>
            <p className="text-lg font-light text-white/70 leading-relaxed">
              In the people who stayed, believed, and helped paint color
              on a canvas that was once blank.
            </p>
          </div>
        </Section>

        {/* ── Closing ── */}
        <Section className="mb-20">
          <p className="text-lg sm:text-xl font-light text-white/80 leading-relaxed mb-8">
            It&apos;s full of possibilities we get to fill — together.
          </p>
          <p className="text-sm text-white/30">
            Year one starts now.
          </p>
        </Section>

        {/* ── Events CTA ── */}
        <Section className="text-center pb-12">
          <a
            href="/events"
            className="inline-block text-xs tracking-widest uppercase text-white/30 border border-white/15 px-6 py-3 rounded-full transition-all duration-300 hover:text-white/60 hover:border-white/40"
          >
            See our events
          </a>
        </Section>
      </main>

      <Footer variant="dark" />
    </div>
  );
}
