import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import SourceCitation from '../components/SourceCitation';
import InfoTooltip from '../components/InfoTooltip';
import { COLORS, CHART_THEME } from '../utils/colors';

const RISK_BY_EDUCATION = [
  { level: 'Lower Secondary', risk: 22, color: COLORS.red },
  { level: 'Upper Secondary', risk: 12, color: COLORS.yellow },
  { level: 'University Degree', risk: 2, color: COLORS.green },
];

const TOP_AI_SKILLS = [
  { skill: 'Data Analysis', demand: 58263, median_pay: 170000 },
  { skill: 'Machine Learning', demand: 42150, median_pay: 165000 },
  { skill: 'Python Programming', demand: 38920, median_pay: 155000 },
  { skill: 'Natural Language Processing', demand: 28450, median_pay: 172000 },
  { skill: 'Cloud Computing (AI/ML)', demand: 25800, median_pay: 160000 },
  { skill: 'Computer Vision', demand: 18200, median_pay: 168000 },
  { skill: 'AI Ethics & Governance', demand: 12400, median_pay: 145000 },
  { skill: 'Prompt Engineering', demand: 9800, median_pay: 130000 },
];

const WEF_SKILLS_2030 = [
  { skill: 'Analytical Thinking', rank: 1 },
  { skill: 'Resilience & Flexibility', rank: 2 },
  { skill: 'AI & Big Data', rank: 3 },
  { skill: 'Leadership', rank: 4 },
  { skill: 'Creative Thinking', rank: 5 },
  { skill: 'Technology Literacy', rank: 6 },
  { skill: 'Curiosity & Lifelong Learning', rank: 7 },
  { skill: 'Systems Thinking', rank: 8 },
];

export default function SkillsGap() {
  return (
    <section id="skills" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-red">Dimension 7</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">The Skills Gap</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Workers without a university degree face 11x higher automation risk (22% vs 2%).
            At its core, the AI divide is really an education divide.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard number="22%" label={<>Automation risk (lower education) <InfoTooltip term="OECD" /></>} source="OECD" color="text-accent-red" calculationKey="skills.22pct_lower_edu" />
          <StatCard number="2%" label="Automation risk (university)" source="OECD" color="text-accent-green" calculationKey="skills.2pct_university" />
          <StatCard number="14%" label={<>Workers needing career change by 2030 <InfoTooltip term="WEF" /></>} source="WEF, 2025" color="text-accent-yellow" calculationKey="skills.14pct_career_change" />
          <StatCard number="$170K" label="Median pay, data analysis AI roles" source="Industry surveys" color="text-accent-green" calculationKey="skills.170k_median" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Automation Risk by Education Level"
            subtitle={<>Workers without university degrees face significantly higher displacement risk (<InfoTooltip term="OECD" /> data)</>}
            source="OECD Employment Outlook (automation risk estimates)"
            summary="Workers with lower secondary education face 22% automation risk, while university grads face just 2%. That's an 11x difference based on education alone."
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={RISK_BY_EDUCATION} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis dataKey="level" tick={{ fill: CHART_THEME.axisPrimary, fontSize: 11 }} />
                <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  formatter={(v) => [`${v}%`, 'Automation Risk']}
                />
                <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                  {RISK_BY_EDUCATION.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Top AI Job Categories by Demand"
            subtitle="Number of open roles and median compensation"
            source="Industry job postings aggregation, 2025"
            summary="Data analysis leads with 58K open roles, followed by machine learning at 42K. Even the smallest category here (prompt engineering) still has nearly 10K openings."
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={TOP_AI_SKILLS} layout="vertical" margin={{ left: 160, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="skill" tick={{ fill: CHART_THEME.axisPrimary, fontSize: 10 }} width={150} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  formatter={(v, name) => [v.toLocaleString(), name === 'demand' ? 'Open Roles' : '']}
                />
                <Bar dataKey="demand" radius={[0, 4, 4, 0]} fill={COLORS.green} fillOpacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer
          title="AI Skill Demand vs Median Pay"
          subtitle="NLP and Computer Vision pay the most per role. Data Analysis has the highest demand by far."
          source="Industry job postings aggregation, 2025"
          calculationKey="skills.demand_vs_pay"
          summary="NLP pays the highest median at $172K but has fewer openings (28K). Data analysis has way more demand (58K roles) at $170K. Prompt engineering is the lowest-paying AI skill at $130K."
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ left: 20, right: 20, top: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis
                type="number"
                dataKey="demand"
                tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                name="Open Roles"
                label={{ value: 'Open Roles', position: 'insideBottom', offset: -10, fill: CHART_THEME.axisLabel, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="median_pay"
                tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                name="Median Pay"
                domain={[120000, 180000]}
                label={{ value: 'Median Pay', angle: -90, position: 'insideLeft', fill: CHART_THEME.axisLabel, fontSize: 11 }}
              />
              <ZAxis range={[80, 80]} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                formatter={(v, name) => {
                  if (name === 'Open Roles') return [v.toLocaleString(), name];
                  return [`$${v.toLocaleString()}`, 'Median Pay'];
                }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.skill || ''}
              />
              <Scatter name="AI Skills" data={TOP_AI_SKILLS} fill={COLORS.green} fillOpacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="WEF Core Skills for 2030"
          subtitle={<>Top skills employers rank as most important by 2030 (<InfoTooltip term="WEF" />)</>}
          source="World Economic Forum, Future of Jobs Report 2025"
          summary="Analytical thinking is #1, and AI/Big Data is only #3. Employers actually rank resilience, flexibility, and creative thinking just as high as technical skills."
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4">
            {WEF_SKILLS_2030.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 p-3 rounded-lg bg-primary/50 border border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green font-mono font-bold text-sm">
                  {item.rank}
                </div>
                <span className="text-sm text-text-primary">{item.skill}</span>
              </div>
            ))}
          </div>
        </ChartContainer>

        <SourceCitation sources={[
          { name: 'OECD Employment Outlook, Automation risk by education level' },
          { name: 'WEF Future of Jobs Report 2025', url: 'https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf' },
          { name: 'Coursera Global Skills Report 2025' },
          { name: 'Mercer Global Talent Trends 2026' },
        ]} />
      </div>
    </section>
  );
}
