import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const NODES = [
  { label: 'AI Capex Spending', value: '$660B', color: '#00e676', x: 0.08, y: 0.5 },
  { label: 'Imported Components (75%)', value: '$495B', color: '#FFD740', x: 0.35, y: 0.28 },
  { label: 'Flows to Taiwan/Korea', value: '$380B', color: '#FFAB40', x: 0.62, y: 0.62 },
  { label: 'US GDP Contribution', value: '≈ 0%', color: '#ff5252', x: 0.9, y: 0.4 },
];

function generateCurvePath(x1, y1, x2, y2) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const offsetX = (y2 - y1) * 0.3;
  const offsetY = -(x2 - x1) * 0.15;
  return `M ${x1} ${y1} Q ${midX + offsetX} ${midY + offsetY}, ${x2} ${y2}`;
}

function FlowParticle({ pathRef, delay, duration, color }) {
  return (
    <motion.circle
      r={2.5}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        offsetDistance: ['0%', '100%'],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        offsetPath: `path("${pathRef}")`,
        offsetRotate: '0deg',
        filter: `drop-shadow(0 0 4px ${color})`,
      }}
    />
  );
}

export default function AnimatedFlow() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const [dims, setDims] = useState({ w: 800, h: 280 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setDims({ w: el.offsetWidth, h: Math.max(260, Math.min(el.offsetWidth * 0.38, 320)) });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { w, h } = dims;
  const nodeRadius = Math.max(32, Math.min(w * 0.055, 48));
  const nodes = NODES.map((n) => ({ ...n, cx: n.x * w, cy: n.y * h }));

  const paths = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    paths.push({
      d: generateCurvePath(nodes[i].cx, nodes[i].cy, nodes[i + 1].cx, nodes[i + 1].cy),
      fromColor: nodes[i].color,
      toColor: nodes[i + 1].color,
      id: `flow-grad-${i}`,
    });
  }

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <defs>
          {paths.map((p) => (
            <linearGradient key={p.id} id={p.id} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={p.fromColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={p.toColor} stopOpacity={0.4} />
            </linearGradient>
          ))}
          <filter id="glow-flow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection paths */}
        {paths.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            stroke={`url(#${p.id})`}
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* Flowing particles along paths */}
        {isInView &&
          paths.map((p, i) =>
            Array.from({ length: 5 }).map((_, j) => (
              <FlowParticle
                key={`${i}-${j}`}
                pathRef={p.d}
                delay={1.0 + i * 0.4 + j * 0.6}
                duration={2.5}
                color={NODES[i].color}
              />
            ))
          )}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.3, type: 'spring', stiffness: 120, damping: 14 }}
            style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
          >
            {/* Glow ring */}
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={nodeRadius + 6}
              fill="none"
              stroke={node.color}
              strokeWidth={1}
              opacity={0.2}
              animate={{ r: [nodeRadius + 6, nodeRadius + 12, nodeRadius + 6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            />
            {/* Main circle */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r={nodeRadius}
              fill="#0d0d0d"
              stroke={node.color}
              strokeWidth={2}
              filter="url(#glow-flow)"
            />
            {/* Value text */}
            <text
              x={node.cx}
              y={node.cy - 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={node.color}
              fontSize={nodeRadius > 40 ? 16 : 13}
              fontWeight="700"
              fontFamily="'Plus Jakarta Sans', monospace"
            >
              {node.value}
            </text>
            {/* Label below */}
            <text
              x={node.cx}
              y={node.cy + nodeRadius + 16}
              textAnchor="middle"
              fill="#a0a0a0"
              fontSize={10}
              fontFamily="'Plus Jakarta Sans', sans-serif"
            >
              {node.label.length > 22 ? (
                <>
                  <tspan x={node.cx} dy="0">{node.label.split(' ').slice(0, 2).join(' ')}</tspan>
                  <tspan x={node.cx} dy="13">{node.label.split(' ').slice(2).join(' ')}</tspan>
                </>
              ) : (
                node.label
              )}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
