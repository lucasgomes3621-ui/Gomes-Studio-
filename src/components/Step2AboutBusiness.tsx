import React from 'react';
import { BriefingData } from '../types';
import { Building2, MapPin, Globe, Instagram, Compass, Navigation } from 'lucide-react';

interface Step2Props {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
  errors?: Record<string, string>;
}

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const REGIOES_OPTIONS = [
  { id: 'Minha cidade / região', label: 'Minha cidade / região', desc: 'Atendimento presencial focado na cidade e redondezas' },
  { id: 'Outras cidades', label: 'Outras cidades', desc: 'Atende cidades vizinhas ou polo regional específico' },
  { id: 'Todo o Brasil', label: 'Todo o Brasil', desc: 'Entrega nacional ou soluções remotas em escala' },
  { id: 'Atendimento online / sem localização específica', label: 'Atendimento online / sem localização física', desc: 'Consultoria, infoproduto ou serviços 100% digitais' },
];

export const Step2AboutBusiness: React.FC<Step2Props> = ({ data, onChange, errors }) => {
  const sobreNegocio = data.sobreNegocio || {
    nomeEmpresa: '',
    segmento: '',
    instagram: '',
    siteAtual: '',
    cidade: '',
    estado: '',
    regioesAtendimento: '',
    outrasRegioes: '',
    possuiEnderecoFisico: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    exibirMapa: '',
    descricaoAtuacao: '',
  };

  const updateField = (field: keyof typeof sobreNegocio, value: any) => {
    onChange((prev) => ({
      ...prev,
      sobreNegocio: {
        ...prev.sobreNegocio,
        [field]: value,
      },
      // Keep sync with legacy empresa object if applicable
      empresa: {
        ...prev.empresa,
        nome: field === 'nomeEmpresa' ? value : prev.empresa?.nome,
        segmento: field === 'segmento' ? value : prev.empresa?.segmento,
        cidadeEstado:
          field === 'cidade' || field === 'estado'
            ? `${field === 'cidade' ? value : prev.sobreNegocio.cidade} - ${field === 'estado' ? value : prev.sobreNegocio.estado}`
            : prev.empresa?.cidadeEstado,
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div>
        <span className="text-[11px] font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
          Etapa 02 · Identificação do Negócio
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          Agora, fale um pouco sobre sua empresa.
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
          Queremos entender melhor o seu negócio, sua atuação e onde ele está presente.
        </p>
      </div>

      {/* Main Info Fields */}
      <div className="space-y-4 pt-1">
        {/* Nome da Empresa */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              Nome da empresa ou negócio <span className="text-[#38BDF8]">*</span>
            </span>
            <span className="text-[10px] text-[#64748B] font-mono">Obrigatório</span>
          </label>
          <input
            type="text"
            value={sobreNegocio.nomeEmpresa}
            onChange={(e) => updateField('nomeEmpresa', e.target.value)}
            placeholder="Ex.: Clínica Vitalle, Gomes Studio, Studio Hair..."
            className={`w-full px-3.5 py-3 rounded-xl bg-[#090D14] border text-sm text-white placeholder-[#475569] transition-all focus:outline-none focus:ring-1 ${
              errors?.nomeEmpresa
                ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
                : 'border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-[#0066FF]/40'
            }`}
          />
          {errors?.nomeEmpresa && (
            <p className="text-xs text-red-400 mt-1">{errors.nomeEmpresa}</p>
          )}
        </div>

        {/* Segmento */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
            Segmento ou ramo de atuação
          </label>
          <input
            type="text"
            value={sobreNegocio.segmento}
            onChange={(e) => updateField('segmento', e.target.value)}
            placeholder="Ex.: Saúde integrada, Estética automotiva, Moda feminina, Consultoria jurídica..."
            className="w-full px-3.5 py-3 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 text-sm text-white placeholder-[#475569] transition-all focus:outline-none"
          />
        </div>

        {/* Instagram & Site Atual in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              Instagram da empresa
            </label>
            <input
              type="text"
              value={sobreNegocio.instagram}
              onChange={(e) => updateField('instagram', e.target.value)}
              placeholder="@suaempresa"
              className="w-full px-3.5 py-3 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30 text-sm text-white placeholder-[#475569] transition-all focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
              Site atual (caso já possua)
            </label>
            <input
              type="text"
              value={sobreNegocio.siteAtual}
              onChange={(e) => updateField('siteAtual', e.target.value)}
              placeholder="https://seusite.com.br"
              className="w-full px-3.5 py-3 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 text-sm text-white placeholder-[#475569] transition-all focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Localização e Área de Atuação Container */}
      <div className="p-4 rounded-2xl bg-[#090D14]/80 border border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-white/5 pb-2.5">
          <MapPin className="w-4 h-4 text-[#38BDF8]" />
          <span>Localização e Área de Atuação</span>
        </div>

        {/* Cidade & Estado */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5">
            Em qual cidade sua empresa está localizada?
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <input
              type="text"
              value={sobreNegocio.cidade}
              onChange={(e) => updateField('cidade', e.target.value)}
              placeholder="Cidade (ex.: Nanuque)"
              className="col-span-2 px-3.5 py-2.5 rounded-xl bg-[#0D121D] border border-white/10 hover:border-white/20 focus:border-[#0066FF] text-sm text-white placeholder-[#475569] transition-all focus:outline-none"
            />
            <select
              value={sobreNegocio.estado}
              onChange={(e) => updateField('estado', e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#0D121D] border border-white/10 hover:border-white/20 focus:border-[#0066FF] text-sm text-white transition-all focus:outline-none cursor-pointer"
            >
              <option value="">UF</option>
              {ESTADOS_BR.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Regiões de Atendimento */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-2">
            Quais regiões sua empresa atende?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REGIOES_OPTIONS.map((opt) => {
              const isSelected = sobreNegocio.regioesAtendimento === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateField('regioesAtendimento', opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#0066FF]/15 border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
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
                          : 'border-white/20 bg-transparent'
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

        {/* Campo opcional de cidades/regiões atendidas */}
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center justify-between">
            <span>Quais cidades ou regiões você atende?</span>
            <span className="text-[10px] text-[#64748B]">Opcional</span>
          </label>
          <input
            type="text"
            value={sobreNegocio.outrasRegioes}
            onChange={(e) => updateField('outrasRegioes', e.target.value)}
            placeholder="Ex.: Nanuque e região, Extremo Sul da Bahia, todo o Brasil..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D121D] border border-white/10 hover:border-white/20 focus:border-[#0066FF] text-sm text-white placeholder-[#475569] transition-all focus:outline-none"
          />
        </div>
      </div>

      {/* Endereço Físico Container */}
      <div className="p-4 rounded-2xl bg-[#090D14]/80 border border-white/[0.08] space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5">
            Sua empresa possui um endereço físico que deve aparecer na página?
          </label>
          <div className="flex gap-2.5">
            {['Sim', 'Não'].map((opt) => {
              const isSelected = sobreNegocio.possuiEnderecoFisico === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField('possuiEnderecoFisico', opt)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#0066FF]/20 border-[#38BDF8] text-white shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'bg-[#0D121D] border-white/5 text-[#94A3B8] hover:border-white/15'
                  }`}
                >
                  {opt === 'Sim' ? 'Sim, temos ponto/escritório físico' : 'Não, somente atendimento remoto/online'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Fields if Sim */}
        {sobreNegocio.possuiEnderecoFisico === 'Sim' && (
          <div className="pt-2 space-y-3 border-t border-white/5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                  Endereço completo (Rua, Avenida)
                </label>
                <input
                  type="text"
                  value={sobreNegocio.endereco}
                  onChange={(e) => updateField('endereco', e.target.value)}
                  placeholder="Ex.: Av. Santos Dumont"
                  className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Número</label>
                <input
                  type="text"
                  value={sobreNegocio.numero}
                  onChange={(e) => updateField('numero', e.target.value)}
                  placeholder="Ex.: 450"
                  className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Complemento</label>
                <input
                  type="text"
                  value={sobreNegocio.complemento}
                  onChange={(e) => updateField('complemento', e.target.value)}
                  placeholder="Sala 204, Bloco A"
                  className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Bairro</label>
                <input
                  type="text"
                  value={sobreNegocio.bairro}
                  onChange={(e) => updateField('bairro', e.target.value)}
                  placeholder="Centro"
                  className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">CEP</label>
                <input
                  type="text"
                  value={sobreNegocio.cep}
                  onChange={(e) => updateField('cep', e.target.value)}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 rounded-xl bg-[#0D121D] border border-white/10 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            {/* Exibir Mapa no site */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#E2E8F0] font-medium flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#38BDF8]" />
                Quero exibir a localização no mapa interativo
              </span>
              <div className="flex gap-2">
                {['Sim', 'Não'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateField('exibirMapa', opt)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                      sobreNegocio.exibirMapa === opt
                        ? 'bg-[#0066FF] text-white border-[#38BDF8]'
                        : 'bg-[#0D121D] text-[#94A3B8] border-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* O que a empresa faz (Descrição de Atuação) */}
      <div>
        <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center justify-between">
          <span>Conte brevemente o que sua empresa faz</span>
          <span className="text-[10px] text-[#64748B]">Proposta de valor</span>
        </label>
        <textarea
          rows={4}
          value={sobreNegocio.descricaoAtuacao}
          onChange={(e) => updateField('descricaoAtuacao', e.target.value)}
          placeholder="Ex.: Somos uma empresa especializada em... Nosso diferencial é entregar rapidez e alta qualidade para..."
          className="w-full px-3.5 py-3 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 text-sm text-white placeholder-[#475569] transition-all focus:outline-none leading-relaxed resize-none"
        />
        <p className="text-[11px] text-[#64748B] mt-1">
          Não precisa ser um texto formal. Descreva com suas próprias palavras para captarmos a essência da sua marca.
        </p>
      </div>
    </div>
  );
};
