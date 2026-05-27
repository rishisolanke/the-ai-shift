import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { COLORS, CHART_THEME } from '../utils/colors';

const INVESTMENT_VS_GDP = [
  { year: '2020', investment: 68, gdp_contribution: 0.1 },
  { year: '2021', investment: 95, gdp_contribution: 0.1 },
  { year: '2022', investment: 142, gdp_contribution: 0.2 },
  { year: '2023', investment: 220, gdp_contribution: 0.2 },
  { year: '2024', investment: 380, gdp_contribution: 0.3 },
  { year: '2025', investment: 520, gdp_contribution: 0.3 },
  { year: '2026', investment: 660, gdp_contribution: 0.4 },
];

const WAGE_PREMIUM = [
  { year: '2018', premium: 12 },
  { year: '2019', premium: 15 },
  { year: '2020', premium: 18 },
  { year: '2021', premium: 22 },
  { year: '2022', premium: 25 },
  { year: '2023', premium: 35 },
  { year: '2024', premium: 45 },
  { year: '2025', premium: 56 },
];

const HARDWARE_FLOW = [
  { step: 'AI Capex Spending (US)', value: 660, unit: 'B' },
  { step: 'Imported Components (75%)', value: 495, unit: 'B' },
  { step: 'Flows to Taiwan/Korea', value: 380, unit: 'B' },
  { step: 'US GDP Contribution', value: 'Near zero', unit: '' },
];

export default function EconomicParadox() {
  return (
    <section id="economic" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-orange">Dimension 6</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">The Economic Paradox</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Companies will spend around $660B on AI <InfoTooltip term="Capex" /> in 2026, but Goldman Sachs says AI has added
            "basically zero" to US <InfoTooltip term="GDP" /> so far. Why? Because 75% of that spending goes toward imported
            hardware, which ends up boosting Taiwan and Korea's economies instead.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number={<>~$660B</>} label={<>AI <InfoTooltip term="Capex" /> spending (2026)</>} source="Various estimates" color="text-accent-green" calculationKey="economic.660b_capex" />
          <StatCard number="~0%" label={<>AI contribution to US <InfoTooltip term="GDP" /> (2025)</>} source="Goldman Sachs" color="text-accent-red" calculationKey="economic.0pct_gdp" />
          <StatCard number="75%" label="Data center cost = imports" source="Goldman Sachs" color="text-accent-yellow" calculationKey="economic.75pct_imports" />
          <StatCard number="95%" label="AI pilots never past testing" source="MIT, 2025" color="text-accent-red" calculationKey="economic.95pct_pilots" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title={<>AI Investment vs <InfoTooltip term="GDP" /> Contribution</>}
            subtitle="Investment keeps climbing, but measurable economic output is still near zero"
            source="Goldman Sachs Global Investment Research (Hatzius); Stanford AI Index 2026"
            calculationKey="economic.investment_chart"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={INVESTMENT_VS_GDP} margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis dataKey="year" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                  label={{ value: 'AI Investment ($B)', angle: -90, position: 'insideLeft', fill: CHART_THEME.axisLabel, fontSize: 10 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 2]}
                  label={{ value: 'GDP Contribution (%)', angle: 90, position: 'insideRight', fill: CHART_THEME.axisLabel, fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                />
                <Bar yAxisId="left" dataKey="investment" fill={COLORS.green} fillOpacity={0.7} radius={[4, 4, 0, 0]} name="AI Investment ($B)" />
                <Line yAxisId="right" type="monotone" dataKey="gdp_contribution" stroke={COLORS.red} strokeWidth={2} name="GDP Contribution (%)" dot={{ fill: COLORS.red }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="AI Skills Wage Premium"
            subtitle="Workers with AI skills are earning more and more over their peers each year"
            source="PwC AI Jobs Barometer 2025"
            calculationKey="economic.wage_premium_chart"
          >
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={WAGE_PREMIUM} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis dataKey="year" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} />
                <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `+${v}%`} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  formatter={(v) => [`+${v}%`, 'Wage Premium']}
                />
                <defs>
                  <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="premium"
                  stroke={COLORS.green}
                  strokeWidth={3}
                  dot={{ fill: COLORS.green, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer
          title="The Import Leakage Problem"
          subtitle="Where data center hardware spending actually flows"
          source="Goldman Sachs analysis; supply chain estimates"
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
            {HARDWARE_FLOW.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-center">
                  <div className={`font-mono text-2xl font-bold ${i === 3 ? 'text-accent-red' : 'text-accent-green'}`}>
                    {typeof item.value === 'number' ? `$${item.value}B` : item.value}
                  </div>
                  <div className="text-xs text-text-secondary mt-1 max-w-[120px]">{item.step}</div>
                </div>
                {i < HARDWARE_FLOW.length - 1 && (
                  <div className="text-text-secondary/30 text-2xl hidden md:block">→</div>
                )}
              </div>
            ))}
          </div>
        </ChartContainer>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-3">More Context</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>PwC projects AI could boost global <InfoTooltip term="GDP" /> by 15% by 2035 ($15.7T), but that's potential, not what's actually happened yet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>McKinsey estimates $4.4T in annual productivity growth potential from generative AI</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span>MIT found 95% of AI pilot programs never made it past the testing phase (roughly $30-40B sitting in stalled projects)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>IDC forecasts total AI spending reaching $632B by 2028</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">-</span>
              <span>CEPR research shows a 10 percentage point increase in AI adoption correlates with +0.6pp productivity growth</span>
            </li>
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'Goldman Sachs, Gen AI: Too Much Spend, Too Little Benefit? (2025)' },
          { name: 'PwC AI Jobs Barometer 2025', url: 'https://www.pwc.com/gx/en/issues/artificial-intelligence/job-barometer/2025/report.pdf' },
          { name: 'Stanford HAI AI Index 2026 (Private Investment)', url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report' },
          { name: 'MIT Technology Review, AI Pilot Programs Study (2025)' },
        ]} />
      </div>
    </section>
  );
}
