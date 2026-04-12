"use client";

import { useEffect, useRef, useState } from "react";

const CLOSED_Y = 30;
const OPEN_UP_Y = -10;
const OPEN_LOW_Y = 70;
const FOCUS_UP_Y = -18;
const FOCUS_LOW_Y = 78;

export default function Eye({ isOpen, isFocus }: { isOpen: boolean; isFocus: boolean }) {
  const [currentUpY, setCurrentUpY] = useState(30);
  const [currentLowY, setCurrentLowY] = useState(30);
  const requestRef = useRef<number>();

  const startTimeRef = useRef<number>();
  const startYRef = useRef({ up: 30, low: 30 });
  const targetYRef = useRef({ up: 30, low: 30 });

  useEffect(() => {
    const targetUp = !isOpen ? CLOSED_Y : isFocus ? FOCUS_UP_Y : OPEN_UP_Y;
    const targetLow = !isOpen ? CLOSED_Y : isFocus ? FOCUS_LOW_Y : OPEN_LOW_Y;

    targetYRef.current = { up: targetUp, low: targetLow };
    startYRef.current = { up: currentUpY, low: currentLowY };
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      if (!startTimeRef.current) return;
      const progress = Math.min((now - startTimeRef.current) / 600, 1);
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setCurrentUpY(startYRef.current.up + (targetYRef.current.up - startYRef.current.up) * ease);
      setCurrentLowY(startYRef.current.low + (targetYRef.current.low - startYRef.current.low) * ease);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isOpen, isFocus]);

  const pupilRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!pupilRef.current) return;
      
      const mouseXPercent = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const mouseYPercent = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      const dampingLimit = isFocus ? 35 : 20;
      
      const x = mouseXPercent * dampingLimit;
      const y = mouseYPercent * 15;
      
      pupilRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isFocus]);

  return (
    <div id="eye-container" className={`w-[220px] h-[120px] transition-transform duration-1000 ease-eye-ease ${isOpen ? "open" : ""}`}>
      <svg viewBox="0 0 100 60" className="w-full h-full fill-none stroke-eye stroke-[1.2] stroke-linecap-round">
        <defs>
          <clipPath id="eye-clip">
            <path d={`M 10 30 Q 50 ${currentUpY} 90 30 Q 50 ${currentLowY} 10 30 Z`} />
          </clipPath>
        </defs>
        <path d={`M 10 30 Q 50 ${currentLowY} 90 30`} />
        <path d={`M 10 30 Q 50 ${currentUpY} 90 30`} />
        <g clipPath="url(#eye-clip)">
          <g ref={pupilRef} className="transition-transform duration-200 ease-out will-change-transform">
            <circle className="eye-iris" cx="50" cy="30" r="12" />
            <circle className="eye-pupil" cx="50" cy="30" r="4" />
          </g>
        </g>
      </svg>
    </div>
  );
}

