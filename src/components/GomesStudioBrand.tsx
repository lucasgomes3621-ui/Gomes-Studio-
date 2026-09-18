import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GOMES_STUDIO_LOGO_URL = '/gomes-studio-logo.png';
export const GOMES_STUDIO_LOGO_FALLBACK = 'https://plain-enam-prod-public.komododecks.com/202609/15/EN3vfpM10EuIbieIGusf/image.png';

/**
 * Gomes Studio Official Logo Image
 * Uses the official logo from Kommodo/ChatGPT assets
 */
export const GomesStudioLogoImage: React.FC<{
  className?: string;
  heightClass?: string;
}> = ({ className = '', heightClass = 'h-9 sm:h-10' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <img
        src={GOMES_STUDIO_LOGO_URL}
        alt="Gomes Studio"
        className={`${heightClass} w-auto max-w-[160px] object-contain drop-shadow-[0_2px_12px_rgba(0,102,255,0.4)] transition-all duration-300 hover:drop-shadow-[0_4px_20px_rgba(56,189,248,0.6)]`}
        onError={(e) => {
          if (e.currentTarget.src !== GOMES_STUDIO_LOGO_FALLBACK) {
            e.currentTarget.src = GOMES_STUDIO_LOGO_FALLBACK;
          }
        }}
      />
    </div>
  );
};

/**
 * Header Brand Logo Component matching Gomes Studio website
 */
export const GomesStudioHeaderLogo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center p-1 rounded-xl bg-[#090D14]/90 border border-white/10 shadow-[0_0_20px_rgba(0,102,255,0.2)]">
        <GomesStudioLogoImage heightClass="h-8 sm:h-9" />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-sans">
            GOMES
          </span>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#38BDF8] drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            STUDIO
          </span>
        </div>
        <span className="font-mono text-[9px] sm:text-[10px] text-[#94A3B8] tracking-wider uppercase font-medium mt-1">
          Briefing de Desenvolvimento
        </span>
      </div>
    </div>
  );
};

/**
 * Full Slogan Banner for Footer & Cover
 */
export const GomesStudioFooterBanner: React.FC = () => {
  return (
    <div className="pt-6 pb-2 text-center space-y-3.5">
      {/* Visual Brand Display */}
      <div className="inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-[#07090C]/80 border border-white/[0.08] backdrop-blur-md shadow-[0_0_30px_rgba(0,102,255,0.15)]">
        <GomesStudioLogoImage heightClass="h-8" />
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-sans">
            GOMES
          </span>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#38BDF8]">
            STUDIO
          </span>
        </div>
      </div>

      {/* Exact Official Slogan with Glowing Accents */}
      <div className="flex items-center justify-center gap-2 max-w-md sm:max-w-lg mx-auto px-4">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#0066FF]/40 to-[#38BDF8]/70" />
        <p className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase whitespace-nowrap px-1">
          DESIGN QUE <span className="text-[#38BDF8] font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">CONECTA</span>, SOLUÇÕES QUE{' '}
          <span className="text-[#38BDF8] font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">IMPULSIONAM</span>
        </p>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#0066FF]/40 to-[#38BDF8]/70" />
      </div>

      {/* Strictly without email, leaving only Desenvolvido por Gomes Studio */}
      <p className="text-xs font-mono text-[#64748B] pt-1">
        desenvolvido por Gomes studio
      </p>
    </div>
  );
};


