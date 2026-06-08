import { Github, Linkedin, Mail } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="border-t border-white/[0.06]">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">About This Project</h2>

          <div className="card text-left mb-8">
            <p className="text-text-secondary leading-relaxed mb-4">
              I built this project because addiction is one of the most misunderstood public-health
              crises we face — clouded by stigma, headlines, and moral panic. So I went straight to the
              data. I pulled from the most authoritative public sources I could find — the CDC, SAMHSA,
              NIDA, and the WHO — to see what the numbers actually say about substance and behavioral addiction.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              The goal isn't to alarm, but to clarify: who's affected, what it costs, where the system is
              failing, and where there's genuine reason for hope — like the 2024 drop in overdose deaths and
              the fact that most people who have struggled with addiction do recover.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Every number on this dashboard traces back to a verified public source. Nothing was
              made up. Where data is uncertain or debated, I've called that out directly.
            </p>
          </div>

          <div className="card text-left mb-8">
            <h3 className="text-lg font-semibold mb-3">What This Covers</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Overdose & mortality',
                'Substance use disorders',
                'Alcohol & tobacco',
                'Opioids & fentanyl',
                'Behavioral addiction',
                'Screens & social media',
                'Demographics & age of onset',
                'Youth vaping trends',
                'The economic cost',
                'The treatment gap',
                'Recovery & MAT',
                'The global picture',
              ].map((skill) => (
                <div key={skill} className="px-3 py-2 rounded-lg bg-primary/50 border border-white/[0.06] text-xs text-text-secondary">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/rishisolanke/the-ai-shift"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Github size={20} />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/rushikesh-solanke"
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
            Built by Rushikesh Solanke | 2026
          </p>
        </div>
      </div>
    </section>
  );
}
