"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
          <Image
            src="/logo-transparent.svg"
            alt="OPEN BLN"
            width={320}
            height={320}
            className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 mb-6"
            priority
          />

          <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-lg text-center leading-relaxed">
            A Berlin-based creative community shaped by mentorship,
            colored with inspiration, and driven by purposeful collaboration.
          </p>
        </div>

        <Footer variant="dark" />
      </div>
    </div>
  );
}
