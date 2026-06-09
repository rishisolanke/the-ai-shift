import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { useIntersection } from '../hooks/useIntersection';
import { useMobile } from '../hooks/useMobile';
import { COLORS, CHART_THEME } from '../utils/colors';

const COST_BY_SUBSTANCE = [
  { name: 'Tobacco', cost: 300 },
  { name: 'Alcohol', cost: 249 },
  { name: 'Illicit drugs', cost: 193 },
];

const ALCOHOL_COST_BREAKDOWN = [
  { name: 'Lost productivity', value: 179, color: COLORS.red },
  { name: 'Healthcare', value: 28, color: COLORS.orange },
  { name: 'Criminal justice', value: 25, color: COLORS.yellow },
  { name: 'Other', value: 17, color: COLORS.green },
];

export default function EconomicCost() {
  const [ref] = useIntersection();
  const isMobile = useMobile();

  return (
    <section id="economic" ref={ref} className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-yellow">Dimension 5</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">The Economic Cost</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Substance misuse costs the United States more than $740 billion every year in healthcare, lost
            productivity, and crime. Most of that bill isn't medical — it's the value of work that never gets
            done. And it doesn't count the hardest cost to price: lives lost.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="$740B" label="Total annual US cost of substance misuse" source="NIDA" color="text-accent-red" calculationKey="hero.740b_cost" />
          <StatCard number="$249B" label="Annual cost of alcohol misuse" source="CDC" color="text-accent-orange" calculationKey="economic.cost_breakdown" />
          <StatCard number="$1.5T" label="Cost of the opioid epidemic in 2020 alone" source="US JEC" color="text-accent-red" calculationKey="economic.opioid_cost" />
          <StatCard number="72%" label="Of alcohol's cost is lost productivity" source="CDC" color="text-accent-yellow" calculationKey="economic.cost_breakdown" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Annual US Cost by Substance"
            subtitle="Billions of dollars per year"
            source="NIDA, Trends & Statistics: Costs of Substance Abuse"
            calculationKey="economic.cost_breakdown"
            summary="These three categories sum to roughly the $740B headline figure. Tobacco leads, but all three impose costs on the scale of a major federal program — every single year."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={COST_BY_SUBSTANCE} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis dataKey="name" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 10 : 12 }} />
                <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [`$${v} billion/year`, 'Cost']}
                />
                <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                  {COST_BY_SUBSTANCE.map((_, i) => (
                    <Cell key={i} fill={[COLORS.red, COLORS.orange, COLORS.yellow][i]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Where Alcohol's $249B Cost Goes"
            subtitle="The bill is mostly lost work, not hospital bills"
            source="CDC, Excessive Alcohol Use cost study"
            calculationKey="economic.cost_breakdown"
            summary="Nearly three-quarters of alcohol's economic toll comes from lost workplace productivity — absenteeism, impaired performance, and premature death. Direct healthcare spending is a relatively small slice."
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={ALCOHOL_COST_BREAKDOWN}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 80 : 110}
                  innerRadius={isMobile ? 45 : 65}
                  paddingAngle={2}
                  label={({ name, value }) => `${name}: $${value}B`}
                  labelLine={false}
                  fontSize={isMobile ? 9 : 11}
                >
                  {ALCOHOL_COST_BREAKDOWN.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.85} stroke={CHART_THEME.tooltipBg} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  formatter={(v, n) => [`$${v} billion`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span><InfoTooltip term="NIDA" /> puts the total annual US cost of substance misuse above $740 billion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span>The US Congress Joint Economic Committee valued the opioid epidemic at ~$1.5 trillion in 2020 alone</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>Most of the cost is indirect — lost productivity and premature death, not medical treatment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">-</span>
              <span>Every $1 invested in treatment saves an estimated $4 in healthcare and $7 in criminal-justice costs (NIDA)</span>
            </li>
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'NIDA — Costs of Substance Abuse (Trends & Statistics)', url: 'https://nida.nih.gov/research-topics/trends-statistics/costs-substance-abuse' },
          { name: 'CDC — Excessive Drinking Costs', url: 'https://www.cdc.gov/alcohol/features/excessive-drinking.html' },
          { name: 'US Joint Economic Committee — The Economic Toll of the Opioid Crisis', url: 'https://www.jec.senate.gov/' },
        ]} />
      </div>
    </section>
  );
}
