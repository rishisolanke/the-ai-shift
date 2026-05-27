import { useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';

/*
  Treemap-style grid for H-1B employer approvals.
  Each company gets a rectangle sized proportional to their approvals.
  Simple squarified layout for 8 items.
*/

const TECH_GIANTS = ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple'];

function computeTreemapLayout(data, width, height) {
  const total = data.reduce((sum, d) => sum + d.approvals, 0);
  const rects = [];

  // Simple slice-and-dice layout
  let x = 0;
  let y = 0;
  let remainW = width;
  let remainH = height;
  const gap = 3;

  // Split into two rows
  const midIdx = Math.ceil(data.length / 2);
  const row1 = data.slice(0, midIdx);
  const row2 = data.slice(midIdx);

  const row1Total = row1.reduce((s, d) => s + d.approvals, 0);
  const row2Total = row2.reduce((s, d) => s + d.approvals, 0);

  const row1Height = (row1Total / total) * height;
  const row2Height = height - row1Height;

  // Layout row 1
  let rx = 0;
  row1.forEach((item) => {
    const w = (item.approvals / row1Total) * width;
    rects.push({
      ...item,
      x: rx + gap / 2,
      y: gap / 2,
      width: w - gap,
      height: row1Height - gap,
    });
    rx += w;
  });

  // Layout row 2
  rx = 0;
  row2.forEach((item) => {
    const w = (item.approvals / row2Total) * width;
    rects.push({
      ...item,
      x: rx + gap / 2,
      y: row1Height + gap / 2,
      width: w - gap,
      height: row2Height - gap,
    });
    rx += w;
  });

  return rects;
}

export default function EmployerTreemap({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(null);

  const width = 600;
  const height = 320;

  const rects = useMemo(() => computeTreemapLayout(data, width, height), [data]);

  return (
    <div ref={ref} className="py-4 flex justify-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible w-full"
        style={{ maxWidth: width, height: 'auto' }}
      >
        {rects.map((rect, i) => {
          const isTechGiant = TECH_GIANTS.includes(rect.employer);
          const color = isTechGiant ? '#4FC3F7' : '#18FFFF';
          const isHovered = hovered === i;

          return (
            <motion.g
              key={rect.employer}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Rectangle */}
              <motion.rect
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                rx={8}
                fill={color}
                fillOpacity={isHovered ? 0.35 : 0.2}
                stroke={color}
                strokeWidth={isHovered ? 1.5 : 0.5}
                strokeOpacity={isHovered ? 0.8 : 0.3}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  type: 'spring',
                  stiffness: 150,
                  damping: 15,
                }}
                style={{ transformOrigin: `${rect.x + rect.width / 2}px ${rect.y + rect.height / 2}px` }}
              />
              {/* Company name */}
              <motion.text
                x={rect.x + rect.width / 2}
                y={rect.y + rect.height / 2 - 8}
                textAnchor="middle"
                fontSize={rect.width > 100 ? 13 : 10}
                fontWeight={600}
                fill="white"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.9 } : {}}
                transition={{ delay: i * 0.08 + 0.3 }}
              >
                {rect.employer}
              </motion.text>
              {/* Approval count */}
              <motion.text
                x={rect.x + rect.width / 2}
                y={rect.y + rect.height / 2 + 12}
                textAnchor="middle"
                fontSize={rect.width > 100 ? 12 : 9}
                fontWeight={700}
                fill={color}
                fontFamily="'JetBrains Mono', monospace"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.8 } : {}}
                transition={{ delay: i * 0.08 + 0.4 }}
              >
                {(rect.approvals / 1000).toFixed(1)}K
              </motion.text>
              {/* Category tag */}
              {rect.width > 80 && (
                <motion.text
                  x={rect.x + rect.width / 2}
                  y={rect.y + rect.height / 2 + 28}
                  textAnchor="middle"
                  fontSize={8}
                  fill={color}
                  fillOpacity={0.5}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.08 + 0.5 }}
                >
                  {isTechGiant ? 'Tech Giant' : 'Outsourcing'}
                </motion.text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
