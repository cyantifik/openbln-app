"use client";

const keyframes = `
@keyframes anim-float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
@keyframes anim-float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
@keyframes anim-orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes anim-pulse { 0%,100% { transform: scale(1); opacity:0.6; } 50% { transform: scale(1.15); opacity:1; } }
@keyframes anim-slide { 0%,100% { transform: translateX(0); } 50% { transform: translateX(2px); } }
`;

function InjectKeyframes() {
  return <style dangerouslySetInnerHTML={{ __html: keyframes }} />;
}

// People meeting — two figures with a pulsing dashed connection
export function PeopleMeetingIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <g style={{ animation: "anim-float1 2.8s ease-in-out infinite" }}>
          <circle cx="16" cy="16" r="3.5" stroke={color} strokeWidth="1.3" />
          <path d="M11 26c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        </g>
        <g style={{ animation: "anim-float2 3.2s ease-in-out infinite 0.5s" }}>
          <circle cx="32" cy="16" r="3.5" stroke={color} strokeWidth="1.3" />
          <path d="M27 26c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        </g>
        <line x1="21" y1="22" x2="27" y2="22" stroke={color} strokeWidth="0.8" strokeDasharray="1.5 1.5"
          style={{ animation: "anim-pulse 2s ease-in-out infinite" }} />
      </svg>
    </>
  );
}

// Photo strip — frames that gently float
export function PhotoStripIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <rect x="8" y="6" width="32" height="36" rx="2" stroke={color} strokeWidth="1.3" />
        <rect x="12" y="10" width="24" height="14" rx="1" stroke={color} strokeWidth="0.8"
          style={{ animation: "anim-float1 2.8s ease-in-out infinite" }} />
        <rect x="12" y="28" width="10" height="10" rx="1" stroke={color} strokeWidth="0.8"
          style={{ animation: "anim-float2 3.2s ease-in-out infinite 0.5s" }} />
        <rect x="26" y="28" width="10" height="10" rx="1" stroke={color} strokeWidth="0.8"
          style={{ animation: "anim-float1 3s ease-in-out infinite 1s" }} />
      </svg>
    </>
  );
}

// Orbiting nodes — molecule-style connection
export function OrbitingNodesIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <circle cx="24" cy="24" r="4" stroke={color} strokeWidth="1.2" />
        <circle cx="24" cy="24" r="1.5" fill={color}
          style={{ animation: "anim-pulse 2s ease-in-out infinite" }} />
        <g style={{ animation: "anim-orbit 8s linear infinite", transformOrigin: "24px 24px" }}>
          <circle cx="24" cy="10" r="3" stroke={color} strokeWidth="1.2" />
        </g>
        <g style={{ animation: "anim-orbit 8s linear infinite reverse", transformOrigin: "24px 24px" }}>
          <circle cx="36" cy="32" r="3" stroke={color} strokeWidth="1.2" />
        </g>
        <g style={{ animation: "anim-orbit 12s linear infinite 2s", transformOrigin: "24px 24px" }}>
          <circle cx="12" cy="32" r="3" stroke={color} strokeWidth="1.2" />
        </g>
      </svg>
    </>
  );
}

// Single person — gentle float
export function PersonIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <circle cx="24" cy="16" r="5" stroke={color} strokeWidth="1.3"
          style={{ animation: "anim-float1 2.8s ease-in-out infinite" }} />
        <path d="M14 34c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke={color} strokeWidth="1.3" strokeLinecap="round"
          style={{ animation: "anim-float2 3.2s ease-in-out infinite 0.5s" }} />
      </svg>
    </>
  );
}

// Chevron in circle — sliding
export function BookingChevronIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1.2" />
        <path d="M21 16l8 8-8 8" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: "anim-slide 2s ease-in-out infinite" }} />
      </svg>
    </>
  );
}
