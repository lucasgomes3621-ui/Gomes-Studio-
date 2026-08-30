import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface SectionItemProps {
  id: number;
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  children: ReactNode;
  isCompleted?: boolean;
}

export const SectionItem: React.FC<SectionItemProps> = ({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  onPrev,
  onNext,
  children,
  isCompleted,
}) => {
  return (
    <div
      id={`section-${id}`}
      className={`rounded-xl border transition-all duration-200 overflow-hidden mb-3 ${
        isOpen
          ? 'bg-[#131b2e] border-blue-600/80 shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
          : 'bg-[#131b2e]/90 border-[#222a3d] hover:border-[#334155]'
      }`}
    >
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left bg-[#171f33]/70 hover:bg-[#171f33] transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors ${
              isOpen
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                : isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#222a3d] text-[#94a3b8]'
            }`}
          >
            {icon}
          </div>
          <span className="text-sm font-semibold text-[#f8fafc] truncate tracking-tight">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {isCompleted && !isOpen && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-900/50" />
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#94a3b8]"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </button>

      {/* Accordion Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <div className="p-4 border-t border-[#222a3d] space-y-3.5">
              {children}

              {/* Step Navigation Inside Section */}
              <div className="pt-3 border-t border-[#222a3d] flex items-center justify-between gap-2 mt-4">
                {onPrev ? (
                  <button
                    type="button"
                    onClick={onPrev}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#171f33] hover:bg-[#222a3d] text-[#94a3b8] hover:text-[#f8fafc] border border-[#2d3449] transition active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Anterior
                  </button>
                ) : (
                  <div />
                )}

                {onNext && (
                  <button
                    type="button"
                    onClick={onNext}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95 shadow-sm shadow-blue-500/20 ml-auto"
                  >
                    Próximo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
