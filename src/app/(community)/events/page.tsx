"use client";

import { useEffect } from "react";

export default function EventsRedirect() {
  useEffect(() => {
    window.location.href = "https://open-bln.com/events";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[50vh] text-gray-400 text-sm">
      Redirecting to events...
    </div>
  );
}
