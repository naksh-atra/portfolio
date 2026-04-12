"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed w-[6px] h-[6px] bg-eye rounded-full pointer-events-none z-[10000] transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
}
