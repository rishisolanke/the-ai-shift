import { Database, FileText, AlertTriangle, Code } from 'lucide-react';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';

const DATA_SOURCES = [
  { name: 'Microsoft AI Diffusion Report', type: 'CSV', access: 'Open (GitHub)', coverage: '174 countries, quarterly' },
  { name: 'Bureau of Labor Statistics (BLS)', type: 'XLSX', access: 'Public Domain', coverage: 'US occupations, 2024-2034 projections' },
  { name: 'World Bank Open Data', type: 'API/JSON', access: 'Open', coverage: '217 countries, annual' },
  { name: 'FRED (Federal Reserve)', type: 'API/JSON', access: 'Free API key', coverage: 'US macro series, monthly/quarterly' },
  { name: 'Census BTOS', type: 'XLSX', access: 'Public', coverage: 'US firms, biweekly since 2023' },
  { name: 'EPA eGRID', type: 'XLSX', access: 'Public Domain', coverage: 'US power plants, annual' },
  { name: 'Indeed Hiring Lab', type: 'CSV', access: 'Open (CC BY 4.0)', coverage: 'Global, daily' },
  { name: 'IMF AI Preparedness Index', type: 'CSV', access: 'Open', coverage: '174 countries' },
  { name: 'Kaggle Tech Layoffs', type: 'CSV', access: 'Open', coverage: 'Global tech layoffs, 2020-2026' },
  { name: 'Stanford HAI AI Index', type: 'PDF', access: 'Open', coverage: 'Annual global report' },
];

const CAVEATS = [
  'BLS Employment Projections do NOT model AI-specific disruption. They only serve as a baseline for comparison.',
  'Census BTOS changed its AI question wording on December 3, 2025, so be careful comparing pre and post data.',
  'Kaggle layoffs data comes from layoffs.fyi, which is one person\'s web scrape. I cross-checked with BLS JOLTS and Indeed data where I could.',
  'Correlation does not mean causation. That applies to everything in this analysis.',
  'Some country-level data has gaps, especially for smaller nations.',
  'Self-reported AI adoption from the Microsoft survey likely overstates how much people are actually using AI productively.',
  'The Congressional Report figure (54,694 AI-cited layoffs) is based on companies self-reporting "AI" as the reason, which could include general automation or cost-cutting relabeled as AI.',
];

export default function Methodology() {
  return (
    <section id="methodology" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">Transparency</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Methodology & Sources</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Every number in this analysis links back to a verified public source.
            Here's the full list of where the data comes from, plus the caveats you should know about.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Database size={20} className="text-accent-green" />
              <h3 className="text-lg font-semibold">Data Pipeline</h3>
            </div>
            <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
              <li>Fetch raw data from 10+ verified sources (APIs, downloads, PDF extraction)</li>
              <li>Clean and standardize (ISO dates, ISO 3166-1 country codes, snake_case columns)</li>
              <li>Transform: cross-source joins on country, year, <InfoTooltip term="SOC code" />, <InfoTooltip term="NAICS" /> sector</li>
              <li>Validate: every number requires a source attribution field</li>
              <li>Export: JSON files for dashboard, Parquet for analysis</li>
            </ol>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Code size={20} className="text-accent-green" />
              <h3 className="text-lg font-semibold">Technical Stack</h3>
            </div>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><span className="text-text-primary font-medium"><InfoTooltip term="ETL" />:</span> Python, Pandas, requests, openpyxl, tabula-py</li>
              <li><span className="text-text-primary font-medium">Analysis:</span> Jupyter, matplotlib, seaborn, scipy, statsmodels</li>
              <li><span className="text-text-primary font-medium">ML:</span> Scikit-learn, <InfoTooltip term="XGBoost" />, TensorFlow (<InfoTooltip term="LSTM" />)</li>
              <li><span className="text-text-primary font-medium">Dashboard:</span> React 18, Vite, Tailwind CSS, Recharts</li>
              <li><span className="text-text-primary font-medium">RAG:</span> LangChain, FAISS, sentence-transformers, Claude API</li>
              <li><span className="text-text-primary font-medium">SQL:</span> PostgreSQL-compatible schema, complex analytical queries</li>
            </ul>
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

        <div className="card">
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
      </div>
    </section>
  );
}
