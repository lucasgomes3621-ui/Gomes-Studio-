import React from 'react';
import { BriefingData, StepId } from '../types';
import {
  FileText,
  User,
  Building2,
  Target,
  Layers,
  Sparkles,
  FolderUp,
  Send,
  Edit3,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Step8Props {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
  onJumpToStep: (stepId: StepId) => void;
  errors?: Record<string, string>;
}

export const Step8Review: React.FC<Step8Props> = ({
  data,
  onChange,
  onJumpToStep,
  errors,
}) => {
  const infoAdd = data.informacoesAdicionais || {
    detalhesExtras: '',
    concordouPrivacidade: false,
  };

  const handleDetalhesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange((prev) => ({
      ...prev,
      informacoesAdicionais: {
        ...prev.informacoesAdicionais,
        detalhesExtras: val,
      },
      adicionais: {
        ...prev.adicionais,
        outrasInfo: val,
      },
    }));
  };

  const handlePrivacidadeToggle = () => {
    onChange((prev) => ({
      ...prev,
      informacoesAdicionais: {
        ...prev.informacoesAdicionais,
        concordouPrivacidade: !prev.informacoesAdicionais?.concordouPrivacidade,
      },
      checklist: {
        ...prev.checklist,
        confirmou: !prev.informacoesAdicionais?.concordouPrivacidade,
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div>
        <span className="text-[11px] font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
          Etapa 08 · Revisão & Confirmação
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          Quase pronto.
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
          Confira o resumo das suas informações antes de enviar o briefing para a Gomes Studio.
        </p>
      </div>

      {/* Additional Notes Textarea */}
      <div className="p-4 rounded-2xl bg-[#090D14]/80 border border-white/[0.08] space-y-2">
        <label className="block text-xs font-semibold text-[#E2E8F0] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
            Tem algo mais que devemos saber?
          </span>
          <span className="text-[10px] text-[#64748B]">Opcional</span>
        </label>
        <textarea
          rows={3}
          value={infoAdd.detalhesExtras}
          onChange={handleDetalhesChange}
          placeholder="Conte qualquer informação, preferência ou detalhe que possa ajudar no desenvolvimento do projeto..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D121D] border border-white/10 hover:border-white/20 focus:border-[#0066FF] text-sm text-white placeholder-[#475569] transition-all focus:outline-none resize-none leading-relaxed"
        />
        <p className="text-[11px] text-[#64748B]">
          Quanto mais contexto tivermos, melhor poderemos compreender sua necessidade.
        </p>
      </div>

      {/* Review Blocks Grid */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Resumo do Briefing
          </h3>
          <span className="text-[10px] text-[#64748B]">Você pode editar qualquer bloco</span>
        </div>

        {/* 01 Sobre Você */}
        <div className="p-3.5 rounded-xl bg-[#090D14] border border-white/10 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <User className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>01. Sobre Você</span>
            </div>
            <p className="text-xs text-[#E2E8F0] font-medium">
              {data.sobreVoce?.nome || <span className="text-red-400">Nome não preenchido</span>}
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              {data.sobreVoce?.email || 'Sem e-mail'} • {data.sobreVoce?.whatsapp || 'Sem WhatsApp'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(1)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-[#38BDF8] border border-white/10 flex items-center gap-1 shrink-0 transition cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar</span>
          </button>
        </div>

        {/* 02 Sobre o Negócio */}
        <div className="p-3.5 rounded-xl bg-[#090D14] border border-white/10 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>02. Sobre o Negócio</span>
            </div>
            <p className="text-xs text-[#E2E8F0] font-medium">
              {data.sobreNegocio?.nomeEmpresa || <span className="text-red-400">Empresa não informada</span>}
              {data.sobreNegocio?.segmento ? ` (${data.sobreNegocio.segmento})` : ''}
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              {[data.sobreNegocio?.cidade, data.sobreNegocio?.estado].filter(Boolean).join(' - ') || 'Sem localização'} • {data.sobreNegocio?.regioesAtendimento || 'Região não especificada'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(2)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-[#38BDF8] border border-white/10 flex items-center gap-1 shrink-0 transition cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar</span>
          </button>
        </div>

        {/* 03 Objetivo */}
        <div className="p-3.5 rounded-xl bg-[#090D14] border border-white/10 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Target className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>03. Objetivo da Página</span>
            </div>
            <p className="text-xs text-[#E2E8F0] font-medium">
              {data.objetivo?.principal || <span className="text-red-400">Nenhum objetivo selecionado</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(3)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-[#38BDF8] border border-white/10 flex items-center gap-1 shrink-0 transition cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar</span>
          </button>
        </div>

        {/* 04 Projeto */}
        <div className="p-3.5 rounded-xl bg-[#090D14] border border-white/10 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>04. Sobre o Projeto</span>
            </div>
            <p className="text-xs text-[#E2E8F0] truncate">
              {data.projeto?.produtosServicos || 'Itens não detalhados'}
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              Textos: {data.projeto?.possuiTextos || 'Não informado'} • Identidade: {data.projeto?.possuiIdentidadeVisual || 'Não informado'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(4)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-[#38BDF8] border border-white/10 flex items-center gap-1 shrink-0 transition cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar</span>
          </button>
        </div>

        {/* 05 Referências e Estilo */}
        <div className="p-3.5 rounded-xl bg-[#090D14] border border-white/10 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>05. Referências e Estilo</span>
            </div>
            <p className="text-xs text-[#E2E8F0]">
              {data.referenciasEstilo?.estilos && data.referenciasEstilo.estilos.length > 0
                ? data.referenciasEstilo.estilos.join(', ')
                : 'Estilos livres a definir com a Gomes Studio'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(5)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-[#38BDF8] border border-white/10 flex items-center gap-1 shrink-0 transition cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar</span>
          </button>
        </div>

        {/* 06 Materiais */}
        <div className="p-3.5 rounded-xl bg-[#090D14] border border-white/10 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FolderUp className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>06. Materiais</span>
            </div>
            <p className="text-xs text-[#E2E8F0]">
              {data.materiais?.arquivosUpload?.length
                ? `${data.materiais.arquivosUpload.length} arquivo(s) anexado(s)`
                : data.materiais?.linkDrive
                ? 'Link da nuvem informado'
                : 'Materiais serão enviados no atendimento'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(6)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-[#38BDF8] border border-white/10 flex items-center gap-1 shrink-0 transition cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar</span>
          </button>
        </div>

        {/* 07 Contato */}
        <div className="p-3.5 rounded-xl bg-[#090D14] border border-white/10 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Send className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>07. Contato e Direcionamento</span>
            </div>
            <p className="text-xs text-[#E2E8F0]">
              Canal principal: <strong className="text-[#38BDF8]">{data.contato?.canalPrincipal || 'WhatsApp'}</strong>
              {data.contato?.canalPrincipalValor ? ` (${data.contato.canalPrincipalValor})` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(7)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-[#38BDF8] border border-white/10 flex items-center gap-1 shrink-0 transition cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar</span>
          </button>
        </div>
      </div>

      {/* Discrete Privacy Checkbox */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-white/10 space-y-2">
        <label
          onClick={handlePrivacidadeToggle}
          className="flex items-start gap-3 cursor-pointer select-none"
        >
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              infoAdd.concordouPrivacidade
                ? 'border-[#38BDF8] bg-[#0066FF] text-white shadow-[0_0_10px_rgba(0,102,255,0.6)]'
                : 'border-white/20 bg-white/5'
            }`}
          >
            {infoAdd.concordouPrivacidade && <CheckCircle2 className="w-4 h-4" />}
          </div>
          <div className="text-xs text-[#E2E8F0] leading-relaxed">
            <span className="font-semibold text-white">
              Concordo em fornecer estas informações para contato sobre meu projeto.
            </span>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              Seus dados serão utilizados exclusivamente para entender e dar andamento ao seu projeto pela equipe da GOMES STUDIO.
            </p>
          </div>
        </label>
        {errors?.privacidade && (
          <p className="text-xs text-red-400 pl-8">{errors.privacidade}</p>
        )}
      </div>
    </div>
  );
};
