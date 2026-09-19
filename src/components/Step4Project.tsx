import React from 'react';
import { BriefingData } from '../types';
import { Layers, FileText, Palette, Star } from 'lucide-react';

interface Step4Props {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
  errors?: Record<string, string>;
}

const TEXTOS_OPTIONS: Array<{
  id: BriefingData['projeto']['possuiTextos'];
  label: string;
  desc: string;
}> = [
  {
    id: 'Sim, já tenho',
    label: 'Sim, já tenho tudo escrito',
    desc: 'Tenho os textos organizados e prontos para inserção.',
  },
  {
    id: 'Tenho parte do conteúdo',
    label: 'Tenho parte do conteúdo',
    desc: 'Tenho algumas ideias e tópicos principais, mas preciso de apoio na lapidação.',
  },
  {
    id: 'Não, preciso de orientação',
    label: 'Não, preciso de orientação',
    desc: 'Gostaria que a Gomes Studio me orientasse na criação da copy e mensagens.',
  },
];

const IDENTIDADE_OPTIONS: Array<{
  id: BriefingData['projeto']['possuiIdentidadeVisual'];
  label: string;
  desc: string;
}> = [
  {
    id: 'Sim, tenho logo e identidade visual',
    label: 'Tenho logo e identidade visual',
    desc: 'Tenho manual de marca, paleta de cores e tipografia definidos.',
  },
  {
    id: 'Tenho apenas o logo',
    label: 'Tenho apenas o logotipo',
    desc: 'Possuo arquivo do logo em imagem/vetor para ser aplicado.',
  },
  {
    id: 'Ainda não tenho',
    label: 'Ainda não tenho',
    desc: 'Estou começando agora e não possuo logotipo ou marca desenhada.',
  },
  {
    id: 'Preciso de orientação',
    label: 'Preciso de orientação',
    desc: 'Gostaria de sugestões visuais da equipe da Gomes Studio.',
  },
];

export const Step4Project: React.FC<Step4Props> = ({ data, onChange }) => {
  const projeto = data.projeto || {
    produtosServicos: '',
    infoIndispensaveis: '',
    possuiTextos: '',
    possuiIdentidadeVisual: '',
  };

  const updateField = (field: keyof typeof projeto, value: any) => {
    onChange((prev) => ({
      ...prev,
      projeto: {
        ...prev.projeto,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div>
        <span className="text-[11px] font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
          Etapa 04 · Conteúdo & Estrutura
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          O que você gostaria de apresentar?
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
          Agora vamos entender o conteúdo que sua página precisa ter para encantar seus clientes.
        </p>
      </div>

      {/* Produtos ou Serviços */}
      <div className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            Quais produtos ou serviços precisam aparecer?
          </label>
          <textarea
            rows={4}
            value={projeto.produtosServicos}
            onChange={(e) => updateField('produtosServicos', e.target.value)}
            placeholder="Ex.:&#10;1. Consultoria de planejamento financeiro&#10;2. Gestão de investimentos para famílias&#10;3. Treinamento in-company"
            className="w-full px-3.5 py-3 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 text-sm text-white placeholder-[#475569] transition-all focus:outline-none resize-none leading-relaxed"
          />
          <p className="text-[11px] text-[#64748B] mt-1">
            Liste os principais itens que devem ter destaque na página.
          </p>
        </div>

        {/* Informações Indispensáveis */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            Quais informações são indispensáveis?
          </label>
          <textarea
            rows={3}
            value={projeto.infoIndispensaveis}
            onChange={(e) => updateField('infoIndispensaveis', e.target.value)}
            placeholder="Ex.: Depoimentos reais, formas de pagamento facilitadas, certificações, garantia de 30 dias, botões de ação para o WhatsApp..."
            className="w-full px-3.5 py-3 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 text-sm text-white placeholder-[#475569] transition-all focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Você já possui textos para a página? */}
        <div className="p-4 rounded-2xl bg-[#090D14]/80 border border-white/[0.08] space-y-3">
          <label className="block text-xs font-semibold text-[#E2E8F0] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
            Você já possui textos para a página?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {TEXTOS_OPTIONS.map((opt) => {
              const isSelected = projeto.possuiTextos === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateField('possuiTextos', opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#0066FF]/20 border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'bg-[#0D121D] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#38BDF8]' : 'text-white'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                        isSelected
                          ? 'border-[#38BDF8] bg-[#0066FF] text-white'
                          : 'border-white/20'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-snug">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Você possui identidade visual? */}
        <div className="p-4 rounded-2xl bg-[#090D14]/80 border border-white/[0.08] space-y-3">
          <label className="block text-xs font-semibold text-[#E2E8F0] flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#38BDF8]" />
            Você possui identidade visual?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {IDENTIDADE_OPTIONS.map((opt) => {
              const isSelected = projeto.possuiIdentidadeVisual === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateField('possuiIdentidadeVisual', opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#0066FF]/20 border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'bg-[#0D121D] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#38BDF8]' : 'text-white'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                        isSelected
                          ? 'border-[#38BDF8] bg-[#0066FF] text-white'
                          : 'border-white/20'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-snug">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
