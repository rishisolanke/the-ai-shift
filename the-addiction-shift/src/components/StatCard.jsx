import CalculationDropdown from './CalculationDropdown';
import { METHODOLOGY } from '../data/methodology';

export default function StatCard({ number, label, source, color = 'text-accent-green', calculationKey }) {
  const calculationText = calculationKey ? METHODOLOGY[calculationKey] : null;

  return (
    <div className="card group hover:border-white/[0.12] transition-all">
      <div className={`stat-number ${color} break-words`}>{number}</div>
      <p className="mt-2 text-xs sm:text-sm text-text-secondary">{label}</p>
      {source && (
        <p className="mt-1 text-xs text-text-muted group-hover:text-text-secondary transition-colors">
          Source: {source}
        </p>
      )}
      {calculationText && <CalculationDropdown text={calculationText} compact />}
    </div>
  );
}
