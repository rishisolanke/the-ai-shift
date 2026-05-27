import { useIntersection } from '../hooks/useIntersection';
import CalculationDropdown from './CalculationDropdown';
import { METHODOLOGY } from '../data/methodology';

export default function ChartContainer({ title, subtitle, source, calculationKey, children, className = '' }) {
  const [ref, isVisible] = useIntersection();
  const calculationText = calculationKey ? METHODOLOGY[calculationKey] : null;

  return (
    <div
      ref={ref}
      className={`card transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
      </div>

      <div className="w-full min-h-[300px]">{children}</div>

      {calculationText && <CalculationDropdown text={calculationText} />}

      {source && (
        <p className="mt-4 text-xs text-text-muted border-t border-white/[0.06] pt-3">
          Source: {source}
        </p>
      )}
    </div>
  );
}
