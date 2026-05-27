import { useState } from 'react';
import { Menu, X, Github, Linkedin } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'employment', label: 'Employment' },
  { id: 'sectors', label: 'Sectors' },
  { id: 'countries', label: 'Countries' },
  { id: 'environment', label: 'Environment' },
  { id: 'economic', label: 'Economic Paradox' },
  { id: 'skills', label: 'Skills Gap' },
  { id: 'ml-insights', label: 'ML Insights' },
  { id: 'methodology', label: 'Methodology' },
];

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/[0.85] backdrop-blur-[20px] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <a href="#" className="font-mono font-bold text-lg text-accent-green tracking-tight">
              THE AI SHIFT
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-green transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-green transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <button
                className="lg:hidden text-text-muted hover:text-text-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-primary-light border-t border-white/[0.06]">
            <nav className="px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="px-3 py-2 text-sm text-text-muted hover:text-text-primary rounded-lg hover:bg-white/[0.06]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="pt-12">{children}</main>

      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-secondary text-sm">
            Built by <span className="text-accent-green font-medium">Rushikesh Solanke</span> |
            Data sourced from BLS, World Bank, IMF, EPA, Census Bureau, and more
          </p>
          <p className="text-text-muted text-xs mt-2">
            Every number is traceable to a verified public source. No data was fabricated.
          </p>
        </div>
      </footer>
    </div>
  );
}
