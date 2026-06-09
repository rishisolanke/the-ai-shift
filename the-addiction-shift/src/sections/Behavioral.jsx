import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { useIntersection } from '../hooks/useIntersection';
import { useMobile } from '../hooks/useMobile';
import { COLORS, CHART_THEME } from '../utils/colors';

const SCREEN_TIME = [
  { group: 'Kids (0–8)', hours: 2.5 },
  { group: 'Tweens (8–12)', hours: 5.5 },
  { group: 'Teens (13–18)', hours: 8.6 },
];

const BEHAVIORAL_PREVALENCE = [
  { name: 'Internet addiction', pct: 7.0 },
  { name: 'Problematic smartphone use', pct: 6.3 },
  { name: 'Problematic social media use', pct: 5.0 },
  { name: 'Gaming disorder', pct: 3.0 },
  { name: 'Gambling disorder', pct: 1.5 },
];

const SOCIAL_MINUTES = [
  { year: '2015', minutes: 106 },
  { year: '2017', minutes: 135 },
  { year: '2019', minutes: 142 },
  { year: '2021', minutes: 147 },
  { year: '2022', minutes: 151 },
  { year: '2024', minutes: 143 },
];

export default function Behavioral() {
  const [ref] = useIntersection();
  const isMobile = useMobile();

  return (
    <section id="behavioral" ref={ref} className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-yellow">Dimension 3</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Behavioral & Digital Addiction</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Addiction isn't only chemical. Gambling and gaming are now formally recognized disorders, and
            screens have created a new battleground for compulsive behavior. The science is younger and the
            definitions are contested — but the time we spend is not in doubt.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="8.6 hrs" label="Daily screen media for US teens" source="Common Sense Media" color="text-accent-red" calculationKey="behavioral.screen_time" />
          <StatCard number="2h 23m" label="Avg daily social media use worldwide" source="DataReportal, 2024" color="text-accent-yellow" calculationKey="hero.24hr_social" />
          <StatCard number="~144" label="Times the average person checks their phone/day" source="Asurion" color="text-accent-yellow" />
          <StatCard number="~2.5M" label="US adults with severe gambling problems" source="NCPG" color="text-accent-red" calculationKey="behavioral.prevalence" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Daily Screen Media Use by Age (US)"
            subtitle="Entertainment screen time, excluding school and homework"
            source="Common Sense Media, Census of Media Use"
            calculationKey="behavioral.screen_time"
            summary="By the teen years, US kids average over 8.5 hours a day of entertainment screen media — more time than they spend asleep or in school. Use roughly triples between early childhood and adolescence."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={SCREEN_TIME} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis dataKey="group" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} />
                <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}h`} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [`${v} hours/day`, 'Screen media']}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                  {SCREEN_TIME.map((_, i) => (
                    <Cell key={i} fill={COLORS.yellow} fillOpacity={0.55 + i * 0.2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Estimated Prevalence of Behavioral Addictions"
            subtitle={<>Share of population, best-available estimates. Only <InfoTooltip term="Gaming disorder" /> and gambling are formal diagnoses.</>}
            source="Peer-reviewed meta-analyses; National Council on Problem Gambling"
            calculationKey="behavioral.prevalence"
            summary="Estimates vary widely by definition and screening tool, so these are ranges, not precise counts. Even at the low end, problematic internet and phone use affect a meaningful share of the global population."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={BEHAVIORAL_PREVALENCE} layout="vertical" margin={{ left: isMobile ? 110 : 170, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 9 : 11 }} width={isMobile ? 100 : 160} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  labelStyle={{ color: CHART_THEME.axisPrimary }}
                  formatter={(v) => [`~${v}%`, 'Estimated prevalence']}
                />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {BEHAVIORAL_PREVALENCE.map((_, i) => (
                    <Cell key={i} fill={COLORS.yellow} fillOpacity={0.85 - i * 0.1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer
          title="Average Daily Social Media Use Worldwide (minutes)"
          subtitle="Per internet user. Steady growth through the 2010s, now plateaued."
          source="DataReportal / GWI, Global Digital Reports"
          calculationKey="behavioral.social_minutes"
          summary="Daily social media use climbed from under 2 hours in 2015 to a peak above 2.5 hours, then settled near 2h 23m. The growth curve flattening doesn't mean the pull weakened — platforms have shifted from adding minutes to deepening engagement."
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={SOCIAL_MINUTES} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis dataKey="year" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} />
              <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}m`} domain={[80, 160]} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                labelStyle={{ color: CHART_THEME.axisPrimary }}
                formatter={(v) => [`${v} minutes/day`, 'Social media']}
              />
              <Line type="monotone" dataKey="minutes" stroke={COLORS.green} strokeWidth={2} dot={{ fill: COLORS.green, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span>US teens average 8.6 hours/day of entertainment screen time, linked in research to rising anxiety and sleep loss</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>The <InfoTooltip term="WHO" /> formally recognized <InfoTooltip term="Gaming disorder" /> in 2019; gambling disorder has been recognized far longer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span><InfoTooltip term="Problematic smartphone use" /> is estimated to affect ~6% of people, though it is not yet a clinical diagnosis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">-</span>
              <span>Behavioral addictions activate the same dopamine reward pathways as drugs — the mechanism is shared</span>
            </li>
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'Common Sense Media — The Common Sense Census: Media Use by Tweens and Teens', url: 'https://www.commonsensemedia.org/research' },
          { name: 'DataReportal — Global Digital Reports', url: 'https://datareportal.com/reports' },
          { name: 'National Council on Problem Gambling', url: 'https://www.ncpgambling.org/' },
          { name: 'WHO — Gaming disorder (ICD-11)', url: 'https://www.who.int/standards/classifications/frequently-asked-questions/gaming-disorder' },
        ]} />
      </div>
    </section>
  );
}
