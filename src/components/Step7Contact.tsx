import React, { useState } from 'react';
import { BriefingData } from '../types';
import { formatBrazilianPhone } from './Step1AboutYou';
import {
  MessageSquare,
  Instagram,
  Phone,
  Mail,
  HelpCircle,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Step7Props {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
  errors?: Record<string, string>;
}

const CANAIS_PRINCIPAIS: Array<{
  id: BriefingData['contato']['canalPrincipal'];
  label: string;
  icon: React.ElementType;
  colorClass: string;
  desc: string;
}> = [
  {
    id: 'WhatsApp',
    label: 'WhatsApp',
    icon: MessageSquare,
    colorClass: 'text-emerald-400',
    desc: 'Atendimento direto, mensagens instantâneas e agilidade comercial',
  },
  {
    id: 'Instagram',
    label: 'Instagram',
    icon: Instagram,
    colorClass: 'text-pink-400',
    desc: 'Direcionamento para Direct, portfólio visual ou perfil oficial',
  },
  {
    id: 'Telefone',
    label: 'Ligação Telefônica',
    icon: Phone,
    colorClass: 'text-cyan-400',
    desc: 'Contato por chamada de voz para suporte ou recepção',
  },
  {
    id: 'E-mail',
    label: 'E-mail',
    icon: Mail,
    colorClass: 'text-amber-400',
    desc: 'Formulário ou link direto de e-mail corporativo',
  },
  {
    id: 'Outro',
    label: 'Outro Canal',
    icon: HelpCircle,
    colorClass: 'text-purple-400',
    desc: 'Link personalizado, sistema de agendamento ou app proprietário',
  },
];

export const Step7Contact: React.FC<Step7Props> = ({ data, onChange, errors }) => {
  const [showOutrosCanais, setShowOutrosCanais] = useState(false);

  const contato = data.contato || {
    canalPrincipal: '',
    canalPrincipalValor: '',
    whatsapp: '',
    instagram: '',
    telefone: '',
    email: '',
    outro: '',
  };

  const handleSelectCanalPrincipal = (id: BriefingData['contato']['canalPrincipal']) => {
    // Auto-fill default value if available
    let defaultValue = '';
    if (id === 'WhatsApp') defaultValue = contato.whatsapp || data.sobreVoce?.whatsapp || '';
    if (id === 'Instagram') defaultValue = contato.instagram || data.sobreNegocio?.instagram || '';
    if (id === 'Telefone') defaultValue = contato.telefone || '';
    if (id === 'E-mail') defaultValue = contato.email || data.sobreVoce?.email || '';

    onChange((prev) => ({
      ...prev,
      contato: {
        ...prev.contato,
        canalPrincipal: id,
        canalPrincipalValor: defaultValue,
      },
    }));
  };

  const handleCanalPrincipalValorChange = (val: string) => {
    onChange((prev) => {
      const nextContato = { ...prev.contato, canalPrincipalValor: val };
      // Sync back with specific fields
      if (prev.contato?.canalPrincipal === 'WhatsApp') nextContato.whatsapp = val;
      if (prev.contato?.canalPrincipal === 'Instagram') nextContato.instagram = val;
      if (prev.contato?.canalPrincipal === 'Telefone') nextContato.telefone = val;
      if (prev.contato?.canalPrincipal === 'E-mail') nextContato.email = val;
      if (prev.contato?.canalPrincipal === 'Outro') nextContato.outro = val;

      return {
        ...prev,
        contato: nextContato,
      };
    });
  };

  const updateOutroCanal = (key: 'whatsapp' | 'instagram' | 'telefone' | 'email' | 'outro', val: string) => {
    onChange((prev) => ({
      ...prev,
      contato: {
        ...prev.contato,
        [key]: val,
      },
      // sync with legacy contatos
      contatos: {
        ...prev.contatos,
        [key]: val,
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div>
        <span className="text-[11px] font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
          Etapa 07 · Direcionamento & Conversão
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          Para onde sua página deve levar seus clientes?
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
          Vamos definir o principal caminho para o visitante entrar em contato com sua empresa e fechar negócios.
        </p>
      </div>

      {errors?.canalPrincipal && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
          {errors.canalPrincipal}
        </div>
      )}

      {/* Seleção do Canal Principal */}
      <div>
        <label className="block text-xs font-semibold text-[#E2E8F0] mb-2 flex items-center justify-between">
          <span>Qual será o principal canal de contato?</span>
          <span className="text-[10px] text-[#38BDF8] font-mono">Foco da página</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CANAIS_PRINCIPAIS.map((canal) => {
            const isSelected = contato.canalPrincipal === canal.id;
            const IconComp = canal.icon;

            return (
              <button
                key={canal.id}
                type="button"
                onClick={() => handleSelectCanalPrincipal(canal.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-[#0066FF]/20 border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                    : 'bg-[#090D14] border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#0066FF] text-white' : 'bg-white/5 ' + canal.colorClass
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#E2E8F0]'}`}>
                      {canal.label}
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                        isSelected ? 'border-[#38BDF8] bg-[#38BDF8] text-black font-bold' : 'border-white/20'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">{canal.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campo Dinâmico correspondente ao canal principal */}
      {contato.canalPrincipal && (
        <div className="p-4 rounded-2xl bg-[#090D14] border border-[#38BDF8]/40 space-y-2 animate-fadeIn">
          <label className="block text-xs font-semibold text-white flex items-center gap-1.5">
            <span>
              {contato.canalPrincipal === 'WhatsApp' && 'Informe o número do WhatsApp de atendimento:'}
              {contato.canalPrincipal === 'Instagram' && 'Informe o @ ou link do Instagram:'}
              {contato.canalPrincipal === 'Telefone' && 'Informe o número do Telefone de atendimento:'}
              {contato.canalPrincipal === 'E-mail' && 'Informe o endereço de e-mail comercial:'}
              {contato.canalPrincipal === 'Outro' && 'Informe o link ou canal desejado:'}
            </span>
            <span className="text-[#38BDF8]">*</span>
          </label>

          <input
            type="text"
            value={contato.canalPrincipalValor}
            onChange={(e) => {
              const val =
                contato.canalPrincipal === 'WhatsApp' || contato.canalPrincipal === 'Telefone'
                  ? formatBrazilianPhone(e.target.value)
                  : e.target.value;
              handleCanalPrincipalValorChange(val);
            }}
            placeholder={
              contato.canalPrincipal === 'WhatsApp'
                ? '(33) 99103-1052'
                : contato.canalPrincipal === 'Instagram'
                ? '@suaempresa ou https://instagram.com/suaempresa'
                : contato.canalPrincipal === 'Telefone'
                ? '(33) 3621-0000'
                : contato.canalPrincipal === 'E-mail'
                ? 'contato@suaempresa.com'
                : 'Ex.: Link do sistema, agendamento ou app'
            }
            className="w-full px-3.5 py-3 rounded-xl bg-[#0D121D] border border-white/10 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#38BDF8] transition-all"
          />
          <p className="text-[11px] text-[#64748B]">
            Os botões principais de chamada para ação (CTAs) direcionarão seus clientes diretamente para cá.
          </p>
        </div>
      )}

      {/* Outros Canais Complementares Accordion */}
      <div className="p-4 rounded-2xl bg-[#090D14]/80 border border-white/[0.08] space-y-3">
        <button
          type="button"
          onClick={() => setShowOutrosCanais(!showOutrosCanais)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <span className="text-xs font-semibold text-[#E2E8F0] flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5 text-[#38BDF8]" />
            Adicionar outros canais de contato secundários
          </span>
          <div className="p-1 rounded-lg text-[#94A3B8] hover:text-white transition">
            {showOutrosCanais ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showOutrosCanais && (
          <div className="pt-2 space-y-3 border-t border-white/5 animate-fadeIn">
            {contato.canalPrincipal !== 'WhatsApp' && (
              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={contato.whatsapp}
                  onChange={(e) => updateOutroCanal('whatsapp', formatBrazilianPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            )}

            {contato.canalPrincipal !== 'Instagram' && (
              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Instagram</label>
                <input
                  type="text"
                  value={contato.instagram}
                  onChange={(e) => updateOutroCanal('instagram', e.target.value)}
                  placeholder="@seuperfil"
                  className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            )}

            {contato.canalPrincipal !== 'Telefone' && (
              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Telefone Fixo / Comercial</label>
                <input
                  type="text"
                  value={contato.telefone}
                  onChange={(e) => updateOutroCanal('telefone', formatBrazilianPhone(e.target.value))}
                  placeholder="(00) 0000-0000"
                  className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            )}

            {contato.canalPrincipal !== 'E-mail' && (
              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">E-mail</label>
                <input
                  type="email"
                  value={contato.email}
                  onChange={(e) => updateOutroCanal('email', e.target.value)}
                  placeholder="contato@empresa.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Outro Link (LinkedIn, Catálogo online, etc.)</label>
              <input
                type="text"
                value={contato.outro}
                onChange={(e) => updateOutroCanal('outro', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
