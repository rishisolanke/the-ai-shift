import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { COLORS, CHART_THEME } from '../utils/colors';

const SECTOR_ADOPTION = [
  { sector: 'Information & Technology', adoption: 37.2 },
  { sector: 'Finance & Insurance', adoption: 29.8 },
  { sector: 'Professional Services', adoption: 26.4 },
  { sector: 'Healthcare', adoption: 18.9 },
  { sector: 'Manufacturing', adoption: 16.3 },
  { sector: 'Retail Trade', adoption: 14.7 },
  { sector: 'Education', adoption: 13.2 },
  { sector: 'Transportation', adoption: 11.5 },
  { sector: 'Construction', adoption: 7.8 },
  { sector: 'Agriculture', adoption: 5.2 },
];

const SECTOR_RISK = [
  { sector: 'Manufacturing', risk: 'High', jobs_at_risk: '2M by 2026', detail: '20M by 2030' },
  { sector: 'Retail (Cashiers)', risk: 'High', jobs_at_risk: '65% facing automation', detail: 'Self-checkout, AI ordering' },
  { sector: 'Transportation', risk: 'High', jobs_at_risk: '1.5M driving jobs', detail: 'By 2030 (autonomous vehicles)' },
  { sector: 'Content/Media', risk: 'High', jobs_at_risk: '-50% writers', detail: 'Digital marketing by 2030' },
  { sector: 'Healthcare (Transcription)', risk: 'High', jobs_at_risk: '99% automated', detail: 'Already largely replaced' },
  { sector: 'Healthcare (Clinical)', risk: 'Low', jobs_at_risk: '+52% NP growth', detail: 'AI augments, not replaces' },
];

export default function SectorAnalysis() {
  return (
    <section id="sectors" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-green">Dimension 2</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Sector & Industry Analysis</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            AI adoption varies dramatically by sector — from 37% in tech to under 6% in agriculture.
            The impact on jobs depends heavily on the nature of work within each industry.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="~18%" label={<>US firms adopted AI (year-end 2025) <InfoTooltip term="Census BTOS" /></>} source="Census BTOS" color="text-accent-blue" calculationKey="sector.18pct_adoption" />
          <StatCard number="75%" label="Knowledge workers using AI tools" source="McKinsey, 2025" color="text-accent-purple" calculationKey="sector.75pct_knowledge" />
          <StatCard number="2M" label="Manufacturing jobs at risk by 2026" source="MIT/BU" color="text-accent-red" calculationKey="sector.2m_manufacturing" />
          <StatCard number="65%" label="Cashier jobs facing automation" source="Various estimates" color="text-accent-yellow" calculationKey="sector.65pct_cashier" />
        </div>

        <ChartContainer
          title="AI Adoption Rate by Sector"
          subtitle={<>Percentage of firms using AI, by <InfoTooltip term="NAICS" /> sector</>}
          source="Census Bureau, Business Trends and Outlook Survey (BTOS), 2025. Note: methodology changed Dec 3, 2025"
          calculationKey="sector.adoption_chart"
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={SECTOR_ADOPTION} layout="vertical" margin={{ left: 160, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="sector" tick={{ fill: CHART_THEME.axisPrimary, fontSize: 11 }} width={150} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                formatter={(v) => [`${v}%`, 'AI Adoption Rate']}
              />
              <Bar dataKey="adoption" radius={[0, 4, 4, 0]}>
                {SECTOR_ADOPTION.map((entry, i) => (
                  <Cell key={i} fill={entry.adoption > 20 ? COLORS.blue : entry.adoption > 10 ? COLORS.purple : COLORS.yellow} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Sector Vulnerability Assessment"
          subtitle="Industries most and least affected by AI automation"
          source="MIT/BU (manufacturing); Oxford Economics (2030 projections); BLS"
          className="mb-8"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-text-secondary font-medium">Sector</th>
                  <th className="text-left py-3 text-text-secondary font-medium">Risk Level</th>
                  <th className="text-left py-3 text-text-secondary font-medium">Impact</th>
                  <th className="text-left py-3 text-text-secondary font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {SECTOR_RISK.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.06]">
                    <td className="py-3 text-text-primary">{row.sector}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.risk === 'High' ? 'bg-accent-red/20 text-accent-red' : 'bg-accent-green/20 text-accent-green'
                      }`}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="py-3 text-text-secondary">{row.jobs_at_risk}</td>
                    <td className="py-3 text-text-secondary/60">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartContainer>

        <SourceCitation sources={[
          { name: 'Census Bureau, Business Trends and Outlook Survey (BTOS)', url: 'https://www.census.gov/hfp/btos/data_downloads' },
          { name: 'MIT/Boston University Research on Manufacturing Automation' },
          { name: 'Oxford Economics, How Robots Change the World (2030 projections)' },
          { name: 'McKinsey, State of AI November 2025' },
        ]} />
      </div>
    </section>
  );
}
