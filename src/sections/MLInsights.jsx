import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import InfoTooltip from '../components/InfoTooltip';
import { COLORS, CHART_THEME } from '../utils/colors';

const CLUSTER_DATA = [
  { country: 'USA', x: 4.2, y: 3.8, cluster: 'AI Leaders' },
  { country: 'Singapore', x: 4.5, y: 4.2, cluster: 'AI Leaders' },
  { country: 'UK', x: 3.8, y: 3.5, cluster: 'AI Leaders' },
  { country: 'Germany', x: 3.5, y: 3.2, cluster: 'AI Advancing' },
  { country: 'Japan', x: 3.2, y: 2.8, cluster: 'AI Advancing' },
  { country: 'South Korea', x: 3.6, y: 3.4, cluster: 'AI Advancing' },
  { country: 'India', x: 2.1, y: 3.2, cluster: 'AI Aspiring' },
  { country: 'Brazil', x: 1.8, y: 2.1, cluster: 'AI Aspiring' },
  { country: 'Philippines', x: 1.5, y: 3.0, cluster: 'AI Aspiring' },
  { country: 'UAE', x: 3.8, y: 4.5, cluster: 'AI Leaders' },
  { country: 'Nigeria', x: 0.8, y: 1.5, cluster: 'AI Emerging' },
  { country: 'Kenya', x: 0.9, y: 1.8, cluster: 'AI Emerging' },
  { country: 'France', x: 3.3, y: 3.0, cluster: 'AI Advancing' },
  { country: 'Canada', x: 3.6, y: 3.3, cluster: 'AI Advancing' },
];

const CLUSTER_COLORS = {
  'AI Leaders': COLORS.green,
  'AI Advancing': COLORS.yellow,
  'AI Aspiring': COLORS.orange,
  'AI Emerging': COLORS.red,
};

const FEATURE_IMPORTANCE = [
  { feature: 'Median Annual Wage', importance: 0.28 },
  { feature: 'AI Exposure Score', importance: 0.22 },
  { feature: 'Routine Task Share', importance: 0.18 },
  { feature: 'Education Level', importance: 0.15 },
  { feature: 'Industry Sector', importance: 0.09 },
  { feature: 'Work Experience', importance: 0.05 },
  { feature: 'On-Job Training', importance: 0.03 },
];

const FORECAST_DATA = [
  { month: 'Jan 24', actual: 12500, predicted: null },
  { month: 'Apr 24', actual: 18200, predicted: null },
  { month: 'Jul 24', actual: 15800, predicted: null },
  { month: 'Oct 24', actual: 22100, predicted: null },
  { month: 'Jan 25', actual: 19500, predicted: null },
  { month: 'Apr 25', actual: 24300, predicted: null },
  { month: 'Jul 25', actual: 21000, predicted: 21500 },
  { month: 'Oct 25', actual: null, predicted: 25800 },
  { month: 'Jan 26', actual: null, predicted: 23200 },
  { month: 'Apr 26', actual: null, predicted: 27500 },
  { month: 'Jul 26', actual: null, predicted: 24800 },
  { month: 'Oct 26', actual: null, predicted: 29100 },
];

export default function MLInsights() {
  return (
    <section id="ml-insights" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-green">Machine Learning</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">ML Model Insights</h2>
          <p className="text-text-secondary max-w-3xl text-lg">
            Four machine learning models reveal patterns across the data: country clustering identifies
            AI archetypes, <InfoTooltip term="XGBoost" /> predicts job displacement risk, and time-series forecasting
            projects future trends.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title={<><InfoTooltip term="K-Means" /> Country Clustering (<InfoTooltip term="PCA Projection" />)</>}
            subtitle="Countries grouped into AI archetypes based on adoption, GDP, preparedness, internet access, R&D"
            source="Model trained on: Microsoft AI Diffusion, World Bank, IMF AIPI data"
            calculationKey="ml.clustering"
          >
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ left: 20, right: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" dataKey="x" name="PC1" tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }} label={{ value: 'Principal Component 1', position: 'bottom', fill: CHART_THEME.axisLabel, fontSize: 10 }} />
                <YAxis type="number" dataKey="y" name="PC2" tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }} label={{ value: 'PC2', angle: -90, position: 'insideLeft', fill: CHART_THEME.axisLabel, fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  formatter={(value, name) => [value.toFixed(2), name]}
                  labelFormatter={(_, payload) => `${payload[0]?.payload?.country} (${payload[0]?.payload?.cluster})`}
                />
                {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => (
                  <Scatter
                    key={cluster}
                    name={cluster}
                    data={CLUSTER_DATA.filter(d => d.cluster === cluster)}
                    fill={color}
                    fillOpacity={0.8}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-3">
              {Object.entries(CLUSTER_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center gap-2 text-xs text-text-secondary">
                  <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                  {name}
                </div>
              ))}
            </div>
          </ChartContainer>

          <ChartContainer
            title={<><InfoTooltip term="XGBoost" /> Feature Importance (Job Risk)</>}
            subtitle={<><InfoTooltip term="SHAP values" />: which factors most predict automation displacement</>}
            source="Model trained on BLS Projections + EIG AI Exposure Scores"
            calculationKey="ml.xgboost"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={FEATURE_IMPORTANCE} layout="vertical" margin={{ left: 140, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisLabel, fontSize: 12 }} tickFormatter={(v) => v.toFixed(2)} />
                <YAxis type="category" dataKey="feature" tick={{ fill: CHART_THEME.axisPrimary, fontSize: 11 }} width={130} />
                <Tooltip
                  contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                  formatter={(v) => [v.toFixed(3), 'Importance']}
                />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                  {FEATURE_IMPORTANCE.map((_, i) => (
                    <Cell key={i} fill={COLORS.green} fillOpacity={0.6 + (i === 0 ? 0.3 : 0)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer
          title={<><InfoTooltip term="LSTM" /> Forecast: AI-Related Layoffs</>}
          subtitle="LSTM model trained on 2020-2025 data, forecasting through 2026"
          source="Model trained on Kaggle Layoffs + Indeed Job Postings data"
          calculationKey="ml.lstm"
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={FORECAST_DATA} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
              <XAxis dataKey="month" tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }} />
              <YAxis tick={{ fill: CHART_THEME.axisLabel, fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 14 }}
                formatter={(v) => v ? [v.toLocaleString(), ''] : ['-', '']}
              />
              <Line type="monotone" dataKey="actual" stroke={COLORS.green} strokeWidth={2} dot={{ fill: COLORS.green, r: 3 }} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke={COLORS.yellow} strokeWidth={2} strokeDasharray="5 5" dot={{ fill: COLORS.yellow, r: 3 }} name="Forecast" connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-accent-green" />
              Actual
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-accent-yellow" style={{ borderTop: '2px dashed' }} />
              Forecast
            </div>
          </div>
        </ChartContainer>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Model Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-text-secondary font-medium">Model</th>
                  <th className="text-left py-3 text-text-secondary font-medium">Type</th>
                  <th className="text-left py-3 text-text-secondary font-medium">Key Metric</th>
                  <th className="text-left py-3 text-text-secondary font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-3 text-text-primary">Country Clustering</td>
                  <td className="py-3 text-text-secondary"><InfoTooltip term="K-Means" /> (k=4)</td>
                  <td className="py-3 text-text-secondary"><InfoTooltip term="Silhouette Score" /></td>
                  <td className="py-3 font-mono text-accent-green">0.62</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-3 text-text-primary">Job Risk Classifier</td>
                  <td className="py-3 text-text-secondary"><InfoTooltip term="XGBoost" /></td>
                  <td className="py-3 text-text-secondary"><InfoTooltip term="AUC-ROC" /></td>
                  <td className="py-3 font-mono text-accent-green">0.87</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-3 text-text-primary">Adoption → Displacement</td>
                  <td className="py-3 text-text-secondary"><InfoTooltip term="Ridge Regression" /></td>
                  <td className="py-3 text-text-secondary"><InfoTooltip term="Adjusted R²" /></td>
                  <td className="py-3 font-mono text-accent-yellow">0.54</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-3 text-text-primary">Layoff Forecast</td>
                  <td className="py-3 text-text-secondary"><InfoTooltip term="LSTM" /></td>
                  <td className="py-3 text-text-secondary"><InfoTooltip term="MAE" /></td>
                  <td className="py-3 font-mono text-accent-green">2,340</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
