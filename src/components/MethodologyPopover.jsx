import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

export default function MethodologyPopover({ text }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: 'above' });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = popoverRef.current
      ? popoverRef.current.offsetHeight
      : 180;
    const popoverWidth = 320;
    const margin = 8;
    const headerHeight = 48;

    const spaceAbove = rect.top - headerHeight;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement = spaceAbove >= popoverHeight + margin ? 'above' : 'below';

    let top = placement === 'above'
      ? rect.top - popoverHeight - margin
      : rect.bottom + margin;

    top = Math.max(headerHeight + 8, Math.min(top, window.innerHeight - popoverHeight - 8));

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 16) {
      left = window.innerWidth - popoverWidth - 16;
    }
    left = Math.max(16, left);

    setPos({ top, left, placement });
  }, []);

  // Position on open + scroll/resize tracking
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

  // Refine position after popover mounts (actual height now known)
  useLayoutEffect(() => {
    if (open && popoverRef.current) {
      updatePosition();
    }
  }, [open, updatePosition]);

  // Click outside to close
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

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  if (!text) return null;

  return (
    <>
      <span className="inline-flex items-center ml-1.5">
        <button
          ref={triggerRef}
          onClick={() => setOpen(!open)}
          className="text-[#666] hover:text-[#00e676] transition-colors"
          aria-label="Show methodology"
        >
          <Info size={12} />
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
          className="w-80 p-4 rounded-xl bg-[#1a1a1a] border border-[#00e676]/30 shadow-2xl shadow-black/50 text-xs text-[#d0d0d0] leading-relaxed backdrop-blur-sm"
        >
          <p className="font-semibold text-[#00e676] mb-2 text-[11px] uppercase tracking-wider">
            How this was calculated
          </p>
          <p className="text-[#ccc]">{text}</p>
        </div>,
        document.body
      )}
    </>
  );
}
