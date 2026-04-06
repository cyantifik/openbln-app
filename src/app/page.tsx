"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays (some browsers block autoplay)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
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
      <div className="relative z-10 flex flex-col h-full px-8 md:px-16 py-10">
        {/* Top nav */}
        <nav className="flex items-center justify-between w-full">
          <a href="/" className="logo logo-animated text-xl tracking-tight text-white">
            <span className="font-bold">OPEN</span>{" "}
            <span className="font-light">BLN</span>
          </a>
          <div className="flex items-center gap-8 text-sm text-white/70">
            <a
              href="https://space.open-bln.com"
              className="hover:text-white transition-colors duration-300 tracking-wider"
            >
              SPACE
            </a>
            <a
              href="https://instagram.com/open.bln"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300 tracking-wider"
            >
              IG
            </a>
            <a
              href="https://linkedin.com/company/openbln"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300 tracking-wider"
            >
              LI
            </a>
            <a
              href="mailto:hello@open-bln.com"
              className="hover:text-white transition-colors duration-300 tracking-wider"
            >
              @
            </a>
          </div>
        </nav>

        {/* Center logo + tagline */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          {/* OPEN BLN square logo */}
          <img
            src="/logo-transparent.svg"
            alt="OPEN BLN"
            className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mb-6 logo-float"
          />

          {/* Tagline */}
          <p className="text-white/50 text-base md:text-lg max-w-lg text-center leading-relaxed">
            Berlin-based creative community shaped by mentorship,
            colored with inspiration, and driven by purposeful collaboration.
          </p>
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between text-sm text-white/40">
          <p>
            &copy; 2026 <span className="font-bold">OPEN</span>{" "}
            <span className="font-light">BLN</span> — A community for Berlin&apos;s creative professionals
          </p>
          <a
            href="https://space.open-bln.com"
            className="hover:text-white/60 transition-colors duration-300"
          >
            Enter the Space &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
