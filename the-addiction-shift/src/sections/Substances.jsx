import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { useIntersection } from '../hooks/useIntersection';
import { useMobile } from '../hooks/useMobile';
import { COLORS, CHART_THEME } from '../utils/colors';

const SUD_BY_SUBSTANCE = [
  { name: 'Alcohol', millions: 28.9 },
  { name: 'Marijuana', millions: 19.2 },
  { name: 'Prescription/illicit opioids', millions: 5.7 },
  { name: 'Prescription stimulants', millions: 1.5 },
  { name: 'Methamphetamine', millions: 1.6 },
  { name: 'Cocaine', millions: 1.4 },
];

const USE_VS_DISORDER = [
  { name: 'Alcohol', users: 134.7, disorder: 28.9 },
  { name: 'Marijuana', users: 61.9, disorder: 19.2 },
  { name: 'Opioids (misuse)', users: 8.6, disorder: 5.7 },
];

export default function Substances() {
  const [ref] = useIntersection();
  const isMobile = useMobile();

  return (
    <section id="substances" ref={ref} className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-yellow">Dimension 2</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Substance Use Disorders</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            In 2023, an estimated 48.7 million Americans aged 12 and older met clinical criteria for a
            substance use disorder. Despite the attention opioids get, alcohol is by far the most common —
            accounting for well over half of all cases.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="48.7M" label="Americans with any SUD (2023)" source="SAMHSA NSDUH" color="text-accent-red" calculationKey="hero.48m_sud" />
          <StatCard number="28.9M" label="With alcohol use disorder" source="SAMHSA NSDUH" color="text-accent-orange" calculationKey="substances.aud_29m" />
          <StatCard number="5.7M" label="With opioid use disorder" source="SAMHSA NSDUH" color="text-accent-red" calculationKey="substances.prevalence_chart" />
          <StatCard number="59%" label="Of all SUD cases involve alcohol" source="SAMHSA NSDUH" color="text-accent-yellow" calculationKey="substances.prevalence_chart" />
        </div>

        <ChartContainer
          title="Americans With a Substance Use Disorder, by Substance (2023)"
          subtitle={<>Past-year prevalence, ages 12+. A person can have more than one <InfoTooltip term="SUD" /></>}
          source="SAMHSA, National Survey on Drug Use and Health 2023"
          calculationKey="substances.prevalence_chart"
          summary="Alcohol dwarfs everything else at 28.9 million, followed by marijuana at 19.2 million. The stimulant and opioid categories are smaller in count but carry the highest overdose risk."
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={SUD_BY_SUBSTANCE} layout="vertical" margin={{ left: isMobile ? 110 : 170, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}M`} />
              <YAxis type="category" dataKey="name" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} width={isMobile ? 100 : 160} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                labelStyle={{ color: CHART_THEME.axisPrimary }}
                formatter={(v) => [`${v} million`, 'People with disorder']}
              />
              <Bar dataKey="millions" radius={[0, 4, 4, 0]}>
                {SUD_BY_SUBSTANCE.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? COLORS.orange : COLORS.yellow} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Use vs. Disorder: How Many Users Develop a Problem"
          subtitle="Millions of Americans (2023). Most users never develop a disorder — but opioids are the exception."
          source="SAMHSA NSDUH 2023 — past-year use vs. past-year use disorder"
          calculationKey="substances.prevalence_chart"
          summary="About 1 in 5 alcohol users and 1 in 3 marijuana users develop a disorder — but roughly two-thirds of people who misuse opioids do. That steep conversion rate is what makes opioids so dangerous relative to how many people use them."
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={USE_VS_DISORDER} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis dataKey="name" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 10 : 12 }} />
              <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}M`} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                labelStyle={{ color: CHART_THEME.axisPrimary }}
                formatter={(v, n) => [`${v} million`, n === 'users' ? 'Past-year users' : 'With a disorder']}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === 'users' ? 'Past-year users' : 'With a disorder')} />
              <Bar dataKey="users" fill={COLORS.green} fillOpacity={0.5} radius={[4, 4, 0, 0]} />
              <Bar dataKey="disorder" fill={COLORS.red} fillOpacity={0.85} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent-orange mt-1">-</span>
              <span><InfoTooltip term="AUD" /> affects ~28.9M Americans — more than every other substance combined</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>Marijuana use disorder (~19.2M) has grown alongside legalization and rising potency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span>Opioids have the highest conversion from use to disorder — a key driver of the overdose crisis (<InfoTooltip term="OUD" />)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>Most people who use substances never develop a disorder — addiction is the exception, not the rule</span>
            </li>
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'SAMHSA — 2023 National Survey on Drug Use and Health (NSDUH)', url: 'https://www.samhsa.gov/data/release/2023-national-survey-drug-use-and-health-nsduh-releases' },
          { name: 'NIDA — Drug Misuse and Addiction', url: 'https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction/drug-misuse-addiction' },
        ]} />
      </div>
    </section>
  );
}
