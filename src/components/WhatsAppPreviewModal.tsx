import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Copy, Check, X, MessageSquare, UserCheck, ShieldCheck, Mail, Loader2, ExternalLink } from 'lucide-react';
import { BriefingData } from '../types';
import {
  formatWhatsAppMessage,
  getDirectWhatsAppUrl,
  getDirectEmailUrls,
  WHATSAPP_TARGET_NUMBER,
  WHATSAPP_DISPLAY_NUMBER,
  WHATSAPP_CONTACT_NAME,
} from '../utils/briefingDefaults';
import { getBriefingPDFBase64 } from '../utils/pdfGenerator';
import { sendBriefingByEmail, uploadBriefingPDF } from '../utils/uploader';

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BriefingData;
  onEmailSent?: (msg: string) => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  onEmailSent,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(WHATSAPP_TARGET_NUMBER);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const formattedMessage = formatWhatsAppMessage(data);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendAll = async () => {
    setIsSending(true);
    let pdfDirectUrl: string | undefined;

    try {
      // 1. Generate PDF base64
      let pdfBase64 = '';
      try {
        pdfBase64 = getBriefingPDFBase64(data);
      } catch (err) {
        console.warn('Erro ao gerar base64 do PDF:', err);
      }

      // 2. Upload PDF so a direct download link is generated
      if (pdfBase64) {
        try {
          const uploadRes = await uploadBriefingPDF(pdfBase64, data.empresa.nome || 'Cliente');
          if (uploadRes.success && (uploadRes.fullUrl || uploadRes.url)) {
            pdfDirectUrl = uploadRes.fullUrl || (typeof window !== 'undefined' ? `${window.location.origin}${uploadRes.url}` : uploadRes.url);
          }
        } catch (uploadErr) {
          console.warn('Upload do PDF em nuvem falhou:', uploadErr);
        }

        // 3. Dispatch copy with PDF attached by email
        sendBriefingByEmail(
          data,
          pdfBase64,
          formatWhatsAppMessage(data, pdfDirectUrl),
          'lucasgomes3621@gmail.com'
        ).then((res) => {
          if (res.success && onEmailSent) {
            onEmailSent('Briefing e PDF anexados enviados para lucasgomes3621@gmail.com!');
          }
        }).catch((e) => console.error('Email background send:', e));
      }
    } catch (e) {
      console.error('Erro na automação do PDF:', e);
    } finally {
      setIsSending(false);
      // 4. Open WhatsApp with complete formatted text + direct PDF link
      const url = getDirectWhatsAppUrl(data, phoneNumber || WHATSAPP_TARGET_NUMBER, pdfDirectUrl);
      window.open(url, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-[#131b2e] border border-[#222a3d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#222a3d] flex items-center justify-between bg-[#171f33]">
            <div className="flex items-center gap-2.5 text-[#f8fafc]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Enviar Briefing para o WhatsApp e E-mail</h3>
                <p className="text-[11px] text-emerald-400 font-medium">
                  WhatsApp: {WHATSAPP_DISPLAY_NUMBER} • E-mail: lucasgomes3621@gmail.com
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#222a3d] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
            {/* Target info card */}
            <div className="p-3 bg-[#0b1326] border border-emerald-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">{WHATSAPP_CONTACT_NAME}</p>
                    <p className="text-[11px] text-[#94a3b8]">WhatsApp: <span className="text-emerald-400 font-mono font-semibold">{WHATSAPP_DISPLAY_NUMBER}</span></p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Destino Oficial
                </span>
              </div>

              <div className="pt-1.5 border-t border-[#1e293b] flex items-center gap-2 text-[11px] text-sky-300">
                <Mail className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>Cópia por E-mail com PDF anexado: <strong className="text-white">lucasgomes3621@gmail.com</strong></span>
              </div>
            </div>

            {/* Formatted message preview */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-[#94a3b8]">
                  Resumo de todas as informações e arquivos:
                </label>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#0b1326] border border-[#222a3d] rounded-xl p-3 text-[11px] text-[#cbd5e1] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto selection:bg-emerald-600 leading-relaxed">
                {formattedMessage}
              </div>
            </div>

            {/* Automatic Delivery Details */}
            <div className="space-y-2">
              <div className="text-[11px] text-sky-300 flex items-start gap-2 p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-lg">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-[#cbd5e1] leading-relaxed">
                  <strong className="text-sky-300">Envio de Fotos e PDF no Gmail:</strong> As informações escritas serão enviadas para o WhatsApp, e os arquivos originais de fotos, vídeos, logo e o PDF gerado serão enviados diretamente pelo seu aplicativo do <strong>Gmail</strong> para <strong className="text-white">lucasgomes3621@gmail.com</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#222a3d] bg-[#171f33] flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                const { gmailWebUrl, mailtoUrl } = getDirectEmailUrls(data, 'lucasgomes3621@gmail.com');
                window.open(gmailWebUrl || mailtoUrl, '_blank');
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition active:scale-95 shadow-md shadow-sky-500/20"
            >
              <Mail className="w-4 h-4" />
              <span>Enviar Mídias no Gmail</span>
            </button>

            <button
              type="button"
              onClick={handleSendAll}
              disabled={isSending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-75 text-white font-bold text-xs transition active:scale-95 shadow-md shadow-emerald-500/20"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Anexando PDF e abrindo...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


