import React from 'react';
import { Sparkles, Trash2, FileDown } from 'lucide-react';
import { GomesStudioHeaderLogo } from './GomesStudioBrand';
import { StepId } from '../types';
import { STEPS } from '../utils/briefingDefaults';

interface HeaderProps {
  currentStep: StepId;
  progress: { filledCount: number; totalCount: number; percentage: number };
  onFillSample: () => void;
  onClear: () => void;
  onDownloadPDF: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  progress,
  onFillSample,
  onClear,
  onDownloadPDF,
}) => {
  const currentStepConfig = STEPS.find((s) => s.id === currentStep) || STEPS[0];

  return (
    <header className="sticky top-0 z-40 bg-[#07090C]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-2xl mx-auto">
        {/* Top bar: Brand + Quick Actions */}
        <div className="flex items-center justify-between gap-3">
          <GomesStudioHeaderLogo />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onFillSample}
              title="Preencher com dados de exemplo para testar"
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[#0F1218] hover:bg-[#161B24] text-[#38BDF8] border border-white/10 hover:border-[#38BDF8]/40 transition active:scale-95 cursor-pointer font-mono"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden xs:inline text-[11px]">Exemplo</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPDF}
              title="Baixar cópia do briefing em PDF"
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[#0F1218] hover:bg-[#161B24] text-amber-300 border border-white/10 hover:border-amber-400/40 transition active:scale-95 cursor-pointer font-mono"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">PDF</span>
            </button>

            <button
              type="button"
              onClick={onClear}
              title="Limpar formulário"
              className="p-1.5 rounded-lg bg-[#0F1218] hover:bg-red-950/30 text-[#94A3B8] hover:text-red-400 border border-white/10 hover:border-red-500/30 transition active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress & Current Step Sub-bar */}
        <div className="mt-2.5">
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-[#94A3B8] font-medium flex items-center gap-1.5 text-[11px] truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse shrink-0" />
              <strong className="text-white font-semibold">ETAPA {currentStep} DE 8</strong>
              <span className="text-[#64748B] hidden sm:inline">·</span>
              <span className="text-[#38BDF8] truncate hidden sm:inline">
                {currentStepConfig.title.toUpperCase()}
              </span>
            </span>
            <span className="text-[#38BDF8] font-semibold text-[11px] shrink-0 font-mono ml-2">
              {progress.percentage}% concluído
            </span>
          </div>

          {/* Minimalist Progress Track */}
          <div className="w-full h-1.5 bg-[#0F1218] rounded-full overflow-hidden border border-white/[0.08]">
            <div
              className="h-full bg-gradient-to-r from-[#0066FF] via-[#0EA5E9] to-[#38BDF8] transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.6)]"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
