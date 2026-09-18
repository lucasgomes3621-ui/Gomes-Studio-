import React, { useState, useRef } from 'react';
import { BriefingData, UploadedMediaItem } from '../types';
import { SectionItem } from './SectionItem';
import { uploadMediaItem } from '../utils/uploader';
import {
  Building2,
  Palette,
  Camera,
  Share2,
  Info,
  ShoppingBag,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  Star,
  Quote,
  MousePointerClick,
  Globe,
  Layout,
  Lightbulb,
  FileText,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Trash2,
  X,
  CheckCircle2,
  FolderOpen,
  Plus,
  AlertCircle,
  CloudUpload,
  Loader2,
  Check,
  Mail,
  MessageSquare,
  Layers,
  Sparkles,
  Zap,
  CheckCheck,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import {
  getPlanConfig,
  getPlanLevel,
  getTierRequiredName,
  sanitizeSelectionsForPlan,
  MASTER_SECTIONS_CATALOG,
  MASTER_BUTTONS_CATALOG,
  MASTER_STYLES_CATALOG,
  PROJECT_TYPES_CONFIG,
} from '../utils/projectTypeConfig';

interface FormSectionsProps {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
  openSection: number | null;
  onToggleSection: (id: number) => void;
  onGoToSection: (id: number) => void;
  searchQuery: string;
}

export const FormSections: React.FC<FormSectionsProps> = ({
  data,
  onChange,
  openSection,
  onToggleSection,
  onGoToSection,
  searchQuery,
}) => {
  const [logoPreviewError, setLogoPreviewError] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const [showPlanSwitchNotice, setShowPlanSwitchNotice] = useState<string | null>(null);

  const currentPlan = data.tipoProjeto || 'Landing page profissional';
  const planConfig = getPlanConfig(currentPlan);
  const planLevel = getPlanLevel(currentPlan);

  const handleSelectPlan = (newPlan: 'Landing page essencial' | 'Landing page profissional' | 'Pagina completa profissional') => {
    if (newPlan === data.tipoProjeto) return;
    onChange((prev) => sanitizeSelectionsForPlan(prev, newPlan));
    setShowPlanSwitchNotice(`Modelo alterado para "${newPlan}". Opções parametrizadas de acordo com o plano.`);
    setTimeout(() => setShowPlanSwitchNotice(null), 4000);
  };

  // Helper for updating nested state
  const updateField = <K extends keyof BriefingData>(
    section: K,
    field: keyof BriefingData[K],
    value: any
  ) => {
    onChange((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const toggleArrayItem = <K extends keyof BriefingData>(
    section: K,
    field: keyof BriefingData[K],
    item: string
  ) => {
    onChange((prev) => {
      const currentList = ((prev[section] as any)[field] as string[]) || [];
      const exists = currentList.includes(item);
      const updated = exists
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      return {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: updated,
        },
      };
    });
  };

  // Multiple Gallery Photos Upload handler
  const handleGalleryPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const fileDataUrl = event.target.result as string;
          const tempId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const newItem: UploadedMediaItem = {
            id: tempId,
            name: file.name,
            dataUrl: fileDataUrl,
            size: file.size,
            type: file.type,
            uploading: true,
          };

          // Append to state immediately for instant preview
          onChange((prev) => {
            const current = prev.midia.uploadedImages || [];
            return {
              ...prev,
              midia: {
                ...prev.midia,
                uploadedImages: [...current, newItem],
              },
            };
          });

          // Upload to server/cloud storage in background
          try {
            const result = await uploadMediaItem(file.name, fileDataUrl, file.type);
            if (result.success && result.url) {
              onChange((prev) => ({
                ...prev,
                midia: {
                  ...prev.midia,
                  uploadedImages: (prev.midia.uploadedImages || []).map((img) =>
                    img.id === tempId
                      ? {
                          ...img,
                          uploading: false,
                          uploaded: true,
                          url: result.url,
                          fullUrl: result.fullUrl,
                        }
                      : img
                  ),
                },
              }));
            } else {
              onChange((prev) => ({
                ...prev,
                midia: {
                  ...prev.midia,
                  uploadedImages: (prev.midia.uploadedImages || []).map((img) =>
                    img.id === tempId ? { ...img, uploading: false } : img
                  ),
                },
              }));
            }
          } catch (err) {
            console.error(err);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so user can choose the same file again if needed
    if (photosInputRef.current) {
      photosInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (id: string) => {
    onChange((prev) => ({
      ...prev,
      midia: {
        ...prev.midia,
        uploadedImages: (prev.midia.uploadedImages || []).filter((item) => item.id !== id),
      },
    }));
  };

  const handleClearAllPhotos = () => {
    onChange((prev) => ({
      ...prev,
      midia: {
        ...prev.midia,
        uploadedImages: [],
      },
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const fileDataUrl = event.target.result as string;
        onChange((prev) => ({
          ...prev,
          identidadeVisual: {
            ...prev.identidadeVisual,
            logoNome: file.name,
            logoUrl: fileDataUrl,
            logoBase64: fileDataUrl,
            logoSize: file.size,
          },
        }));

        try {
          const res = await uploadMediaItem(file.name, fileDataUrl, file.type);
          if (res.success && res.fullUrl) {
            onChange((prev) => ({
              ...prev,
              identidadeVisual: {
                ...prev.identidadeVisual,
                logoCloudUrl: res.fullUrl,
              },
            }));
          }
        } catch (err) {
          console.warn('Logo upload server:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreviewError(false);
    onChange((prev) => ({
      ...prev,
      identidadeVisual: {
        ...prev.identidadeVisual,
        logoNome: '',
        logoUrl: '',
        logoBase64: '',
        logoCloudUrl: '',
        logoSize: undefined,
      },
    }));
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  // Check visibility according to search query
  const matchesSearch = (terms: string[]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return terms.some((t) => t.toLowerCase().includes(q));
  };

  return (
    <div className="space-y-1">
      {/* SELEÇÃO DO TIPO DE PROJETO (GOMES STUDIO) */}
      <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-[#090D14]/90 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 flex items-center justify-center text-[#38BDF8] shadow-[0_0_12px_rgba(0,102,255,0.3)] flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Qual tipo de projeto você deseja?
              </h2>
              <span className="font-mono text-[9px] text-[#38BDF8] bg-[#0066FF]/15 px-2 py-0.5 rounded-full border border-[#0066FF]/30 font-semibold uppercase">
                Escolha seu modelo
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Selecione o formato que melhor atende o objetivo do seu negócio:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3.5">
          {/* Opção 1: Landing page essencial */}
          <button
            type="button"
            onClick={() => handleSelectPlan('Landing page essencial')}
            className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
              data.tipoProjeto === 'Landing page essencial'
                ? 'bg-[#0066FF]/15 border-[#38BDF8] shadow-[0_0_24px_rgba(56,189,248,0.25)] ring-1 ring-[#38BDF8]'
                : 'bg-[#05070A]/80 border-white/[0.08] hover:border-white/20 hover:bg-[#0E131E]'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/[0.06] text-[#94A3B8] border border-white/[0.06]">
                  Presença Ágil
                </span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  data.tipoProjeto === 'Landing page essencial'
                    ? 'border-[#38BDF8] bg-[#0066FF] text-white'
                    : 'border-white/20'
                }`}>
                  {data.tipoProjeto === 'Landing page essencial' && '✓'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Landing page essencial
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Ideal para profissionais e negócios que precisam de presença digital rápida, objetiva e com foco em contato direto no WhatsApp.
              </p>
            </div>
            <ul className="mt-3 pt-2.5 border-t border-white/[0.06] text-[11px] text-[#CBD5E1] space-y-1 font-mono">
              <li className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">✓</span> Página única focada em contato
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">✓</span> Apresentação & Serviços principais
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">✓</span> 100% Otimizado para celular
              </li>
            </ul>
          </button>

          {/* Opção 2: Landing page profissional */}
          <button
            type="button"
            onClick={() => handleSelectPlan('Landing page profissional')}
            className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
              data.tipoProjeto === 'Landing page profissional'
                ? 'bg-[#0066FF]/20 border-[#38BDF8] shadow-[0_0_30px_rgba(56,189,248,0.35)] ring-1 ring-[#38BDF8]'
                : 'bg-[#05070A]/80 border-white/[0.08] hover:border-white/20 hover:bg-[#0E131E]'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#0066FF]/30 text-[#38BDF8] border border-[#0066FF]/40">
                  ⭐ Recomendado
                </span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  data.tipoProjeto === 'Landing page profissional'
                    ? 'border-[#38BDF8] bg-[#0066FF] text-white'
                    : 'border-white/20'
                }`}>
                  {data.tipoProjeto === 'Landing page profissional' && '✓'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Landing page profissional
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Carro-chefe Gomes Studio. Foco em autoridade visual, vitrine detalhada de produtos/serviços, prova social e alta conversão.
              </p>
            </div>
            <ul className="mt-3 pt-2.5 border-t border-white/[0.06] text-[11px] text-[#CBD5E1] space-y-1 font-mono">
              <li className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">✓</span> Design exclusivo & autoridade visual
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">✓</span> Vitrine de produtos ou serviços
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">✓</span> Prova social, depoimentos & CTAs
              </li>
            </ul>
          </button>

          {/* Opção 3: Pagina completa profissional */}
          <button
            type="button"
            onClick={() => handleSelectPlan('Pagina completa profissional')}
            className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
              data.tipoProjeto === 'Pagina completa profissional'
                ? 'bg-[#0066FF]/15 border-[#38BDF8] shadow-[0_0_24px_rgba(56,189,248,0.25)] ring-1 ring-[#38BDF8]'
                : 'bg-[#05070A]/80 border-white/[0.08] hover:border-white/20 hover:bg-[#0E131E]'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/[0.06] text-[#94A3B8] border border-white/[0.06]">
                  Institucional Completo
                </span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  data.tipoProjeto === 'Pagina completa profissional'
                    ? 'border-[#38BDF8] bg-[#0066FF] text-white'
                    : 'border-white/20'
                }`}>
                  {data.tipoProjeto === 'Pagina completa profissional' && '✓'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Pagina completa profissional
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Website institucional multi-seções para empresas que necessitam de menu completo, catálogo detalhado e mapa interativo.
              </p>
            </div>
            <ul className="mt-3 pt-2.5 border-t border-white/[0.06] text-[11px] text-[#CBD5E1] space-y-1 font-mono">
              <li className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">✓</span> Menu superior de navegação
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">✓</span> Catálogo estruturado por categorias
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">✓</span> FAQ sanfonado, mapa & contatos
              </li>
            </ul>
          </button>
        </div>

        {/* Notificação de troca de plano */}
        {showPlanSwitchNotice && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{showPlanSwitchNotice}</span>
          </div>
        )}

        {/* Status de parametrização dinâmica ativa */}
        <div className="mt-3.5 pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066FF]"></span>
            </span>
            <span className="text-[#94A3B8]">Opções parametrizadas para o modelo:</span>
            <span className="font-semibold text-white px-2 py-0.5 rounded-md bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#38BDF8]">
              {planConfig.badge}
            </span>
          </div>

          <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#CBD5E1]">
            {planLevel === 1 && '🔒 Itens dos planos Profissional e Completo bloqueados'}
            {planLevel === 2 && '🔒 Itens exclusivos da Página Completa bloqueados'}
            {planLevel === 3 && '✓ Todas as opções e recursos desbloqueados'}
          </span>
        </div>
      </div>

      {/* 1. INFORMAÇÕES DA EMPRESA */}
      {matchesSearch(['empresa', 'nome', 'segmento', 'cidade', 'endereço', 'maps']) && (
        <SectionItem
          id={1}
          title="1. Informações da Empresa"
          icon={<Building2 className="w-4 h-4" />}
          isOpen={openSection === 1}
          onToggle={() => onToggleSection(1)}
          onNext={() => onGoToSection(2)}
          isCompleted={Boolean(data.empresa.nome || data.empresa.segmento)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Nome da Empresa / Profissional
            </label>
            <input
              type="text"
              value={data.empresa.nome}
              onChange={(e) => updateField('empresa', 'nome', e.target.value)}
              placeholder="Ex: Nome da sua Empresa ou Marca"
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Segmento / Ramo de Atuação
            </label>
            <input
              type="text"
              value={data.empresa.segmento}
              onChange={(e) => updateField('empresa', 'segmento', e.target.value)}
              placeholder="Ex: Consultoria, Advocacia, Gastronomia, Saúde..."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition mb-2"
            />
            {/* Quick chips for Segmento */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Prestação de Serviços',
                'Comércio & Loja',
                'Saúde & Estética',
                'Gastronomia & Alimentos',
                'Advocacia & Finanças',
                'Construção & Arquitetura',
                'Tecnologia',
              ].map((seg) => (
                <button
                  type="button"
                  key={seg}
                  onClick={() => updateField('empresa', 'segmento', seg)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-mono ${
                    data.empresa.segmento === seg
                      ? 'bg-[#0066FF]/20 border-[#38BDF8] text-[#38BDF8]'
                      : 'bg-white/[0.04] border-white/[0.06] text-[#94A3B8] hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Cidade / Estado (UF)
              </label>
              <input
                type="text"
                value={data.empresa.cidadeEstado}
                onChange={(e) => updateField('empresa', 'cidadeEstado', e.target.value)}
                placeholder="Ex: Nanuque - MG"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Endereço Físico (se houver atendimento)
              </label>
              <input
                type="text"
                value={data.empresa.endereco}
                onChange={(e) => updateField('empresa', 'endereco', e.target.value)}
                placeholder="Ex: Rua Central, 100 - Centro"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Link do Google Maps (Opcional)
            </label>
            <input
              type="url"
              value={data.empresa.googleMapsLink}
              onChange={(e) => updateField('empresa', 'googleMapsLink', e.target.value)}
              placeholder="Cole o link do seu local no Google Maps se tiver"
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 2. IDENTIDADE VISUAL */}
      {matchesSearch(['identidade', 'visual', 'logo', 'cores', 'slogan', 'estilo', 'referência']) && (
        <SectionItem
          id={2}
          title="2. Identidade Visual"
          icon={<Palette className="w-4 h-4" />}
          isOpen={openSection === 2}
          onToggle={() => onToggleSection(2)}
          onPrev={() => onGoToSection(1)}
          onNext={() => onGoToSection(3)}
          isCompleted={Boolean(data.identidadeVisual.logoUrl || data.identidadeVisual.logoNome || data.identidadeVisual.coresPrincipais || data.identidadeVisual.estiloSite.length > 0)}
        >
          {/* Guia de Estilo e Identidade adaptado ao modelo */}
          <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#0066FF]/30 flex items-start gap-2.5 text-xs text-[#CBD5E1]">
            <Sparkles className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">Identidade Visual do Modelo:</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#0066FF]/20 text-[#38BDF8] border border-[#0066FF]/30 font-bold">
                  {planConfig.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {planConfig.secao2.notaGuia}
              </p>
            </div>
          </div>

          {/* Logo / Envio pelo WhatsApp */}
          <div className="space-y-3 bg-[#05070A]/90 p-4 rounded-xl border border-emerald-500/30">
            <div className="flex items-start gap-3 text-xs text-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-2 leading-relaxed flex-1">
                <p className="font-bold text-emerald-300 text-sm">
                  📌 Envio da Logomarca pelo WhatsApp
                </p>
                <p className="text-[#CBD5E1] text-xs">
                  O arquivo da sua logo (PNG, JPG, PDF, SVG ou vetor) pode ser enviado diretamente pelo <strong>WhatsApp</strong> da <strong>Gomes Studio</strong>, ou anexado aqui no formulário.
                </p>
                <div className="bg-[#090D14] p-3 rounded-lg border border-white/[0.08] space-y-1.5 text-[11px] text-[#94A3B8]">
                  <p className="font-semibold text-white">Como fazer o envio no WhatsApp:</p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">1</span>
                    No final deste formulário, clique no botão verde <strong>"Enviar pelo WhatsApp"</strong>.
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">2</span>
                    A conversa abrirá automaticamente no WhatsApp com todos os dados preenchidos.
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">3</span>
                    Na conversa, clique no ícone de <strong>Clips 📎 / Anexo (+)</strong> &gt; <strong>Documento</strong> ou <strong>Fotos</strong> e envie o arquivo original da sua logo.
                  </p>
                </div>
              </div>
            </div>

            {/* Opcional: Pré-visualizar ou anexar arquivo da Logo aqui */}
            <div className="pt-2 border-t border-white/[0.08] space-y-2">
              <label className="block text-xs font-semibold text-[#94A3B8]">
                Pré-visualizar ou anexar arquivo da Logo aqui no formulário (Opcional)
              </label>

              {data.identidadeVisual.logoUrl || data.identidadeVisual.logoBase64 ? (
                <div className="flex items-center justify-between p-3 bg-[#090D14] rounded-xl border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <img
                      src={data.identidadeVisual.logoBase64 || data.identidadeVisual.logoUrl}
                      alt="Logo preview"
                      className="w-12 h-12 object-contain rounded-lg bg-[#05070A] p-1 border border-white/10"
                      onError={() => setLogoPreviewError(true)}
                    />
                    <div>
                      <p className="text-xs font-semibold text-white truncate max-w-[200px]">
                        {data.identidadeVisual.logoNome || 'Logomarca Anexada'}
                      </p>
                      <p className="text-[10px] text-emerald-400">✓ Pronta para inclusão no projeto</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Remover arquivo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Remover</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*,.pdf,.svg,.eps,.ai"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload-input"
                  />
                  <label
                    htmlFor="logo-upload-input"
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#090D14] hover:bg-[#0F1420] border border-dashed border-emerald-500/40 text-emerald-300 text-xs font-medium cursor-pointer transition active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Selecionar arquivo da Logo no dispositivo</span>
                  </label>
                </div>
              )}

              <div>
                <input
                  type="url"
                  value={data.identidadeVisual.logoCloudUrl || ''}
                  onChange={(e) => updateField('identidadeVisual', 'logoCloudUrl', e.target.value)}
                  placeholder="Ou cole o link da logo no Google Drive / Nuvem (se preferir)"
                  className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#475569] outline-none transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Slogan ou Frase de Apoio da Marca
            </label>
            <input
              type="text"
              value={data.identidadeVisual.slogan}
              onChange={(e) => updateField('identidadeVisual', 'slogan', e.target.value)}
              placeholder="Ex: Design que Conecta, Soluções que Impulsionam"
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Cores Principais
            </label>
            <input
              type="text"
              value={data.identidadeVisual.coresPrincipais}
              onChange={(e) => updateField('identidadeVisual', 'coresPrincipais', e.target.value)}
              placeholder="Ex: Preto e Azul Ciano, Preto e Dourado..."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition mb-2"
            />
            {/* Quick chips for Cores */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {planConfig.secao2.sugestoesCores.map((cor) => (
                <button
                  type="button"
                  key={cor}
                  onClick={() => updateField('identidadeVisual', 'coresPrincipais', cor)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-mono ${
                    data.identidadeVisual.coresPrincipais === cor
                      ? 'bg-[#0066FF]/20 border-[#38BDF8] text-[#38BDF8]'
                      : 'bg-white/[0.04] border-white/[0.06] text-[#94A3B8] hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {cor}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#94A3B8]">
                Estilo Visual Desejado
              </label>
              <span className="text-[10px] text-[#38BDF8] font-mono">
                {planConfig.badge}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {MASTER_STYLES_CATALOG.map((estiloItem) => {
                const isLocked = estiloItem.minLevel > planLevel;
                const checked = Boolean(data.identidadeVisual?.estiloSite?.includes(estiloItem.nome));
                const requiredTier = getTierRequiredName(estiloItem.minLevel);

                return (
                  <button
                    type="button"
                    key={estiloItem.nome}
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) return;
                      toggleArrayItem('identidadeVisual', 'estiloSite', estiloItem.nome);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition ${
                      isLocked
                        ? 'opacity-40 bg-[#05070A]/50 border-white/[0.04] text-[#64748B] cursor-not-allowed select-none'
                        : checked
                        ? 'bg-[#0066FF]/20 border-[#38BDF8] text-[#38BDF8] cursor-pointer active:scale-95'
                        : 'bg-[#05070A] border-white/[0.08] text-[#94A3B8] hover:text-white hover:border-white/20 cursor-pointer active:scale-95'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      <span
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ${
                          isLocked
                            ? 'border-white/10 text-[#64748B] bg-white/[0.02]'
                            : checked
                            ? 'bg-[#0066FF] border-[#38BDF8] text-white'
                            : 'border-white/20'
                        }`}
                      >
                        {isLocked ? '🔒' : checked ? '✓' : ''}
                      </span>
                      <span className={`truncate ${isLocked ? 'text-[#94A3B8]' : ''}`}>
                        {estiloItem.nome}
                      </span>
                    </div>

                    {isLocked ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded ml-1 flex-shrink-0 whitespace-nowrap bg-amber-500/15 text-amber-300/90 border border-amber-500/25 font-semibold">
                        🔒 Requer {requiredTier}
                      </span>
                    ) : estiloItem.tag ? (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ml-1 flex-shrink-0 whitespace-nowrap ${
                        estiloItem.tag === 'Essencial'
                          ? 'bg-white/[0.06] text-[#94A3B8]'
                          : estiloItem.tag?.includes('⭐') || estiloItem.tag === 'Destaque'
                          ? 'bg-[#0066FF]/30 text-[#38BDF8] border border-[#0066FF]/40'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {estiloItem.tag}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Sites de Referência (Links que você admira)
            </label>
            <textarea
              rows={2}
              value={data.identidadeVisual.sitesReferencia}
              onChange={(e) => updateField('identidadeVisual', 'sitesReferencia', e.target.value)}
              placeholder="Cole links de sites que você gosta como inspiração visual"
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 3. FOTOS E VÍDEOS */}
      {matchesSearch(['fotos', 'vídeos', 'mídia', 'imagens', 'upload', 'galeria', 'celular', 'links']) && (
        <SectionItem
          id={3}
          title="3. Fotos e Vídeos"
          icon={<Camera className="w-4 h-4" />}
          isOpen={openSection === 3}
          onToggle={() => onToggleSection(3)}
          onPrev={() => onGoToSection(2)}
          onNext={() => onGoToSection(4)}
          isCompleted={Boolean(
            (data.midia.uploadedImages && data.midia.uploadedImages.length > 0) ||
            data.midia.linksImagens ||
            data.midia.observacoes ||
            data.midia.arquivosInfo
          )}
        >
          {/* Instruções de Envio de Fotos no WhatsApp */}
          <div className="bg-[#05070A]/90 border border-emerald-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3 text-xs text-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-2 leading-relaxed flex-1">
                <p className="font-bold text-emerald-300 text-sm">
                  📌 Envio de Fotos e Vídeos pelo WhatsApp
                </p>
                <p className="text-[#CBD5E1] text-xs">
                  Para manter a resolução máxima de fotos de produtos, ambiente e equipe, o envio pode ser feito diretamente pelo <strong>WhatsApp</strong> da <strong>Gomes Studio</strong>, ou via link do Google Drive/Nuvem.
                </p>
              </div>
            </div>

            {/* Passo a Passo Ilustrado */}
            <div className="bg-[#090D14] p-3.5 rounded-xl border border-white/[0.08] space-y-2 text-xs text-[#94A3B8]">
              <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                <span>📋 Como enviar suas fotos e vídeos no WhatsApp:</span>
              </p>
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                  <span>Preencha as informações do briefing e vá até o final da página.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                  <span>Clique no botão verde <strong>"Enviar pelo WhatsApp"</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                  <span>O WhatsApp abrirá com todos os dados do site já organizados.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">4</span>
                  <span>Na conversa, clique no ícone de <strong>Clips 📎 (Anexo)</strong> &gt; <strong>Documento</strong> (para qualidade original sem compressão) ou <strong>Fotos/Vídeos</strong>, e envie!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Google Drive / Cloud Link Field */}
          <div className="bg-[#05070A] p-3 rounded-xl border border-white/[0.08] space-y-2">
            <label className="block text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
              Link da Pasta no Google Drive / Dropbox / Nuvem (Opcional)
            </label>
            <input
              type="url"
              value={data.midia.arquivosInfo || ''}
              onChange={(e) => updateField('midia', 'arquivosInfo', e.target.value)}
              placeholder="https://drive.google.com/drive/folders/... ou link de pasta compartilhada"
              className="w-full bg-[#090D14] border border-white/[0.08] focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
            <p className="text-[10px] text-[#94A3B8]">
              Se você já tiver uma pasta com suas fotos e vídeos no Google Drive ou Dropbox, pode colar o link compartilhável aqui.
            </p>
          </div>

          {/* Links diretos das imagens HTML */}
          <div className="bg-[#05070A] p-3 rounded-xl border border-white/[0.08] space-y-2">
            <label className="block text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
              Outros links diretos de imagens na web
            </label>
            <textarea
              rows={2}
              value={data.midia.linksImagens}
              onChange={(e) => updateField('midia', 'linksImagens', e.target.value)}
              placeholder="Cole aqui links de imagens na web (um por linha), se houver"
              className="w-full bg-[#090D14] border border-white/[0.08] focus:border-[#0066FF] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Observações sobre a Mídia
            </label>
            <textarea
              rows={2}
              value={data.midia.observacoes}
              onChange={(e) => updateField('midia', 'observacoes', e.target.value)}
              placeholder="Ex: Pode utilizar banco de imagens profissional da Gomes Studio se necessário."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 4. REDES SOCIAIS E CONTATOS */}
      {matchesSearch(['redes', 'sociais', 'contatos', 'whatsapp', 'instagram', 'facebook', 'email', 'tiktok']) && (
        <SectionItem
          id={4}
          title="4. Redes Sociais e Contatos"
          icon={<Share2 className="w-4 h-4" />}
          isOpen={openSection === 4}
          onToggle={() => onToggleSection(4)}
          onPrev={() => onGoToSection(3)}
          onNext={() => onGoToSection(5)}
          isCompleted={Boolean(data.contatos.whatsapp || data.contatos.instagram || data.contatos.email)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">WhatsApp Comercial Principal</label>
              <input
                type="text"
                value={data.contatos.whatsapp}
                onChange={(e) => updateField('contatos', 'whatsapp', e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Instagram Oficial</label>
              <input
                type="text"
                value={data.contatos.instagram}
                onChange={(e) => updateField('contatos', 'instagram', e.target.value)}
                placeholder="@seuusuario"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Facebook</label>
              <input
                type="text"
                value={data.contatos.facebook}
                onChange={(e) => updateField('contatos', 'facebook', e.target.value)}
                placeholder="facebook.com/suapagina"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">TikTok (se houver)</label>
              <input
                type="text"
                value={data.contatos.tiktok}
                onChange={(e) => updateField('contatos', 'tiktok', e.target.value)}
                placeholder="@seutiktok"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">E-mail Profissional</label>
              <input
                type="email"
                value={data.contatos.email}
                onChange={(e) => updateField('contatos', 'email', e.target.value)}
                placeholder="contato@suaempresa.com"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Outro Contato / Telefone Fixo</label>
              <input
                type="text"
                value={data.contatos.outros}
                onChange={(e) => updateField('contatos', 'outros', e.target.value)}
                placeholder="Ex: (00) 3000-0000 ou LinkedIn"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
          </div>
        </SectionItem>
      )}

      {/* 5. SOBRE A EMPRESA */}
      {matchesSearch(['sobre', 'história', 'missão', 'empresa', 'quem somos']) && (
        <SectionItem
          id={5}
          title="5. Sobre a Empresa"
          icon={<Info className="w-4 h-4" />}
          isOpen={openSection === 5}
          onToggle={() => onToggleSection(5)}
          onPrev={() => onGoToSection(4)}
          onNext={() => onGoToSection(6)}
          isCompleted={Boolean(data.sobre.historia || data.sobre.sobreNos)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Resumo Institucional / Quem Somos</label>
            <textarea
              rows={3}
              value={data.sobre.sobreNos}
              onChange={(e) => updateField('sobre', 'sobreNos', e.target.value)}
              placeholder="Descreva de forma simples quem é a sua empresa, propósito e compromisso com o cliente..."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">História ou Trajetória (Opcional)</label>
            <textarea
              rows={2}
              value={data.sobre.historia}
              onChange={(e) => updateField('sobre', 'historia', e.target.value)}
              placeholder="Como começou, anos de experiência ou marcos importantes..."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 6. PRODUTOS E/OU SERVIÇOS */}
      {matchesSearch(['produtos', 'serviços', 'preço', 'itens']) && (
        <SectionItem
          id={6}
          title="6. Produtos e/ou Serviços"
          icon={<ShoppingBag className="w-4 h-4" />}
          isOpen={openSection === 6}
          onToggle={() => onToggleSection(6)}
          onPrev={() => onGoToSection(5)}
          onNext={() => onGoToSection(7)}
          isCompleted={data.produtosServicos.some((p) => p.nome.trim() !== '')}
        >
          {/* Dica baseada no plano */}
          <div className="p-3 rounded-xl bg-[#090D14] border border-white/[0.06] flex items-center justify-between gap-2 text-xs">
            <div className="text-[#94A3B8]">
              <span className="text-white font-semibold">Recomendação ({planConfig.badge}): </span>
              {planConfig.secao6Servicos.limiteRecomendado}
            </div>
            <span className="text-[10px] font-mono text-[#38BDF8] bg-[#0066FF]/15 px-2 py-0.5 rounded border border-[#0066FF]/30">
              {data.produtosServicos.length} cadastrados
            </span>
          </div>

          <div className="space-y-3">
            {data.produtosServicos.map((prod, idx) => (
              <div key={idx} className="bg-[#05070A] p-3.5 rounded-xl border border-white/[0.08] space-y-2 relative group">
                <div className="text-xs font-bold text-[#38BDF8] flex items-center justify-between font-mono">
                  <span>Produto / Serviço 0{idx + 1}</span>
                  {data.produtosServicos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.produtosServicos.filter((_, i) => i !== idx);
                        onChange((prev) => ({ ...prev, produtosServicos: updated }));
                      }}
                      className="text-[11px] text-red-400/70 hover:text-red-400 flex items-center gap-1 transition"
                      title="Remover este item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={prod.nome}
                  onChange={(e) => {
                    const updated = [...data.produtosServicos];
                    updated[idx].nome = e.target.value;
                    onChange((prev) => ({ ...prev, produtosServicos: updated }));
                  }}
                  placeholder="Nome do produto ou serviço"
                  className="w-full bg-[#090D14] border border-white/[0.08] focus:border-[#0066FF] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#475569] outline-none transition"
                />
                <textarea
                  rows={2}
                  value={prod.descricao}
                  onChange={(e) => {
                    const updated = [...data.produtosServicos];
                    updated[idx].descricao = e.target.value;
                    onChange((prev) => ({ ...prev, produtosServicos: updated }));
                  }}
                  placeholder="Breve descrição dos benefícios e características"
                  className="w-full bg-[#090D14] border border-white/[0.08] focus:border-[#0066FF] rounded-xl px-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#475569] outline-none transition"
                />
                <input
                  type="text"
                  value={prod.preco}
                  onChange={(e) => {
                    const updated = [...data.produtosServicos];
                    updated[idx].preco = e.target.value;
                    onChange((prev) => ({ ...prev, produtosServicos: updated }));
                  }}
                  placeholder="Preço (Ex: A partir de R$ X ou A consultar)"
                  className="w-full bg-[#090D14] border border-white/[0.08] focus:border-[#0066FF] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#475569] outline-none transition font-mono"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                onChange((prev) => ({
                  ...prev,
                  produtosServicos: [...prev.produtosServicos, { nome: '', descricao: '', preco: '' }],
                }));
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-white/20 hover:border-[#0066FF] hover:bg-[#0066FF]/10 text-xs font-semibold text-[#CBD5E1] hover:text-[#38BDF8] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Mais um Produto / Serviço</span>
            </button>
          </div>
        </SectionItem>
      )}

      {/* 7. PLANOS E VALORES */}
      {matchesSearch(['planos', 'valores', 'mensalidade', 'tabela']) && (
        <SectionItem
          id={7}
          title="7. Planos e Valores"
          icon={<CreditCard className="w-4 h-4" />}
          isOpen={openSection === 7}
          onToggle={() => onToggleSection(7)}
          onPrev={() => onGoToSection(6)}
          onNext={() => onGoToSection(8)}
          isCompleted={Boolean(data.planos.possuiPlanos || data.planos.detalhes)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Seu negócio trabalha com planos, pacotes ou mensalidades?
            </label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-xs text-[#F8FAFC] cursor-pointer">
                  <input
                    type="radio"
                    name="possuiPlanos"
                    checked={data.planos.possuiPlanos === opt}
                    onChange={() => updateField('planos', 'possuiPlanos', opt as any)}
                    className="accent-[#0066FF]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Detalhes dos Planos ou Pacotes (Se houver)
            </label>
            <textarea
              rows={3}
              value={data.planos.detalhes}
              onChange={(e) => updateField('planos', 'detalhes', e.target.value)}
              placeholder="Ex: Plano Básico (R$ X), Plano Completo (R$ Y com suporte prioritário)..."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 8. AGENDAMENTO */}
      {matchesSearch(['agendamento', 'consulta', 'reserva', 'calendário']) && (
        <SectionItem
          id={8}
          title="8. Agendamento e Reservas"
          icon={<Calendar className="w-4 h-4" />}
          isOpen={openSection === 8}
          onToggle={() => onToggleSection(8)}
          onPrev={() => onGoToSection(7)}
          onNext={() => onGoToSection(9)}
          isCompleted={Boolean(data.agendamento.possuiAgendamento || data.agendamento.canais.length > 0)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Terá chamada para agendamento no site?
            </label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-xs text-[#F8FAFC] cursor-pointer">
                  <input
                    type="radio"
                    name="possuiAgendamento"
                    checked={data.agendamento.possuiAgendamento === opt}
                    onChange={() => updateField('agendamento', 'possuiAgendamento', opt as any)}
                    className="accent-[#0066FF]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Como o cliente deve agendar?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['Via WhatsApp Direto', 'Via Formulário no Site', 'Link de Sistema Externo (Calendly/Outro)'].map((canal) => {
                const checked = Boolean(data.agendamento?.canais?.includes(canal));
                return (
                  <button
                    type="button"
                    key={canal}
                    onClick={() => toggleArrayItem('agendamento', 'canais', canal)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition active:scale-95 cursor-pointer ${
                      checked
                        ? 'bg-[#0066FF]/20 border-[#38BDF8] text-[#38BDF8]'
                        : 'bg-[#05070A] border-white/[0.08] text-[#94A3B8] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                        checked ? 'bg-[#0066FF] border-[#38BDF8] text-white' : 'border-white/20'
                      }`}
                    >
                      {checked && '✓'}
                    </span>
                    <span>{canal}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Instruções de Agendamento (Opcional)</label>
            <textarea
              rows={2}
              value={data.agendamento.maisInformacoes}
              onChange={(e) => updateField('agendamento', 'maisInformacoes', e.target.value)}
              placeholder="Ex: Link do agendador online ou horário preferencial para retorno"
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 9. HORÁRIO DE FUNCIONAMENTO */}
      {matchesSearch(['horário', 'funcionamento', 'aberto', 'semana', 'sábado', 'domingo']) && (
        <SectionItem
          id={9}
          title="9. Horário de Funcionamento"
          icon={<Clock className="w-4 h-4" />}
          isOpen={openSection === 9}
          onToggle={() => onToggleSection(9)}
          onPrev={() => onGoToSection(8)}
          onNext={() => onGoToSection(10)}
          isCompleted={Boolean(data.horarios.segundaSexta || data.horarios.sabados)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Segunda a Sexta</label>
              <input
                type="text"
                value={data.horarios.segundaSexta}
                onChange={(e) => updateField('horarios', 'segundaSexta', e.target.value)}
                placeholder="Ex: 08:00 às 18:00"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Sábados</label>
              <input
                type="text"
                value={data.horarios.sabados}
                onChange={(e) => updateField('horarios', 'sabados', e.target.value)}
                placeholder="Ex: 08:00 às 12:00 ou Fechado"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Domingos e Feriados</label>
              <input
                type="text"
                value={data.horarios.domingosFeriados}
                onChange={(e) => updateField('horarios', 'domingosFeriados', e.target.value)}
                placeholder="Ex: Fechado ou Sob Agendamento"
                className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
              />
            </div>
          </div>
        </SectionItem>
      )}

      {/* 10. LOCALIZAÇÃO */}
      {matchesSearch(['localização', 'endereço', 'mapa', 'ponto de referência']) && (
        <SectionItem
          id={10}
          title="10. Localização e Mapa"
          icon={<MapPin className="w-4 h-4" />}
          isOpen={openSection === 10}
          onToggle={() => onToggleSection(10)}
          onPrev={() => onGoToSection(9)}
          onNext={() => onGoToSection(11)}
          isCompleted={Boolean(data.localizacao.enderecoExibicao || data.localizacao.exibirMapa)}
        >
          {/* Banner de parametrização de mapa por plano */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
            planLevel === 1
              ? 'bg-[#090D14] border-sky-500/30 text-[#CBD5E1]'
              : 'bg-[#090D14] border-emerald-500/30 text-[#CBD5E1]'
          }`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${planLevel === 1 ? 'text-[#38BDF8]' : 'text-emerald-400'}`} />
                <span className="font-semibold text-white">
                  {planLevel === 1
                    ? 'Localização: Endereço & Rota no Google Maps'
                    : 'Mapa Interativo Google Maps Disponível'}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                planLevel === 1
                  ? 'bg-[#0066FF]/20 text-[#38BDF8] border-[#0066FF]/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {planConfig.badge}
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              {planConfig.secao10.notaExplicativa}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Endereço de Exibição no Site</label>
            <input
              type="text"
              value={data.localizacao.enderecoExibicao}
              onChange={(e) => updateField('localizacao', 'enderecoExibicao', e.target.value)}
              placeholder="Rua, Número, Bairro, Cidade - Estado (ou Atendimento 100% Online)"
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Ponto de Referência (Opcional)</label>
            <input
              type="text"
              value={data.localizacao.pontoReferencia}
              onChange={(e) => updateField('localizacao', 'pontoReferencia', e.target.value)}
              placeholder="Ex: Próximo à praça central, em frente ao supermercado..."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
              Exibir mapa interativo do Google Maps no site?
            </label>
            <div className="space-y-2">
              {planLevel === 1 ? (
                <>
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                      data.localizacao.exibirMapa === 'Não'
                        ? 'bg-[#0066FF]/15 border-[#38BDF8] text-white'
                        : 'bg-[#05070A] border-white/[0.08] text-[#94A3B8] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exibirMapa"
                      checked={data.localizacao.exibirMapa === 'Não'}
                      onChange={() => updateField('localizacao', 'exibirMapa', 'Não')}
                      className="accent-[#0066FF] mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>Não — Apenas endereço formatado e botão de rota direta</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-[#38BDF8]">
                          Disponível no Essencial
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        Exibe o endereço completo e abre diretamente o app do Google Maps / Waze quando o cliente clica.
                      </p>
                    </div>
                  </label>

                  <div
                    className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-[#05070A]/50 text-[#64748B] opacity-50 cursor-not-allowed select-none"
                    title="O mapa interativo embutido está disponível a partir do plano Profissional"
                  >
                    <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center text-[10px] mt-0.5 flex-shrink-0 text-[#64748B] bg-white/[0.02]">
                      🔒
                    </div>
                    <div>
                      <div className="font-semibold text-[#94A3B8] flex items-center gap-2 flex-wrap">
                        <span>Sim — Mapa interativo embutido no site</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300/90 border border-amber-500/25 font-semibold">
                          🔒 Requer Plano Profissional ou Completo
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Recurso exclusivo dos planos Profissional e Completo. No plano Essencial, o mapa interativo embutido não pode ser marcado.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                      data.localizacao.exibirMapa === 'Sim'
                        ? 'bg-[#0066FF]/15 border-[#38BDF8] text-white'
                        : 'bg-[#05070A] border-white/[0.08] text-[#94A3B8] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exibirMapa"
                      checked={data.localizacao.exibirMapa === 'Sim'}
                      onChange={() => updateField('localizacao', 'exibirMapa', 'Sim')}
                      className="accent-[#0066FF] mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>Sim — Mapa interativo embutido no site</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Disponível
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        O visitante consegue aproximar o zoom, visualizar pontos de referência e traçar rotas diretamente na página.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                      data.localizacao.exibirMapa === 'Não'
                        ? 'bg-[#0066FF]/15 border-[#38BDF8] text-white'
                        : 'bg-[#05070A] border-white/[0.08] text-[#94A3B8] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exibirMapa"
                      checked={data.localizacao.exibirMapa === 'Não'}
                      onChange={() => updateField('localizacao', 'exibirMapa', 'Não')}
                      className="accent-[#0066FF] mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-white">Não — Apenas endereço textual sem mapa embutido</div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        Exibe apenas o endereço formatado por escrito.
                      </p>
                    </div>
                  </label>
                </>
              )}
            </div>
          </div>
        </SectionItem>
      )}

      {/* 11. DIFERENCIAIS DA EMPRESA */}
      {matchesSearch(['diferenciais', 'vantagens', 'por que escolher', 'benefícios']) && (
        <SectionItem
          id={11}
          title="11. Diferenciais da Empresa"
          icon={<Star className="w-4 h-4" />}
          isOpen={openSection === 11}
          onToggle={() => onToggleSection(11)}
          onPrev={() => onGoToSection(10)}
          onNext={() => onGoToSection(12)}
          isCompleted={Boolean(data.diferenciais.itens)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Por que o cliente deve escolher a sua empresa? (Diferenciais competitivos)
            </label>
            <textarea
              rows={3}
              value={data.diferenciais.itens}
              onChange={(e) => updateField('diferenciais', 'itens', e.target.value)}
              placeholder="1. Atendimento rápido e direto no WhatsApp&#10;2. Profissionais certificados e experientes&#10;3. Pontualidade e garantia de qualidade"
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 12. FRASE DE EFEITO */}
      {matchesSearch(['frase', 'efeito', 'headline', 'topo', 'destaque']) && (
        <SectionItem
          id={12}
          title="12. Frase de Destaque (Headline do Topo)"
          icon={<Quote className="w-4 h-4" />}
          isOpen={openSection === 12}
          onToggle={() => onToggleSection(12)}
          onPrev={() => onGoToSection(11)}
          onNext={() => onGoToSection(13)}
          isCompleted={Boolean(data.fraseEfeito.frasePrincipal)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Frase principal de impacto para o topo do site
            </label>
            <textarea
              rows={2}
              value={data.fraseEfeito.frasePrincipal}
              onChange={(e) => updateField('fraseEfeito', 'frasePrincipal', e.target.value)}
              placeholder="Ex: A solução definitiva para alavancar seu negócio com rapidez, segurança e autoridade."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 13. BOTÕES E AÇÕES */}
      {matchesSearch(['botões', 'ações', 'cta', 'destaque', 'orçamento']) && (
        <SectionItem
          id={13}
          title="13. Botões e Ações de Conversão (CTAs)"
          icon={<MousePointerClick className="w-4 h-4" />}
          isOpen={openSection === 13}
          onToggle={() => onToggleSection(13)}
          onPrev={() => onGoToSection(12)}
          onNext={() => onGoToSection(14)}
          isCompleted={data.botoesAcoes.selecionados.length > 0}
        >
          {/* Header explicativo do plano */}
          <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#0066FF]/30 space-y-2 text-xs text-[#CBD5E1]">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-[#38BDF8]" />
                <span className="font-semibold text-white">Estratégia de Conversão:</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#0066FF]/20 text-[#38BDF8] border border-[#0066FF]/30 font-bold">
                  {planConfig.badge}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#38BDF8]">
                {data.botoesAcoes.selecionados.length} botões selecionados
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              {planConfig.secao13.notaGuia}
            </p>
            <div className="text-[11px] text-amber-300/90 font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 inline-block">
              ⚡ {planConfig.secao13.limiteRecomendado}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
              Selecione os botões de ação que devem aparecer no seu site:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MASTER_BUTTONS_CATALOG.map((btn) => {
                const isLocked = btn.minLevel > planLevel;
                const checked = Boolean(data.botoesAcoes?.selecionados?.includes(btn.nome));
                const isRecommended = !isLocked && Boolean(planConfig.secao13?.botoesRecomendados?.includes(btn.nome));
                const requiredTier = getTierRequiredName(btn.minLevel);

                return (
                  <button
                    type="button"
                    key={btn.nome}
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) return;
                      toggleArrayItem('botoesAcoes', 'selecionados', btn.nome);
                    }}
                    className={`flex items-start justify-between p-3 rounded-xl border text-xs font-medium transition text-left ${
                      isLocked
                        ? 'opacity-40 bg-[#05070A]/50 border-white/[0.04] text-[#64748B] cursor-not-allowed select-none'
                        : checked
                        ? 'bg-[#0066FF]/20 border-[#38BDF8] text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.15)] cursor-pointer active:scale-95'
                        : 'bg-[#05070A] border-white/[0.08] text-[#94A3B8] hover:text-white hover:border-white/20 cursor-pointer active:scale-95'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] mt-0.5 flex-shrink-0 ${
                          isLocked
                            ? 'border-white/10 text-[#64748B] bg-white/[0.02]'
                            : checked
                            ? 'bg-[#0066FF] border-[#38BDF8] text-white'
                            : 'border-white/20'
                        }`}
                      >
                        {isLocked ? '🔒' : checked ? '✓' : ''}
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-semibold text-white truncate flex items-center gap-1.5">
                          <span className={isLocked ? 'text-[#94A3B8]' : ''}>{btn.nome}</span>
                          {isRecommended && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" title="Sugerido para seu plano" />
                          )}
                        </div>
                        {btn.desc && (
                          <p className="text-[11px] text-[#94A3B8] line-clamp-1">{btn.desc}</p>
                        )}
                      </div>
                    </div>

                    {isLocked ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0 whitespace-nowrap bg-amber-500/15 text-amber-300/90 border border-amber-500/25 font-semibold">
                        🔒 Requer {requiredTier}
                      </span>
                    ) : btn.tag ? (
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0 whitespace-nowrap ${
                        btn.tag === 'Essencial'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : btn.tag?.includes('⭐') || btn.tag === 'Alta Conversão'
                          ? 'bg-[#0066FF]/30 text-[#38BDF8] border border-[#0066FF]/40 font-bold'
                          : 'bg-white/[0.06] text-[#94A3B8] border border-white/[0.08]'
                      }`}>
                        {btn.tag}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionItem>
      )}

      {/* 14. DOMÍNIO */}
      {matchesSearch(['domínio', 'registro', 'www', 'site', 'url']) && (
        <SectionItem
          id={14}
          title="14. Domínio (Endereço do Site)"
          icon={<Globe className="w-4 h-4" />}
          isOpen={openSection === 14}
          onToggle={() => onToggleSection(14)}
          onPrev={() => onGoToSection(13)}
          onNext={() => onGoToSection(15)}
          isCompleted={Boolean(data.dominio.possuiDominio || data.dominio.nomeDominio)}
        >
          {/* Caixa explicativa sobre o que é Domínio */}
          <div className="bg-[#05070A]/90 p-4 rounded-xl border border-sky-500/30 text-xs text-[#94A3B8] space-y-2">
            <div className="flex items-center gap-2 text-[#38BDF8] font-semibold text-xs">
              <Globe className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
              <span>O que é um Domínio?</span>
            </div>
            <p className="leading-relaxed text-[#CBD5E1]">
              O <strong>domínio</strong> é o seu endereço oficial na internet (o link que as pessoas digitam no navegador). A <strong>Gomes Studio</strong> auxilia na configuração completa e conexão ao seu servidor.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#38BDF8] font-mono">
              <span className="text-[#94A3B8]">Exemplos:</span>
              <code className="bg-[#090D14] px-2 py-0.5 rounded text-[#38BDF8] border border-sky-500/20">www.suaempresa.com.br</code>
              <code className="bg-[#090D14] px-2 py-0.5 rounded text-[#38BDF8] border border-sky-500/20">seunome.com</code>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Já possui domínio registrado?
            </label>
            <div className="flex gap-4">
              {['Sim', 'Não', 'Não sei (Preciso de ajuda da Gomes Studio)'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-xs text-[#F8FAFC] cursor-pointer">
                  <input
                    type="radio"
                    name="possuiDominio"
                    checked={data.dominio.possuiDominio === opt}
                    onChange={() => updateField('dominio', 'possuiDominio', opt as any)}
                    className="accent-[#0066FF]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Qual domínio você já tem ou gostaria de ter?
            </label>
            <input
              type="text"
              value={data.dominio.nomeDominio}
              onChange={(e) => updateField('dominio', 'nomeDominio', e.target.value)}
              placeholder="ex: suamarca.com.br"
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition font-mono"
            />
          </div>
        </SectionItem>
      )}

      {/* 15. PÁGINAS DO SITE */}
      {matchesSearch(['páginas', 'one page', 'estrutura', 'menu']) && (
        <SectionItem
          id={15}
          title="15. Seções e Estrutura do Site"
          icon={<Layout className="w-4 h-4" />}
          isOpen={openSection === 15}
          onToggle={() => onToggleSection(15)}
          onPrev={() => onGoToSection(14)}
          onNext={() => onGoToSection(16)}
          isCompleted={data.paginasSite.selecionadas.length > 0}
        >
          {/* Guia estrutural de acordo com o plano */}
          <div className="p-4 rounded-xl bg-[#090D14]/90 border border-[#0066FF]/40 shadow-[0_0_20px_rgba(0,102,255,0.1)] space-y-2.5 text-xs text-[#CBD5E1]">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0066FF]/20 border border-[#0066FF]/40 flex items-center justify-center text-[#38BDF8]">
                  <Layout className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-white tracking-tight">Arquitetura do Projeto:</span>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#0066FF]/25 text-[#38BDF8] border border-[#38BDF8]/40 font-bold tracking-wide">
                  {planConfig.badge}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.1] text-[#38BDF8]">
                  {data.paginasSite.selecionadas.length} seções selecionadas
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const recommended = planConfig.secao15?.secoesRecomendadas || [];
                    const sanitized = sanitizeSelectionsForPlan(data.tipoProjeto, {
                      ...data,
                      paginasSite: {
                        ...data.paginasSite,
                        selecionadas: recommended,
                      },
                    });
                    onChange('paginasSite', sanitized.paginasSite);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#0066FF]/20 hover:bg-[#0066FF]/35 border border-[#38BDF8]/40 text-[#38BDF8] text-[11px] font-medium transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                  title="Marca automaticamente as seções ideais para este tipo de projeto"
                >
                  <Sparkles className="w-3 h-3" />
                  Preencher sugeridas
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              {planConfig.secao15.notaGuia}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
              Selecione as seções que você deseja presentes no seu site:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MASTER_SECTIONS_CATALOG.map((secao) => {
                const isLocked = secao.minLevel > planLevel;
                const checked = Boolean(data.paginasSite?.selecionadas?.includes(secao.nome));
                const isSuggested = !isLocked && Boolean(planConfig.secao15?.secoesRecomendadas?.includes(secao.nome));
                const requiredTier = getTierRequiredName(secao.minLevel);

                return (
                  <button
                    type="button"
                    key={secao.nome}
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) return;
                      toggleArrayItem('paginasSite', 'selecionadas', secao.nome);
                    }}
                    className={`flex items-start justify-between p-3 rounded-xl border text-xs font-medium text-left transition ${
                      isLocked
                        ? 'opacity-40 bg-[#05070A]/50 border-white/[0.04] text-[#64748B] cursor-not-allowed select-none'
                        : checked
                        ? 'bg-[#0066FF]/20 border-[#38BDF8] text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.15)] cursor-pointer active:scale-95'
                        : 'bg-[#05070A] border-white/[0.08] text-[#94A3B8] hover:text-white hover:border-white/20 cursor-pointer active:scale-95'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 ${
                          isLocked
                            ? 'border-white/10 text-[#64748B] bg-white/[0.02]'
                            : checked
                            ? 'bg-[#0066FF] border-[#38BDF8] text-white'
                            : 'border-white/20'
                        }`}
                      >
                        {isLocked ? '🔒' : checked ? '✓' : ''}
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-semibold text-white truncate flex items-center gap-1.5">
                          <span className={isLocked ? 'text-[#94A3B8]' : ''}>{secao.nome}</span>
                          {isSuggested && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" title="Sugerido para seu plano" />
                          )}
                        </div>
                        {secao.desc && (
                          <p className="text-[11px] text-[#94A3B8] line-clamp-1">{secao.desc}</p>
                        )}
                      </div>
                    </div>

                    {isLocked ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0 whitespace-nowrap bg-amber-500/15 text-amber-300/90 border border-amber-500/25 font-semibold">
                        🔒 Requer {requiredTier}
                      </span>
                    ) : secao.tag ? (
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0 whitespace-nowrap ${
                        secao.tag === 'Essencial'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : secao.tag?.includes('⭐') || secao.tag === 'Alta Conversão'
                          ? 'bg-[#0066FF]/30 text-[#38BDF8] border border-[#0066FF]/40 font-bold'
                          : 'bg-white/[0.06] text-[#94A3B8] border border-white/[0.08]'
                      }`}>
                        {secao.tag}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionItem>
      )}

      {/* 16. REFERÊNCIAS E IDEIAS */}
      {matchesSearch(['referências', 'ideias', 'gosta', 'não quer']) && (
        <SectionItem
          id={16}
          title="16. Preferências e Detalhes Visuais"
          icon={<Lightbulb className="w-4 h-4" />}
          isOpen={openSection === 16}
          onToggle={() => onToggleSection(16)}
          onPrev={() => onGoToSection(15)}
          onNext={() => onGoToSection(17)}
          isCompleted={Boolean(data.referencias.gosta || data.referencias.naoQuer)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              O que você mais gosta visualmente em sites de referência?
            </label>
            <textarea
              rows={2}
              value={data.referencias.gosta}
              onChange={(e) => updateField('referencias', 'gosta', e.target.value)}
              placeholder="Ex: Animações suaves, estilo cyber escuro, botões chamativos, fotos grandes..."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              O que você NÃO quer de jeito nenhum?
            </label>
            <textarea
              rows={2}
              value={data.referencias.naoQuer}
              onChange={(e) => updateField('referencias', 'naoQuer', e.target.value)}
              placeholder="Ex: Cores apagadas, poluição visual, blocos de texto muito longos..."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 17. INFORMAÇÕES ADICIONAIS */}
      {matchesSearch(['informações', 'adicionais', 'observações', 'extras']) && (
        <SectionItem
          id={17}
          title="17. Observações Finais"
          icon={<FileText className="w-4 h-4" />}
          isOpen={openSection === 17}
          onToggle={() => onToggleSection(17)}
          onPrev={() => onGoToSection(16)}
          isCompleted={Boolean(data.adicionais.outrasInfo)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Alguma outra observação para a equipe da Gomes Studio?
            </label>
            <textarea
              rows={3}
              value={data.adicionais.outrasInfo}
              onChange={(e) => updateField('adicionais', 'outrasInfo', e.target.value)}
              placeholder="Fique à vontade para adicionar qualquer pedido especial, prazo desejado ou detalhe importante..."
              className="w-full bg-[#05070A] border border-white/[0.08] focus:border-[#0066FF] focus:ring-1 focus:ring-[#38BDF8] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* CHECKLIST FINAL */}
      <div className="bg-[#090D14]/90 border border-white/10 rounded-2xl p-5 mt-6 space-y-3 backdrop-blur-md">
        <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] shadow-[0_0_8px_#0066FF]" /> Checklist Final de Envio
        </h3>
        <div className="space-y-2.5">
          <label className="flex items-start gap-3 text-xs text-[#CBD5E1] cursor-pointer p-3 rounded-xl bg-[#05070A] border border-white/[0.08] hover:border-white/20 transition">
            <input
              type="checkbox"
              checked={data.checklist.confirmou}
              onChange={(e) => updateField('checklist', 'confirmou', e.target.checked)}
              className="mt-0.5 accent-[#0066FF]"
            />
            <span>Confirmo que revisei as informações e desejo iniciar a produção com a <strong>Gomes Studio</strong></span>
          </label>
          <label className="flex items-start gap-3 text-xs text-[#CBD5E1] cursor-pointer p-3 rounded-xl bg-[#05070A] border border-white/[0.08] hover:border-white/20 transition">
            <input
              type="checkbox"
              checked={data.checklist.anexouArquivos}
              onChange={(e) => updateField('checklist', 'anexouArquivos', e.target.checked)}
              className="mt-0.5 accent-[#0066FF]"
            />
            <span>Estou ciente de que posso enviar a logomarca e fotos diretamente pelo <strong>WhatsApp da Gomes Studio</strong> após o envio</span>
          </label>
        </div>
      </div>
    </div>
  );
};
