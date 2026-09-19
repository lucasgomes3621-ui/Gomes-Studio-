import React from 'react';
import { StepId } from '../types';
import { STEPS } from '../utils/briefingDefaults';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: StepId;
  onStepClick: (stepId: StepId) => void;
  stepsCompleted: boolean[];
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onStepClick,
  stepsCompleted,
}) => {
  return (
    <div className="w-full">
      {/* Desktop/Tablet Stepper Bar */}
      <div className="hidden md:flex items-center justify-between gap-1 overflow-x-auto py-2 no-scrollbar">
        {STEPS.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const isDone = stepsCompleted[index];
          const isPast = step.id < currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step.id)}
              className={`flex-1 flex items-center gap-2 p-2 rounded-xl transition-all cursor-pointer text-left border ${
                isCurrent
                  ? 'bg-[#0066FF]/10 border-[#0066FF]/40 shadow-[0_0_15px_rgba(0,102,255,0.15)]'
                  : isDone
                  ? 'bg-[#0c1322] border-white/10 hover:border-white/20'
                  : 'bg-[#080c14]/60 border-white/[0.04] opacity-70 hover:opacity-100 hover:border-white/10'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-[#0066FF] text-white shadow-[0_0_10px_rgba(0,102,255,0.8)]'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isPast
                    ? 'bg-white/10 text-white/70'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                {isDone && !isCurrent ? <Check className="w-3.5 h-3.5" /> : step.numberStr}
              </div>
              <div className="min-w-0 flex-1 truncate">
                <p
                  className={`text-[11px] font-medium truncate ${
                    isCurrent ? 'text-[#38BDF8] font-bold' : isDone ? 'text-white' : 'text-[#94A3B8]'
                  }`}
                >
                  {step.shortTitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Step Chips Slider */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        {STEPS.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const isDone = stepsCompleted[index];

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border shrink-0 ${
                isCurrent
                  ? 'bg-[#0066FF]/20 border-[#38BDF8]/60 text-white shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : isDone
                  ? 'bg-[#0D1525] border-emerald-500/30 text-emerald-400'
                  : 'bg-[#080c14] border-white/5 text-[#94A3B8]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold ${
                  isCurrent
                    ? 'bg-[#0066FF] text-white'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/10 text-white/50'
                }`}
              >
                {isDone && !isCurrent ? '✓' : step.id}
              </span>
              <span className="text-[11px]">{step.shortTitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
