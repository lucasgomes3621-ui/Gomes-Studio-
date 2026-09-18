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
      className={`rounded-2xl border transition-all duration-200 overflow-hidden mb-3.5 backdrop-blur-md ${
        isOpen
          ? 'bg-[#090D14]/95 border-[#0066FF]/80 shadow-[0_8px_32px_rgba(0,102,255,0.2)]'
          : 'bg-[#090D14]/80 border-white/[0.08] hover:border-white/20'
      }`}
    >
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left bg-[#0D121C]/80 hover:bg-[#121824] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors ${
              isOpen
                ? 'bg-[#0066FF]/20 text-[#38BDF8] border border-[#0066FF]/40'
                : isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-white/[0.06] text-[#94A3B8] border border-white/[0.05]'
            }`}
          >
            {icon}
          </div>
          <span className="text-sm font-bold text-white truncate tracking-tight">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {isCompleted && !isOpen && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" />
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#94A3B8]"
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
            <div className="p-4 sm:p-5 border-t border-white/[0.08] space-y-4">
              {children}

              {/* Step Navigation Inside Section */}
              <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-2 mt-4">
                {onPrev ? (
                  <button
                    type="button"
                    onClick={onPrev}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0F1420] hover:bg-[#161D2C] text-[#94A3B8] hover:text-white border border-white/10 transition active:scale-95 cursor-pointer font-mono"
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
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white transition active:scale-95 shadow-[0_0_16px_rgba(0,102,255,0.4)] ml-auto cursor-pointer font-mono"
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

