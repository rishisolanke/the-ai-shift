import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * SectionTransition — gradient spacer between sections.
 *
 * A breathing-room element that creates a smooth visual transition
 * between scrollytelling sections with a fading chapter title.
 *
 * Props:
 *   title     – short chapter title (e.g. "Next: The Economic Paradox")
 *   fromColor – accent color of the section above (default: transparent)
 *   toColor   – accent color of the section below (default: transparent)
 *   height    – viewport height multiplier (default: 0.5 = 50vh)
 */
export default function SectionTransition({
  title,
  fromColor = 'transparent',
  toColor = 'transparent',
  height = 0.5,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Title fades in at 30%, peaks at 50%, fades out at 70%
  const titleOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [30, 0, -30]);

  // Gradient line opacity
  const lineOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 0]);

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: `${height * 100}vh` }}
    >
      {/* Subtle gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${fromColor}06 0%, transparent 50%, ${toColor}06 100%)`,
        }}
      />

      {/* Center gradient line */}
      <motion.div
        className="absolute left-1/4 right-1/4 h-[1px]"
        style={{
          opacity: lineOpacity,
          background: `linear-gradient(90deg, transparent, ${toColor || '#00e676'}40, transparent)`,
        }}
      />

      {/* Chapter title */}
      {title && (
        <motion.p
          className="text-sm font-mono text-[#444] tracking-widest uppercase select-none"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          {title}
        </motion.p>
      )}
    </div>
  );
}
