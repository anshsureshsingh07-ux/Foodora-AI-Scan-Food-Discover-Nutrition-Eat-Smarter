import React from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  speed?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = "",
  id,
  speed = 1.05,
}) => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, speed]);
  const zIndex = useTransform(scrollYProgress, [0, 1], [1, 10]);

  return (
    <motion.div
      id={id}
      style={{ scale, zIndex }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};
