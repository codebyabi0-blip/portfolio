"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  link: string; // "#about", "#projects"
  icon?: React.ReactNode;
};

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  /* -------------------------------
     SHOW / HIDE NAV ON SCROLL
  -------------------------------- */
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current !== "number") return;
console.log(current)
    const prev = scrollYProgress.getPrevious() ?? 0;
    const direction = current - prev;

    if (scrollYProgress.get() < 0.05) {
      setVisible(true);
    } else {
      setVisible(direction < 0);
    }
  });

  /* -------------------------------
     SCROLL SPY (AUTO UNDERLINE)
  -------------------------------- */
  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.link))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px", // center detection
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navItems]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-5 inset-x-0 mx-auto px-10 py-5 rounded-lg border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-4",
          className
        )}
        style={{
          backgroundColor: "rgba(17, 25, 40, 0.75)",
        }}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.link;

          return (
            <Link
              key={item.link}
              href={item.link}
              onClick={() => setActiveSection(item.link)}
              className={cn(
                "relative text-sm cursor-pointer text-neutral-300 hover:text-white transition"
              )}
            >
              {item.name}

              {/* ACTIVE UNDERLINE */}
              {isActive && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};
