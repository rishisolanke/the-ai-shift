import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/*
  Radial Bar Chart for Sector AI Adoption.
  Concentric arcs emanating from center — each sector's arc sweeps
  proportional to its adoption rate. Animated with staggered entrance.
*/

const SECTOR_DATA = [
  { name: 'Information & Technology', value: 37.2, color: '#4FC3F7' },
  { name: 'Finance & Insurance', value: 29.8, color: '#00e676' },
  { name: 'Professional Services', value: 26.4, color: '#B388FF' },
  { name: 'Healthcare', value: 18.9, color: '#18FFFF' },
  { name: 'Manufacturing', value: 16.3, color: '#FFD740' },
  { name: 'Retail Trade', value: 14.7, color: '#FFAB40' },
  { name: 'Education', value: 13.2, color: '#FF80AB' },
  { name: 'Transportation', value: 11.5, color: '#4FC3F7' },
  { name: 'Construction', value: 7.8, color: '#B388FF' },
  { name: 'Agriculture', value: 5.2, color: '#FFD740' },
];

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export default function RadialBarSector() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(null);

  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const innerRadius = 55;
  const arcGap = 4;
  const arcWidth = (size / 2 - innerRadius - 40) / SECTOR_DATA.length;
  const maxSweep = 270; // max degrees for 100%

  return (
    <div ref={ref} className="flex flex-col items-center py-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <defs>
          {SECTOR_DATA.map((sector, i) => (
            <filter key={`glow-${i}`} id={`radial-glow-${i}`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Background arcs (track) */}
        {SECTOR_DATA.map((sector, i) => {
          const r = innerRadius + (i + 1) * arcWidth;
          const trackPath = describeArc(cx, cy, r, 0, maxSweep);
          return (
            <path
              key={`track-${i}`}
              d={trackPath}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={arcWidth - arcGap}
              strokeLinecap="round"
            />
          );
        })}

        {/* Animated value arcs */}
        {SECTOR_DATA.map((sector, i) => {
          const r = innerRadius + (i + 1) * arcWidth;
          const sweepAngle = (sector.value / 100) * maxSweep;
          const arcPath = describeArc(cx, cy, r, 0, sweepAngle);
          const circumference = (sweepAngle / 360) * 2 * Math.PI * r;
          const totalCirc = (maxSweep / 360) * 2 * Math.PI * r;
          const isHovered = hovered === i;

          return (
            <motion.path
              key={`arc-${i}`}
              d={describeArc(cx, cy, r, 0, sweepAngle)}
              fill="none"
              stroke={sector.color}
              strokeWidth={arcWidth - arcGap}
              strokeLinecap="round"
              strokeOpacity={isHovered ? 1 : 0.8}
              filter={isHovered ? `url(#radial-glow-${i})` : undefined}
              initial={{ strokeDasharray: `${circumference} ${totalCirc}`, strokeDashoffset: circumference }}
              animate={isInView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: 1, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}

        {/* Labels at arc ends */}
        {SECTOR_DATA.map((sector, i) => {
          const r = innerRadius + (i + 1) * arcWidth;
          const sweepAngle = (sector.value / 100) * maxSweep;
          const labelPos = polarToCartesian(cx, cy, r, sweepAngle + 4);
          const isHovered = hovered === i;

          return (
            <motion.g
              key={`label-${i}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: isHovered ? 1 : 0.7 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 * i + 0.8 }}
            >
              <text
                x={labelPos.x + 6}
                y={labelPos.y + 4}
                fontSize={isHovered ? 11 : 9}
                fontWeight={isHovered ? 700 : 500}
                fill={sector.color}
                fontFamily="'Plus Jakarta Sans', sans-serif"
              >
                {sector.value}%
              </text>
            </motion.g>
          );
        })}

        {/* Center text */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2, type: 'spring', stiffness: 100 }}
        >
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fontSize={22}
            fontWeight={700}
            fill="#4FC3F7"
            fontFamily="'JetBrains Mono', monospace"
          >
            ~18%
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fontSize={10}
            fill="#a0a0a0"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            avg. adoption
          </text>
        </motion.g>
      </svg>

      {/* Legend below */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full max-w-md">
        {SECTOR_DATA.map((sector, i) => (
          <motion.div
            key={sector.name}
            className="flex items-center gap-2 text-xs cursor-pointer"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.1 * i + 1 }}
            style={{ opacity: hovered !== null && hovered !== i ? 0.4 : 1 }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: sector.color }}
            />
            <span className="text-text-secondary truncate">{sector.name}</span>
            <span className="font-mono text-white ml-auto">{sector.value}%</span>
          </motion.div>
        ))}
      </div>

      {/* Hover tooltip */}
      {hovered !== null && (
        <motion.div
          className="mt-3 px-4 py-2 rounded-lg border bg-[#0d0d0d]/90"
          style={{ borderColor: `${SECTOR_DATA[hovered].color}30` }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <span className="text-sm font-semibold" style={{ color: SECTOR_DATA[hovered].color }}>
            {SECTOR_DATA[hovered].name}
          </span>
          <span className="text-xs text-text-secondary ml-3">
            {SECTOR_DATA[hovered].value}% of firms use AI
          </span>
        </motion.div>
      )}
    </div>
  );
}
