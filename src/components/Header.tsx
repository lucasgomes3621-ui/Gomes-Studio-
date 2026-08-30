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
    <header className="sticky top-0 z-40 bg-[#070d1a]/95 backdrop-blur-md border-b border-[#1e293b] px-4 py-3 transition-all shadow-lg shadow-black/40">
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
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-blue-300 border border-[#2d3449] transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden xs:inline">Exemplo</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPDF}
              title="Baixar backup do briefing em PDF"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-amber-300 border border-[#2d3449] transition active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              type="button"
              onClick={onToggleAll}
              title={allExpanded ? "Recolher todas" : "Expandir todas"}
              className="p-1.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#94a3b8] hover:text-[#f8fafc] border border-[#2d3449] transition active:scale-95"
            >
              {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClear}
              title="Limpar formulário"
              className="p-1.5 rounded-lg bg-[#171f33] hover:bg-red-950/40 text-[#94a3b8] hover:text-red-400 border border-[#2d3449] transition active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="mt-2.5">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-[#94a3b8] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Progresso do Briefing
            </span>
            <span className="text-blue-300 font-semibold">
              {progress.filledCount} / {progress.totalCount} ({progress.percentage}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#171f33] rounded-full overflow-hidden border border-[#222a3d]">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
