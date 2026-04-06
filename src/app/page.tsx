"use client";

import { useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-black flex flex-col">
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
      <div className="relative z-10 flex flex-col min-h-screen">
        <Nav variant="dark" />

        {/* Center logo + tagline */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-10 px-6">
          <h1
            className="text-white text-6xl md:text-8xl lg:text-9xl tracking-tight mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="font-bold">OPEN</span>{" "}
            <span className="font-light">BLN</span>
          </h1>

          <p className="text-white/50 text-base md:text-lg max-w-lg text-center leading-relaxed mb-8">
            Berlin-based creative community shaped by mentorship,
            colored with inspiration, and driven by purposeful collaboration.
          </p>

          <a
            href="/community"
            className="text-white/50 text-sm hover:text-white transition-colors duration-300"
          >
            Enter the Space &rarr;
          </a>
        </div>

        <Footer variant="dark" />
      </div>
    </div>
  );
}
