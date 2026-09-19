import React from 'react';
import { BriefingData } from '../types';
import {
  Globe,
  Briefcase,
  Package,
  MessageCircle,
  ShoppingBag,
  Megaphone,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface Step3Props {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
  errors?: Record<string, string>;
}

interface ObjectiveOption {
  id: BriefingData['objetivo']['principal'];
  title: string;
  description: string;
  icon: React.ElementType;
}

const OBJECTIVES: ObjectiveOption[] = [
  {
    id: 'APRESENTAR MINHA EMPRESA',
    title: 'Apresentar minha empresa',
    description: 'Quero criar uma presença profissional na internet.',
    icon: Globe,
  },
  {
    id: 'DIVULGAR MEUS SERVIÇOS',
    title: 'Divulgar meus serviços',
    description: 'Quero apresentar meus serviços de forma clara e profissional.',
    icon: Briefcase,
  },
  {
    id: 'DIVULGAR UM PRODUTO',
    title: 'Divulgar um produto',
    description: 'Quero destacar um produto, lançamento ou oferta especial.',
    icon: Package,
  },
  {
    id: 'RECEBER CONTATOS',
    title: 'Receber contatos',
    description: 'Quero gerar contatos e oportunidades pelo WhatsApp ou outros canais.',
    icon: MessageCircle,
  },
  {
    id: 'RECEBER PEDIDOS',
    title: 'Receber pedidos',
    description: 'Quero direcionar clientes para pedidos rápidos ou atendimento de balcão.',
    icon: ShoppingBag,
  },
  {
    id: 'DIVULGAR UMA CAMPANHA',
    title: 'Divulgar uma campanha',
    description: 'Quero uma página específica para uma promoção, evento ou campanha temática.',
    icon: Megaphone,
  },
  {
    id: 'OUTRO',
    title: 'Outro objetivo',
    description: 'Tenho outro objetivo e gostaria de descrever em detalhes.',
    icon: HelpCircle,
  },
];

export const Step3Objective: React.FC<Step3Props> = ({ data, onChange, errors }) => {
  const objetivo = data.objetivo || { principal: '', outroDescricao: '' };

  const handleSelect = (id: BriefingData['objetivo']['principal']) => {
    onChange((prev) => ({
      ...prev,
      objetivo: {
        ...prev.objetivo,
        principal: id,
      },
    }));
  };

  const handleOutroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange((prev) => ({
      ...prev,
      objetivo: {
        ...prev.objetivo,
        outroDescricao: val,
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div>
        <span className="text-[11px] font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
          Etapa 03 · Foco Estratégico
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          Qual é o principal objetivo da sua página?
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
          Essa resposta nos ajuda a entender qual experiência faz mais sentido para o seu negócio.
        </p>
      </div>

      {errors?.principal && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
          {errors.principal}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {OBJECTIVES.map((item) => {
          const isSelected = objetivo.principal === item.id;
          const IconComp = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#0066FF]/15 border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.25)] ring-1 ring-[#38BDF8]/40'
                  : 'bg-[#090D14] border-white/10 hover:border-white/20 hover:bg-[#0E1422]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,102,255,0.8)]'
                        : 'bg-white/5 text-[#94A3B8] group-hover:text-white group-hover:bg-white/10'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected
                        ? 'border-[#38BDF8] bg-[#38BDF8] text-black font-bold'
                        : 'border-white/20 bg-transparent'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </div>
                </div>

                <h3
                  className={`text-sm font-bold tracking-tight ${
                    isSelected ? 'text-white' : 'text-[#E2E8F0] group-hover:text-white'
                  }`}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{item.description}</p>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2 border-t border-[#38BDF8]/20 flex items-center gap-1.5 text-[11px] text-[#38BDF8] font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Objetivo prioritário selecionado</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Outro Objetivo Field */}
      {objetivo.principal === 'OUTRO' && (
        <div className="p-4 rounded-2xl bg-[#090D14] border border-[#38BDF8]/40 animate-fadeIn space-y-2">
          <label className="block text-xs font-semibold text-white">
            Conte um pouco mais sobre seu objetivo:
          </label>
          <textarea
            rows={3}
            value={objetivo.outroDescricao}
            onChange={handleOutroChange}
            placeholder="Descreva o que você espera que a sua página realize pelo seu negócio..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D121D] border border-white/10 focus:border-[#38BDF8] text-sm text-white placeholder-[#475569] focus:outline-none resize-none leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
