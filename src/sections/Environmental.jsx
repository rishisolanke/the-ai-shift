import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { COLORS, CHART_THEME } from '../utils/colors';

const ENERGY_TIMELINE = [
  { year: 2020, twh: 260, type: 'actual' },
  { year: 2021, twh: 285, type: 'actual' },
  { year: 2022, twh: 330, type: 'actual' },
  { year: 2023, twh: 375, type: 'actual' },
  { year: 2024, twh: 415, type: 'actual' },
  { year: 2025, twh: 500, type: 'projected' },
  { year: 2026, twh: 580, type: 'projected' },
  { year: 2027, twh: 670, type: 'projected' },
  { year: 2028, twh: 760, type: 'projected' },
  { year: 2029, twh: 850, type: 'projected' },
  { year: 2030, twh: 945, type: 'projected' },
];

const EMISSIONS_COMPARISON = [
  { label: 'AI Data Centers CO₂ (2030 low est.)', value: 24, unit: 'Mt/yr', color: COLORS.red },
  { label: 'AI Data Centers CO₂ (2030 high est.)', value: 44, unit: 'Mt/yr', color: COLORS.red },
  { label: 'Equivalent: Million Cars', value: 10, unit: 'M cars', color: COLORS.yellow },
  { label: 'AI-Enabled Reductions (2035)', value: 1400, unit: 'Mt', color: COLORS.green },
];

const PARADOX_DATA = [
  { category: 'CO₂ Added by AI (per year by 2030)', value: 44, type: 'added' },
  { category: 'CO₂ Reduced by AI (per year by 2035)', value: 1400, type: 'reduced' },
];

export default function Environmental() {
  return (
    <section id="environment" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-yellow">Dimension 4</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Environmental Impact</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            By 2030, data centers will use more electricity than all of Japan. At the same time,
            AI could help cut 1,400 <InfoTooltip term="Mt CO₂" /> per year if it's used for energy optimization.
            That's the tradeoff.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number={<>415 <InfoTooltip term="TWh" /></>} label="Data center electricity (2024)" source="IEA, 2025" color="text-accent-yellow" calculationKey="env.415twh_current" />
          <StatCard number="945 TWh" label="Projected by 2030" source="IEA, 2025" color="text-accent-red" calculationKey="env.945twh_projected" />
          <StatCard number={<>24-44 <InfoTooltip term="Mt CO₂" /></>} label="CO₂ per year by 2030" source="Cornell/Xiao, 2025" color="text-accent-red" calculationKey="env.24_44mt_co2" />
          <StatCard number="1,400 Mt" label="Potential CO₂ reduction by AI" source="IEA, 2025" color="text-accent-green" calculationKey="env.1400mt_reduction" />
        </div>

        <ChartContainer
          title="Data Center Electricity Consumption (2020-2030)"
          subtitle={<>Actual through 2024, <InfoTooltip term="IEA" /> projections 2025-2030. 945 TWh exceeds Japan's total consumption.</>}
          source="International Energy Agency (IEA), Energy and AI Report, April 2025"
          calculationKey="env.energy_chart"
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={ENERGY_TIMELINE} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis dataKey="year" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} />
              <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v} TWh`} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                formatter={(v, _, props) => [`${v} TWh`, props.payload.type === 'projected' ? 'Projected' : 'Actual']}
              />
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.yellow} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.yellow} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="twh"
                stroke={COLORS.yellow}
                fill="url(#energyGradient)"
                strokeWidth={2}
                strokeDasharray={(entry) => entry?.type === 'projected' ? '5 5' : '0'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="The Green Paradox"
            subtitle="AI adds emissions but also enables large-scale reductions"
            source="Cornell/Xiao 2025 (emissions); IEA 2025 (reductions)"
          >
            <div className="space-y-6 py-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">CO₂ Added by AI (<InfoTooltip term="Mt CO₂" />/yr by 2030)</span>
                  <span className="text-accent-red font-mono">24-44 Mt</span>
                </div>
                <div className="h-4 bg-primary rounded-full overflow-hidden">
                  <div className="h-full bg-accent-red/70 rounded-full" style={{ width: '3.1%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">CO₂ Reduction Potential by AI (Mt/yr by 2035)</span>
                  <span className="text-accent-green font-mono">1,400 Mt</span>
                </div>
                <div className="h-4 bg-primary rounded-full overflow-hidden">
                  <div className="h-full bg-accent-green/70 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <p className="text-xs text-text-secondary/60 mt-4">
                For scale, the reduction potential is roughly 32x larger than the emissions AI adds.
                If applied to energy grids, farming, and materials science, AI could offset its own footprint many times over.
              </p>
            </div>
          </ChartContainer>

          <ChartContainer
            title="Key Environmental Metrics"
            subtitle="Data center environmental footprint"
            source="Goldman Sachs; Cornell/Xiao Nature Sustainability 2025; Google 2025 Environmental Report"
          >
            <div className="space-y-4 py-4">
              {[
                { label: 'Fossil fuel share of new DC power', value: '60%', source: 'Goldman Sachs', color: 'text-accent-red' },
                { label: 'Additional carbon from fossil DCs', value: '+220M tons', source: 'Goldman Sachs', color: 'text-accent-red' },
                { label: 'Water consumption by 2030', value: '731-1,125M m³/yr', source: 'Cornell/Xiao', color: 'text-accent-yellow' },
                { label: 'Equivalent household water use', value: '6-10M Americans', source: 'Cornell/Xiao', color: 'text-accent-yellow' },
                { label: 'Google GHG emissions YoY (2023)', value: '+13%', source: 'Google Env Report', color: 'text-accent-red' },
                { label: 'Global electricity share (2024)', value: '1.5%', source: 'IEA', color: 'text-accent-yellow' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-sm text-text-secondary">{item.label}</span>
                  <div className="text-right">
                    <span className={`font-mono font-medium ${item.color}`}>{item.value}</span>
                    <span className="text-xs text-text-secondary/40 ml-2">({item.source})</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartContainer>
        </div>

        <SourceCitation sources={[
          { name: 'IEA, Energy and AI Report, April 2025', url: 'https://iea.blob.core.windows.net/assets/dd7c2387-2f60-4b60-8c5f-6563b6aa1e4c/EnergyandAI.pdf' },
          { name: 'Cornell/Xiao, Nature Sustainability 2025, AI server CO₂ and water projections', url: 'https://www.nature.com/articles/s41893-025-01681-y' },
          { name: 'EPA eGRID 2023 rev2 (Grid Emissions Data)', url: 'https://www.epa.gov/egrid/download-data' },
          { name: 'Google 2025 Environmental Report', url: 'https://www.gstatic.com/gumdrop/sustainability/google-2025-environmental-report.pdf' },
        ]} />
      </div>
    </section>
  );
}
