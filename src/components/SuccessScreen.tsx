import React from 'react';
import { BriefingData } from '../types';
import { GomesStudioLogoImage } from './GomesStudioBrand';
import {
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  FileDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SuccessScreenProps {
  data: BriefingData;
  onReset: () => void;
  onDownloadPDF: () => void;
  onOpenWhatsApp: () => void;
  submissionCode: string;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  data,
  onReset,
  onDownloadPDF,
  onOpenWhatsApp,
  submissionCode,
}) => {
  const companyName = data.sobreNegocio?.nomeEmpresa || data.sobreVoce?.nome || 'Cliente';
  const clientName = data.sobreVoce?.nome || 'Cliente';
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-center space-y-6 animate-fadeIn">
      {/* Visual Success Emblem */}
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0 bg-[#0066FF] rounded-full blur-2xl opacity-40 animate-pulse" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0A1224] to-[#0F1B36] border border-[#38BDF8]/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,102,255,0.4)]">
          <CheckCircle2 className="w-10 h-10 text-[#38BDF8]" />
        </div>
      </div>

      {/* Main Title & Confirmation */}
      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066FF]/15 border border-[#38BDF8]/30 text-[11px] font-mono text-[#38BDF8]">
          <Sparkles className="w-3 h-3" />
          BRIEFING DE PRESENÇA DIGITAL CONCLUÍDO
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Briefing recebido.
        </h1>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
          Obrigado por compartilhar os detalhes do seu projeto, <strong className="text-white">{clientName}</strong>.
          Agora temos as informações necessárias para entender melhor sua necessidade e avaliar a melhor estrutura para sua página.
        </p>
        <p className="text-xs text-[#38BDF8] font-medium max-w-md mx-auto">
          Em breve, a GOMES STUDIO entrará em contato para alinhar os próximos passos.
        </p>
      </div>

      {/* Confirmation Receipt Card */}
      <div className="p-5 rounded-2xl bg-[#070A10] border border-white/10 text-left space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <GomesStudioLogoImage heightClass="h-5" />
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              COMPROVANTE DE ENVIO
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#38BDF8]">{submissionCode}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[#64748B] block text-[10px] font-mono">EMPRESA:</span>
            <span className="text-white font-medium truncate block">{companyName}</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px] font-mono">CANAL PRINCIPAL:</span>
            <span className="text-[#38BDF8] font-medium block">{data.contato?.canalPrincipal || 'WhatsApp'}</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px] font-mono">OBJETIVO:</span>
            <span className="text-[#E2E8F0] block truncate">{data.objetivo?.principal || 'Presença Digital'}</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px] font-mono">REGISTRADO EM:</span>
            <span className="text-[#94A3B8] font-mono text-[11px] block">{today}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Main CTA: Voltar para Gomes Studio */}
        <a
          href="https://lucasgomes3621-ui.github.io/Gomes-Studio-/"
          target="_blank"
          rel="noreferrer"
          className="w-full py-3.5 px-5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,102,255,0.4)] cursor-pointer"
        >
          <span>Voltar para a GOMES STUDIO</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onOpenWhatsApp}
            className="py-3 px-4 rounded-xl bg-[#0D1627] hover:bg-[#121F38] text-emerald-400 text-xs font-bold border border-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Falar pelo WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            className="py-3 px-4 rounded-xl bg-[#0D1627] hover:bg-[#121F38] text-amber-300 text-xs font-bold border border-amber-500/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <FileDown className="w-4 h-4 text-amber-400" />
            <span>Baixar Cópia em PDF</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#64748B] hover:text-[#94A3B8] transition inline-flex items-center gap-1.5 pt-2 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Iniciar novo briefing</span>
        </button>
      </div>

      {/* Final Signature Slogan */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-xs font-medium text-[#94A3B8] italic">
          "Seu projeto começa com uma boa apresentação."
        </p>
        <p className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider mt-1">
          GOMES STUDIO · DESIGN QUE CONECTA, SOLUÇÕES QUE IMPULSIONAM
        </p>
      </div>
    </div>
  );
};
