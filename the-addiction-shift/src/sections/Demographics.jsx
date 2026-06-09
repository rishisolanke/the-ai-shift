import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { useIntersection } from '../hooks/useIntersection';
import { useMobile } from '../hooks/useMobile';
import { COLORS, CHART_THEME } from '../utils/colors';

const OD_BY_AGE = [
  { age: '15–24', rate: 12.5 },
  { age: '25–34', rate: 45.7 },
  { age: '35–44', rate: 56.6 },
  { age: '45–54', rate: 48.3 },
  { age: '55–64', rate: 38.0 },
  { age: '65+', rate: 11.0 },
];

const OD_BY_RACE = [
  { group: 'Am. Indian / Alaska Native', rate: 65.2 },
  { group: 'Black', rate: 47.5 },
  { group: 'White', rate: 35.6 },
  { group: 'Hispanic', rate: 22.7 },
  { group: 'Asian', rate: 5.3 },
];

const VAPING_TREND = [
  { year: '2017', millions: 2.1 },
  { year: '2018', millions: 3.6 },
  { year: '2019', millions: 5.4 },
  { year: '2020', millions: 3.6 },
  { year: '2021', millions: 2.1 },
  { year: '2022', millions: 2.55 },
  { year: '2023', millions: 2.13 },
  { year: '2024', millions: 1.63 },
];

export default function Demographics() {
  const [ref] = useIntersection();
  const isMobile = useMobile();

  return (
    <section id="demographics" ref={ref} className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-orange">Dimension 4</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Who's Affected</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Addiction does not strike evenly. It overwhelmingly takes root in adolescence, hits men harder than
            women, and falls heaviest on communities already facing disadvantage. The overdose crisis has also
            shifted dramatically across racial lines over the past decade.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="~90%" label="Of SUDs begin before age 18" source="CASA Columbia" color="text-accent-red" calculationKey="demographics.age_onset" />
          <StatCard number="35–44" label="Age group with the highest overdose rate" source="CDC, 2022" color="text-accent-orange" calculationKey="demographics.od_by_age" />
          <StatCard number="~2x" label="Men vs women likelihood of a SUD" source="SAMHSA" color="text-accent-yellow" />
          <StatCard number="65 / 100K" label="Overdose rate among AI/AN — the highest" source="CDC, 2022" color="text-accent-red" calculationKey="demographics.by_race" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Overdose Death Rate by Age (US, 2022)"
            subtitle="Deaths per 100,000 people"
            source="CDC WONDER, age-specific overdose death rates 2022"
            calculationKey="demographics.od_by_age"
            summary="Overdose deaths concentrate among adults 35–44, the cohort that came of age as prescription opioids and then fentanyl spread. Both the very young and the elderly have far lower rates."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={OD_BY_AGE} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis dataKey="age" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} />
                <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [`${v} per 100K`, 'Overdose rate']}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {OD_BY_AGE.map((d, i) => (
                    <Cell key={i} fill={d.age === '35–44' ? COLORS.red : COLORS.orange} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Overdose Death Rate by Race/Ethnicity (US, 2022)"
            subtitle="Age-adjusted deaths per 100,000"
            source="CDC WONDER, age-adjusted overdose death rates 2022"
            calculationKey="demographics.by_race"
            summary="For years the opioid crisis was framed as a largely white, rural phenomenon. That has changed: American Indian/Alaska Native and Black Americans now have the highest overdose death rates, driven by fentanyl and gaps in treatment access."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={OD_BY_RACE} layout="vertical" margin={{ left: isMobile ? 110 : 160, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} />
                <YAxis type="category" dataKey="group" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} width={isMobile ? 100 : 150} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [`${v} per 100K`, 'Overdose rate']}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {OD_BY_RACE.map((_, i) => (
                    <Cell key={i} fill={COLORS.red} fillOpacity={0.85 - i * 0.13} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer
          title="US Youth E-Cigarette Use (Middle & High School)"
          subtitle="Current e-cigarette users, in millions"
          source="National Youth Tobacco Survey (CDC/FDA)"
          calculationKey="demographics.vaping_trend"
          summary="Youth vaping exploded to a peak of 5.4 million users in 2019, prompting flavor restrictions and enforcement. It has since fallen to about 1.6 million in 2024 — one of the clearer public-health wins of the period, even as nicotine pouches emerge as the next concern."
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={VAPING_TREND} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis dataKey="year" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} />
              <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}M`} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                labelStyle={{ color: CHART_THEME.axisPrimary }}
                formatter={(v) => [`${v} million`, 'Youth e-cig users']}
              />
              <Area type="monotone" dataKey="millions" stroke={COLORS.orange} fill={COLORS.orange} fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span>The adolescent brain is uniquely vulnerable — ~90% of addictions trace back to substance use that began before 18</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-orange mt-1">-</span>
              <span>The overdose crisis has shifted: <InfoTooltip term="CDC" /> data shows AI/AN and Black Americans now face the highest death rates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">-</span>
              <span>Youth vaping fell from 5.4M (2019) to 1.6M (2024) after regulatory action (<InfoTooltip term="NYTS" />)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>Men are roughly twice as likely as women to develop a substance use disorder</span>
            </li>
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'CDC WONDER — Drug Overdose Mortality by demographic', url: 'https://wonder.cdc.gov/' },
          { name: 'CDC/FDA — National Youth Tobacco Survey', url: 'https://www.cdc.gov/tobacco/data_statistics/surveys/nyts/' },
          { name: 'National Center on Addiction and Substance Abuse (CASA) — Adolescent Substance Use', url: 'https://www.centeronaddiction.org/' },
        ]} />
      </div>
    </section>
  );
}
