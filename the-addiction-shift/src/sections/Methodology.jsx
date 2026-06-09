import { Database, FileText, AlertTriangle, HeartPulse } from 'lucide-react';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';

const DATA_SOURCES = [
  { name: 'CDC WONDER / NCHS', type: 'Database', access: 'Public', coverage: 'US overdose & cause-of-death mortality' },
  { name: 'SAMHSA — NSDUH', type: 'PDF/CSV', access: 'Public', coverage: '~70,000 Americans 12+, annual' },
  { name: 'NIDA — Trends & Statistics', type: 'Web/PDF', access: 'Public', coverage: 'US drug use, addiction, costs' },
  { name: 'CDC — Smoking & Alcohol (ARDI)', type: 'Web/App', access: 'Public', coverage: 'US tobacco & alcohol mortality' },
  { name: 'CDC/FDA — NYTS', type: 'PDF/CSV', access: 'Public', coverage: 'US middle & high school students' },
  { name: 'WHO — Global Status Reports', type: 'PDF', access: 'Open', coverage: 'Global alcohol, tobacco, drugs' },
  { name: 'WHO — GISAH', type: 'Database', access: 'Open', coverage: 'Per-capita alcohol, by country' },
  { name: 'Common Sense Media — Census', type: 'PDF', access: 'Open', coverage: 'US youth screen & media use' },
  { name: 'DataReportal / GWI', type: 'Reports', access: 'Open', coverage: 'Global digital & social media use' },
  { name: 'National Council on Problem Gambling', type: 'Web', access: 'Public', coverage: 'US gambling prevalence' },
];

const CAVEATS = [
  'NSDUH is a household survey, so it under-counts people who are homeless, incarcerated, or in treatment — exactly the groups most affected by severe addiction.',
  'The 2024 overdose figure is provisional. The CDC revises it as late death certificates are processed, so the final number may shift.',
  'Overdose "drugs involved" categories overlap because most deaths involve more than one substance. They do not sum to the total.',
  'Behavioral-addiction prevalence estimates vary widely by definition and screening tool. Treat them as best-available ranges, not precise clinical counts.',
  'Cost-of-illness figures come from different base years and methodologies and are only approximately inflation-adjusted.',
  'Self-reported survey data on substance use tends to under-report stigmatized behaviors.',
  'Correlation is not causation. Links between screen time and mental health, for example, are real but contested in direction.',
];

export default function Methodology() {
  return (
    <section id="methodology" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">Transparency</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Methodology & Sources</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Every number in this analysis links back to a verified public source — almost all of them
            government health agencies or the WHO. Here's where the data comes from and the caveats you should
            keep in mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Database size={20} className="text-accent-green" />
              <h3 className="text-lg font-semibold">How This Was Built</h3>
            </div>
            <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
              <li>Pull figures from authoritative public-health sources (CDC, SAMHSA, NIDA, WHO)</li>
              <li>Cross-check headline numbers against more than one source where possible</li>
              <li>Record the year and survey behind every statistic</li>
              <li>Prefer the most recent finalized data; flag provisional figures explicitly</li>
              <li>Visualize with React, Vite, Tailwind CSS, and Recharts</li>
            </ol>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <HeartPulse size={20} className="text-accent-green" />
              <h3 className="text-lg font-semibold">A Note on Framing</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Addiction is a treatable medical condition, not a moral failing. This project uses clinical
              language — <InfoTooltip term="SUD" />, <InfoTooltip term="OUD" />, <InfoTooltip term="MAT" /> —
              rather than stigmatizing terms.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              The numbers here describe populations, not individuals. If you or someone you know is struggling,
              help is available 24/7 — see the resources in the footer.
            </p>
          </div>
        </div>

        <div className="card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={20} className="text-accent-green" />
            <h3 className="text-lg font-semibold">Data Sources ({DATA_SOURCES.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-text-secondary font-medium">Source</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Format</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Access</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {DATA_SOURCES.map((src, i) => (
                  <tr key={i} className="border-b border-white/[0.06]">
                    <td className="py-2 text-text-primary">{src.name}</td>
                    <td className="py-2 text-text-secondary font-mono text-xs">{src.type}</td>
                    <td className="py-2 text-text-secondary">{src.access}</td>
                    <td className="py-2 text-text-secondary/70 text-xs">{src.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} className="text-accent-yellow" />
            <h3 className="text-lg font-semibold">Important Caveats</h3>
          </div>
          <ul className="space-y-3">
            {CAVEATS.map((caveat, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-accent-yellow mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span>{caveat}</span>
              </li>
            ))}
          </ul>
        </div>

        <SourceCitation sources={[
          { name: 'CDC WONDER', url: 'https://wonder.cdc.gov/' },
          { name: 'SAMHSA Data', url: 'https://www.samhsa.gov/data/' },
          { name: 'NIDA — Trends & Statistics', url: 'https://nida.nih.gov/research-topics/trends-statistics' },
          { name: 'WHO — Alcohol, Drugs and Addictive Behaviours', url: 'https://www.who.int/teams/mental-health-and-substance-use/alcohol-drugs-and-addictive-behaviours' },
        ]} />
      </div>
    </section>
  );
}
