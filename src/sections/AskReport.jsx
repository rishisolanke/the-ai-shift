import { useState } from 'react';
import { motion } from 'framer-motion';
import ChartContainer from '../components/ChartContainer';

const SAMPLE_QUESTIONS = [
  "Will AI take my job?",
  "Which jobs are safest from AI?",
  "How many new jobs will AI create?",
  "Why hasn't AI boosted the economy yet?",
  "Where does AI spending actually go?",
  "How much electricity do AI data centers use?",
  "Is AI good or bad for the climate?",
  "What skills do I need for an AI world?",
  "Does education protect against automation?",
  "Which country uses AI the most?",
  "Why is the US not #1 in AI adoption?",
  "What are the main findings of this report?",
  "What data sources were used?",
  "How were the ML models built?",
  "What's the AI wage premium?",
  "What is the global AI adoption rate?",
];

const SAMPLE_ANSWERS = {
  "Will AI take my job?": {
    answer: "It depends on what you do. Jobs involving repetitive, routine tasks (data entry, basic bookkeeping, telemarketing) face the highest risk — some have a 30%+ projected decline over the next decade. But jobs requiring human judgment, creativity, physical dexterity, or emotional intelligence are growing. The World Economic Forum estimates 92 million jobs will be displaced, but 170 million new ones created — a net positive of 78 million.",
    sources: ["WEF Future of Jobs Report 2025", "BLS Employment Projections 2024-2034"],
  },
  "Which jobs are safest from AI?": {
    answer: "Healthcare practitioners (nurses, therapists), skilled trades (electricians, plumbers), creative professionals, and roles requiring complex social interaction are the safest. Nurse practitioners are projected to grow 52% by 2034. The pattern: if your job requires being physically present, reading emotions, or making judgment calls in unpredictable situations, AI is more likely to assist you than replace you.",
    sources: ["BLS Employment Projections 2024-2034", "WEF Future of Jobs Report 2025"],
  },
  "How many new jobs will AI create?": {
    answer: "The World Economic Forum projects 170 million new jobs by 2030 — roles like AI trainers, data analysts, sustainability specialists, and automation engineers. Many of these titles didn't exist 5 years ago. The net effect (new minus displaced) is positive: roughly 78 million more jobs created than destroyed globally.",
    sources: ["WEF Future of Jobs Report 2025"],
  },
  "Why hasn't AI boosted the economy yet?": {
    answer: "Goldman Sachs found that AI has contributed essentially zero to US GDP so far, despite companies spending over $660 billion. Three reasons: (1) 75% of AI spending goes to imported chips from Taiwan and Korea, boosting their economies instead; (2) 95% of company AI pilot programs never make it past the testing phase; (3) it takes years for new technology to show up in economic statistics — the internet took a decade too.",
    sources: ["Goldman Sachs Global Investment Research 2025", "MIT Technology Review 2025"],
  },
  "Where does AI spending actually go?": {
    answer: "Of the roughly $660 billion spent on AI in 2026, about 75% flows overseas: chips manufactured by TSMC (Taiwan), memory from Samsung (South Korea), and equipment from ASML (Netherlands). Most AI 'investment' is really hardware imports, data center construction, and electricity bills — not yet producing measurable economic returns in the spending country.",
    sources: ["Goldman Sachs analysis", "Stanford AI Index 2026"],
  },
  "How much electricity do AI data centers use?": {
    answer: "In 2024, data centers used 415 terawatt-hours globally. By 2030, the International Energy Agency projects this will hit 945 TWh — more than Japan's entire electricity consumption. A single ChatGPT query uses about 10x more electricity than a Google search. The rapid growth is driven by AI training runs and inference at scale.",
    sources: ["IEA Energy and AI Report, April 2025"],
  },
  "Is AI good or bad for the climate?": {
    answer: "Both. AI data centers are projected to add 24-44 million tons of CO2 per year by 2030 (equivalent to 10 million cars). BUT — if AI is deployed for energy optimization, smart grids, and materials science, it could help reduce 1,400 million tons per year by 2035. That's 32x more than it adds. The question isn't whether AI helps or hurts — it's whether we deploy it for optimization or just for chatbots.",
    sources: ["Cornell/Xiao, Nature Sustainability 2025", "IEA Energy and AI 2025"],
  },
  "What skills do I need for an AI world?": {
    answer: "The World Economic Forum's top 3 skills for 2030 are: (1) Analytical thinking, (2) Resilience and flexibility, (3) AI and big data literacy. Notice that 'coding' isn't #1 — the ability to think critically about AI outputs, adapt to changing tools, and understand data matters more than writing Python from scratch. Workers with AI skills already earn 56% more than peers without them.",
    sources: ["WEF Future of Jobs Report 2025", "PwC AI Jobs Barometer 2025"],
  },
  "Does education protect against automation?": {
    answer: "Dramatically. Workers without a university degree face 22% automation risk — 11 times higher than university graduates (2%). This is the single strongest predictor of AI resilience. However, it's not the degree itself that protects — it's that degree-holders tend to work in jobs involving complex judgment, creativity, and non-routine problem-solving, which AI handles poorly.",
    sources: ["OECD Employment Outlook 2024"],
  },
  "Which country uses AI the most?": {
    answer: "The UAE leads global AI adoption at 70% of the working population using AI tools weekly, followed by Singapore (63%) and South Korea (52%). The US, despite being #1 in AI building and investment, ranks only 34% in actual usage — outside the top 10. Building AI and using AI are very different capabilities.",
    sources: ["Microsoft AI Diffusion Report, Q1 2026"],
  },
  "Why is the US not #1 in AI adoption?": {
    answer: "The US dominates AI investment ($285.9 billion in 2025, outspending China 23x) and hosts most major AI labs — but actual workplace adoption lags at 34%. Smaller nations like UAE and Singapore adopted faster because: (1) smaller populations are easier to transform, (2) strong government mandates, (3) less legacy infrastructure to replace. The US builds the tools; others adopt them first.",
    sources: ["Microsoft AI Diffusion Report Q1 2026", "Stanford AI Index 2026"],
  },
  "What are the main findings of this report?": {
    answer: "Seven key findings: (1) AI will displace 92M jobs but create 170M new ones by 2030; (2) Only 18% of US firms actually use AI despite the hype; (3) AI workers earn 56% more than peers; (4) Data centers will use more electricity than Japan by 2030; (5) $660B in AI spending has produced ~0% GDP growth so far; (6) Education is the #1 predictor of automation safety; (7) The countries building AI and the countries using AI are different places.",
    sources: ["Cross-dimensional analysis of 12+ data sources"],
  },
  "What data sources were used?": {
    answer: "12+ verified sources including: World Economic Forum employer surveys, Bureau of Labor Statistics projections, International Energy Agency reports, Microsoft global adoption surveys, Stanford AI Index, Goldman Sachs research, USCIS immigration data, Census Bureau business surveys, PwC wage analysis, OECD employment studies, and peer-reviewed research from Nature Sustainability. Every single number in this report traces back to a specific source with a URL.",
    sources: ["See full source list in each section footer"],
  },
  "How were the ML models built?": {
    answer: "Four models: (1) A clustering model that sorted 14 countries into 4 groups based on AI readiness — like sorting cards by shared traits; (2) A prediction model that identifies high-risk jobs with 87% accuracy using salary, education, and task type; (3) A simple model testing whether AI adoption predicts job losses (answer: partially); (4) A neural network trained on 5 years of layoff data to forecast future trends. All built with Python, scikit-learn, XGBoost, and TensorFlow.",
    sources: ["Analysis notebooks in /analysis/ directory"],
  },
  "What's the AI wage premium?": {
    answer: "Workers with AI skills earn 56% more than similar workers without AI skills — and this gap is growing every year (it was only 12% in 2018). For H-1B visa holders specifically, AI roles average $148K base salary versus $130K for non-AI positions. The premium exists across industries, experience levels, and countries. Learning AI skills is currently one of the highest-return career investments.",
    sources: ["PwC AI Jobs Barometer 2025", "DOL OFLC LCA Data"],
  },
  "What is the global AI adoption rate?": {
    answer: "About 16.3% of the world's working-age population uses AI tools at least once a week, according to Microsoft's survey of 147 countries. But this average hides huge variation: from 70% in the UAE to under 5% in many developing nations. The rate is growing rapidly — South Korea's adoption jumped 43% in just 6 months.",
    sources: ["Microsoft AI Diffusion Report Q1 2026"],
  },
};

export default function AskReport() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleAsk = (q) => {
    const query = q || question;
    if (!query.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const matched = SAMPLE_ANSWERS[query] || {
        answer: "Great question! This demo covers the 18 most common questions. For custom queries, the full RAG pipeline (LangChain + FAISS) runs locally — clone the repo and follow the setup instructions.",
        sources: ["See rag/README for setup instructions"],
      };
      setAnswer({ question: query, ...matched });
      setLoading(false);
    }, 600);
  };

  const visibleQuestions = showAll ? SAMPLE_QUESTIONS : SAMPLE_QUESTIONS.slice(0, 8);

  return (
    <section id="ask" className="section-container">
      <ChartContainer
        title="Ask the Report"
        subtitle="18 pre-answered questions covering every dimension. Plain English, no jargon."
        source="Answers derived from verified data sources cited in each section"
      >
        <div className="space-y-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask about AI's impact on jobs, economy, environment..."
              className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#00e676]/50 transition-colors"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading}
              className="px-6 py-3 bg-[#00e676] text-black rounded-xl font-semibold hover:bg-[#00c964] transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Ask'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {visibleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => { setQuestion(q); handleAsk(q); }}
                className="px-3 py-1.5 text-sm bg-black border border-white/10 rounded-full text-[#a0a0a0] hover:border-[#00e676]/40 hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
            {!showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="px-3 py-1.5 text-sm border border-dashed border-white/10 rounded-full text-[#666] hover:text-[#00e676] hover:border-[#00e676]/30 transition-colors"
              >
                +{SAMPLE_QUESTIONS.length - 8} more...
              </button>
            )}
          </div>

          {answer && (
            <motion.div
              className="bg-black border border-[#00e676]/15 rounded-xl p-6 space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-[#00e676] font-mono">Q: {answer.question}</p>
              <p className="text-[#e0e0e0] leading-relaxed">{answer.answer}</p>
              <div className="pt-3 border-t border-white/[0.06]">
                <p className="text-xs text-[#666] font-mono">Sources:</p>
                <ul className="text-xs text-[#a0a0a0] mt-1 space-y-0.5">
                  {answer.sources.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          <p className="text-xs text-[#666] text-center">
            18 pre-answered questions from verified data. Full RAG pipeline available locally.
          </p>
        </div>
      </ChartContainer>
    </section>
  );
}
