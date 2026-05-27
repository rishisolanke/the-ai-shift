import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import { GLOSSARY } from '../data/glossary';

export default function InfoTooltip({ term, children }) {
  const definition = children || GLOSSARY[term];
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = popoverRef.current ? popoverRef.current.offsetHeight : 120;
    const popoverWidth = 280;
    const margin = 8;
    const headerHeight = 48;

    const spaceAbove = rect.top - headerHeight;
    let top = spaceAbove >= popoverHeight + margin
      ? rect.top - popoverHeight - margin
      : rect.bottom + margin;

    top = Math.max(headerHeight + 8, Math.min(top, window.innerHeight - popoverHeight - 8));

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 16) {
      left = window.innerWidth - popoverWidth - 16;
    }
    left = Math.max(16, left);

    setPos({ top, left });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  useLayoutEffect(() => {
    if (open && popoverRef.current) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (triggerRef.current?.contains(e.target)) return;
      if (popoverRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  if (!definition) return null;

  return (
    <>
      <span className="inline-flex items-center gap-0.5 ml-0.5">
        <span className="underline decoration-dotted decoration-text-faint underline-offset-2 cursor-help" onClick={() => setOpen(!open)}>{term}</span>
        <button
          ref={triggerRef}
          onClick={() => setOpen(!open)}
          className="text-text-faint hover:text-accent-green transition-colors"
          aria-label={`What is ${term}?`}
        >
          <Info size={11} />
        </button>
      </span>
      {open && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            zIndex: 9999,
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            maxWidth: 'calc(100vw - 32px)',
          }}
          className="w-72 p-3.5 rounded-xl bg-[#0a0a0a] border border-accent-green/20 shadow-2xl shadow-black/60 text-xs leading-relaxed"
        >
          <p className="font-semibold text-accent-green mb-1.5 text-[10px] uppercase tracking-wider">
            {term}
          </p>
          <p className="text-text-secondary">{definition}</p>
        </div>,
        document.body
      )}
    </>
  );
}
