import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * SpringCounter — animates a number from 0 to target using spring physics.
 *
 * Props:
 *   value    – target numeric value (e.g. 92, 285.9)
 *   prefix   – string before the number (e.g. "$")
 *   suffix   – string after the number (e.g. "M", " TWh", "%")
 *   isInView – boolean trigger (starts animation when true)
 *   className – optional CSS class for the motion.span
 *   style    – optional inline styles
 */
export default function SpringCounter({
  value,
  prefix = '',
  suffix = '',
  isInView = true,
  className = '',
  style = {},
}) {
  const spring = useSpring(0, { stiffness: 40, damping: 20, restDelta: 0.01 });

  const display = useTransform(spring, (v) => {
    const num = Number.isInteger(value) ? Math.round(v) : v.toFixed(1);
    return `${prefix}${num}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <motion.span className={className} style={style}>
      {display}
    </motion.span>
  );
}
