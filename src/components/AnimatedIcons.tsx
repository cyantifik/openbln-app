"use client";

const keyframes = `
@keyframes anim-float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
@keyframes anim-float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
@keyframes anim-orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes anim-pulse { 0%,100% { transform: scale(1); opacity:0.6; } 50% { transform: scale(1.15); opacity:1; } }
@keyframes anim-slide { 0%,100% { transform: translateX(0); } 50% { transform: translateX(2px); } }
@keyframes anim-wrench { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
@keyframes anim-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes anim-hand { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
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
        <path d="M22 18l6 6-6 6" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: "anim-slide 2s ease-in-out infinite" }} />
      </svg>
    </>
  );
}

// ID card — elements float independently
export function IdCardIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <rect x="8" y="10" width="32" height="28" rx="3" stroke={color} strokeWidth="1.2" />
        <circle cx="20" cy="22" r="4" stroke={color} strokeWidth="1"
          style={{ animation: "anim-float1 2.8s ease-in-out infinite" }} />
        <line x1="28" y1="20" x2="36" y2="20" stroke={color} strokeWidth="0.8" strokeLinecap="round"
          style={{ animation: "anim-float1 3s ease-in-out infinite 0.3s" }} />
        <line x1="28" y1="24" x2="34" y2="24" stroke={color} strokeWidth="0.8" strokeLinecap="round"
          style={{ animation: "anim-float1 3.2s ease-in-out infinite 0.5s" }} />
        <path d="M14 34c0-3.3 2.7-6 6-6s6 3.3 6 6" stroke={color} strokeWidth="1" strokeLinecap="round" />
      </svg>
    </>
  );
}

// Wrench — wiggles
export function ToolboxIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <g style={{ animation: "anim-wrench 3s ease-in-out infinite", transformOrigin: "24px 24px" }}>
          <path d="M28 12l8 8-3 3-8-8" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 36l-6-6 14-14 6 6-14 14z" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </>
  );
}

// Search arrow — looking for
export function LookingForIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <circle cx="20" cy="24" r="8" stroke={color} strokeWidth="1.2" strokeDasharray="3 3"
          style={{ animation: "anim-rotate 12s linear infinite", transformOrigin: "20px 24px" }} />
        <path d="M28 24h8" stroke={color} strokeWidth="1.2" strokeLinecap="round"
          style={{ animation: "anim-slide 2s ease-in-out infinite" }} />
        <path d="M33 21l3 3-3 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: "anim-slide 2s ease-in-out infinite" }} />
      </svg>
    </>
  );
}

// Guide figure — mentorship
export function MentorshipIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <g style={{ animation: "anim-hand 2s ease-in-out infinite", transformOrigin: "24px 36px" }}>
          <circle cx="24" cy="16" r="6" stroke={color} strokeWidth="1.2" />
          <path d="M16 36c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <circle cx="36" cy="14" r="3" stroke={color} strokeWidth="1"
          style={{ animation: "anim-pulse 2.5s ease-in-out infinite" }} />
        <line x1="30" y1="16" x2="33" y2="15" stroke={color} strokeWidth="0.6" strokeDasharray="1.5 1.5" />
      </svg>
    </>
  );
}

// Floating lines in circle — links
export function LinksIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <>
      <InjectKeyframes />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="1.2" />
        <path d="M20 20l12 0" stroke={color} strokeWidth="1" strokeLinecap="round"
          style={{ animation: "anim-float1 2.5s ease-in-out infinite" }} />
        <path d="M20 24l8 0" stroke={color} strokeWidth="1" strokeLinecap="round"
          style={{ animation: "anim-float2 3s ease-in-out infinite 0.3s" }} />
        <path d="M20 28l10 0" stroke={color} strokeWidth="1" strokeLinecap="round"
          style={{ animation: "anim-float1 2.8s ease-in-out infinite 0.6s" }} />
      </svg>
    </>
  );
}
