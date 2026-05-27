import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { useIntersection } from '../hooks/useIntersection';
import { COLORS, CHART_THEME } from '../utils/colors';

const DECLINING_JOBS = [
  { name: 'Data Entry Keyers', change: -32.6, wage: 37380 },
  { name: 'Word Processors & Typists', change: -36.0, wage: 42920 },
  { name: 'Telephone Operators', change: -20.7, wage: 37960 },
  { name: 'Legal Secretaries', change: -20.0, wage: 48780 },
  { name: 'Executive Secretaries', change: -19.4, wage: 67510 },
  { name: 'Bookkeeping Clerks', change: -5.2, wage: 45560 },
  { name: 'Tellers', change: -15.4, wage: 36310 },
  { name: 'Postal Service Mail Carriers', change: -11.3, wage: 53440 },
  { name: 'Print Binding Workers', change: -17.5, wage: 36150 },
  { name: 'File Clerks', change: -14.3, wage: 37090 },
];

const GROWING_JOBS = [
  { name: 'Nurse Practitioners', change: 52.0, wage: 121610 },
  { name: 'Data Scientists', change: 36.0, wage: 108020 },
  { name: 'Information Security Analysts', change: 33.0, wage: 120360 },
  { name: 'Statisticians', change: 32.0, wage: 99960 },
  { name: 'Software Developers', change: 17.0, wage: 127260 },
  { name: 'Physician Assistants', change: 28.0, wage: 126010 },
  { name: 'Wind Turbine Technicians', change: 60.0, wage: 61770 },
  { name: 'Solar Photovoltaic Installers', change: 48.0, wage: 48800 },
  { name: 'Home Health Aides', change: 21.0, wage: 33530 },
  { name: 'Medical Assistants', change: 14.0, wage: 38270 },
];

const LAYOFFS_TIMELINE = [
  { year: '2020', layoffs: 80998 },
  { year: '2021', layoffs: 15823 },
  { year: '2022', layoffs: 159684 },
  { year: '2023', layoffs: 262735 },
  { year: '2024', layoffs: 152028 },
  { year: '2025', layoffs: 54694, note: 'AI-cited (Congressional Report)' },
];

export default function Employment() {
  const [ref, isVisible] = useIntersection();

  return (
    <section id="employment" ref={ref} className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-green">Dimension 1</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Employment & Job Displacement</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            AI will displace 92 million jobs globally by 2030, but it will also create 170 million new ones.
            That's a net gain of 78 million. The catch is that the people losing jobs and the people getting new ones
            are often not the same people.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="92M" label="Jobs displaced by 2030" source="WEF, 2025" color="text-accent-red" calculationKey="employment.92m_displaced" />
          <StatCard number="170M" label="New jobs created" source="WEF, 2025" color="text-accent-green" calculationKey="employment.170m_created" />
          <StatCard number="40%" label="Global jobs exposed to AI" source="IMF, 2024" color="text-accent-yellow" calculationKey="employment.40pct_exposed" />
          <StatCard number="54,694" label="AI-cited layoffs in 2025" source="Congressional Report, 2025" color="text-accent-red" calculationKey="employment.54k_layoffs" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Fastest Declining Occupations (2024-2034)"
            subtitle={<>BLS <InfoTooltip term="BLS" /> projections. Note: these do NOT model AI-specific disruption</>}
            source="Bureau of Labor Statistics, Employment Projections 2024-2034"
            calculationKey="employment.declining_chart"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={DECLINING_JOBS} layout="vertical" margin={{ left: 140, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: CHART_THEME.axisPrimary, fontSize: 11 }} width={130} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [`${v}%`, 'Projected Change']}
                />
                <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                  {DECLINING_JOBS.map((_, i) => (
                    <Cell key={i} fill={COLORS.red} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Fastest Growing Occupations (2024-2034)"
            subtitle="AI-adjacent and healthcare roles lead growth"
            source="Bureau of Labor Statistics, Employment Projections 2024-2034"
            calculationKey="employment.growing_chart"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={GROWING_JOBS} layout="vertical" margin={{ left: 160, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: CHART_THEME.axisPrimary, fontSize: 11 }} width={150} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [`${v}%`, 'Projected Change']}
                />
                <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                  {GROWING_JOBS.map((_, i) => (
                    <Cell key={i} fill={COLORS.green} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer
          title="Tech Layoffs Timeline (2020-2025)"
          subtitle="2025 figure represents AI-cited layoffs specifically"
          source="Kaggle Tech Layoffs Dataset; Congressional AI Jobs Report (Dec 2025)"
          calculationKey="employment.layoffs_chart"
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={LAYOFFS_TIMELINE} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis dataKey="year" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} />
              <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                labelStyle={{ color: CHART_THEME.axisPrimary }}
                formatter={(v) => [v.toLocaleString(), 'Layoffs']}
              />
              <Area
                type="monotone"
                dataKey="layoffs"
                stroke={COLORS.red}
                fill={COLORS.red}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span><InfoTooltip term="WEF" /> projects 92M jobs displaced but 170M created globally by 2030, so net +78M (WEF Future of Jobs 2025)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>Goldman Sachs estimates 6-7% of US workforce displaced during transition period</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span><InfoTooltip term="IMF" /> estimates 40% of global jobs exposed to AI; 60% in advanced economies (IMF, 2024)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>Data entry clerks face highest automation risk at 95% (<InfoTooltip term="BLS" />, 2024)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">-</span>
              <span>Nurse practitioners see +52% projected growth, data scientists +36% (BLS, 2024)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>40% of employees highly concerned about AI job loss, up from 28% (Mercer, 2026)</span>
            </li>
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'World Economic Forum, Future of Jobs Report 2025', url: 'https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf' },
          { name: 'Bureau of Labor Statistics, Employment Projections 2024-2034', url: 'https://www.bls.gov/emp/tables.htm' },
          { name: 'Congressional AI Jobs Report, December 2025', url: 'https://foushee.house.gov/imo/media/doc/foushee_ai_jobs_report_2025.pdf' },
          { name: 'IMF Working Paper: Gen-AI - Artificial Intelligence and the Future of Work', url: 'https://www.imf.org/en/Publications/Staff-Discussion-Notes/Issues/2024/01/14/Gen-AI-Artificial-Intelligence-and-the-Future-of-Work-542379' },
        ]} />
      </div>
    </section>
  );
}
