"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";

const STATS = [
  { number: "10×", label: "mais rápido que montar no Word" },
  { number: "2 min", label: "do briefing ao brief completo" },
  { number: "100%", label: "em português, contexto BR" },
];

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      className="bg-[#FFFCF5]"
    >
      <Container>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 mx-auto"
          style={{ maxWidth: "680px" }}
        >
          {STATS.map(({ number, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="flex flex-col items-center justify-center gap-1 text-center"
              style={{ padding: "56px 24px" }}
            >
              <span
                className="font-bold leading-none tracking-[-0.03em]"
                style={{
                  fontSize: "56px",
                  color: number === "100%" ? "#C2410C" : "#1F1A14",
                }}
              >
                {number}
              </span>
              <span className="text-[#6B6258] mt-1" style={{ fontSize: "15px" }}>{label}</span>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
