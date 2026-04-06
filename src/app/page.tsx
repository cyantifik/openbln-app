"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/* ── Manifesto lines — one per snap section ── */
const MANIFESTO = [
  {
    text: "Purpose, not proximity.",
    sub: null,
  },
  {
    text: "Real mentorship. Real connection. Real intention.",
    sub: "In a world full of noise, those things got buried.",
  },
  {
    text: "We build on our own ground.",
    sub: "Independent. Rooted. Open to possibilities.",
  },
  {
    text: "The act of showing up is the whole point.",
    sub: null,
  },
];

/* ── Intersection Observer hook for fade-in ── */
function useReveal() {
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
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function ManifestoSection({
  text,
  sub,
  index,
}: {
  text: string;
  sub: string | null;
  index: number;
}) {
  const { ref, visible } = useReveal();
  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      className="min-h-[70vh] sm:min-h-screen flex items-center justify-center px-8 sm:px-12 snap-start"
    >
      <div
        className={`max-w-2xl transition-all duration-[1200ms] ease-out ${
          isEven ? "text-center" : "text-left"
        }`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
        }}
      >
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white leading-snug tracking-tight">
          {text}
        </p>
        {sub && (
          <p
            className="mt-4 sm:mt-6 text-sm sm:text-base text-white/35 font-light max-w-md leading-relaxed"
            style={{
              marginLeft: isEven ? "auto" : undefined,
              marginRight: isEven ? "auto" : undefined,
              transitionDelay: "200ms",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s",
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="bg-black text-white snap-y snap-mandatory">
      {/* ── HERO ── */}
      <section className="relative w-screen h-screen overflow-hidden flex flex-col snap-start">
        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col h-full">
          <Nav variant="dark" />

          {/* Center logo + tagline */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-10 px-6">
            <Image
              src="/logo-transparent.svg"
              alt="OPEN BLN"
              width={320}
              height={320}
              className="w-72 h-72 sm:w-[22rem] sm:h-[22rem] md:w-[28rem] md:h-[28rem] mb-6 logo-float"
              priority
            />
            <p className="text-white/50 text-xs sm:text-sm md:text-base max-w-lg text-center leading-relaxed font-semibold">
              A Berlin-based creative collective shaped by mentorship,
              colored with inspiration, and driven by purposeful collaboration.
            </p>
          </div>

          {/* Scroll hint */}
          <div className="flex justify-center pb-8 animate-pulse">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/25"
            >
              <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── MANIFESTO SECTIONS ── */}
      {MANIFESTO.map((item, i) => (
        <ManifestoSection key={i} text={item.text} sub={item.sub} index={i} />
      ))}

      {/* ── CTA — Learn more ── */}
      <section className="min-h-[50vh] flex items-center justify-center px-8 snap-start">
        <div className="text-center">
          <Link
            href="/about"
            className="inline-block text-xs tracking-widest uppercase text-white/30 border border-white/15 px-6 py-3 rounded-full transition-all duration-300 hover:text-white/60 hover:border-white/40"
          >
            Our story
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="snap-start">
        <Footer variant="dark" />
      </div>
    </div>
  );
}
