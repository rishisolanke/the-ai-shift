import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LabelList } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { useMobile } from '../hooks/useMobile';
import { COLORS, CHART_THEME } from '../utils/colors';

const ADOPTION_BY_COUNTRY = [
  { country: 'UAE', adoption: 70, gdp_per_capita: 44316 },
  { country: 'Singapore', adoption: 63, gdp_per_capita: 65234 },
  { country: 'South Korea', adoption: 52, gdp_per_capita: 32255 },
  { country: 'Denmark', adoption: 48, gdp_per_capita: 67803 },
  { country: 'Finland', adoption: 46, gdp_per_capita: 53983 },
  { country: 'UK', adoption: 42, gdp_per_capita: 46125 },
  { country: 'India', adoption: 40, gdp_per_capita: 2389 },
  { country: 'Philippines', adoption: 38, gdp_per_capita: 3499 },
  { country: 'Germany', adoption: 36, gdp_per_capita: 51204 },
  { country: 'USA', adoption: 34, gdp_per_capita: 76330 },
  { country: 'Canada', adoption: 33, gdp_per_capita: 52051 },
  { country: 'Japan', adoption: 28, gdp_per_capita: 33815 },
  { country: 'France', adoption: 30, gdp_per_capita: 44408 },
  { country: 'Brazil', adoption: 22, gdp_per_capita: 8920 },
  { country: 'Nigeria', adoption: 18, gdp_per_capita: 2066 },
];

const FASTEST_GROWING = [
  { country: 'South Korea', growth: 43.2 },
  { country: 'Philippines', growth: 38.5 },
  { country: 'UAE', growth: 32.1 },
  { country: 'India', growth: 28.7 },
  { country: 'Singapore', growth: 24.3 },
  { country: 'Vietnam', growth: 22.8 },
  { country: 'Indonesia', growth: 21.4 },
  { country: 'Thailand', growth: 19.6 },
  { country: 'Brazil', growth: 17.2 },
  { country: 'Mexico', growth: 15.8 },
];

const AI_INVESTMENT = [
  { country: 'United States', investment: 285.9 },
  { country: 'China', investment: 12.4 },
  { country: 'United Kingdom', investment: 4.5 },
  { country: 'Germany', investment: 2.8 },
  { country: 'Canada', investment: 2.4 },
  { country: 'France', investment: 2.1 },
  { country: 'India', investment: 1.8 },
  { country: 'Israel', investment: 1.6 },
];

const CustomScatterLabel = ({ cx, cy, payload }) => (
  <text x={cx} y={cy - 10} textAnchor="middle" fill="#a0a0a0" fontSize={9}>{payload.country}</text>
);

export default function CountryAdoption() {
  const isMobile = useMobile();

  return (
    <section id="countries" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-yellow">Dimension 3</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Global AI Adoption</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            The UAE leads global AI adoption at 70%, while the US, despite being #1 in building AI,
            ranks outside the top 20 in actual usage. Building AI and using it are two very different things.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="70%+" label="UAE adoption (global #1)" source="Microsoft AI Diffusion, Q1 2026" color="text-accent-green" calculationKey="country.70pct_uae" />
          <StatCard number="16.3%" label="Global working-age population uses AI" source="Microsoft, 2026" color="text-accent-green" calculationKey="country.16pct_global" />
          <StatCard number="+43.2%" label="South Korea growth (6 months)" source="Microsoft AI Diffusion" color="text-accent-yellow" calculationKey="country.43pct_korea" />
          <StatCard number="$1.81T" label="Global AI market by 2030" source="Various estimates" color="text-accent-yellow" calculationKey="country.1_81t_market" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title={<>AI Adoption vs <InfoTooltip term="GDP" /> Per Capita</>}
            subtitle="Some developing countries are outpacing wealthy ones in AI usage"
            source="Microsoft AI Diffusion Q1 2026; World Bank GDP data"
            calculationKey="country.scatter_chart"
            summary="India has 40% AI adoption on a GDP per capita of just $2,389, while the US sits at only 34% with $76K GDP per capita. Being rich doesn't automatically mean you use AI more."
          >
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ left: 20, right: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis
                  type="number"
                  dataKey="gdp_per_capita"
                  name="GDP per Capita"
                  tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  label={{ value: 'GDP per Capita (USD)', position: 'bottom', fill: CHART_THEME.axisLabel, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="adoption"
                  name="AI Adoption"
                  tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: 'AI Adoption Rate', angle: -90, position: 'insideLeft', fill: CHART_THEME.axisLabel, fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  formatter={(value, name) => {
                    if (name === 'GDP per Capita') return [`$${value.toLocaleString()}`, name];
                    return [`${value}%`, name];
                  }}
                  labelFormatter={(_, payload) => payload[0]?.payload?.country || ''}
                />
                <Scatter data={ADOPTION_BY_COUNTRY} fill={COLORS.green} fillOpacity={0.7} shape={<CustomScatterLabel />}>
                  {ADOPTION_BY_COUNTRY.map((_, i) => (
                    <Cell key={i} fill={COLORS.green} fillOpacity={0.7} />
                  ))}
                </Scatter>
                <Scatter data={ADOPTION_BY_COUNTRY} fill={COLORS.green} fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Top 10 Fastest Growing AI Adoption"
            subtitle="6-month growth rate (H1 2025 → Q1 2026)"
            source="Microsoft AI Diffusion Report, Q1 2026"
            calculationKey="country.growth_chart"
            summary="South Korea's AI adoption grew 43% in just six months, and the Philippines isn't far behind at 39%. Most of the fastest growers are in Asia."
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={FASTEST_GROWING} layout="vertical" margin={{ left: isMobile ? 70 : 100, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `+${v}%`} />
                <YAxis type="category" dataKey="country" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} width={isMobile ? 60 : 90} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  formatter={(v) => [`+${v}%`, 'Growth']}
                />
                <Bar dataKey="growth" radius={[0, 4, 4, 0]} fill={COLORS.yellow} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer
          title="Private AI Investment by Country (2025)"
          subtitle="The US outspends China 23x on private AI investment"
          source="Stanford AI Index Report 2026"
          calculationKey="country.investment_chart"
          summary="The US poured $286B into private AI investment in 2025, which is more than every other country combined. China came in second at $12.4B, and everyone else is in single digits."
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={AI_INVESTMENT} layout="vertical" margin={{ left: isMobile ? 80 : 120, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
              <YAxis type="category" dataKey="country" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} width={isMobile ? 70 : 110} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                formatter={(v) => [`$${v}B`, 'Investment']}
              />
              <Bar dataKey="investment" radius={[0, 4, 4, 0]}>
                {AI_INVESTMENT.map((entry, i) => (
                  <Cell key={i} fill={i === 0 ? COLORS.green : COLORS.yellow} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <SourceCitation sources={[
          { name: 'Microsoft AI Diffusion Report, Q1 2026 Update', url: 'https://github.com/microsoft/ai-diffusion-report' },
          { name: 'Stanford HAI AI Index 2026', url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report' },
          { name: 'World Bank Open Data (GDP indicators)', url: 'https://data.worldbank.org' },
          { name: 'IMF AI Preparedness Index (AIPI)', url: 'https://www.imf.org/external/datamapper/datasets/AIPI' },
        ]} />
      </div>
    </section>
  );
}
