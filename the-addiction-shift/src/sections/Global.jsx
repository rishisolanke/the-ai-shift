import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { useIntersection } from '../hooks/useIntersection';
import { useMobile } from '../hooks/useMobile';
import { COLORS, CHART_THEME } from '../utils/colors';

const GLOBAL_DEATHS = [
  { name: 'Tobacco', millions: 8.0 },
  { name: 'Alcohol', millions: 2.6 },
  { name: 'Illicit drugs', millions: 0.6 },
];

const ALCOHOL_PER_CAPITA = [
  { country: 'Latvia', litres: 12.9 },
  { country: 'Romania', litres: 12.6 },
  { country: 'Czechia', litres: 11.6 },
  { country: 'Germany', litres: 10.6 },
  { country: 'France', litres: 10.4 },
  { country: 'UK', litres: 9.7 },
  { country: 'USA', litres: 8.9 },
  { country: 'China', litres: 5.7 },
  { country: 'India', litres: 4.0 },
];

export default function Global() {
  const [ref] = useIntersection();
  const isMobile = useMobile();

  return (
    <section id="global" ref={ref} className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-red">Dimension 7</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">The Global Picture</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Addiction is a worldwide health crisis. The WHO estimates that around 400 million people live with
            an alcohol or drug use disorder, and that tobacco, alcohol, and drugs together account for more than
            11 million deaths a year. The US overdose crisis is severe, but the global toll is dominated by the
            world's two legal drugs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="400M" label="People worldwide with alcohol/drug use disorders" source="WHO, 2024" color="text-accent-red" calculationKey="global.400m" />
          <StatCard number="8M" label="Annual global deaths from tobacco" source="WHO" color="text-accent-red" calculationKey="hero.8m_tobacco" />
          <StatCard number="2.6M" label="Annual global deaths from alcohol" source="WHO, 2024" color="text-accent-orange" calculationKey="global.deaths_chart" />
          <StatCard number="1.3B" label="Tobacco users worldwide" source="WHO" color="text-accent-yellow" />
        </div>

        <ChartContainer
          title="Annual Global Deaths by Substance (millions)"
          subtitle="Tobacco dwarfs everything else"
          source="World Health Organization"
          calculationKey="global.deaths_chart"
          summary="Tobacco alone kills 8 million people a year worldwide — more than alcohol and all illicit drugs combined, several times over. The world's deadliest addictions are legal, taxed, and widely advertised."
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={GLOBAL_DEATHS} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis dataKey="name" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 10 : 12 }} />
              <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}M`} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                labelStyle={{ color: CHART_THEME.axisPrimary }}
                formatter={(v) => [`${v} million deaths/year`, 'Global toll']}
              />
              <Bar dataKey="millions" radius={[4, 4, 0, 0]}>
                {GLOBAL_DEATHS.map((_, i) => (
                  <Cell key={i} fill={[COLORS.red, COLORS.orange, COLORS.yellow][i]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Alcohol Consumption Per Capita (selected countries)"
          subtitle="Litres of pure alcohol per adult, per year"
          source="WHO Global Information System on Alcohol and Health"
          calculationKey="global.deaths_chart"
          summary="Per-adult alcohol consumption is highest across Eastern and Central Europe and lower in much of Asia, where drinking is less culturally widespread. The US sits in the middle of the wealthy-nation pack."
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={ALCOHOL_PER_CAPITA} layout="vertical" margin={{ left: isMobile ? 70 : 90, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}L`} />
              <YAxis type="category" dataKey="country" tick={{ fill: CHART_THEME.axisPrimary, fontSize: isMobile ? 10 : 12 }} width={isMobile ? 60 : 80} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                labelStyle={{ color: CHART_THEME.axisPrimary }}
                formatter={(v) => [`${v} litres/adult/year`, 'Pure alcohol']}
              />
              <Bar dataKey="litres" radius={[0, 4, 4, 0]}>
                {ALCOHOL_PER_CAPITA.map((d, i) => (
                  <Cell key={i} fill={d.country === 'USA' ? COLORS.green : COLORS.orange} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span>The <InfoTooltip term="WHO" /> estimates ~400 million people worldwide live with an alcohol or drug use disorder</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">-</span>
              <span>Tobacco kills ~8 million people a year globally — the single largest preventable cause of death</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-orange mt-1">-</span>
              <span>Alcohol is responsible for ~2.6 million deaths a year, about 4.7% of all deaths worldwide</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-yellow mt-1">-</span>
              <span>The deadliest addictions globally are the legal ones — a pattern that mirrors the US</span>
            </li>
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'WHO — Tobacco Fact Sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/tobacco' },
          { name: 'WHO — Global status report on alcohol and health and treatment of substance use disorders 2024', url: 'https://www.who.int/publications/i/item/9789240096745' },
          { name: 'WHO — Global Information System on Alcohol and Health (GISAH)', url: 'https://www.who.int/data/gho/data/themes/global-information-system-on-alcohol-and-health' },
        ]} />
      </div>
    </section>
  );
}
