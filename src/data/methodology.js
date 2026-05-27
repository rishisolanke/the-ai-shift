export const METHODOLOGY = {
  // ─── HERO ───
  "hero.92m_displaced":
    "The World Economic Forum surveyed over 1,000 employers in 55 countries, asking how many roles they expect to eliminate by 2030. They combined those employer estimates with global workforce data to project total job losses across all industries.",
  "hero.170m_created":
    "Same WEF employer survey. Employers reported how many new roles they plan to create, including jobs that don't exist yet (like AI ethics officers or prompt engineers). The total was scaled up using each industry's share of the global economy.",
  "hero.285b_investment":
    "Stanford's AI research center added up all private money invested in AI companies during 2025, including venture capital, acquisitions, and large funding rounds, using financial databases that track company deals.",
  "hero.945twh":
    "The IEA estimated future data center electricity by counting how many AI chips are being ordered, how much power each draws, and how much extra electricity goes to cooling. They projected forward based on announced construction plans.",
  "hero.16pct_adoption":
    "Microsoft surveyed working-age people in 147 countries (early 2026) and asked if they use AI tools at least once a week for work. 16.3% is the global average, weighted by each country's workforce size.",
  "hero.56pct_premium":
    "PwC analyzed over 25 million job postings across 15 countries. They compared the typical salary for jobs requiring AI skills versus similar jobs without AI requirements, controlling for experience and education. The gap was 56%.",

  // ─── EMPLOYMENT ───
  "employment.92m_displaced":
    "The WEF asked 1,000+ employers across 55 countries how many positions they expect to cut by 2030. Each employer's estimate was weighted by their industry's share of total employment to get the global figure.",
  "employment.170m_created":
    "Same WEF survey. Employers reported how many new roles they plan to hire for, including brand-new job titles. These projections were added up across 27 industry groups to reach 170 million.",
  "employment.40pct_exposed":
    "The IMF analyzed over 700 job types by looking at the tasks each job involves (using a US government database of job descriptions). They scored each job on how much AI could replace or assist its core tasks. 40% of all workers globally are in jobs with significant AI overlap.",
  "employment.54k_layoffs":
    "A US Congressional Research Service report added up all company announcements that specifically mentioned AI as a reason for layoffs, cross-checked with official government layoff filings and corporate disclosures.",
  "employment.declining_chart":
    "The BLS projects employment levels 10 years out using economic models. These bars show jobs expected to shrink between 2024 and 2034. Important: BLS says their model does NOT account for AI-specific disruption.",
  "employment.growing_chart":
    "Same BLS projection model. Growth here is driven by population aging (healthcare demand), government policy (renewable energy mandates), and historical productivity trends, not AI predictions specifically.",
  "employment.layoffs_chart":
    "Data compiled from company announcements, government layoff filings, and news reports by the layoffs.fyi tracker. I verified the numbers against official government separation data and outplacement firm reports.",
  "employment.wage_scatter":
    "Each dot is one occupation from the BLS Employment Projections 2024-2034. The x-axis is the median annual wage from the BLS Occupational Employment and Wage Statistics (OES) survey. The y-axis is the projected 10-year employment change. Red dots are the 10 fastest-declining roles, green dots are the 10 fastest-growing. The pattern shows that jobs being automated tend to pay $35-50K while growing roles pay $60-130K.",
  "employment.demand_chart":
    "This diverging chart combines all 30 roles from the WEF Future of Jobs Report 2025 (Figure 3.2). The WEF surveyed 1,000+ employers across 55 countries. Each bar shows the % of employers who identified that role as fastest-growing or fastest-declining. Bars right = hiring intent, bars left = reduction intent. This is a global survey, so it reflects worldwide employer sentiment, not just the US.",

  // ─── SECTOR ANALYSIS ───
  "sector.18pct_adoption":
    "The US Census Bureau surveys roughly 300,000 American businesses quarterly, asking whether they use AI. About 18% said yes as of late 2025. Note: the survey question wording changed in December 2025, which may affect comparisons to earlier data.",
  "sector.75pct_knowledge":
    "McKinsey surveyed 1,200+ professionals at large companies (1,000+ employees) across 10 countries. 75% of office/knowledge workers said they use AI tools at least monthly, though this skews toward large, tech-forward companies.",
  "sector.2m_manufacturing":
    "MIT and Boston University researchers studied how quickly factories adopt robots, then matched that against government employment data for manufacturing jobs. The 2 million figure is cumulative through 2026, not a single year.",
  "sector.65pct_cashier":
    "This combines academic research on which jobs are most automatable with real-world data on how quickly self-checkout and automated ordering systems are spreading. 65% reflects how many cashier roles face significant automation pressure.",
  "sector.adoption_chart":
    "Each bar shows the percentage of businesses in that industry that reported using AI (from the Census Bureau survey). Tech companies lead at 37%, agriculture trails at 5%. Response rates vary by industry.",

  // ─── COUNTRY ADOPTION ───
  "country.70pct_uae":
    "Microsoft surveyed working-age adults in the UAE and found 70% use AI tools at least weekly. The UAE's high score is partly because of government AI mandates and a relatively small, tech-connected workforce.",
  "country.16pct_global":
    "The global 16.3% average is pulled down by large-population countries (India, China, Indonesia) where AI adoption is moderate. It's the employment-weighted average across all 147 countries Microsoft surveyed.",
  "country.43pct_korea":
    "South Korea's adoption rate grew 43% in just 6 months (mid-2025 to early 2026). This surge was driven by Samsung and LG rolling out AI tools company-wide, plus government subsidies for AI adoption.",
  "country.1_81t_market":
    "Multiple research firms (Statista, Grand View Research, IDC) estimate the total global AI market will reach roughly $1.8 trillion by 2030. Estimates range from $1.5T to $2.1T depending on what's counted (software, hardware, services).",
  "country.scatter_chart":
    "Each dot is one country. Horizontal position shows wealth (GDP per person), vertical shows AI adoption rate. Worth noting: some less wealthy countries (India, Philippines) have higher adoption than richer ones, so wealth alone doesn't predict AI use.",
  "country.growth_chart":
    "Growth rate measures how much faster people adopted AI tools in the second half of the measurement period compared to the first. Only countries surveyed at both time points are included.",
  "country.investment_chart":
    "Stanford's AI Index tracks private investment by where companies are headquartered. The US leads by a huge margin because most major AI labs (OpenAI, Anthropic, Google DeepMind, Meta AI) are US-based, even though they operate globally.",

  // ─── ENVIRONMENTAL ───
  "env.415twh_current":
    "The IEA counted how many servers exist worldwide, measured how much electricity each type uses, and added the extra power needed for cooling systems. They totaled it up to reach 415 terawatt-hours for 2024.",
  "env.945twh_projected":
    "The IEA projected forward from current AI chip orders, announced data center construction plans, and expected AI workload growth. The 945 TWh figure assumes no major efficiency breakthroughs. If chips get much more efficient, the actual number could be lower.",
  "env.24_44mt_co2":
    "Researchers analyzed the full carbon footprint of AI computing: manufacturing the chips, running them (factoring in each region's mix of fossil fuels vs. renewables), and cooling the facilities. The range (24-44 million tons) reflects uncertainty about how clean the grid will be.",
  "env.1400mt_reduction":
    "The IEA estimated how much CO2 could be saved if AI is deployed at scale for energy optimization: smarter power grids, precision farming, efficient buildings, optimized shipping routes, and faster materials science. This is potential, not guaranteed. It requires deliberate deployment.",
  "env.emissions_bar":
    "This bar chart compares two numbers side by side. The left bar (44 Mt) is the high-end estimate of CO2 that AI data centers will add per year by 2030, from Cornell/Xiao's Nature Sustainability paper. The right bar (1,400 Mt) is the IEA's estimate of how much CO2 AI could help reduce per year by 2035 through energy optimization. The reduction potential is about 32x larger than the emissions.",
  "env.energy_chart":
    "The chart shows actual measured electricity use (2020-2024) from utility reports, then projected use (2025-2030) based on announced data center construction and AI chip orders. The dashed portion marks where projections begin.",

  // ─── IMMIGRATION ───
  "immigration.100k_fee":
    "In September 2025, US immigration authorities raised the H-1B work visa fee to $100,000 for companies whose workforce is more than 50% visa holders. This is the largest cost increase in the program's history.",
  "immigration.285k_jobs":
    "CBRE (a commercial real estate research firm) counted active AI job postings across major US cities using data from LinkedIn, Indeed, and Glassdoor. The 285,235 figure represents open positions at the time of measurement.",
  "immigration.1043_approvals":
    "Researchers filtered the public US visa approval database by job titles and classification codes related to AI and machine learning. Only 1,043 initial approvals in fiscal year 2024 were specifically for AI roles, a tiny fraction of total H-1B visas.",
  "immigration.148k_wage":
    "The Department of Labor publishes the wages offered on every H-1B visa application. I filtered for AI-related job categories and calculated the average: $148K. This is base salary only. Total compensation including stock and bonuses would be higher.",
  "immigration.h1b_chart":
    "The bars show total H-1B visa approvals each year (public government data). The line shows what percentage went to AI/ML-related roles, identified by matching job titles and classification codes against a curated list of AI keywords.",

  // ─── ECONOMIC PARADOX ───
  "economic.660b_capex":
    "I added up AI spending announcements from the big tech companies (Microsoft, Google, Amazon, Meta) plus venture capital tracked by financial databases. This includes data center construction, AI chip purchases, and startup funding.",
  "economic.0pct_gdp":
    "Goldman Sachs economists tried to measure AI's actual contribution to US economic output using standard national accounting methods. They found it's basically zero so far. Most AI spending goes to imported hardware and building infrastructure, not producing measurable economic output yet.",
  "economic.75pct_imports":
    "Goldman Sachs analyzed where data center money actually goes. About 75% flows to imported components: chips from Taiwan (TSMC), memory from South Korea (Samsung), and equipment from the Netherlands (ASML). That money boosts those countries' economies, not the US.",
  "economic.95pct_pilots":
    "MIT surveyed 2,500+ companies running AI pilot programs. They found 95% of test projects never moved to full production within 18 months. Companies are experimenting with AI but struggling to deploy it at scale.",
  "economic.investment_chart":
    "The bars show total AI investment growing each year (from financial databases). The line shows GDP contribution (from Goldman Sachs). The growing gap between investment and returns is the core paradox: spending keeps climbing while measurable economic benefit stays flat.",
  "economic.wage_premium_chart":
    "PwC compared salaries in 25 million+ job postings each year. The 'premium' is how much more AI-skilled workers earn compared to similar workers without AI skills, in the same job category and experience level. It grew from 12% in 2018 to 56% in 2025.",

  // ─── SKILLS GAP ───
  "skills.22pct_lower_edu":
    "The OECD studied which jobs are most at risk of automation, then looked at the education levels of those workers. 22% of workers without a university degree are in high-risk jobs, which is 11 times the rate for degree holders.",
  "skills.2pct_university":
    "Same OECD analysis. University-educated workers face only 2% high-risk exposure because their jobs tend to involve complex thinking, creativity, and judgment, which current AI still handles poorly compared to routine, repetitive work.",
  "skills.14pct_career_change":
    "The WEF projects that 14% of the global workforce may need to switch to a completely different occupation by 2030. Not just learn new tools within their current role, but change careers entirely.",
  "skills.170k_median":
    "I aggregated salary data from Levels.fyi, Glassdoor, and LinkedIn for US-based data analysis roles that explicitly require AI or machine learning skills. The $170K median includes base salary, stock options, and bonuses.",
  "skills.demand_vs_pay":
    "Each dot represents an AI skill category. The x-axis is the number of open job postings mentioning that skill (from aggregated job board data). The y-axis is the median total compensation for roles requiring that skill. Data Analysis has the most openings but NLP and Computer Vision roles pay more per position, likely because the talent pool is smaller.",

  // ─── ML INSIGHTS ───
  "ml.clustering":
    "I fed the model 5 facts about each country (AI adoption rate, wealth, internet access, research spending, and government AI readiness). It sorted countries into 4 groups based on similarity, like grouping students by shared characteristics. The groups came out as: Leaders, Advancing, Aspiring, and Emerging.",
  "ml.xgboost":
    "I trained a prediction model to identify which jobs are most at risk of automation. It takes information about each job (typical salary, AI exposure score, education required, how routine the work is) and learns which combination of factors best predicts displacement. The model correctly identifies high-risk jobs 87% of the time.",
  "ml.ridge":
    "I built a simpler model to see if a country's AI adoption level can predict its job displacement rate. The answer: somewhat. The model explains about 54% of the variation, meaning other factors like labor laws and industry mix also matter a lot.",
  "ml.lstm":
    "I trained a neural network on monthly tech layoff data from 2020-2025, teaching it to pick up patterns in the timing and size of layoff waves. It then projected those patterns forward to forecast layoffs through 2026. Its average prediction error is about 2,340 jobs per month.",
};
