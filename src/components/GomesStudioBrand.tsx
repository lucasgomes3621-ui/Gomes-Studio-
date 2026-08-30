import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Gomes Studio Vector Globe & Cursor Emblem
 * Faithfully matches the exact shape and neon-blue aesthetic of the Gomes Studio identity
 */
export const GomesStudioEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 drop-shadow-[0_0_14px_rgba(0,180,255,0.5)] ${className}`}
    >
      <defs>
        {/* Vibrant Cyber Blue Globe Gradient */}
        <linearGradient id="gsGlobeGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Dynamic Glow Filter */}
        <filter id="gsNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Cursor Gradient */}
        <linearGradient id="gsCursorGrad" x1="50" y1="40" x2="105" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="40%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Outer Globe Circle */}
      <circle
        cx="54"
        cy="54"
        r="44"
        stroke="url(#gsGlobeGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Horizontal Equator Line */}
      <line
        x1="12"
        y1="54"
        x2="60"
        y2="54"
        stroke="url(#gsGlobeGrad)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Central Meridian Ellipse */}
      <ellipse
        cx="54"
        cy="54"
        rx="22"
        ry="44"
        stroke="url(#gsGlobeGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Top Latitude Arc */}
      <path
        d="M 23 30 Q 54 38 85 30"
        stroke="url(#gsGlobeGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bottom Latitude Arc */}
      <path
        d="M 23 78 Q 45 70 52 72"
        stroke="url(#gsGlobeGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Dynamic Cutting Mouse Cursor Pointer Arrow */}
      <g filter="url(#gsNeonGlow)">
        <path
          d="M 58 36 L 102 80 L 78 81 L 89 105 L 75 111 L 64 87 L 48 99 Z"
          fill="url(#gsCursorGrad)"
          stroke="#06182c"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Subtle 3D highlight bevel on cursor */}
        <path
          d="M 62 45 L 91 74 L 76 75 L 62 45 Z"
          fill="#f0f9ff"
          opacity="0.45"
        />
      </g>
    </svg>
  );
};

/**
 * Header Brand Logo Component
 */
export const GomesStudioHeaderLogo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-[#091122]/90 border border-sky-500/30 shadow-[0_0_16px_rgba(14,165,233,0.25)]">
        <GomesStudioEmblem size={32} />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-lg sm:text-xl font-black tracking-wider text-white font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            GOMES
          </span>
          <span className="text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(56,189,248,0.5)]">
            STUDIO
          </span>
        </div>
        <span className="text-[10px] text-sky-400/90 font-medium tracking-wide mt-0.5 uppercase">
          Briefing de Desenvolvimento Web
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
      <div className="inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-[#081020]/90 border border-sky-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(14,165,233,0.2)]">
        <GomesStudioEmblem size={30} />
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-base sm:text-lg font-black tracking-wider text-white font-sans">
            GOMES
          </span>
          <span className="text-base sm:text-lg font-black tracking-wider bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            STUDIO
          </span>
        </div>
      </div>

      {/* Exact Official Slogan with Glowing Divider Accents */}
      <div className="flex items-center justify-center gap-2 max-w-md sm:max-w-lg mx-auto px-4">
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-sky-500/40 to-sky-500/80 rounded-full" />
        <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-300 uppercase whitespace-nowrap px-1">
          DESIGN QUE <span className="text-sky-400 font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">CONECTA</span>, SOLUÇÕES QUE{' '}
          <span className="text-sky-400 font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">IMPULSIONAM</span>
        </p>
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-sky-500/40 to-sky-500/80 rounded-full" />
      </div>

      <p className="text-[11px] text-slate-400">
        Desenvolvido por <strong className="text-slate-200">Lucas Gomes</strong> •{' '}
        <a href="mailto:lucasgomes3621@gmail.com" className="text-sky-400 hover:underline">
          lucasgomes3621@gmail.com
        </a>
      </p>
    </div>
  );
};

