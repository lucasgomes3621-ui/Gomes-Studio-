/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BriefingData, StepId } from './types';
import {
  initialBriefingData,
  calculateProgress,
  WHATSAPP_TARGET_NUMBER,
  getDirectWhatsAppUrl,
  formatWhatsAppMessage,
} from './utils/briefingDefaults';
import { sampleBriefingData } from './utils/sampleData';
import { generateBriefingPDF, getBriefingPDFBase64 } from './utils/pdfGenerator';
import { sendBriefingByEmail, uploadBriefingPDF } from './utils/uploader';
import { Header } from './components/Header';
import { FormSections } from './components/FormSections';
import { SuccessScreen } from './components/SuccessScreen';
import { GomesStudioFooterBanner } from './components/GomesStudioBrand';
import { Clock, Sparkles, Trash2, X, AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'briefing_gomes_studio_v2';
const STEP_STORAGE_KEY = 'briefing_gomes_studio_step_v2';

function mergeWithDefaults(saved: any, defaults: BriefingData): BriefingData {
  if (!saved || typeof saved !== 'object') return defaults;
  const result: any = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof BriefingData)[]) {
    const savedVal = saved[key];
    const defaultVal = defaults[key];
    if (savedVal === undefined || savedVal === null) {
      result[key] = defaultVal;
    } else if (Array.isArray(defaultVal)) {
      result[key] = Array.isArray(savedVal) ? savedVal : defaultVal;
    } else if (typeof defaultVal === 'object' && defaultVal !== null) {
      result[key] = typeof savedVal === 'object' && savedVal !== null
        ? { ...defaultVal, ...savedVal }
        : defaultVal;
    } else {
      result[key] = savedVal;
    }
  }
  return result;
}

export default function App() {
  const [data, setData] = useState<BriefingData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return mergeWithDefaults(JSON.parse(saved), initialBriefingData);
      }
    } catch (e) {
      console.error(e);
    }
    return initialBriefingData;
  });

  const [currentStep, setCurrentStep] = useState<StepId>(() => {
    try {
      const saved = localStorage.getItem(STEP_STORAGE_KEY);
      if (saved) {
        const num = parseInt(saved, 10);
        if (num >= 1 && num <= 8) return num as StepId;
      }
    } catch (e) {
      console.error(e);
    }
    return 1;
  });

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionCode, setSubmissionCode] = useState<string>('GS-8021');

  // Auto-save data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }, [data]);

  // Auto-save step
  useEffect(() => {
    try {
      localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
    } catch (e) {
      console.error(e);
    }
  }, [currentStep]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const progress = calculateProgress(data);

  const handleFillSample = () => {
    setData(sampleBriefingData);
    showToast('Dados de exemplo preenchidos com sucesso!');
  };

  const handleClear = () => {
    setIsClearConfirmOpen(true);
  };

  const handleConfirmClear = () => {
    setData(initialBriefingData);
    setCurrentStep(1);
    setIsSubmitted(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setIsClearConfirmOpen(false);
    showToast('Todos os campos foram reiniciados.');
  };

  const handleDownloadPDF = () => {
    try {
      generateBriefingPDF(data);
      showToast('PDF gerado e baixado com sucesso!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleWhatsAppSend = (pdfUrl?: string) => {
    const url = getDirectWhatsAppUrl(data, WHATSAPP_TARGET_NUMBER, pdfUrl);
    window.open(url, '_blank');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const code = `GS-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmissionCode(code);

    let pdfDirectUrl: string | undefined;

    try {
      // 1. Generate base64 PDF
      let pdfBase64 = '';
      try {
        pdfBase64 = getBriefingPDFBase64(data);
      } catch (err) {
        console.warn('PDF Base64 creation error:', err);
      }

      // 2. Upload PDF to server for a permanent link if available
      if (pdfBase64) {
        try {
          const clientName = data.sobreNegocio?.nomeEmpresa || data.sobreVoce?.nome || 'Cliente';
          const uploadRes = await uploadBriefingPDF(pdfBase64, clientName);
          if (uploadRes.success && (uploadRes.fullUrl || uploadRes.url)) {
            pdfDirectUrl = uploadRes.fullUrl || (typeof window !== 'undefined' ? `${window.location.origin}${uploadRes.url}` : uploadRes.url);
          }
        } catch (uploadErr) {
          console.warn('PDF upload warning:', uploadErr);
        }

        // 3. Dispatch backup email to Gomes Studio
        sendBriefingByEmail(
          data,
          pdfBase64,
          formatWhatsAppMessage(data, pdfDirectUrl),
          'lucasgomes3621@gmail.com'
        ).catch((e) => console.error(e));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Automatically open WhatsApp with the briefing info
      setTimeout(() => {
        handleWhatsAppSend(pdfDirectUrl);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-[#f8fafc] flex flex-col justify-between selection:bg-[#0066FF] selection:text-white">
      <div>
        {/* Sticky Header & Navigation Progress */}
        <Header
          currentStep={currentStep}
          progress={progress}
          onFillSample={handleFillSample}
          onClear={handleClear}
          onDownloadPDF={handleDownloadPDF}
        />

        {/* Main Content Area */}
        <main className="max-w-2xl mx-auto px-4 pt-6 pb-12">
          {/* If submitted: Success Screen */}
          {isSubmitted ? (
            <SuccessScreen
              data={data}
              onReset={handleConfirmClear}
              onDownloadPDF={handleDownloadPDF}
              onOpenWhatsApp={() => handleWhatsAppSend()}
              submissionCode={submissionCode}
            />
          ) : (
            <div className="space-y-6">
              {/* Welcoming Hero Header */}
              {currentStep === 1 && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1326] via-[#090E1D] to-[#070A12] border border-white/[0.08] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066FF]/15 border border-[#38BDF8]/30 text-[11px] font-mono font-medium text-[#38BDF8]">
                        <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                        GOMES STUDIO · BRIEFING DE PRESENÇA DIGITAL
                      </span>

                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#94A3B8]">
                        <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                        Leva apenas alguns minutos
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                      Vamos criar a página certa para o seu objetivo.
                    </h1>

                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                      Conte um pouco sobre sua empresa, seu projeto e o que você deseja apresentar. Com essas informações, a <strong>GOMES STUDIO</strong> poderá entender sua necessidade e desenvolver uma experiência digital alinhada ao seu negócio.
                    </p>
                  </div>
                </div>
              )}

              {/* 8-Step Multi-Step Controller */}
              <FormSections
                data={data}
                onChange={setData}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer Banner */}
      <GomesStudioFooterBanner />

      {/* Clear Confirmation Modal */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm p-5 rounded-2xl bg-[#0B1220] border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Limpar briefing?</span>
              </div>
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="text-[#94A3B8] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Todas as respostas preenchidas serão apagadas e você iniciará o briefing do zero. Deseja continuar?
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, limpar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-semibold shadow-2xl border border-[#38BDF8]/40 animate-fadeIn">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
