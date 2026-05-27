import { useEffect, useState } from 'react';
import { useIntersection } from '../hooks/useIntersection';
import CalculationDropdown from './CalculationDropdown';
import InfoTooltip from './InfoTooltip';
import { METHODOLOGY } from '../data/methodology';

const STATS = [
  { value: 92, suffix: 'M', label: 'Jobs displaced by 2030', source: 'World Economic Forum, 2025', color: 'text-accent-red', calcKey: 'hero.92m_displaced' },
  { value: 170, suffix: 'M', label: 'New jobs created', source: 'World Economic Forum, 2025', color: 'text-accent-green', calcKey: 'hero.170m_created' },
  { value: 285.9, suffix: 'B', prefix: '$', label: 'US AI investment in 2025', source: 'Stanford AI Index, 2026', color: 'text-accent-green', calcKey: 'hero.285b_investment' },
  { value: 945, suffix: ' TWh', label: 'Projected data center electricity by 2030', source: 'IEA, 2025', color: 'text-accent-yellow', calcKey: 'hero.945twh' },
  { value: 16.3, suffix: '%', label: 'Global AI adoption rate', source: 'Microsoft AI Diffusion, 2026', color: 'text-accent-yellow', calcKey: 'hero.16pct_adoption' },
  { value: 56, suffix: '%', label: 'AI skills wage premium', source: 'PwC, 2025', color: 'text-accent-green', calcKey: 'hero.56pct_premium' },
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
              The AI Shift
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-text-secondary font-light leading-relaxed">
            What is AI <em>actually</em> doing to the world? Not the hype, not the doom —
            just what the data says. This project analyzes <span className="text-text-primary font-semibold">12+ verified sources</span> across
            employment, economy, environment, and skills to find the real patterns.
          </p>
          <p className="mt-4 text-sm text-text-muted leading-relaxed max-w-2xl mx-auto">
            Every number on this page traces back to a public source. Click any
            <span className="text-accent-green mx-1">dotted-underlined term</span>
            for a plain-English definition, or expand
            <span className="text-accent-green mx-1">"How was this calculated?"</span>
            below any chart for methodology.
          </p>
          <p className="mt-3 text-xs text-text-faint">
            By Rushikesh Solanke
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-primary-card border border-white/[0.06] rounded-card p-6 text-center group hover:border-accent-green/20 transition-all duration-300"
            >
              <div className={`stat-number ${stat.color}`}>
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix}
                  start={isVisible}
                />
              </div>
              <p className="mt-2 text-sm text-text-secondary leading-tight">
                {stat.label}
                {stat.suffix === ' TWh' && <InfoTooltip term="TWh" />}
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
