import { Github, Linkedin, Mail } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">About This Project</h2>

          <div className="card text-left mb-8">
            <p className="text-text-secondary leading-relaxed mb-4">
              As a data analyst and immigrant, I built this project to understand what AI is
              <em> really</em> doing to the global workforce — not the hype, not the doom, just
              what the data says. I analyzed 12+ datasets from government agencies, international
              organizations, and research institutions to find the patterns.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              This project demonstrates full-stack data analytics capabilities: Python ETL pipelines,
              statistical analysis, machine learning models, SQL query design, a React visualization
              dashboard, and a RAG-powered Q&A system.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Every number on this dashboard is traceable to a verified public source. No data
              was fabricated or hallucinated. Where data is uncertain or contested, I've noted
              the limitations explicitly.
            </p>
          </div>

          <div className="card text-left mb-8">
            <h3 className="text-lg font-semibold mb-3">Skills Demonstrated</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Python (Pandas, NumPy)',
                'SQL (Window functions, CTEs)',
                'Machine Learning (Scikit-learn)',
                'XGBoost & TensorFlow',
                'Data Visualization (Recharts)',
                'React 18 & Tailwind CSS',
                'ETL Pipeline Design',
                'Statistical Analysis',
                'LangChain & RAG',
                'API Integration',
                'Git & CI/CD',
                'Data Storytelling',
              ].map((skill) => (
                <div key={skill} className="px-3 py-2 rounded-lg bg-primary/50 border border-white/[0.06] text-xs text-text-secondary">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Github size={20} />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Linkedin size={20} />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href="mailto:rishisolanke57@gmail.com"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Mail size={20} />
              <span className="text-sm">Email</span>
            </a>
          </div>

          <p className="mt-8 text-xs text-text-secondary/40">
            Built by Rushikesh Solanke | 2025
          </p>
        </div>
      </div>
    </section>
  );
}
