import React, { useRef, useState } from 'react';
import { BriefingData, UploadedMediaItem } from '../types';
import { uploadMediaItem } from '../utils/uploader';
import {
  FolderUp,
  Cloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Loader2,
  ExternalLink,
  Info,
} from 'lucide-react';

interface Step6Props {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
}

const MATERIAIS_LIST: Array<{
  key: keyof BriefingData['materiais']['statusItens'];
  label: string;
}> = [
  { key: 'logo', label: 'Logotipo da empresa' },
  { key: 'fotos', label: 'Fotos do negócio / produtos' },
  { key: 'videos', label: 'Vídeos institucionais / de produtos' },
  { key: 'textos', label: 'Textos descritivos' },
  { key: 'redesSociais', label: 'Redes sociais ativas' },
  { key: 'identidadeVisual', label: 'Manual de marca / cores' },
  { key: 'catalogo', label: 'Catálogo / apresentação em PDF' },
];

export const Step6Materials: React.FC<Step6Props> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const materiais = data.materiais || {
    statusItens: {
      logo: '',
      fotos: '',
      videos: '',
      textos: '',
      redesSociais: '',
      identidadeVisual: '',
      catalogo: '',
    },
    linkDrive: '',
    arquivosUpload: [],
    observacoes: '',
  };

  const handleStatusChange = (
    key: keyof BriefingData['materiais']['statusItens'],
    status: string
  ) => {
    onChange((prev) => ({
      ...prev,
      materiais: {
        ...prev.materiais,
        statusItens: {
          ...prev.materiais.statusItens,
          [key]: prev.materiais.statusItens?.[key] === status ? '' : status,
        },
      },
    }));
  };

  const handleLinkDriveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange((prev) => ({
      ...prev,
      materiais: {
        ...prev.materiais,
        linkDrive: val,
      },
      midia: {
        ...prev.midia,
        arquivosInfo: val,
      },
    }));
  };

  const handleObservacoesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange((prev) => ({
      ...prev,
      materiais: {
        ...prev.materiais,
        observacoes: val,
      },
    }));
  };

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newItems: UploadedMediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const tempItem: UploadedMediaItem = {
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
        uploading: true,
      };

      try {
        const res = await uploadMediaItem(file.name, dataUrl, file.type);
        if (res.success) {
          tempItem.url = res.url;
          tempItem.fullUrl = res.fullUrl;
          tempItem.uploaded = true;
        }
      } catch (err) {
        console.warn('Upload error:', err);
      }
      tempItem.uploading = false;
      newItems.push(tempItem);
    }

    onChange((prev) => ({
      ...prev,
      materiais: {
        ...prev.materiais,
        arquivosUpload: [...(prev.materiais.arquivosUpload || []), ...newItems],
      },
      midia: {
        ...prev.midia,
        uploadedImages: [...(prev.midia.uploadedImages || []), ...newItems],
      },
    }));

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (id: string) => {
    onChange((prev) => ({
      ...prev,
      materiais: {
        ...prev.materiais,
        arquivosUpload: (prev.materiais.arquivosUpload || []).filter((f) => f.id !== id),
      },
      midia: {
        ...prev.midia,
        uploadedImages: (prev.midia.uploadedImages || []).filter((f) => f.id !== id),
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div>
        <span className="text-[11px] font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
          Etapa 06 · Ativos & Mídias
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          Você já possui os materiais?
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
          Se você já possui materiais, eles podem nos ajudar a entender melhor a identidade do seu negócio.
        </p>
      </div>

      {/* Helpful banner */}
      <div className="p-3.5 rounded-xl bg-[#090D14]/80 border border-white/[0.08] flex items-start gap-2.5 text-xs text-[#94A3B8] leading-relaxed">
        <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
        <div>
          <span className="text-white font-medium">Não se preocupe com materiais pendentes.</span> Você pode enviar o que tiver pronto agora ou compartilhar links. Caso ainda não tenha tudo finalizado, nossa equipe orientará cada etapa.
        </div>
      </div>

      {/* Status dos Materiais */}
      <div className="p-4 rounded-2xl bg-[#090D14]/80 border border-white/[0.08] space-y-3">
        <label className="block text-xs font-semibold text-[#E2E8F0] mb-1">
          Informe o status de cada item:
        </label>

        <div className="space-y-2">
          {MATERIAIS_LIST.map((item) => {
            const currentVal = materiais.statusItens?.[item.key] || '';
            return (
              <div
                key={item.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0D121D] border border-white/5 hover:border-white/10 transition"
              >
                <span className="text-xs text-white font-medium">{item.label}</span>
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {['Tenho', 'Em desenvolvimento', 'Não tenho'].map((status) => {
                    const isSelected = currentVal === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(item.key, status)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border cursor-pointer ${
                          isSelected
                            ? status === 'Tenho'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                              : status === 'Em desenvolvimento'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                              : 'bg-white/10 text-white/80 border-white/30'
                            : 'bg-[#090D14] text-[#94A3B8] border-white/5 hover:border-white/15'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Link de Nuvem (Google Drive, OneDrive, Dropbox, WeTransfer) */}
      <div>
        <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-[#38BDF8]" />
          Link de pasta na nuvem (Google Drive, Dropbox, OneDrive, WeTransfer)
        </label>
        <div className="relative">
          <input
            type="url"
            value={materiais.linkDrive}
            onChange={handleLinkDriveChange}
            placeholder="https://drive.google.com/drive/folders/..."
            className="w-full px-3.5 py-3 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 text-sm text-white placeholder-[#475569] transition-all focus:outline-none"
          />
        </div>
        <p className="text-[11px] text-[#64748B] mt-1">
          Lembre-se de deixar a pasta com permissão de visualização pública ou compartilhada.
        </p>
      </div>

      {/* Upload Direto de Arquivos */}
      <div>
        <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FolderUp className="w-3.5 h-3.5 text-emerald-400" />
            Upload direto de arquivos (Logo, Fotos, PDFs)
          </span>
          <span className="text-[10px] text-[#64748B]">Opcional</span>
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelection}
          multiple
          accept="image/*,.pdf,.svg"
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#38BDF8]/50 bg-[#090D14]/60 hover:bg-[#0E1422] transition-all cursor-pointer text-center space-y-2 group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-white/5 text-[#38BDF8] flex items-center justify-center group-hover:scale-110 transition-transform">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FolderUp className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              {isUploading ? 'Enviando arquivos...' : 'Clique para selecionar arquivos do seu aparelho'}
            </p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Aceita imagens (PNG, JPG, SVG, WebP) e documentos PDF
            </p>
          </div>
        </div>

        {/* Lista de Arquivos Anexados */}
        {materiais.arquivosUpload && materiais.arquivosUpload.length > 0 && (
          <div className="mt-3 space-y-2">
            <span className="text-[11px] font-mono text-[#94A3B8]">
              {materiais.arquivosUpload.length} arquivo(s) registrado(s):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {materiais.arquivosUpload.map((file) => (
                <div
                  key={file.id}
                  className="p-2.5 rounded-xl bg-[#0D121D] border border-white/10 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      {file.type.includes('image') ? (
                        <ImageIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="text-xs text-white font-medium truncate">{file.name}</p>
                      <p className="text-[10px] text-[#64748B] font-mono">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {file.fullUrl && (
                      <a
                        href={file.fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-[#94A3B8] hover:text-white"
                        title="Abrir arquivo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1 text-[#94A3B8] hover:text-red-400 transition cursor-pointer"
                      title="Remover arquivo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Observações sobre Materiais */}
      <div>
        <label className="block text-xs font-semibold text-[#E2E8F0] mb-1.5 flex items-center justify-between">
          <span>Observações adicionais sobre fotos ou logo</span>
          <span className="text-[10px] text-[#64748B]">Opcional</span>
        </label>
        <textarea
          rows={2}
          value={materiais.observacoes}
          onChange={handleObservacoesChange}
          placeholder="Ex.: Temos fotos em alta resolução no fotógrafo, enviaremos o catálogo atualizado na próxima semana..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D14] border border-white/10 hover:border-white/20 focus:border-[#0066FF] text-sm text-white placeholder-[#475569] transition-all focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};
