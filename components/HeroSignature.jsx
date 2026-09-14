"use client";
import { useEffect, useRef } from "react";

export default function HeroSignature({ firstName = "Henry Mfon", lastName = "Akpan" }) {
  const r1 = useRef(null);
  const r2 = useRef(null);

  useEffect(() => {
    const els = [
      { el: r1.current, delay: 0.1 },
      { el: r2.current, delay: 0.5 }
    ];
    const timers = [];
    els.forEach(({ el, delay }) => {
      if (!el) return;
      const len = el.getComputedTextLength ? el.getComputedTextLength() : 400;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      el.style.transition = `stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1) ${delay}s, fill 0.6s ease ${delay + 1.1}s`;
      requestAnimationFrame(() => {
        el.style.strokeDashoffset = 0;
      });
      timers.push(
        setTimeout(() => {
          if (el) {
            el.style.fill = "#eaf0f5";
            el.style.stroke = "none";
          }
        }, (delay + 1.1) * 1000)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <svg
      viewBox="0 0 640 160"
      width="100%"
      style={{ overflow: "visible", maxWidth: 600 }}
      role="img"
      aria-label={`${firstName} ${lastName}`}
    >
      <text
        ref={r1}
        x="0"
        y="70"
        fontFamily="'Space Grotesk'"
        fontWeight="600"
        fontSize="52"
        fill="none"
        stroke="#2de2c8"
        strokeWidth="1"
      >
        {firstName}
      </text>
      <text
        ref={r2}
        x="0"
        y="130"
        fontFamily="'Space Grotesk'"
        fontWeight="600"
        fontSize="52"
        fill="none"
        stroke="#2de2c8"
        strokeWidth="1"
      >
        {lastName}
      </text>
    </svg>
  );
}
