import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { useIntersection } from '../hooks/useIntersection';
import { useMobile } from '../hooks/useMobile';
import { COLORS, CHART_THEME } from '../utils/colors';

const OVERDOSE_TREND = [
  { year: '2015', deaths: 52404 },
  { year: '2016', deaths: 63632 },
  { year: '2017', deaths: 70237 },
  { year: '2018', deaths: 67367 },
  { year: '2019', deaths: 70630 },
  { year: '2020', deaths: 91799 },
  { year: '2021', deaths: 106699 },
  { year: '2022', deaths: 107941 },
  { year: '2023', deaths: 105007 },
  { year: '2024', deaths: 80391, note: 'Provisional' },
];

const DRUGS_INVOLVED = [
  { name: 'Synthetic opioids (fentanyl)', deaths: 73838 },
  { name: 'Psychostimulants (meth)', deaths: 34022 },
  { name: 'Cocaine', deaths: 27569 },
  { name: 'Prescription opioids', deaths: 14716 },
  { name: 'Heroin', deaths: 5871 },
];

const DEATHS_BY_CAUSE = [
  { name: 'Tobacco / smoking', deaths: 480000, color: COLORS.red },
  { name: 'Excessive alcohol', deaths: 178000, color: COLORS.orange },
  { name: 'Drug overdose', deaths: 107941, color: COLORS.yellow },
];

export default function Mortality() {
  const [ref] = useIntersection();
  const isMobile = useMobile();

  return (
    <section id="mortality" ref={ref} className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-red">Dimension 1</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">The Human Toll</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Addiction's most visible cost is measured in deaths. In the US, overdose deaths climbed for a
            decade before peaking near 108,000 — driven almost entirely by fentanyl — then fell sharply in 2024.
            But overdoses are only part of the picture. Tobacco and alcohol quietly kill far more people every year.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="107,941" label="US overdose deaths at the 2022 peak" source="CDC, 2022" color="text-accent-red" calculationKey="hero.107k_od" />
          <StatCard number="480K" label="Annual US deaths from smoking" source="CDC" color="text-accent-red" calculationKey="mortality.tobacco_deaths" />
          <StatCard number="178K" label="Annual US deaths from alcohol" source="CDC" color="text-accent-orange" calculationKey="mortality.alcohol_deaths" />
          <StatCard number="-26%" label="Drop in overdose deaths in 2024" source="CDC provisional" color="text-accent-green" calculationKey="mortality.od_trend" />
        </div>

        <ChartContainer
          title="US Drug Overdose Deaths (2015–2024)"
          subtitle="A decade-long climb, then the first major decline"
          source="CDC WONDER & National Center for Health Statistics. 2024 figure is provisional."
          calculationKey="mortality.od_trend"
          summary="Deaths more than doubled from 52K in 2015 to a peak near 108K in 2022, accelerating sharply when illicit fentanyl entered the drug supply around 2020. The 2024 drop to ~80K — credited to naloxone access, treatment expansion, and a changing drug supply — is the steepest decline ever recorded."
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={OVERDOSE_TREND} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis dataKey="year" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} />
              <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                labelStyle={{ color: CHART_THEME.axisPrimary }}
                formatter={(v) => [v.toLocaleString(), 'Deaths']}
              />
              <Area type="monotone" dataKey="deaths" stroke={COLORS.red} fill={COLORS.red} fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Drugs Involved in Overdose Deaths (2022)"
            subtitle={<>Categories overlap — many deaths involve more than one drug</>}
            source="CDC, Drug Overdose Deaths 2022"
            calculationKey="mortality.drug_breakdown"
            summary="Synthetic opioids — almost entirely illicit fentanyl — were involved in roughly 74,000 deaths, more than double any other category. Meth and cocaine deaths have surged too, often because they're laced with fentanyl."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={DRUGS_INVOLVED} layout="vertical" margin={{ left: isMobile ? 90 : 150, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} width={isMobile ? 85 : 140} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [v.toLocaleString(), 'Deaths']}
                />
                <Bar dataKey="deaths" radius={[0, 4, 4, 0]}>
                  {DRUGS_INVOLVED.map((_, i) => (
                    <Cell key={i} fill={COLORS.red} fillOpacity={0.85 - i * 0.12} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Annual US Deaths by Substance"
            subtitle="The legal substances do the most damage"
            source="CDC (smoking, alcohol, overdose mortality)"
            calculationKey="mortality.tobacco_deaths"
            summary="Overdoses dominate headlines, but tobacco kills more than four times as many Americans each year, and alcohol nearly twice as many. The deadliest substances are the ones sold legally on every corner."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={DEATHS_BY_CAUSE} layout="vertical" margin={{ left: isMobile ? 90 : 120, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} width={isMobile ? 85 : 110} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [v.toLocaleString(), 'Deaths/year']}
                />
                <Bar dataKey="deaths" radius={[0, 4, 4, 0]}>
                  {DEATHS_BY_CAUSE.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span>US overdose deaths peaked at ~108,000 in 2022, then fell ~26% in 2024 — the largest one-year decline on record (<InfoTooltip term="CDC" />)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span><InfoTooltip term="Fentanyl" /> is involved in roughly 7 of every 10 overdose deaths</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-orange mt-1">-</span>
              <span>Tobacco (~480K) and alcohol (~178K) each kill far more Americans annually than overdoses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">-</span>
              <span>Wider <InfoTooltip term="Naloxone" /> access is one of the leading explanations for the 2024 turnaround</span>
            </li>
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'CDC WONDER — Drug Overdose Mortality', url: 'https://wonder.cdc.gov/' },
          { name: 'CDC — Provisional Drug Overdose Death Counts (NCHS)', url: 'https://www.cdc.gov/nchs/nvss/vsrr/drug-overdose-data.htm' },
          { name: 'CDC — Smoking & Tobacco Use, Fast Facts', url: 'https://www.cdc.gov/tobacco/data_statistics/fact_sheets/fast_facts/index.htm' },
          { name: 'CDC — Alcohol-Related Disease Impact (ARDI)', url: 'https://www.cdc.gov/alcohol/ardi/index.html' },
        ]} />
      </div>
    </section>
  );
}
