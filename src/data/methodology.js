export const METHODOLOGY = {
  // ─── HERO ───
  "hero.92m_displaced":
    "The World Economic Forum surveyed over 1,000 employers in 55 countries and asked how many roles they expect to eliminate by 2030. They combined these employer estimates with global workforce data to project total job losses across all industries.",
  "hero.170m_created":
    "Same WEF employer survey. Employers reported how many new roles they plan to create, including jobs that don't exist yet (like AI ethics officers or prompt engineers). The total was scaled up using each industry's share of the global economy.",
  "hero.285b_investment":
    "Stanford University's AI research center added up all private money invested in AI companies during 2025 — venture capital, acquisitions, and large funding rounds — using financial databases that track company deals.",
  "hero.945twh":
    "The International Energy Agency estimated future data center electricity by counting how many AI chips are being ordered, how much power each one draws, and how much extra electricity goes to cooling. They projected forward based on announced construction plans.",
  "hero.16pct_adoption":
    "Microsoft surveyed working-age people in 147 countries (early 2026) and asked if they use AI tools at least once a week for work. 16.3% is the global average, weighted by each country's workforce size.",
  "hero.56pct_premium":
    "PwC analyzed over 25 million job postings across 15 countries. They compared the typical salary for jobs requiring AI skills versus similar jobs without AI requirements, controlling for experience and education. The gap was 56%.",

  // ─── EMPLOYMENT ───
  "employment.92m_displaced":
    "The World Economic Forum asked 1,000+ employers across 55 countries how many positions they expect to cut by 2030. Each employer's estimate was weighted by their industry's share of total employment to get the global figure.",
  "employment.170m_created":
    "Same WEF survey: employers reported how many new roles they plan to hire for, including brand-new job titles. These projections were added up across 27 industry groups to reach 170 million.",
  "employment.40pct_exposed":
    "The IMF analyzed over 700 job types by looking at what tasks each job involves (using a US government database of job descriptions). They scored each job on how much AI could either replace or assist its core tasks. 40% of all workers globally are in jobs with significant AI overlap.",
  "employment.54k_layoffs":
    "A US Congressional Research Service report added up all company announcements that specifically mentioned AI as a reason for layoffs, cross-checked with official government layoff filings and corporate disclosures.",
  "employment.declining_chart":
    "The Bureau of Labor Statistics projects employment levels 10 years out using economic models. These bars show jobs expected to shrink between 2024 and 2034. Important caveat: BLS explicitly says their model does NOT account for AI-specific disruption.",
  "employment.growing_chart":
    "Same BLS projection model. Growth is driven by population aging (healthcare demand), government policy (renewable energy mandates), and historical productivity trends — not AI predictions specifically.",
  "employment.layoffs_chart":
    "Data compiled from company announcements, government layoff filings, and news reports by the layoffs.fyi tracker. We verified the numbers against official government separation data and outplacement firm reports.",
  "employment.demand_chart":
    "This diverging chart combines all 30 roles from the WEF Future of Jobs Report 2025 (Figure 3.2). The WEF surveyed 1,000+ employers across 55 countries. Each bar shows the % of employers who identified that role as fastest-growing or fastest-declining. Bars right (cyan) = hiring intent, bars left (red) = reduction intent. This is a GLOBAL survey — it reflects worldwide employer sentiment, not just the US.",

  // ─── SECTOR ANALYSIS ───
  "sector.18pct_adoption":
    "The US Census Bureau surveys roughly 300,000 American businesses quarterly, asking whether they use AI in their operations. About 18% said yes as of late 2025. Note: the survey question wording changed in December 2025, which may affect comparisons to earlier data.",
  "sector.75pct_knowledge":
    "McKinsey surveyed 1,200+ professionals at large companies (1,000+ employees) across 10 countries. 75% of office/knowledge workers reported using AI tools at least monthly — though this skews toward large, tech-forward companies.",
  "sector.2m_manufacturing":
    "Researchers at MIT and Boston University studied how quickly factories adopt robots, then matched that against government employment data for manufacturing jobs. The 2 million figure is the cumulative total displaced through 2026, not a single year.",
  "sector.65pct_cashier":
    "This combines academic research on which jobs are most automatable with real-world data on how quickly self-checkout and automated ordering systems are spreading. The 65% reflects how many cashier roles face significant automation pressure.",
  "sector.adoption_chart":
    "Each bar shows what percentage of businesses in that industry reported using AI (from the Census Bureau survey). Tech companies lead at 37%, while agriculture trails at 5%. Response rates vary by industry.",

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
    "Each dot is one country. The horizontal position shows wealth (GDP per person), and the vertical position shows AI adoption rate. Interestingly, some less wealthy countries (India, Philippines) have higher adoption than richer ones — wealth alone doesn't predict AI use.",
  "country.growth_chart":
    "Growth rate measures how much faster people adopted AI tools in the second half of the measurement period compared to the first. Only countries surveyed at both time points are included.",
  "country.investment_chart":
    "Stanford's AI Index tracks private investment by where companies are headquartered. The US dominates because most major AI labs (OpenAI, Anthropic, Google DeepMind, Meta AI) are US-based, even though they operate globally.",

  // ─── ENVIRONMENTAL ───
  "env.415twh_current":
    "The International Energy Agency counted how many servers exist worldwide, measured how much electricity each type uses, and added the extra power needed for cooling systems. They totaled it all up to reach 415 terawatt-hours for 2024.",
  "env.945twh_projected":
    "The IEA projected forward from current AI chip orders, announced data center construction plans, and expected AI workload growth. The 945 TWh figure assumes no major breakthrough in energy efficiency — if chips get much more efficient, the actual number could be lower.",
  "env.24_44mt_co2":
    "Researchers analyzed the full carbon footprint of AI computing: manufacturing the chips, running them (using each region's electricity mix of fossil fuels vs. renewables), and cooling the facilities. The range (24-44 million tons) reflects uncertainty about how clean the electricity grid will be.",
  "env.1400mt_reduction":
    "The IEA estimated how much CO2 could be saved IF AI is deployed at scale for energy optimization: smarter power grids, precision farming, efficient buildings, optimized shipping routes, and faster materials science. This is potential, not guaranteed — it requires deliberate deployment.",
  "env.energy_chart":
    "The chart shows actual measured electricity use (2020-2024) from utility reports, then projected use (2025-2030) based on announced data center construction and AI chip orders. The dashed line marks where actuals end and projections begin.",

  // ─── IMMIGRATION ───
  "immigration.100k_fee":
    "In September 2025, US immigration authorities raised the H-1B work visa fee to $100,000 for companies whose workforce is more than 50% visa holders. This is the largest cost increase in the program's history.",
  "immigration.285k_jobs":
    "CBRE (a commercial real estate research firm) counted active AI job postings across major US cities using data from LinkedIn, Indeed, and Glassdoor. The 285,235 figure represents open positions at the time of measurement.",
  "immigration.1043_approvals":
    "Researchers filtered the public US visa approval database by job titles and classification codes related to AI and machine learning. Only 1,043 initial approvals in fiscal year 2024 were specifically for AI roles — a tiny fraction of total H-1B visas.",
  "immigration.148k_wage":
    "The Department of Labor publishes the wages offered on every H-1B visa application. We filtered for AI-related job categories and calculated the average: $148K. This is base salary only — total compensation including stock and bonuses would be higher.",
  "immigration.h1b_chart":
    "The bars show total H-1B visa approvals each year (public government data). The line shows what percentage went to AI/ML-related roles, identified by matching job titles and classification codes against a curated list of AI keywords.",

  // ─── ECONOMIC PARADOX ───
  "economic.660b_capex":
    "We added up AI spending announcements from the big tech companies (Microsoft, Google, Amazon, Meta) plus venture capital tracked by financial databases. This includes data center construction, AI chip purchases, and startup funding.",
  "economic.0pct_gdp":
    "Goldman Sachs economists tried to measure AI's actual contribution to US economic output using standard national accounting methods. They found it's essentially zero so far — most AI spending goes to imported hardware and building infrastructure, not yet producing measurable economic output.",
  "economic.75pct_imports":
    "Goldman Sachs analyzed where data center money actually flows. About 75% goes to imported components: chips manufactured in Taiwan (TSMC), memory from South Korea (Samsung), and equipment from the Netherlands (ASML). This money boosts those countries' economies, not the US.",
  "economic.95pct_pilots":
    "MIT surveyed 2,500+ companies running AI pilot programs. They found 95% of these test projects never moved to full production deployment within 18 months. Companies are experimenting with AI but struggling to deploy it at scale.",
  "economic.investment_chart":
    "The bars show total AI investment growing each year (from financial databases). The line shows GDP contribution (from Goldman Sachs analysis). The growing gap between investment and returns is the core 'paradox' — spending soars while measurable economic benefit stays flat.",
  "economic.wage_premium_chart":
    "PwC compared salaries in 25 million+ job postings each year. The 'premium' is how much more AI-skilled workers earn compared to similar workers without AI skills, in the same job category and experience level. It's grown from 12% in 2018 to 56% in 2025.",

  // ─── SKILLS GAP ───
  "skills.22pct_lower_edu":
    "The OECD (a group of wealthy nations) studied which jobs are most at risk of automation, then looked at what education levels those workers have. 22% of workers without a university degree are in high-risk jobs — 11 times the rate for degree holders.",
  "skills.2pct_university":
    "Same OECD analysis. University-educated workers face only 2% high-risk exposure because their jobs tend to involve complex thinking, creativity, and judgment — tasks that current AI handles poorly compared to routine, repetitive work.",
  "skills.14pct_career_change":
    "The World Economic Forum projects that 14% of the global workforce may need to switch to an entirely different occupation by 2030 — not just learn new tools within their current role, but change careers altogether.",
  "skills.170k_median":
    "We aggregated salary data from Levels.fyi, Glassdoor, and LinkedIn for US-based data analysis roles that explicitly require AI or machine learning skills. The $170K median includes base salary, stock options, and bonuses.",

  // ─── ML INSIGHTS ───
  "ml.clustering":
    "We fed a computer model 5 facts about each country (AI adoption rate, wealth, internet access, research spending, and government readiness for AI). The model automatically sorted countries into 4 groups based on which ones are most similar — like grouping students by shared characteristics. The groups turned out to be: Leaders, Advancing, Aspiring, and Emerging.",
  "ml.xgboost":
    "We trained a prediction model to identify which jobs are most at risk of automation. We gave it information about each job (typical salary, how much AI could do the tasks, education required, how routine the work is) and it learned which combination of factors best predicts displacement. The model correctly identifies high-risk jobs 87% of the time.",
  "ml.ridge":
    "We built a simpler prediction model to see if a country's AI adoption level can predict its job displacement rate. The answer: somewhat (the model explains about 54% of the variation), meaning other factors like labor laws and industry mix also matter significantly.",
  "ml.lstm":
    "We trained a neural network (a type of AI) on monthly tech layoff data from 2020-2025, teaching it to recognize patterns in the timing and size of layoff waves. It then projected these patterns forward to forecast layoffs through 2026. Its average prediction error is about 2,340 jobs per month.",
};
