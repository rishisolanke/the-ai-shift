import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/*
  3D tilt effect wrapper — cards rotate in perspective on mouse hover.
  Provides a premium, interactive feel to stat cards.
*/

export default function TiltCard({ children, className = '', glowColor = '#00e676', intensity = 15 }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}

      {/* Dynamic light reflection */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + transform.rotateY * 3}% ${50 - transform.rotateX * 3}%, ${glowColor}08 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
    </motion.div>
  );
}
