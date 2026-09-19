import React, { useState } from 'react';
import { BriefingData, StepId } from '../types';
import { StepProgress } from './StepProgress';
import { Step1AboutYou } from './Step1AboutYou';
import { Step2AboutBusiness } from './Step2AboutBusiness';
import { Step3Objective } from './Step3Objective';
import { Step4Project } from './Step4Project';
import { Step5References } from './Step5References';
import { Step6Materials } from './Step6Materials';
import { Step7Contact } from './Step7Contact';
import { Step8Review } from './Step8Review';
import { ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react';

interface FormSectionsProps {
  data: BriefingData;
  onChange: (updater: (prev: BriefingData) => BriefingData) => void;
  currentStep: StepId;
  onStepChange: (step: StepId) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const FormSections: React.FC<FormSectionsProps> = ({
  data,
  onChange,
  currentStep,
  onStepChange,
  onSubmit,
  isSubmitting,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compute completed status for steps 1-8
  const stepsCompleted = [
    Boolean(
      data.sobreVoce?.nome?.trim() &&
        data.sobreVoce?.email?.includes('@') &&
        data.sobreVoce?.whatsapp?.replace(/\D/g, '').length >= 10
    ),
    Boolean(data.sobreNegocio?.nomeEmpresa?.trim()),
    Boolean(data.objetivo?.principal),
    Boolean(data.projeto?.produtosServicos || data.projeto?.possuiTextos),
    Boolean(data.referenciasEstilo?.estilos?.length || data.referenciasEstilo?.sitesGosta),
    Boolean(
      data.materiais?.linkDrive ||
        data.materiais?.arquivosUpload?.length ||
        Object.values(data.materiais?.statusItens || {}).some(Boolean)
    ),
    Boolean(data.contato?.canalPrincipal),
    Boolean(data.informacoesAdicionais?.concordouPrivacidade),
  ];

  const validateCurrentStep = (step: StepId): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!data.sobreVoce?.nome?.trim()) {
        newErrors.nome = 'Por favor, informe seu nome completo.';
      }
      if (!data.sobreVoce?.email?.trim()) {
        newErrors.email = 'Por favor, informe seu e-mail para contato.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.sobreVoce.email)) {
        newErrors.email = 'Por favor, informe um e-mail válido (ex.: nome@empresa.com).';
      }
      const phoneDigits = (data.sobreVoce?.whatsapp || '').replace(/\D/g, '');
      if (!phoneDigits) {
        newErrors.whatsapp = 'Por favor, informe seu WhatsApp com DDD.';
      } else if (phoneDigits.length < 10) {
        newErrors.whatsapp = 'Informe um WhatsApp válido com DDD (mínimo 10 dígitos).';
      }
    }

    if (step === 2) {
      if (!data.sobreNegocio?.nomeEmpresa?.trim()) {
        newErrors.nomeEmpresa = 'Por favor, informe o nome da sua empresa ou negócio.';
      }
    }

    if (step === 3) {
      if (!data.objetivo?.principal) {
        newErrors.principal = 'Por favor, selecione o principal objetivo da sua página.';
      }
    }

    if (step === 7) {
      if (!data.contato?.canalPrincipal) {
        newErrors.canalPrincipal = 'Por favor, escolha o canal de conversão principal da página.';
      }
    }

    if (step === 8) {
      if (!data.informacoesAdicionais?.concordouPrivacidade) {
        newErrors.privacidade =
          'Por favor, marque a concordância para que possamos entrar em contato.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep(currentStep)) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    setErrors({});
    if (currentStep < 8) {
      const next = (currentStep + 1) as StepId;
      onStepChange(next);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } else {
      onSubmit();
    }
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep > 1) {
      const prev = (currentStep - 1) as StepId;
      onStepChange(prev);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepId: StepId) => {
    // If moving forward past current step, validate current step first
    if (stepId > currentStep && !validateCurrentStep(currentStep)) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    setErrors({});
    onStepChange(stepId);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Step Navigator Bar */}
      <StepProgress
        currentStep={currentStep}
        onStepClick={handleStepClick}
        stepsCompleted={stepsCompleted}
      />

      {/* Main Step Card Container */}
      <div className="p-5 sm:p-7 rounded-3xl bg-[#080C14]/90 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm">
        {currentStep === 1 && (
          <Step1AboutYou data={data} onChange={onChange} errors={errors} />
        )}
        {currentStep === 2 && (
          <Step2AboutBusiness data={data} onChange={onChange} errors={errors} />
        )}
        {currentStep === 3 && (
          <Step3Objective data={data} onChange={onChange} errors={errors} />
        )}
        {currentStep === 4 && (
          <Step4Project data={data} onChange={onChange} errors={errors} />
        )}
        {currentStep === 5 && (
          <Step5References data={data} onChange={onChange} />
        )}
        {currentStep === 6 && (
          <Step6Materials data={data} onChange={onChange} />
        )}
        {currentStep === 7 && (
          <Step7Contact data={data} onChange={onChange} errors={errors} />
        )}
        {currentStep === 8 && (
          <Step8Review
            data={data}
            onChange={onChange}
            onJumpToStep={handleStepClick}
            errors={errors}
          />
        )}

        {/* Navigation Footer */}
        <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="py-3 px-4 sm:px-5 rounded-xl bg-[#0F1523] hover:bg-[#161F33] text-[#94A3B8] hover:text-white text-xs sm:text-sm font-semibold border border-white/10 transition active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-3 px-6 sm:px-8 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs sm:text-sm font-bold transition active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(0,102,255,0.4)] cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="py-3.5 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0284C7] hover:from-[#0052cc] hover:to-[#0369A1] disabled:opacity-75 text-white text-xs sm:text-sm font-bold transition active:scale-95 flex items-center gap-2 shadow-[0_0_25px_rgba(0,102,255,0.5)] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando briefing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar briefing</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
