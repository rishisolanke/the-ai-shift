import { ExternalLink } from 'lucide-react';

export default function SourceCitation({ sources }) {
  return (
    <div className="mt-8 pt-6 border-t border-white/[0.06]">
      <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
        Data Sources
      </h4>
      <ul className="space-y-1">
        {sources.map((src, i) => (
          <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
            <ExternalLink size={12} className="mt-0.5 flex-shrink-0 text-text-muted" />
            <span>
              {src.name}
              {src.url && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-accent-green hover:underline"
                >
                  [link]
                </a>
              )}
              {src.accessed && <span className="text-text-faint"> (accessed {src.accessed})</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
