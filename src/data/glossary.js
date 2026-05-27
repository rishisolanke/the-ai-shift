export const GLOSSARY = {
  // Units
  "TWh": "Terawatt-hours, a unit of energy equal to 1 trillion watt-hours. For context, the average US household uses about 10,500 kWh per year, so 1 TWh could power roughly 95,000 homes for a year.",
  "Mt CO₂": "Megatons of carbon dioxide, or one million metric tons of CO₂. For scale, the average American car produces about 4.6 metric tons of CO₂ per year, so 1 Mt equals the annual emissions of roughly 217,000 cars.",
  "Capex": "Capital Expenditure, the money a company spends on long-term assets like data centers, servers, or infrastructure. Different from operating costs (rent, salaries) because capex builds things that last years.",

  // Organizations
  "BLS": "Bureau of Labor Statistics, the US government agency that tracks jobs, wages, and employment projections. Their data covers every occupation in America and is updated annually.",
  "WEF": "World Economic Forum, an international organization that surveys 1,000+ employers across 55 countries to forecast global job trends. They publish the 'Future of Jobs Report.'",
  "IEA": "International Energy Agency, an intergovernmental organization that tracks global energy production, consumption, and publishes projections. Widely considered the standard for energy statistics.",
  "IMF": "International Monetary Fund, an international organization of 190 countries that monitors the global economy, publishes economic data, and advises governments on financial stability.",
  "OECD": "Organisation for Economic Co-operation and Development, a group of 38 mostly wealthy countries that research and publish data on economic and social policy, including automation risk.",
  "NAICS": "North American Industry Classification System, the standard used by the US Census Bureau to categorize every business into an industry sector (like 'Manufacturing' or 'Finance & Insurance').",
  "BTOS": "Business Trends and Outlook Survey, a US Census Bureau survey that asks roughly 300,000 American businesses about their operations, including whether they use AI. Published quarterly.",
  "Census BTOS": "Business Trends and Outlook Survey, a US Census Bureau survey that asks roughly 300,000 American businesses about their operations, including whether they use AI. Published quarterly.",

  // ML Terms
  "PCA Projection": "Principal Component Analysis, a math technique that simplifies data with many variables into 2 or 3 dimensions so it can be plotted on a chart. Think of it as a 'summary view' that captures the most important patterns.",
  "K-Means": "A clustering algorithm that groups similar items together. You tell it how many groups to make, and it finds the best way to divide the data. Like sorting countries by shared characteristics.",
  "XGBoost": "Extreme Gradient Boosting, a machine learning algorithm that builds many small decision trees and combines their predictions. One of the most accurate algorithms for structured data like spreadsheets.",
  "SHAP values": "SHapley Additive exPlanations, a method that explains WHY a prediction model made a specific decision. It shows how much each input factor (salary, education, etc.) pushed the prediction up or down.",
  "AUC-ROC": "Area Under the ROC Curve, a score from 0 to 1 measuring how well a model tells apart two categories (e.g., 'at-risk job' vs 'safe job'). 0.5 = random guessing, 0.87 = very good, 1.0 = perfect.",
  "Silhouette Score": "A measure of how well-separated clusters are. Ranges from -1 to 1. Above 0.5 is considered good, meaning items within each group are much more similar to each other than to items in other groups.",
  "LSTM": "Long Short-Term Memory, a type of neural network designed for time-series data (things that change over time). It picks up patterns like 'layoffs spike in Q1' and uses them to predict future values.",
  "Ridge Regression": "A statistical model that predicts one number from several inputs, with a built-in safeguard against overfitting. It's basically 'careful prediction' that doesn't overreact to random noise in the data.",
  "Adjusted R²": "A score showing what percentage of variation in the outcome your model explains. 0.54 means the model explains about 54% of why things vary, which is decent but not perfect. Other unmeasured factors also play a role.",
  "MAE": "Mean Absolute Error, the average size of a model's prediction mistakes. An MAE of 2,340 means the forecast is typically off by about 2,340 in either direction. Like a weather forecast being off by a few degrees.",

  // Economic
  "GDP": "Gross Domestic Product, the total value of all goods and services a country produces in a year. It's the main measure economists use to gauge how big and productive an economy is.",
  "SOC code": "Standard Occupational Classification, the numbering system the US government uses to categorize every job. For example, 15-1252 = Software Developers. Used to track employment across different data sources.",
  "FY": "Fiscal Year, the US government's budget year, which runs from October 1 to September 30. So 'FY2024' actually started in October 2023 and ended September 2024.",
  "ETL": "Extract, Transform, Load. The process of pulling raw data from different sources (Extract), cleaning and reformatting it (Transform), and saving it in a usable format (Load). It's how messy real-world data becomes analysis-ready.",
};
