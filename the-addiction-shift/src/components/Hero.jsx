import { useEffect, useState } from 'react';
import { useIntersection } from '../hooks/useIntersection';
import CalculationDropdown from './CalculationDropdown';
import InfoTooltip from './InfoTooltip';
import { METHODOLOGY } from '../data/methodology';

const STATS = [
  { value: 48.7, suffix: 'M', label: 'Americans with a substance use disorder', source: 'SAMHSA NSDUH, 2023', color: 'text-accent-red', calcKey: 'hero.48m_sud' },
  { value: 107, suffix: 'K', label: 'Peak annual US overdose deaths (2022)', source: 'CDC WONDER', color: 'text-accent-red', calcKey: 'hero.107k_od' },
  { value: 740, suffix: 'B', prefix: '$', label: 'Annual US cost of substance misuse', source: 'NIDA', color: 'text-accent-yellow', calcKey: 'hero.740b_cost' },
  { value: 23, suffix: '%', label: 'Of those with a SUD who get treatment', source: 'SAMHSA NSDUH, 2023', color: 'text-accent-yellow', calcKey: 'hero.23pct_treatment' },
  { value: 8, suffix: 'M', label: 'Annual global deaths from tobacco', source: 'WHO', color: 'text-accent-red', calcKey: 'hero.8m_tobacco' },
  { value: 2.4, suffix: ' hrs', label: 'Avg daily social media use worldwide', source: 'DataReportal, 2024', color: 'text-accent-yellow', calcKey: 'hero.24hr_social' },
];

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2000, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, value, duration]);

  const display = Number.isInteger(value) ? Math.round(count) : count.toFixed(1);
  return <span>{prefix}{display}{suffix}</span>;
}

export default function Hero() {
  const [ref, isVisible] = useIntersection();

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent-green/[0.04] via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-green/[0.03] rounded-full blur-[120px]" />

      <div className="section-container relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">
              The Addiction Atlas
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-text-secondary font-light leading-relaxed">
            I pulled together <span className="text-text-primary font-semibold">public-health data</span> to
            map what addiction actually looks like by the numbers — across drugs, alcohol, tobacco, and the
            newer behavioral kind. Here's what I found: nearly 49 million Americans have a substance use disorder,
            yet only about 1 in 4 get any treatment. US overdose deaths peaked near 107,000 — driven by fentanyl —
            before a sharp 2024 decline. Tobacco still kills 8 million people a year worldwide. Alcohol remains the
            most common addiction by far. And screens have introduced a new front: teens now average over 8 hours of
            screen media a day. The scale is enormous, but so is the gap between who needs help and who receives it.
          </p>
          <p className="mt-4 text-sm text-text-muted leading-relaxed max-w-2xl mx-auto">
            Every number on this page links back to a public source. Click any
            <span className="text-accent-green mx-1">dotted-underlined term</span>
            for a definition, or expand
            <span className="text-accent-green mx-1">"How was this calculated?"</span>
            under any chart for the full methodology.
          </p>
          <p className="mt-3 text-xs text-text-faint">
            By Rushikesh Solanke
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-primary-card border border-white/[0.06] rounded-card p-3 sm:p-6 text-center group hover:border-accent-green/20 transition-all duration-300"
            >
              <div className={`stat-number ${stat.color} break-words`}>
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix}
                  start={isVisible}
                />
              </div>
              <p className="mt-2 text-sm text-text-secondary leading-tight">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                {stat.source}
              </p>
              {METHODOLOGY[stat.calcKey] && (
                <CalculationDropdown text={METHODOLOGY[stat.calcKey]} compact />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
