import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { useIntersection } from '../hooks/useIntersection';
import { useMobile } from '../hooks/useMobile';
import { COLORS, CHART_THEME } from '../utils/colors';

const TREATMENT_FUNNEL = [
  { stage: 'Met criteria for a SUD', people: 48.7 },
  { stage: 'Received any treatment', people: 12.8 },
  { stage: 'Treated at a specialty facility', people: 6.6 },
];

const MAT_SPLIT = [
  { name: 'Received medication', value: 22, color: COLORS.green },
  { name: 'Did not receive medication', value: 78, color: COLORS.red },
];

export default function Treatment() {
  const [ref] = useIntersection();
  const isMobile = useMobile();

  return (
    <section id="treatment" ref={ref} className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-yellow">Dimension 6</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">The Treatment Gap</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Addiction is treatable — but most people never get treated. Of the nearly 49 million Americans with
            a substance use disorder, only about one in four receive any care, and even fewer get the medications
            proven to save lives. The encouraging counterpoint: recovery is not just possible, it's common.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="1 in 4" label="Of people with a SUD receive treatment" source="SAMHSA NSDUH, 2023" color="text-accent-red" calculationKey="treatment.funnel" />
          <StatCard number="35.9M" label="Needed treatment but didn't get it" source="SAMHSA NSDUH, 2023" color="text-accent-red" calculationKey="treatment.funnel" />
          <StatCard number="~22%" label="Of people with OUD receive medication" source="Peer-reviewed studies" color="text-accent-orange" calculationKey="treatment.mat_gap" />
          <StatCard number="~70%" label="Of those who ever had a SUD are in recovery" source="SAMHSA" color="text-accent-green" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="The Treatment Funnel (US, 2023)"
            subtitle="Millions of people at each stage"
            source="SAMHSA, National Survey on Drug Use and Health 2023"
            calculationKey="treatment.funnel"
            summary="The drop-off is staggering: from 48.7 million who need help, to 12.8 million who get any treatment, to just 6.6 million treated at a specialty facility. The biggest single reason people give for not seeking care is that they don't believe they need it."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={TREATMENT_FUNNEL} layout="vertical" margin={{ left: isMobile ? 110 : 180, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}M`} />
                <YAxis type="category" dataKey="stage" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} width={isMobile ? 100 : 170} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [`${v} million`, 'People']}
                />
                <Bar dataKey="people" radius={[0, 4, 4, 0]}>
                  {TREATMENT_FUNNEL.map((_, i) => (
                    <Cell key={i} fill={[COLORS.yellow, COLORS.orange, COLORS.red][i]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Medication for Opioid Use Disorder"
            subtitle={<>Only ~1 in 5 with <InfoTooltip term="OUD" /> get <InfoTooltip term="MAT" /></>}
            source="Peer-reviewed analyses of treatment & insurance data"
            calculationKey="treatment.mat_gap"
            summary="Medications like buprenorphine and methadone cut the risk of overdose death by roughly half — yet the large majority of people with opioid use disorder never receive them, due to stigma, restrictive rules, and limited prescriber access."
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={MAT_SPLIT}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 80 : 110}
                  innerRadius={isMobile ? 45 : 65}
                  paddingAngle={2}
                  label={({ value }) => `${value}%`}
                  labelLine={false}
                  fontSize={isMobile ? 10 : 12}
                >
                  {MAT_SPLIT.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.85} stroke={CHART_THEME.tooltipBg} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  formatter={(v, n) => [`${v}%`, n]}
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
              <span>Roughly 75% of people with a substance use disorder receive no treatment in a given year</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-orange mt-1">-</span>
              <span>Life-saving <InfoTooltip term="MAT" /> reaches only about a fifth of people with opioid use disorder</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">-</span>
              <span>An estimated 7 in 10 people who ever had a SUD now consider themselves in recovery — addiction is not a life sentence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>The most common reason people give for not seeking treatment is not believing they need it</span>
            </li>
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'SAMHSA — 2023 NSDUH: Treatment for Substance Use', url: 'https://www.samhsa.gov/data/' },
          { name: 'NIDA — Effective Treatments for Opioid Addiction', url: 'https://nida.nih.gov/publications/effective-treatments-opioid-addiction' },
          { name: 'SAMHSA — Recovery and Recovery Support', url: 'https://www.samhsa.gov/find-help/recovery' },
        ]} />
      </div>
    </section>
  );
}
