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
} from 'lucide-react';

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

  const handleRemoveLogo = () => {
    setLogoPreviewError(false);
    onChange((prev) => ({
      ...prev,
      identidadeVisual: {
        ...prev.identidadeVisual,
        logoNome: '',
        logoUrl: '',
        logoBase64: '',
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
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Nome da Empresa
            </label>
            <input
              type="text"
              value={data.empresa.nome}
              onChange={(e) => updateField('empresa', 'nome', e.target.value)}
              placeholder="Sua Empresa LTDA"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Segmento / Ramo de Atuação
            </label>
            <input
              type="text"
              value={data.empresa.segmento}
              onChange={(e) => updateField('empresa', 'segmento', e.target.value)}
              placeholder="Ex: Tecnologia, Varejo, Saúde, Gastronomia"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Cidade/Estado
            </label>
            <input
              type="text"
              value={data.empresa.cidadeEstado}
              onChange={(e) => updateField('empresa', 'cidadeEstado', e.target.value)}
              placeholder="Ex: São Paulo - SP"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Endereço Completo
            </label>
            <input
              type="text"
              value={data.empresa.endereco}
              onChange={(e) => updateField('empresa', 'endereco', e.target.value)}
              placeholder="Ex: Rua X, 123 - Bairro Central"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Link do Google Maps
            </label>
            <input
              type="url"
              value={data.empresa.googleMapsLink}
              onChange={(e) => updateField('empresa', 'googleMapsLink', e.target.value)}
              placeholder="Cole o link do Google Maps aqui"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
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
          {/* Logo / Anexo por Email */}
          <div className="space-y-3 bg-[#0b1326] p-4 rounded-xl border border-sky-500/40">
            <div className="flex items-start gap-3 text-xs text-sky-200">
              <Mail className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 leading-relaxed">
                <p className="font-bold text-sky-300 text-sm">
                  📌 Envio da Logomarca por E-mail (Gmail)
                </p>
                <p className="text-[#cbd5e1] text-xs">
                  Para garantir a máxima definição visual e sem perda de qualidade, o arquivo original da sua logo (PNG, JPG, PDF ou vetor) deve ser enviado por <strong>E-mail (Gmail)</strong> para <strong>lucasgomes3621@gmail.com</strong>.
                </p>
                <div className="bg-[#131b2e] p-3 rounded-lg border border-[#222a3d] space-y-1.5 text-[11px] text-[#94a3b8]">
                  <p className="font-semibold text-white">Como fazer o envio:</p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px]">1</span>
                    No final deste formulário, clique no botão azul <strong>"Enviar as Mídias no E-mail"</strong>.
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px]">2</span>
                    Seu Gmail abrirá com o destinatário e o texto já preenchidos.
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px]">3</span>
                    Clique no ícone de <strong>Clips 📎 (Anexar arquivos)</strong> do Gmail e anexe o arquivo da sua logo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Slogan da Empresa
            </label>
            <input
              type="text"
              value={data.identidadeVisual.slogan}
              onChange={(e) => updateField('identidadeVisual', 'slogan', e.target.value)}
              placeholder="Ex: Inovando para você"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Cores Principais
            </label>
            <input
              type="text"
              value={data.identidadeVisual.coresPrincipais}
              onChange={(e) => updateField('identidadeVisual', 'coresPrincipais', e.target.value)}
              placeholder="Ex: Azul e Branco, Preto e Dourado..."
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-2">
              Estilo do Site
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Moderno', 'Minimalista', 'Clássico', 'Corporativo', 'Criativo', 'Tech / Dark'].map((estilo) => {
                const checked = data.identidadeVisual.estiloSite.includes(estilo);
                return (
                  <button
                    type="button"
                    key={estilo}
                    onClick={() => toggleArrayItem('identidadeVisual', 'estiloSite', estilo)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition active:scale-95 ${
                      checked
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-[#0b1326] border-[#2d3449] text-[#94a3b8] hover:text-[#f8fafc]'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                        checked ? 'bg-blue-600 border-blue-500 text-white' : 'border-[#4b5563]'
                      }`}
                    >
                      {checked && '✓'}
                    </span>
                    <span>{estilo}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Sites de Referência (Links)
            </label>
            <textarea
              rows={2}
              value={data.identidadeVisual.sitesReferencia}
              onChange={(e) => updateField('identidadeVisual', 'sitesReferencia', e.target.value)}
              placeholder="Cole links de sites que você gosta como inspiração"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
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
          {/* Instruções de Envio de Fotos no Email */}
          <div className="bg-[#0b1326] border border-sky-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3 text-xs text-sky-200">
              <Mail className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 leading-relaxed">
                <p className="font-bold text-sky-300 text-sm">
                  📌 Envio de Fotos, Vídeos e Imagens por E-mail (Gmail)
                </p>
                <p className="text-[#cbd5e1] text-xs">
                  Para que as fotos do seu estabelecimento, produtos, equipe e serviços não percam qualidade nem sofram compressão, o envio das mídias é feito diretamente pelo <strong>Gmail</strong> para <strong>lucasgomes3621@gmail.com</strong>.
                </p>
              </div>
            </div>

            {/* Passo a Passo Ilustrado */}
            <div className="bg-[#131b2e] p-3.5 rounded-xl border border-[#222a3d] space-y-2.5 text-xs text-[#94a3b8]">
              <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                <span>📋 Como anexar suas mídias no Gmail:</span>
              </p>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                  <span>Preencha as informações do briefing e vá até o final da página.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                  <span>Clique no botão azul <strong>"Enviar as Mídias no E-mail"</strong> localizado no final do formulário.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                  <span>O seu aplicativo ou site do <strong>Gmail</strong> abrirá automaticamente com o destinatário <strong>lucasgomes3621@gmail.com</strong> e o resumo do site já preenchido.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">4</span>
                  <span>No Gmail, clique no ícone do <strong>Clips 📎 ("Anexar arquivos")</strong> no topo ou rodapé do e-mail.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">5</span>
                  <span>Selecione as fotos, vídeos e o arquivo da sua logo, e clique em <strong>Enviar</strong>!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Google Drive / Cloud Link Field */}
          <div className="bg-[#0b1326] p-3 rounded-lg border border-[#2d3449] space-y-2">
            <label className="block text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
              Link da Pasta no Google Drive / Dropbox / Nuvem (Opcional)
            </label>
            <input
              type="url"
              value={data.midia.arquivosInfo || ''}
              onChange={(e) => updateField('midia', 'arquivosInfo', e.target.value)}
              placeholder="https://drive.google.com/drive/folders/... ou link de pasta compartilhada"
              className="w-full bg-[#131b2e] border border-[#222a3d] focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
            <p className="text-[10px] text-[#94a3b8]">
              Se você já tiver uma pasta com todas as suas fotos e vídeos no Google Drive, OneDrive ou Dropbox, pode colar o link compartilhável aqui.
            </p>
          </div>

          {/* Links diretos das imagens HTML */}
          <div className="bg-[#0b1326] p-3 rounded-lg border border-[#2d3449] space-y-2">
            <label className="block text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
              Outros links diretos de imagens na web
            </label>
            <textarea
              rows={2}
              value={data.midia.linksImagens}
              onChange={(e) => updateField('midia', 'linksImagens', e.target.value)}
              placeholder="Cole aqui links de imagens na web (um por linha), se houver"
              className="w-full bg-[#131b2e] border border-[#222a3d] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Observações sobre a Mídia
            </label>
            <textarea
              rows={2}
              value={data.midia.observacoes}
              onChange={(e) => updateField('midia', 'observacoes', e.target.value)}
              placeholder="Detalhes adicionais sobre as fotos/vídeos (ex: usar banco de imagens gratuito se necessário)"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
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
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">WhatsApp Principal</label>
              <input
                type="text"
                value={data.contatos.whatsapp}
                onChange={(e) => updateField('contatos', 'whatsapp', e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Instagram</label>
              <input
                type="text"
                value={data.contatos.instagram}
                onChange={(e) => updateField('contatos', 'instagram', e.target.value)}
                placeholder="@seuusuario"
                className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Facebook</label>
              <input
                type="text"
                value={data.contatos.facebook}
                onChange={(e) => updateField('contatos', 'facebook', e.target.value)}
                placeholder="facebook.com/suapagina"
                className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">TikTok</label>
              <input
                type="text"
                value={data.contatos.tiktok}
                onChange={(e) => updateField('contatos', 'tiktok', e.target.value)}
                placeholder="@seutiktok"
                className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">E-mail de Contato</label>
              <input
                type="email"
                value={data.contatos.email}
                onChange={(e) => updateField('contatos', 'email', e.target.value)}
                placeholder="contato@suaempresa.com"
                className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Outros Contatos / LinkedIn</label>
              <input
                type="text"
                value={data.contatos.outros}
                onChange={(e) => updateField('contatos', 'outros', e.target.value)}
                placeholder="LinkedIn, Telefone Fixo, etc."
                className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
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
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">História</label>
            <textarea
              rows={3}
              value={data.sobre.historia}
              onChange={(e) => updateField('sobre', 'historia', e.target.value)}
              placeholder="Como surgiu a empresa, trajetória e valores centrais..."
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Sobre Nós / Resumo</label>
            <textarea
              rows={3}
              value={data.sobre.sobreNos}
              onChange={(e) => updateField('sobre', 'sobreNos', e.target.value)}
              placeholder="Resumo de apresentação institucional para a seção Sobre do site..."
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
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
          <p className="text-xs text-[#94a3b8] mb-2">Detalhe até 3 principais produtos/serviços:</p>
          <div className="space-y-3">
            {data.produtosServicos.map((prod, idx) => (
              <div key={idx} className="bg-[#0b1326] p-3 rounded-lg border border-[#222a3d] space-y-2">
                <div className="text-xs font-bold text-blue-400 flex items-center justify-between">
                  <span>Produto/Serviço {idx + 1}</span>
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
                  className="w-full bg-[#131b2e] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
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
                  className="w-full bg-[#131b2e] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
                />
                <input
                  type="text"
                  value={prod.preco}
                  onChange={(e) => {
                    const updated = [...data.produtosServicos];
                    updated[idx].preco = e.target.value;
                    onChange((prev) => ({ ...prev, produtosServicos: updated }));
                  }}
                  placeholder="Preço (Ex: R$ 150,00 ou A consultar)"
                  className="w-full bg-[#131b2e] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
                />
              </div>
            ))}
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
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Possui planos específicos?
            </label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-xs text-[#f8fafc] cursor-pointer">
                  <input
                    type="radio"
                    name="possuiPlanos"
                    checked={data.planos.possuiPlanos === opt}
                    onChange={() => updateField('planos', 'possuiPlanos', opt as any)}
                    className="accent-blue-600"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Detalhes dos Planos
            </label>
            <textarea
              rows={3}
              value={data.planos.detalhes}
              onChange={(e) => updateField('planos', 'detalhes', e.target.value)}
              placeholder="Descreva os planos 1, 2, 3 com diferenciais e preços..."
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 8. AGENDAMENTO */}
      {matchesSearch(['agendamento', 'consulta', 'reserva', 'calendário']) && (
        <SectionItem
          id={8}
          title="8. Agendamento"
          icon={<Calendar className="w-4 h-4" />}
          isOpen={openSection === 8}
          onToggle={() => onToggleSection(8)}
          onPrev={() => onGoToSection(7)}
          onNext={() => onGoToSection(9)}
          isCompleted={Boolean(data.agendamento.possuiAgendamento || data.agendamento.canais.length > 0)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Terá sistema de agendamento?
            </label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-xs text-[#f8fafc] cursor-pointer">
                  <input
                    type="radio"
                    name="possuiAgendamento"
                    checked={data.agendamento.possuiAgendamento === opt}
                    onChange={() => updateField('agendamento', 'possuiAgendamento', opt as any)}
                    className="accent-blue-600"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Canal de Atendimento do Agendamento
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['Via WhatsApp', 'Via Formulário', 'Sistema Externo'].map((canal) => {
                const checked = data.agendamento.canais.includes(canal);
                return (
                  <button
                    type="button"
                    key={canal}
                    onClick={() => toggleArrayItem('agendamento', 'canais', canal)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition active:scale-95 ${
                      checked
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-[#0b1326] border-[#2d3449] text-[#94a3b8]'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                        checked ? 'bg-blue-600 border-blue-500 text-white' : 'border-[#4b5563]'
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
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Mais informações...</label>
            <textarea
              rows={2}
              value={data.agendamento.maisInformacoes}
              onChange={(e) => updateField('agendamento', 'maisInformacoes', e.target.value)}
              placeholder="Ex: Link do Calendly ou instruções de triagem prévia"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
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
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Segunda a Sexta</label>
            <input
              type="text"
              value={data.horarios.segundaSexta}
              onChange={(e) => updateField('horarios', 'segundaSexta', e.target.value)}
              placeholder="Ex: 08:00 às 18:00"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Sábados</label>
            <input
              type="text"
              value={data.horarios.sabados}
              onChange={(e) => updateField('horarios', 'sabados', e.target.value)}
              placeholder="Ex: 09:00 às 13:00 ou Fechado"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Domingos / Feriados</label>
            <input
              type="text"
              value={data.horarios.domingosFeriados}
              onChange={(e) => updateField('horarios', 'domingosFeriados', e.target.value)}
              placeholder="Ex: Fechado ou Sob agendamento"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 10. LOCALIZAÇÃO */}
      {matchesSearch(['localização', 'endereço', 'mapa', 'ponto de referência']) && (
        <SectionItem
          id={10}
          title="10. Localização"
          icon={<MapPin className="w-4 h-4" />}
          isOpen={openSection === 10}
          onToggle={() => onToggleSection(10)}
          onPrev={() => onGoToSection(9)}
          onNext={() => onGoToSection(11)}
          isCompleted={Boolean(data.localizacao.enderecoExibicao || data.localizacao.exibirMapa)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Endereço de Exibição no Site</label>
            <input
              type="text"
              value={data.localizacao.enderecoExibicao}
              onChange={(e) => updateField('localizacao', 'enderecoExibicao', e.target.value)}
              placeholder="Como deve aparecer no rodapé / seção de contato"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Ponto de Referência</label>
            <input
              type="text"
              value={data.localizacao.pontoReferencia}
              onChange={(e) => updateField('localizacao', 'pontoReferencia', e.target.value)}
              placeholder="Ex: Em frente ao banco X, próximo à estação de metrô"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Exibir mapa interativo no site?</label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-xs text-[#f8fafc] cursor-pointer">
                  <input
                    type="radio"
                    name="exibirMapa"
                    checked={data.localizacao.exibirMapa === opt}
                    onChange={() => updateField('localizacao', 'exibirMapa', opt as any)}
                    className="accent-blue-600"
                  />
                  {opt}
                </label>
              ))}
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
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Liste seus diferenciais (Por que o cliente deve escolher vocês?)
            </label>
            <textarea
              rows={4}
              value={data.diferenciais.itens}
              onChange={(e) => updateField('diferenciais', 'itens', e.target.value)}
              placeholder="1. Atendimento ágil e personalizado&#10;2. Mais de 10 anos no mercado&#10;3. Garantia de qualidade&#10;4. Equipamentos de última geração"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 12. FRASE DE EFEITO */}
      {matchesSearch(['frase', 'efeito', 'headline', 'topo', 'destaque']) && (
        <SectionItem
          id={12}
          title="12. Frase de Efeito"
          icon={<Quote className="w-4 h-4" />}
          isOpen={openSection === 12}
          onToggle={() => onToggleSection(12)}
          onPrev={() => onGoToSection(11)}
          onNext={() => onGoToSection(13)}
          isCompleted={Boolean(data.fraseEfeito.frasePrincipal)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Frase principal para o topo do site (Headline)
            </label>
            <textarea
              rows={3}
              value={data.fraseEfeito.frasePrincipal}
              onChange={(e) => updateField('fraseEfeito', 'frasePrincipal', e.target.value)}
              placeholder="Ex: A solução definitiva para acelerar seus resultados com segurança e agilidade."
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 13. BOTÕES E AÇÕES */}
      {matchesSearch(['botões', 'ações', 'cta', 'destaque', 'orçamento']) && (
        <SectionItem
          id={13}
          title="13. Botões e Ações"
          icon={<MousePointerClick className="w-4 h-4" />}
          isOpen={openSection === 13}
          onToggle={() => onToggleSection(13)}
          onPrev={() => onGoToSection(12)}
          onNext={() => onGoToSection(14)}
          isCompleted={data.botoesAcoes.selecionados.length > 0}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-2">
              Quais botões de ação deseja em destaque no site?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Comprar Agora',
                'Agendar / Marcar Consulta',
                'Falar no WhatsApp',
                'Solicitar Orçamento',
                'Ligar Agora',
                'Ver Cardápio / Catálogo',
              ].map((btn) => {
                const checked = data.botoesAcoes.selecionados.includes(btn);
                return (
                  <button
                    type="button"
                    key={btn}
                    onClick={() => toggleArrayItem('botoesAcoes', 'selecionados', btn)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-medium transition active:scale-95 ${
                      checked
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-[#0b1326] border-[#2d3449] text-[#94a3b8] hover:text-[#f8fafc]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                        checked ? 'bg-blue-600 border-blue-500 text-white' : 'border-[#4b5563]'
                      }`}
                    >
                      {checked && '✓'}
                    </span>
                    <span>{btn}</span>
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
          title="14. Domínio"
          icon={<Globe className="w-4 h-4" />}
          isOpen={openSection === 14}
          onToggle={() => onToggleSection(14)}
          onPrev={() => onGoToSection(13)}
          onNext={() => onGoToSection(15)}
          isCompleted={Boolean(data.dominio.possuiDominio || data.dominio.nomeDominio)}
        >
          {/* Caixa explicativa sobre o que é Domínio */}
          <div className="bg-[#0b1326] p-3.5 rounded-xl border border-sky-500/30 text-xs text-[#94a3b8] space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
              <Globe className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>O que é um Domínio?</span>
            </div>
            <p className="leading-relaxed text-[#cbd5e1]">
              O <strong>domínio</strong> é o <strong>endereço oficial exclusivo</strong> do seu site na internet (o link que as pessoas digitam no navegador para encontrar sua empresa).
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-sky-300">
              <span className="text-[#94a3b8]">Exemplos:</span>
              <code className="bg-[#131b2e] px-2 py-0.5 rounded text-sky-300 border border-sky-500/20 font-mono">www.suaempresa.com.br</code>
              <code className="bg-[#131b2e] px-2 py-0.5 rounded text-sky-300 border border-sky-500/20 font-mono">seunome.com</code>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Já possui um domínio registrado? (ex: www.suaempresa.com.br)
            </label>
            <div className="flex gap-4">
              {['Sim', 'Não', 'Não sei'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-xs text-[#f8fafc] cursor-pointer">
                  <input
                    type="radio"
                    name="possuiDominio"
                    checked={data.dominio.possuiDominio === opt}
                    onChange={() => updateField('dominio', 'possuiDominio', opt as any)}
                    className="accent-blue-600"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Qual o domínio (se possuir ou tiver em mente)?
            </label>
            <input
              type="text"
              value={data.dominio.nomeDominio}
              onChange={(e) => updateField('dominio', 'nomeDominio', e.target.value)}
              placeholder="ex: suamarca.com.br"
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 15. PÁGINAS DO SITE */}
      {matchesSearch(['páginas', 'one page', 'estrutura', 'menu']) && (
        <SectionItem
          id={15}
          title="15. Páginas do Site"
          icon={<Layout className="w-4 h-4" />}
          isOpen={openSection === 15}
          onToggle={() => onToggleSection(15)}
          onPrev={() => onGoToSection(14)}
          onNext={() => onGoToSection(16)}
          isCompleted={data.paginasSite.selecionadas.length > 0}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-2">
              Selecione as páginas que deseja incluir:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'One Page (Tudo em uma única página fluida)',
                'Início (Home)',
                'Sobre Nós',
                'Serviços / Produtos',
                'Contato',
                'Galeria / Portfólio',
                'Depoimentos de Clientes',
                'Blog / Notícias',
              ].map((pag) => {
                const checked = data.paginasSite.selecionadas.includes(pag);
                return (
                  <button
                    type="button"
                    key={pag}
                    onClick={() => toggleArrayItem('paginasSite', 'selecionadas', pag)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-medium text-left transition active:scale-95 ${
                      checked
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-[#0b1326] border-[#2d3449] text-[#94a3b8] hover:text-[#f8fafc]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ${
                        checked ? 'bg-blue-600 border-blue-500 text-white' : 'border-[#4b5563]'
                      }`}
                    >
                      {checked && '✓'}
                    </span>
                    <span>{pag}</span>
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
          title="16. Referências e Ideias"
          icon={<Lightbulb className="w-4 h-4" />}
          isOpen={openSection === 16}
          onToggle={() => onToggleSection(16)}
          onPrev={() => onGoToSection(15)}
          onNext={() => onGoToSection(17)}
          isCompleted={Boolean(data.referencias.gosta || data.referencias.naoQuer)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              O que você gosta nesses sites de referência?
            </label>
            <textarea
              rows={3}
              value={data.referencias.gosta}
              onChange={(e) => updateField('referencias', 'gosta', e.target.value)}
              placeholder="Ex: Animações suaves, visual minimalista escuro, botões chamativos..."
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              O que você NÃO quer de jeito nenhum?
            </label>
            <textarea
              rows={3}
              value={data.referencias.naoQuer}
              onChange={(e) => updateField('referencias', 'naoQuer', e.target.value)}
              placeholder="Ex: Cores muito berrantes, textos gigantes sem espaçamento, popups chatos..."
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* 17. INFORMAÇÕES ADICIONAIS */}
      {matchesSearch(['informações', 'adicionais', 'observações', 'extras']) && (
        <SectionItem
          id={17}
          title="17. Informações Adicionais"
          icon={<FileText className="w-4 h-4" />}
          isOpen={openSection === 17}
          onToggle={() => onToggleSection(17)}
          onPrev={() => onGoToSection(16)}
          isCompleted={Boolean(data.adicionais.outrasInfo)}
        >
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">
              Alguma outra informação importante que esquecemos?
            </label>
            <textarea
              rows={4}
              value={data.adicionais.outrasInfo}
              onChange={(e) => updateField('adicionais', 'outrasInfo', e.target.value)}
              placeholder="Deixe aqui qualquer detalhe específico, integrações especiais ou observações para a equipe de desenvolvimento."
              className="w-full bg-[#0b1326] border border-[#2d3449] focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#4b5563] outline-none transition"
            />
          </div>
        </SectionItem>
      )}

      {/* CHECKLIST FINAL */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 mt-5 space-y-3">
        <h3 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Checklist Final
        </h3>
        <div className="space-y-2">
          <label className="flex items-start gap-2.5 text-xs text-[#f8fafc] cursor-pointer p-2 rounded-lg bg-[#0b1326] border border-[#222a3d]">
            <input
              type="checkbox"
              checked={data.checklist.confirmou}
              onChange={(e) => updateField('checklist', 'confirmou', e.target.checked)}
              className="mt-0.5 accent-blue-600"
            />
            <span>Confirmo que as informações preenchidas estão corretas</span>
          </label>
          <label className="flex items-start gap-2.5 text-xs text-[#f8fafc] cursor-pointer p-2 rounded-lg bg-[#0b1326] border border-[#222a3d]">
            <input
              type="checkbox"
              checked={data.checklist.anexouArquivos}
              onChange={(e) => updateField('checklist', 'anexouArquivos', e.target.checked)}
              className="mt-0.5 accent-blue-600"
            />
            <span>Anexei links ou arquivos necessários (Logo, fotos, referências)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
