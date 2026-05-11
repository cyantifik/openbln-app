"use client";

import Image from "next/image";

interface PhotoStripsProps {
  photos: string[];
  eventTitle: string;
}

export default function PhotoStrips({
  photos,
  eventTitle,
}: PhotoStripsProps) {
  if (!photos || photos.length === 0) return null;

  // Split photos into 3 strips of ~2-3 photos each
  const strips: string[][] = [[], [], []];
  photos.forEach((p, i) => strips[i % 3].push(p));

  return (
    <div className="w-full">
      {/* Strips container */}
      <div
        className="flex items-start justify-center gap-4 sm:gap-5 py-8"
        style={{ perspective: "1000px" }}
      >
        {strips.map((stripPhotos, si) => (
          <div
            key={si}
            className="photo-strip flex-shrink-0 relative flex flex-col rounded"
            style={{
              background: "#111",
              padding:
                si === 0
                  ? "14px 14px 36px 14px"
                  : "14px 14px 36px 14px",
              gap: "10px",
              width: "clamp(110px, 22vw, 200px)",
              boxShadow:
                "0 25px 50px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.04)",
              animation: `photoStripFloat${si + 1} 10s ease-in-out infinite`,
              marginTop: si === 1 ? "30px" : si === 2 ? "10px" : "0",
            }}
          >
            {stripPhotos.map((photo, pi) => (
              <div
                key={pi}
                className="w-full rounded-sm overflow-hidden"
                style={{ aspectRatio: "4 / 3" }}
              >
                <Image
                  src={photo}
                  alt={`${eventTitle} photo`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  style={{
                    animation: `photoStripBreathe 7s ease-in-out infinite`,
                    animationDelay: `${si * 2.3}s`,
                  }}
                />
              </div>
            ))}

            {/* OPEN BLN stamp */}
            <div className="text-center pt-1">
              <p
                className="font-semibold uppercase"
                style={{
                  fontSize: "7px",
                  letterSpacing: "4px",
                  color: "#444",
                }}
              >
                OPEN BLN
              </p>
            </div>

            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 rounded pointer-events-none"
              style={{
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
                mixBlendMode: "overlay",
                opacity: 0.6,
              }}
            />
          </div>
        ))}
      </div>

      {/* Keyframe animations injected via style tag */}
      <style jsx global>{`
        @keyframes photoStripFloat1 {
          0%, 100% { transform: rotate(-3deg) translateY(0); }
          33% { transform: rotate(-1.5deg) translateY(-12px); }
          66% { transform: rotate(-3.5deg) translateY(-6px); }
        }
        @keyframes photoStripFloat2 {
          0%, 100% { transform: rotate(1.5deg) translateY(0); }
          40% { transform: rotate(2.5deg) translateY(-10px); }
          70% { transform: rotate(0.5deg) translateY(-5px); }
        }
        @keyframes photoStripFloat3 {
          0%, 100% { transform: rotate(-1deg) translateY(0); }
          25% { transform: rotate(-2deg) translateY(-8px); }
          60% { transform: rotate(0.5deg) translateY(-14px); }
        }
        @keyframes photoStripBreathe {
          0%, 100% {
            filter: saturate(1.15) brightness(1.0) contrast(1.05);
          }
          50% {
            filter: saturate(0) brightness(0.75) contrast(1.2);
          }
        }
      `}</style>
    </div>
  );
}
