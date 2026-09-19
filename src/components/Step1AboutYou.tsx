import React from 'react';
import { BriefingData } from '../types';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';

interface Step1Props {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
  errors?: Record<string, string>;
}

export const formatBrazilianPhone = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const Step1AboutYou: React.FC<Step1Props> = ({ data, onChange, errors }) => {
  const sobreVoce = data.sobreVoce || { nome: '', email: '', whatsapp: '' };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange((prev) => ({
      ...prev,
      sobreVoce: { ...prev.sobreVoce, nome: val },
      // keep legacy company fallback if empty
      empresa: { ...prev.empresa, nome: prev.empresa?.nome || val },
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange((prev) => ({
      ...prev,
      sobreVoce: { ...prev.sobreVoce, email: val },
      contatos: { ...prev.contatos, email: val },
    }));
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBrazilianPhone(e.target.value);
    onChange((prev) => ({
      ...prev,
      sobreVoce: { ...prev.sobreVoce, whatsapp: formatted },
      contatos: { ...prev.contatos, whatsapp: formatted },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div>
        <span className="text-[11px] font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
          Etapa 01 · Contato Inicial
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          Vamos começar.
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
          Precisamos de algumas informações para saber com quem estamos falando.
        </p>
      </div>

      {/* Inputs Container */}
      <div className="space-y-4 pt-1">
        {/* Nome */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#38BDF8]" />
              Seu nome completo <span className="text-[#38BDF8]">*</span>
            </span>
            <span className="text-[10px] text-[#64748B] font-mono">Obrigatório</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={sobreVoce.nome}
              onChange={handleNomeChange}
              placeholder="Ex.: Lucas Gomes"
              className={`w-full px-3.5 py-3 rounded-xl bg-[#090D14] border text-sm text-white placeholder-[#475569] transition-all focus:outline-none focus:ring-1 ${
                errors?.nome
                  ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
                  : 'border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-[#0066FF]/40'
              }`}
            />
          </div>
          {errors?.nome && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">{errors.nome}</p>
          )}
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
              Seu e-mail profissional <span className="text-[#38BDF8]">*</span>
            </span>
            <span className="text-[10px] text-[#64748B] font-mono">Obrigatório</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={sobreVoce.email}
              onChange={handleEmailChange}
              placeholder="seuemail@empresa.com"
              className={`w-full px-3.5 py-3 rounded-xl bg-[#090D14] border text-sm text-white placeholder-[#475569] transition-all focus:outline-none focus:ring-1 ${
                errors?.email
                  ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
                  : 'border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-[#0066FF]/40'
              }`}
            />
          </div>
          {errors?.email && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">{errors.email}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Seu WhatsApp com DDD <span className="text-[#38BDF8]">*</span>
            </span>
            <span className="text-[10px] text-[#64748B] font-mono">Obrigatório</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              value={sobreVoce.whatsapp}
              onChange={handleWhatsappChange}
              placeholder="(33) 99103-1052"
              className={`w-full px-3.5 py-3 rounded-xl bg-[#090D14] border text-sm text-white placeholder-[#475569] font-mono transition-all focus:outline-none focus:ring-1 ${
                errors?.whatsapp
                  ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
                  : 'border-white/10 hover:border-white/20 focus:border-emerald-500 focus:ring-emerald-500/30'
              }`}
            />
          </div>
          {errors?.whatsapp && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">{errors.whatsapp}</p>
          )}
          <p className="text-[11px] text-[#64748B] mt-1">
            Utilizaremos este número para enviar a confirmação e alinhar o projeto diretamente com você.
          </p>
        </div>
      </div>

      {/* Discrete Privacy Notice */}
      <div className="p-3 rounded-xl bg-[#090D14]/60 border border-white/[0.06] flex items-center gap-2.5 text-xs text-[#94A3B8]">
        <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
        <span>Seus dados são confidenciais e utilizados apenas para o alinhamento deste projeto.</span>
      </div>
    </div>
  );
};
