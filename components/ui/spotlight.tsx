"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export const Spotlightining = ({ className, fill }: SpotlightProps) => {
  const [key, setKey] = useState(0);

  // force re-mount on page load
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, []);

  return (
    <svg
      key={key}
      className={cn(
        "pointer-events-none absolute z-10 opacity-60 animate-spotlight",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.35"
        />
      </g>

      <defs>
        <filter
          id="filter"
          x="0"
          y="0"
          width="3787"
          height="2842"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur stdDeviation="180" />
        </filter>
      </defs>
    </svg>
  );
};
