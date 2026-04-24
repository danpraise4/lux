"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SOCIAL } from "@/lib/constants";

export function FloatingWidgets() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.a
        href={SOCIAL.whatsapp}
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-40 flex max-w-[calc(100vw-5.5rem)] touch-manipulation items-center gap-2 rounded-full border border-gold/30 bg-ink px-3 py-2 text-[11px] font-medium text-white shadow-lg shadow-black/20 sm:left-4 sm:max-w-[min(20rem,calc(100vw-2rem))] sm:px-4 sm:text-xs md:text-sm"
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
          <MessageCircle className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-ink">
            1
          </span>
        </span>
        <span className="truncate sm:whitespace-normal">Online — chat with us</span>
      </motion.a>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 z-40 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-gold/30 bg-ink text-white shadow-lg transition hover:bg-ink/90 sm:right-4"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
