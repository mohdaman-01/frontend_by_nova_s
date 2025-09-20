import { motion, useReducedMotion } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
