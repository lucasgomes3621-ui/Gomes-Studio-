import React, { ReactNode } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Terminal,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { GOMES_STUDIO_LOGO_URL } from './GomesStudioBrand';
import { WHATSAPP_TARGET_NUMBER } from '../utils/briefingDefaults';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Gomes Studio ErrorBoundary] Capturado erro de renderização:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
  };

  handleReload = () => {
    try {
      window.location.reload();
    } catch {
      window.location.href = window.location.href;
    }
  };

  handleClearCacheAndReload = () => {
    try {
      localStorage.removeItem('gomes_studio_briefing_draft');
      localStorage.removeItem('gomes_studio_briefing_autosave');
      sessionStorage.clear();
    } catch (e) {
      console.warn('Erro ao limpar cache local:', e);
    }
    this.handleReload();
  };

  handleCopyError = async () => {
    try {
      const { error, errorInfo } = this.state;
      const report = [
        '--- RELATÓRIO DE ERRO GOMES STUDIO ---',
        `Data/Hora: ${new Date().toLocaleString('pt-BR')}`,
        `URL: ${window.location.href}`,
        `Navegador: ${navigator.userAgent}`,
        `Erro: ${error?.name || 'Error'}: ${error?.message || 'Sem mensagem'}`,
        '',
        'Stack Trace:',
        error?.stack || 'Não disponível',
        '',
        'Component Stack:',
        errorInfo?.componentStack || 'Não disponível',
        '---------------------------------------',
      ].join('\n');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(report);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = report;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      this.setState({ copied: true });
      setTimeout(() => {
        this.setState({ copied: false });
      }, 2500);
    } catch (err) {
      console.warn('Falha ao copiar:', err);
    }
  };

  handleSendToWhatsApp = () => {
    try {
      const { error } = this.state;
      const shortMsg = encodeURIComponent(
        `Olá Gomes Studio, ocorreu uma instabilidade na tela do briefing:\n\n*Erro:* ${error?.name || 'Erro'}: ${error?.message || 'Falha ao renderizar'}\n*Link:* ${window.location.href}`
      );
      window.open(`https://wa.me/${WHATSAPP_TARGET_NUMBER}?text=${shortMsg}`, '_blank');
    } catch (e) {
      console.warn('Falha ao abrir WhatsApp:', e);
    }
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  override render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails, copied } = this.state;

      return (
        <div className="min-h-screen bg-[#05070A] text-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
          {/* Background Ambient Cyber Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0066FF]/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-xl w-full bg-[#090D14]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6 relative z-10">
            {/* Header com Logo Gomes Studio e Alerta */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={GOMES_STUDIO_LOGO_URL}
                  alt="Gomes Studio"
                  className="h-7 w-auto object-contain brightness-110"
                />
                <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase bg-[#0066FF]/10 px-2 py-0.5 rounded-full border border-[#0066FF]/30">
                  Gomes Studio Safe-Guard
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
              </div>
            </div>

            {/* Descrição Amigável */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Ops! Ocorreu uma instabilidade pontual
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Para sua tranquilidade, seus dados preenchidos no formulário continuam <strong>salvos com segurança</strong> no seu dispositivo. Você pode recarregar a tela ou avisar nossa equipe diretamente.
              </p>
            </div>

            {/* Resumo do Erro */}
            {error?.message && (
              <div className="bg-[#05070A] border border-white/[0.08] rounded-xl p-3 text-left">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Mensagem do Sistema</span>
                </p>
                <p className="text-xs text-red-300 font-mono break-words bg-red-950/25 p-2 rounded-lg border border-red-900/30">
                  {error.name ? `${error.name}: ` : ''}{error.message}
                </p>
              </div>
            )}

            {/* Ações Principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={this.handleReset}
                className="py-2.5 px-4 bg-gradient-to-r from-[#0066FF] to-[#38BDF8] hover:from-[#0052cc] hover:to-[#0284c7] text-white text-xs sm:text-sm font-semibold rounded-xl transition active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/25 border border-white/20 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tentar Recuperar Tela</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="py-2.5 px-4 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-semibold rounded-xl transition active:scale-95 flex items-center justify-center gap-2 border border-white/15 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recarregar Página</span>
              </button>
            </div>

            {/* Opções de Suporte e Limpeza */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={this.handleClearCacheAndReload}
                className="w-full sm:w-auto px-3 py-1.5 text-[#94A3B8] hover:text-amber-300 bg-[#05070A] hover:bg-white/[0.04] border border-white/[0.08] rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                title="Limpar apenas os rascunhos temporários caso algum campo tenha causado inconsistência"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Limpar Rascunho & Reiniciar</span>
              </button>

              <button
                type="button"
                onClick={this.handleSendToWhatsApp}
                className="w-full sm:w-auto px-3.5 py-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Avisar Suporte no WhatsApp</span>
              </button>
            </div>

            {/* Detalhes Técnicos Dobráveis */}
            <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#05070A]">
              <button
                type="button"
                onClick={this.toggleDetails}
                className="w-full px-3.5 py-2 flex items-center justify-between text-xs text-[#94A3B8] hover:bg-white/[0.04] transition cursor-pointer font-mono"
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Detalhes Técnicos para Depuração</span>
                </span>
                <span className="text-[#64748B] flex items-center gap-1 text-[11px]">
                  {showDetails ? (
                    <>
                      <span>Recolher</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Expandir</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </span>
              </button>

              {showDetails && (
                <div className="p-3.5 border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#94A3B8] font-mono">Stack Trace:</span>
                    <button
                      type="button"
                      onClick={this.handleCopyError}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#94A3B8]" />
                          <span>Copiar Relatório</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="max-h-40 overflow-y-auto font-mono text-[10px] text-[#94A3B8] bg-black/60 p-2.5 rounded-lg border border-white/[0.06] leading-relaxed select-all">
                    {error?.stack || errorInfo?.componentStack || 'Nenhum rastreamento de pilha disponível.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


