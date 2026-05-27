import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';

const COUNTRIES = [
  { country: 'UAE', adoption: 70, tier: 'high' },
  { country: 'Singapore', adoption: 63, tier: 'high' },
  { country: 'South Korea', adoption: 52, tier: 'high' },
  { country: 'Denmark', adoption: 48, tier: 'high' },
  { country: 'Finland', adoption: 46, tier: 'high' },
  { country: 'UK', adoption: 42, tier: 'medium' },
  { country: 'India', adoption: 40, tier: 'medium' },
  { country: 'Philippines', adoption: 38, tier: 'medium' },
  { country: 'Germany', adoption: 36, tier: 'medium' },
  { country: 'USA', adoption: 34, tier: 'medium' },
  { country: 'Canada', adoption: 33, tier: 'medium' },
  { country: 'France', adoption: 30, tier: 'medium' },
  { country: 'Japan', adoption: 28, tier: 'low' },
  { country: 'Brazil', adoption: 22, tier: 'low' },
  { country: 'Nigeria', adoption: 18, tier: 'low' },
];

const TIER_COLORS = {
  high: '#00e676',
  medium: '#FFD740',
  low: '#ff5252',
};

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function packBubbles(countries, width, height) {
  const rng = seededRandom(42);
  const minR = 18;
  const maxR = 52;
  const maxAdoption = Math.max(...countries.map((c) => c.adoption));
  const minAdoption = Math.min(...countries.map((c) => c.adoption));

  const bubbles = countries.map((c) => {
    const norm = (c.adoption - minAdoption) / (maxAdoption - minAdoption);
    const r = minR + norm * (maxR - minR);
    return { ...c, r, x: 0, y: 0 };
  });

  // Sort by size descending for better packing
  bubbles.sort((a, b) => b.r - a.r);

  // Simple force-directed placement
  const padding = 6;
  const centerX = width / 2;
  const centerY = height / 2;

  bubbles.forEach((b, i) => {
    // Spiral placement
    const angle = i * 2.4 + rng() * 0.5;
    const dist = 30 + i * 18 + rng() * 20;
    b.x = centerX + Math.cos(angle) * dist;
    b.y = centerY + Math.sin(angle) * dist * 0.65;
  });

  // Collision resolution - multiple passes
  for (let iter = 0; iter < 80; iter++) {
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const dx = bubbles[j].x - bubbles[i].x;
        const dy = bubbles[j].y - bubbles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = bubbles[i].r + bubbles[j].r + padding;

        if (dist < minDist && dist > 0) {
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          bubbles[i].x -= nx * overlap;
          bubbles[i].y -= ny * overlap;
          bubbles[j].x += nx * overlap;
          bubbles[j].y += ny * overlap;
        }
      }
      // Pull toward center
      const toCenterX = centerX - bubbles[i].x;
      const toCenterY = centerY - bubbles[i].y;
      bubbles[i].x += toCenterX * 0.01;
      bubbles[i].y += toCenterY * 0.01;

      // Keep in bounds
      bubbles[i].x = Math.max(bubbles[i].r + 4, Math.min(width - bubbles[i].r - 4, bubbles[i].x));
      bubbles[i].y = Math.max(bubbles[i].r + 4, Math.min(height - bubbles[i].r - 4, bubbles[i].y));
    }
  }

  return bubbles;
}

export default function BubbleScatter() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const [dims, setDims] = useState({ w: 700, h: 400 });
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      setDims({ w, h: Math.max(340, Math.min(w * 0.6, 440)) });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const bubbles = useMemo(() => packBubbles(COUNTRIES, dims.w, dims.h), [dims.w, dims.h]);

  // Find connections within same tier
  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        if (bubbles[i].tier === bubbles[j].tier) {
          const dx = bubbles[j].x - bubbles[i].x;
          const dy = bubbles[j].y - bubbles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            lines.push({ i, j, dist });
          }
        }
      }
    }
    return lines;
  }, [bubbles]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: dims.h }}>
      <svg width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`}>
        <defs>
          <filter id="glow-bubble">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Constellation lines */}
        {connections.map(({ i, j, dist }, idx) => (
          <motion.line
            key={`line-${idx}`}
            x1={bubbles[i].x}
            y1={bubbles[i].y}
            x2={bubbles[j].x}
            y2={bubbles[j].y}
            stroke={TIER_COLORS[bubbles[i].tier]}
            strokeWidth={0.6}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: (1 - dist / 180) * 0.2 } : {}}
            transition={{ duration: 1, delay: 0.8 + idx * 0.03 }}
          />
        ))}

        {/* Bubbles */}
        {bubbles.map((b, i) => {
          const color = TIER_COLORS[b.tier];
          const isHovered = hoveredIdx === i;

          return (
            <motion.g
              key={b.country}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.2 + i * 0.06,
                type: 'spring',
                stiffness: 100,
                damping: 12,
              }}
              style={{ transformOrigin: `${b.x}px ${b.y}px` }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              {/* Outer glow pulse */}
              <motion.circle
                cx={b.x}
                cy={b.y}
                r={b.r}
                fill="none"
                stroke={color}
                strokeWidth={1}
                opacity={0.15}
                animate={{
                  r: [b.r + 2, b.r + 6, b.r + 2],
                  opacity: [0.15, 0.08, 0.15],
                }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Main bubble */}
              <motion.circle
                cx={b.x}
                cy={b.y}
                r={b.r}
                fill={color}
                fillOpacity={isHovered ? 0.25 : 0.12}
                stroke={color}
                strokeWidth={isHovered ? 2 : 1.2}
                strokeOpacity={isHovered ? 0.9 : 0.5}
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                filter={isHovered ? 'url(#glow-bubble)' : undefined}
              />

              {/* Country name */}
              <text
                x={b.x}
                y={b.r > 30 ? b.y - 6 : b.y - 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isHovered ? '#fff' : '#e0e0e0'}
                fontSize={b.r > 35 ? 11 : b.r > 25 ? 9 : 7}
                fontWeight={600}
                fontFamily="'Plus Jakarta Sans', sans-serif"
              >
                {b.country}
              </text>

              {/* Adoption percentage */}
              {b.r > 25 && (
                <text
                  x={b.x}
                  y={b.y + (b.r > 30 ? 10 : 8)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  fontSize={b.r > 35 ? 13 : 10}
                  fontWeight={700}
                  fontFamily="monospace"
                >
                  {b.adoption}%
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-5 justify-center mt-3">
        {[
          { label: 'High (>45%)', color: TIER_COLORS.high },
          { label: 'Medium (30-45%)', color: TIER_COLORS.medium },
          { label: 'Low (<30%)', color: TIER_COLORS.low },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-[#a0a0a0]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color, opacity: 0.7 }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
