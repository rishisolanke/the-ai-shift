import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const GAUGE_DATA = [
  { label: 'Lower Secondary', value: 22, maxVal: 30, color: '#ff5252', description: 'No university degree' },
  { label: 'Upper Secondary', value: 12, maxVal: 30, color: '#FFD740', description: 'High school diploma' },
  { label: 'University Degree', value: 2, maxVal: 30, color: '#00e676', description: 'Bachelor\'s or higher' },
];

function GaugeArc({ value, maxVal, color, label, description, size = 160, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Semi-circle: from 180° to 0° (top half)
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweepAngle = Math.PI;

  // Value proportion
  const valueProportion = value / maxVal;

  // Arc path for background
  const bgStartX = center + radius * Math.cos(startAngle);
  const bgStartY = center - radius * Math.sin(startAngle);
  const bgEndX = center + radius * Math.cos(endAngle);
  const bgEndY = center - radius * Math.sin(endAngle);

  const bgPath = `M ${bgStartX} ${bgStartY} A ${radius} ${radius} 0 0 1 ${bgEndX} ${bgEndY}`;

  // Circumference of semi-circle
  const semiCircumference = Math.PI * radius;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <svg width={size} height={size * 0.6 + 10} viewBox={`0 0 ${size} ${size * 0.6 + 10}`} className="overflow-visible">
        <defs>
          <filter id={`glow-gauge-${label}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={bgPath}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value arc */}
        <motion.path
          d={bgPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={semiCircumference}
          initial={{ strokeDashoffset: semiCircumference }}
          animate={isInView ? { strokeDashoffset: semiCircumference * (1 - valueProportion) } : {}}
          transition={{ duration: 1.5, delay: delay, ease: [0.16, 1, 0.3, 1] }}
          filter={`url(#glow-gauge-${label})`}
        />

        {/* Value text */}
        <motion.text
          x={center}
          y={center - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={28}
          fontWeight="800"
          fontFamily="'Plus Jakarta Sans', monospace"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.6 }}
        >
          {value}%
        </motion.text>

        {/* Min/Max labels */}
        <text x={bgStartX - 2} y={center + 16} textAnchor="middle" fill="#666" fontSize={9} fontFamily="monospace">0%</text>
        <text x={bgEndX + 2} y={center + 16} textAnchor="middle" fill="#666" fontSize={9} fontFamily="monospace">{maxVal}%</text>
      </svg>

      {/* Labels */}
      <motion.div
        className="text-center -mt-1"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        <p className="text-sm font-semibold text-[#e0e0e0]">{label}</p>
        <p className="text-xs text-[#666] mt-0.5">{description}</p>
      </motion.div>
    </div>
  );
}

export default function AnimatedGauge() {
  return (
    <div className="py-6">
      <div className="grid grid-cols-3 gap-4">
        {GAUGE_DATA.map((item, i) => (
          <GaugeArc
            key={item.label}
            value={item.value}
            maxVal={item.maxVal}
            color={item.color}
            label={item.label}
            description={item.description}
            size={160}
            delay={i * 0.3}
          />
        ))}
      </div>

      {/* 11x callout */}
      <motion.div
        className="flex items-center justify-center gap-3 mt-6 p-4 rounded-xl bg-[#0d0d0d] border border-white/[0.06]"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.2, type: 'spring' }}
      >
        <span className="text-4xl font-bold font-mono text-[#ff5252]">11×</span>
        <p className="text-sm text-[#a0a0a0] max-w-xs">
          Workers without university degrees face 11 times higher automation risk than graduates.
        </p>
      </motion.div>
    </div>
  );
}
