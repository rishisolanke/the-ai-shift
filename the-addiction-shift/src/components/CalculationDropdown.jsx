import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function CalculationDropdown({ text, compact = false }) {
  const [open, setOpen] = useState(false);

  if (!text) return null;

  return (
    <div className={compact ? 'mt-2' : 'mt-4'}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-accent-green hover:text-accent-green/80 transition-colors group"
      >
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ChevronDown size={compact ? 12 : 14} />
        </motion.span>
        <span className={`${compact ? 'text-[10px]' : 'text-xs'} font-medium`}>
          How was this calculated?
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className={`${compact ? 'text-[11px] pt-2' : 'text-xs pt-3'} text-text-muted leading-relaxed border-t border-white/[0.06] mt-2`}>
              {text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
