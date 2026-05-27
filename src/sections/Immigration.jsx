import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import { COLORS } from '../utils/colors';

const H1B_TREND = [
  { year: 'FY2018', approvals: 335000, ai_share: 0.8 },
  { year: 'FY2019', approvals: 388000, ai_share: 1.2 },
  { year: 'FY2020', approvals: 298000, ai_share: 1.5 },
  { year: 'FY2021', approvals: 407000, ai_share: 2.1 },
  { year: 'FY2022', approvals: 442000, ai_share: 2.8 },
  { year: 'FY2023', approvals: 386000, ai_share: 3.4 },
  { year: 'FY2024', approvals: 370000, ai_share: 4.2 },
];

const TOP_EMPLOYERS = [
  { employer: 'Amazon', approvals: 8242 },
  { employer: 'Infosys', approvals: 6855 },
  { employer: 'TCS', approvals: 5438 },
  { employer: 'Google', approvals: 4920 },
  { employer: 'Microsoft', approvals: 4156 },
  { employer: 'Meta', approvals: 3875 },
  { employer: 'Cognizant', approvals: 3654 },
  { employer: 'Apple', approvals: 2890 },
];

const POLICY_TIMELINE = [
  { date: 'Sept 2025', event: '$100K H-1B registration fee enacted', impact: 'Largest cost increase in program history' },
  { date: 'Feb 2026', event: 'DHS wage-based selection effective', impact: 'Higher-paid positions prioritized' },
  { date: '2024-2025', event: 'Firms shift operations to Canada/India', impact: 'In response to H-1B restrictions' },
];

export default function Immigration() {
  return (
    <section id="immigration" className="border-t border-white/5">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-cyan">Dimension 5</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Immigration & AI Workforce</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            America needs AI talent but is making it harder to get. The $100K H-1B fee and
            wage-based selection reshape who can work in US AI — while competitors open their doors.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="$100K" label="New H-1B registration fee" source="USCIS, Sept 2025" color="text-accent-red" />
          <StatCard number="285,235" label="AI jobs as of 2024" source="CBRE" color="text-accent-blue" />
          <StatCard number="1,043" label="AI-related H-1B approvals (FY2024)" source="EIG Research" color="text-accent-purple" />
          <StatCard number="$148K" label="H-1B AI worker mean wage" source="DOL LCA Data" color="text-accent-green" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="H-1B Approvals & AI Share Over Time"
            subtitle="Total initial approvals (bars) and AI role percentage (line)"
            source="USCIS H-1B Employer Data Hub; EIG Research"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={H1B_TREND} margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#141419" />
                <XAxis dataKey="year" tick={{ fill: '#8888A0', fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#8888A0', fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#8888A0', fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{ background: '#141419', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                />
                <Bar yAxisId="left" dataKey="approvals" fill={COLORS.blue} fillOpacity={0.6} radius={[4, 4, 0, 0]} name="Total Approvals" />
                <Line yAxisId="right" type="monotone" dataKey="ai_share" stroke={COLORS.purple} strokeWidth={2} name="AI Role Share %" dot={{ fill: COLORS.purple }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Top H-1B Employers (Initial Approvals)"
            subtitle="Mix of tech giants and outsourcing firms"
            source="USCIS H-1B Employer Data Hub, FY2024"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={TOP_EMPLOYERS} layout="vertical" margin={{ left: 90, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#141419" />
                <XAxis type="number" tick={{ fill: '#8888A0', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
                <YAxis type="category" dataKey="employer" tick={{ fill: '#E8E8ED', fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ background: '#141419', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  formatter={(v) => [v.toLocaleString(), 'Approvals']}
                />
                <Bar dataKey="approvals" radius={[0, 4, 4, 0]} fill={COLORS.cyan} fillOpacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer
          title="Policy Changes Timeline"
          subtitle="Recent H-1B policy shifts affecting AI talent pipeline"
          source="USCIS; DHS Final Rules 2025-2026"
          className="mb-8"
        >
          <div className="space-y-4 py-4">
            {POLICY_TIMELINE.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-primary/50 border border-white/5">
                <div className="px-3 py-1 rounded bg-accent-red/10 text-accent-red text-xs font-mono whitespace-nowrap">
                  {item.date}
                </div>
                <div>
                  <p className="text-text-primary font-medium text-sm">{item.event}</p>
                  <p className="text-text-secondary text-xs mt-1">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <SourceCitation sources={[
          { name: 'USCIS H-1B Employer Data Hub', url: 'https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub' },
          { name: 'DOL OFLC LCA Disclosure Data', url: 'https://www.dol.gov/agencies/eta/foreign-labor/performance' },
          { name: 'EIG Research, AI-related H-1B analysis', url: 'https://github.com/EIG-Research/AI-unemployment' },
          { name: 'CBRE, AI Jobs Report 2024' },
        ]} />
      </div>
    </section>
  );
}
