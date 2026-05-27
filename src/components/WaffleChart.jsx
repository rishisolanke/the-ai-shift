import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/*
  Waffle Chart — shows percentages as filled squares in a 10x10 grid.
  Each country gets its own mini grid. Used for "Fastest Growing AI Adoption."
*/

const GRID_SIZE = 10; // 10x10 = 100 squares

export default function WaffleChart({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  // Color gradient based on growth value
  const getColor = (value) => {
    if (value >= 35) return '#B388FF';
    if (value >= 25) return '#B388FF';
    if (value >= 18) return '#4FC3F7';
    return '#18FFFF';
  };

  return (
    <div ref={ref} className="py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {data.slice(0, 5).map((item, countryIdx) => {
          const filledCount = Math.round(item.growth);
          const color = getColor(item.growth);

          return (
            <div key={item.country} className="flex flex-col items-center">
              {/* Waffle grid */}
              <div className="grid grid-cols-10 gap-[2px]">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                  const row = Math.floor(i / GRID_SIZE);
                  const col = i % GRID_SIZE;
                  // Fill from bottom-left: reverse row order
                  const fillIndex = (GRID_SIZE - 1 - row) * GRID_SIZE + col;
                  const isFilled = fillIndex < filledCount;
                  // Stagger delay: bottom-left fills first
                  const delay = countryIdx * 0.15 + fillIndex * 0.008;

                  return (
                    <motion.div
                      key={i}
                      className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] rounded-[1.5px]"
                      style={{
                        background: isFilled ? color : 'rgba(255,255,255,0.04)',
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? {
                        opacity: isFilled ? 0.85 : 0.3,
                        scale: 1,
                      } : {}}
                      transition={{
                        duration: 0.15,
                        delay: isInView ? delay : 0,
                        ease: 'easeOut',
                      }}
                    />
                  );
                })}
              </div>
              {/* Country label */}
              <motion.div
                className="mt-3 text-center"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: countryIdx * 0.15 + 0.8 }}
              >
                <p className="text-xs font-semibold text-white">{item.country}</p>
                <p className="text-lg font-mono font-bold" style={{ color }}>
                  +{item.growth}%
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Remaining countries as compact list */}
      {data.length > 5 && (
        <motion.div
          className="mt-6 flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          {data.slice(5).map((item) => (
            <div key={item.country} className="flex items-center gap-2 text-xs text-text-secondary">
              <div className="w-2 h-2 rounded-full" style={{ background: getColor(item.growth) }} />
              <span>{item.country}</span>
              <span className="font-mono text-white">+{item.growth}%</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
