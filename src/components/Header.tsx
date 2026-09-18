import React from 'react';
import { Sparkles, Trash2, CheckCircle2, ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import { GomesStudioHeaderLogo } from './GomesStudioBrand';

interface HeaderProps {
  progress: { filledCount: number; totalCount: number; percentage: number };
  onFillSample: () => void;
  onClear: () => void;
  onToggleAll: () => void;
  allExpanded: boolean;
  onDownloadPDF: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onFillSample,
  onClear,
  onToggleAll,
  allExpanded,
  onDownloadPDF,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#07090C]/90 backdrop-blur-md border-b border-white/[0.08] px-4 py-3 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-2xl mx-auto">
        {/* Main Brand & Action Tools */}
        <div className="flex items-center justify-between gap-3">
          <GomesStudioHeaderLogo />

          {/* Action Tools */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onFillSample}
              title="Preencher com dados de exemplo"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#0F1218] hover:bg-[#161B24] text-[#38BDF8] border border-white/10 hover:border-[#38BDF8]/40 transition active:scale-95 cursor-pointer font-mono"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden xs:inline text-[11px]">Exemplo</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPDF}
              title="Baixar cópia do briefing em PDF"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#0F1218] hover:bg-[#161B24] text-amber-300 border border-white/10 hover:border-amber-400/40 transition active:scale-95 cursor-pointer font-mono"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">PDF</span>
            </button>

            <button
              type="button"
              onClick={onToggleAll}
              title={allExpanded ? "Recolher todas as seções" : "Expandir todas as seções"}
              className="p-1.5 rounded-lg bg-[#0F1218] hover:bg-[#161B24] text-[#94A3B8] hover:text-white border border-white/10 hover:border-white/20 transition active:scale-95 cursor-pointer"
            >
              {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

        {/* Progress Bar & Percentage */}
        <div className="mt-2.5">
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-[#94A3B8] font-medium flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              PROGRESSO DO BRIEFING
            </span>
            <span className="text-[#38BDF8] font-semibold text-[11px]">
              {progress.filledCount} / {progress.totalCount} ({progress.percentage}%)
            </span>
          </div>
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

