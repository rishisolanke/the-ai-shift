import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/*
  Liquid Fill Bars — horizontal bars with animated wave-top fill.
  Each bar fills like liquid pouring in with a subtle wave animation.
*/

export default function SkillsLiquidBars({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const maxValue = Math.max(...data.map((d) => d.demand));

  return (
    <div ref={ref} className="space-y-4 py-4">
      {data.map((item, i) => {
        const fillPercent = (item.demand / maxValue) * 100;
        const barColor = '#4FC3F7';

        return (
          <div key={item.skill} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-text-secondary group-hover:text-white transition-colors">
                {item.skill}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#666] font-mono">
                  ${(item.median_pay / 1000).toFixed(0)}K
                </span>
                <span className="text-sm font-mono font-semibold text-white">
                  {(item.demand / 1000).toFixed(1)}K
                </span>
              </div>
            </div>

            {/* Bar container */}
            <div className="relative h-7 rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.04]">
              {/* Animated fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-lg"
                style={{ background: `linear-gradient(90deg, ${barColor}40, ${barColor}90)` }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${fillPercent}%` } : { width: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.15 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Wave effect at the fill edge */}
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-6"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.15 * i + 1 }}
                >
                  <svg
                    className="absolute right-[-12px] top-0 h-full w-6"
                    viewBox="0 0 24 28"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M0,0 Q12,7 0,14 Q12,21 0,28"
                      fill={`${barColor}60`}
                      initial={{ x: 0 }}
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.2,
                      }}
                    />
                  </svg>
                </motion.div>

                {/* Shimmer highlight */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['100% 0', '-100% 0'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.3 + 1.5,
                  }}
                />
              </motion.div>

              {/* Glow at fill edge */}
              <motion.div
                className="absolute top-0 bottom-0 w-1 rounded-full"
                style={{
                  background: barColor,
                  boxShadow: `0 0 12px ${barColor}, 0 0 4px ${barColor}`,
                }}
                initial={{ left: 0, opacity: 0 }}
                animate={isInView ? {
                  left: `calc(${fillPercent}% - 2px)`,
                  opacity: [0, 1, 0.7],
                } : {}}
                transition={{
                  duration: 1.2,
                  delay: 0.15 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center justify-end gap-4 mt-4 pt-2 border-t border-white/5">
        <span className="text-[10px] text-[#666]">Bar = Open Roles</span>
        <span className="text-[10px] text-[#666]">Right = Median Pay</span>
      </div>
    </div>
  );
}
