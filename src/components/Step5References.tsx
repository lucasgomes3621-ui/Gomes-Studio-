import React from 'react';
import { BriefingData } from '../types';
import { Sparkles, Globe, Ban, Check } from 'lucide-react';

interface Step5Props {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
}

const ESTILOS_DISPONIVEIS = [
  { id: 'Minimalista', label: 'Minimalista', desc: 'Linhas limpas, respiro visual e foco no essencial' },
  { id: 'Moderno', label: 'Moderno', desc: 'Design contemporâneo, tipografia marcante e dinamismo' },
  { id: 'Elegante', label: 'Elegante', desc: 'Visual refinado, equilíbrio e acabamentos sóbrios' },
  { id: 'Sofisticado', label: 'Sofisticado', desc: 'Exclusividade, autoridade e percepção de alto padrão' },
  { id: 'Comercial', label: 'Comercial', desc: 'Foco direto em conversão, clareza de ofertas e ação rápida' },
  { id: 'Criativo', label: 'Criativo', desc: 'Estética autêntica, diferenciada e cheia de personalidade' },
  { id: 'Tecnológico', label: 'Tecnológico', desc: 'Atmosfera digital, inovação, precisão e tecnologia' },
];

export const Step5References: React.FC<Step5Props> = ({ data, onChange }) => {
  const referenciasEstilo = data.referenciasEstilo || {
    sitesGosta: '',
    estilos: [],
    naoGosta: '',
  };

  const handleToggleEstilo = (estiloId: string) => {
    const current = referenciasEstilo.estilos || [];
    const updated = current.includes(estiloId)
      ? current.filter((item) => item !== estiloId)
      : [...current, estiloId];

    onChange((prev) => ({
      ...prev,
      referenciasEstilo: {
        ...prev.referenciasEstilo,
        estilos: updated,
      },
      // sync with legacy identidadeVisual.estiloSite
      identidadeVisual: {
        ...prev.identidadeVisual,
        estiloSite: updated,
      },
    }));
  };

  const updateSitesGosta = (val: string) => {
    onChange((prev) => ({
      ...prev,
      referenciasEstilo: {
        ...prev.referenciasEstilo,
        sitesGosta: val,
      },
      identidadeVisual: {
        ...prev.identidadeVisual,
        sitesReferencia: val,
      },
    }));
  };

  const updateNaoGosta = (val: string) => {
    onChange((prev) => ({
      ...prev,
      referenciasEstilo: {
        ...prev.referenciasEstilo,
        naoGosta: val,
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div>
        <span className="text-[11px] font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
          Etapa 05 · Referências & Atmosfera
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          Como você imagina sua página?
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
          Referências ajudam a entender o estilo visual e a percepção que você deseja transmitir.
        </p>
      </div>

      <div className="space-y-5 pt-1">
        {/* Sites de Referência */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
            Existe algum site ou página que você gosta?
          </label>
          <textarea
            rows={3}
            value={referenciasEstilo.sitesGosta}
            onChange={(e) => updateSitesGosta(e.target.value)}
            placeholder="Cole links ou nomes de sites/perfis que você admira (ex.: apple.com, stripe.com, perfil @nomedamarca)..."
            className="w-full px-3.5 py-3 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 text-sm text-white placeholder-[#475569] transition-all focus:outline-none resize-none leading-relaxed"
          />
          <p className="text-[11px] text-[#64748B] mt-1">
            Pode ser o estilo de navegação, a combinação de cores ou a forma como apresentam os produtos.
          </p>
        </div>

        {/* Estilos Selecionáveis Múltiplos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-[#E2E8F0] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              Que estilo combina mais com sua empresa?
            </label>
            <span className="text-[10px] text-[#64748B] font-mono">Múltipla escolha</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {ESTILOS_DISPONIVEIS.map((item) => {
              const isSelected = referenciasEstilo.estilos?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleEstilo(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#0066FF]/20 border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'bg-[#090D14] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#38BDF8]' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#38BDF8] bg-[#0066FF] text-white'
                          : 'border-white/20 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1.5 leading-snug">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* O que NÃO gostaria que aparecesse */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center gap-1.5">
            <Ban className="w-3.5 h-3.5 text-rose-400" />
            Existe alguma coisa que você NÃO gostaria que aparecesse?
          </label>
          <textarea
            rows={3}
            value={referenciasEstilo.naoGosta}
            onChange={(e) => updateNaoGosta(e.target.value)}
            placeholder="Ex.: Não quero muitas cores chamativas, evitar fontes muito finas, sem pop-ups intrusivos, sem excesso de texto denso..."
            className="w-full px-3.5 py-3 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 text-sm text-white placeholder-[#475569] transition-all focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
