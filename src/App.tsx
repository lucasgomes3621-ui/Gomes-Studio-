/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BriefingData } from './types';
import {
  initialBriefingData,
  calculateProgress,
  WHATSAPP_TARGET_NUMBER,
  WHATSAPP_DISPLAY_NUMBER,
  WHATSAPP_CONTACT_NAME,
  getDirectWhatsAppUrl,
  getDirectEmailUrls,
  formatWhatsAppMessage,
} from './utils/briefingDefaults';
import { sampleBriefingData } from './utils/sampleData';
import { generateBriefingPDF, getBriefingPDFBase64 } from './utils/pdfGenerator';
import { sendBriefingByEmail, uploadBriefingPDF } from './utils/uploader';
import { Header } from './components/Header';
import { FormSections } from './components/FormSections';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { GomesStudioFooterBanner } from './components/GomesStudioBrand';
import { Send, CheckCircle2, MessageSquare, FileDown, Trash2, AlertTriangle, X, Mail, Loader2 } from 'lucide-react';

const STORAGE_KEY = 'briefing_profissional_data_v1';

export default function App() {
  const [data, setData] = useState<BriefingData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return initialBriefingData;
  });

  const [activeSection, setActiveSection] = useState<number | null>(1);
  const [allExpanded, setAllExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSendingSubmit, setIsSendingSubmit] = useState<boolean>(false);

  // Auto-save on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const progress = calculateProgress(data);

  const handleToggleSection = (id: number) => {
    if (allExpanded) {
      setAllExpanded(false);
      setActiveSection(activeSection === id ? null : id);
    } else {
      setActiveSection(activeSection === id ? null : id);
    }
  };

  const handleGoToSection = (id: number) => {
    setActiveSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleToggleAll = () => {
    if (allExpanded) {
      setAllExpanded(false);
      setActiveSection(null);
    } else {
      setAllExpanded(true);
      setActiveSection(null);
    }
  };

  const handleFillSample = () => {
    setData(sampleBriefingData);
    showToast('Dados de exemplo preenchidos com sucesso!');
  };

  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  const handleClear = () => {
    setIsClearConfirmOpen(true);
  };

  const handleConfirmClear = () => {
    setData(initialBriefingData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setIsClearConfirmOpen(false);
    showToast('Todos os campos foram limpos com sucesso!');
  };

  const handleOpenEmailForMedia = () => {
    // Open prefilled Gmail directly with company info and briefing summary
    const { gmailWebUrl, mailtoUrl } = getDirectEmailUrls(data, 'lucasgomes3621@gmail.com');
    window.open(gmailWebUrl || mailtoUrl, '_blank');
  };

  const handleDirectWhatsAppSend = async () => {
    setIsSendingWhatsApp(true);
    let pdfDirectUrl: string | undefined;

    try {
      // 1. Generate base64 of the PDF
      let pdfBase64 = '';
      try {
        pdfBase64 = getBriefingPDFBase64(data);
      } catch (err) {
        console.warn('PDF Base64 creation:', err);
      }

      // 2. Upload PDF to server to generate permanent download link
      if (pdfBase64) {
        try {
          const uploadRes = await uploadBriefingPDF(pdfBase64, data.empresa.nome || 'Cliente');
          if (uploadRes.success && (uploadRes.fullUrl || uploadRes.url)) {
            pdfDirectUrl = uploadRes.fullUrl || (typeof window !== 'undefined' ? `${window.location.origin}${uploadRes.url}` : uploadRes.url);
          }
        } catch (uploadErr) {
          console.warn('Upload do PDF falhou:', uploadErr);
        }

        // 3. Dispatch backup email to lucasgomes3621@gmail.com with the PDF attached
        sendBriefingByEmail(
          data,
          pdfBase64,
          formatWhatsAppMessage(data, pdfDirectUrl),
          'lucasgomes3621@gmail.com'
        ).catch((e) => console.error(e));
      }

      showToast('✓ Respostas e PDF anexados para envio!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingWhatsApp(false);
      // 4. Open WhatsApp with formatted text + direct PDF link
      const url = getDirectWhatsAppUrl(data, WHATSAPP_TARGET_NUMBER, pdfDirectUrl);
      window.open(url, '_blank');
    }
  };

  const handleDownloadPDF = () => {
    try {
      generateBriefingPDF(data);
      showToast('PDF de Backup gerado e baixado com sucesso!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Erro ao gerar PDF. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#f8fafc] pb-12">
      {/* Sticky Header & Progress Navigator */}
      <Header
        progress={progress}
        onFillSample={handleFillSample}
        onClear={handleClear}
        onToggleAll={handleToggleAll}
        allExpanded={allExpanded}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-4">
        {/* Intro Banner */}
        <div className="mb-4 p-3.5 bg-[#131b2e] border border-[#222a3d] rounded-xl text-xs text-[#94a3b8] leading-relaxed">
          <p className="font-medium text-[#f8fafc] mb-0.5">
            Preencha as informações do seu site para iniciarmos o projeto.
          </p>
          <p>
            Ao concluir, todas as informações e o documento oficial do seu site são enviados diretamente pelo <strong>WhatsApp</strong> para <strong>Lucas Gomes</strong> ({WHATSAPP_DISPLAY_NUMBER}). Você também poderá enviar sua logomarca e fotos na conversa.
          </p>
        </div>

        {/* 17 Form Sections */}
        <FormSections
          data={data}
          onChange={setData}
          openSection={allExpanded ? null : activeSection}
          onToggleSection={handleToggleSection}
          onGoToSection={handleGoToSection}
          searchQuery={searchQuery}
        />

        {/* Action card before footer */}
        <div className="mt-6 p-5 bg-gradient-to-br from-[#131b2e] to-[#101b2b] border border-emerald-500/40 rounded-2xl text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-inner">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Finalização & Envio do Projeto</h3>
            <p className="text-xs text-[#94a3b8] mt-1.5 max-w-md mx-auto leading-relaxed">
              Ao clicar no botão abaixo, todas as respostas do seu briefing e o documento oficial do projeto são enviados diretamente pelo <strong>WhatsApp</strong> para <strong>Lucas Gomes</strong> ({WHATSAPP_DISPLAY_NUMBER}).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1 justify-center max-w-lg mx-auto">
            <button
              type="button"
              onClick={handleDirectWhatsAppSend}
              disabled={isSendingWhatsApp}
              className="flex-1 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-75 text-white text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 border border-emerald-400/30 cursor-pointer"
            >
              {isSendingWhatsApp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Preparando envio no WhatsApp...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar pelo WhatsApp</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="py-3 px-4 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-amber-300 text-xs font-bold border border-amber-500/30 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-amber-400" />
              <span>Baixar Cópia em PDF</span>
            </button>
          </div>
        </div>

        {/* Footer Brand & Slogan */}
        <footer className="mt-8 pb-6 border-t border-[#1e293b]/60">
          <GomesStudioFooterBanner />
          <p className="text-[11px] text-[#475569] text-center mt-2">
            Preencha no seu ritmo. O formulário salva tudo automaticamente no seu navegador.
          </p>
        </footer>
      </main>

      {/* WhatsApp Modal */}
      <WhatsAppPreviewModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        data={data}
        onEmailSent={(msg) => showToast(msg)}
      />


      {/* Clear Confirmation Modal */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#131b2e] border border-[#2d3449] rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Limpar Formulário?</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#171f33] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Tem certeza de que deseja apagar todos os dados digitados e fotos selecionadas? Esta ação resetará o formulário do início.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#f8fafc] text-xs font-semibold border border-[#2d3449] transition active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Limpar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

