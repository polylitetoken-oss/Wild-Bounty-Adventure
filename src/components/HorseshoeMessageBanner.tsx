import React from 'react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface HorseshoeMessageBannerProps {
  message: string;
  isFreeSpins: boolean;
  remainingFreeSpins: number;
  currentWin: number;
  currency: 'USD' | 'IDR';
  language?: Language;
}

export const HorseshoeMessageBanner: React.FC<HorseshoeMessageBannerProps> = ({
  message,
  isFreeSpins,
  remainingFreeSpins,
  currentWin,
  currency,
  language = 'ID',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ID;
  const formattedWin =
    currency === 'IDR'
      ? `Rp ${currentWin.toLocaleString('id-ID')}`
      : `${currentWin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="relative w-full max-w-[500px] sm:max-w-[520px] mx-auto select-none mb-1 px-1">
      {/* 3D GOLDEN HORSESHOE AT TOP CENTER - CLASPING BASE OF FRAME */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        <svg width="28" height="28" viewBox="0 0 32 32">
          <defs>
            <linearGradient id="horseshoeGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="30%" stopColor="#fbbf24" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          {/* Horseshoe U-shape */}
          <path
            d="M 6, 26 C 4, 18 6, 6 16, 6 C 26, 6 28, 18 26, 26 L 21, 25 C 22, 18 20, 11 16, 11 C 12, 11 10, 18 11, 25 Z"
            fill="url(#horseshoeGold)"
            stroke="#451a03"
            strokeWidth="1.2"
          />
          {/* Nail Holes */}
          <circle cx="8.5" cy="12" r="0.9" fill="#1e0e05" />
          <circle cx="8" cy="17" r="0.9" fill="#1e0e05" />
          <circle cx="9" cy="22" r="0.9" fill="#1e0e05" />
          <circle cx="23.5" cy="12" r="0.9" fill="#1e0e05" />
          <circle cx="24" cy="17" r="0.9" fill="#1e0e05" />
          <circle cx="23" cy="22" r="0.9" fill="#1e0e05" />
        </svg>
      </div>

      {/* SVG BEVELED WOODEN BANNER WITH GOLD TRIM */}
      <div className="relative z-10">
        <svg viewBox="0 0 440 68" className="w-full h-auto drop-shadow-md pointer-events-none">
          <defs>
            <linearGradient id="plaqueWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3d1f0c" />
              <stop offset="40%" stopColor="#251206" />
              <stop offset="80%" stopColor="#170a03" />
              <stop offset="100%" stopColor="#0b0401" />
            </linearGradient>

            <linearGradient id="plaqueRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe4b5" />
              <stop offset="25%" stopColor="#e2a84d" />
              <stop offset="60%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>

          {/* Arched Beveled Banner Plaque */}
          <path
            d="M 28, 14 L 140, 14 Q 160, 6 220, 6 Q 280, 6 300, 14 L 412, 14 L 424, 34 L 412, 56 L 28, 56 L 16, 34 Z"
            fill="url(#plaqueWoodGrad)"
            stroke="url(#plaqueRimGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Inlay Line */}
          <path
            d="M 32, 18 L 142, 18 Q 160, 10 220, 10 Q 280, 10 298, 18 L 408, 18 L 418, 34 L 408, 52 L 32, 52 L 22, 34 Z"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          {/* Corner Screws */}
          <circle cx="34" cy="22" r="2.2" fill="#d97706" stroke="#291104" strokeWidth="0.6" />
          <circle cx="406" cy="22" r="2.2" fill="#d97706" stroke="#291104" strokeWidth="0.6" />
          <circle cx="34" cy="48" r="2.2" fill="#d97706" stroke="#291104" strokeWidth="0.6" />
          <circle cx="406" cy="48" r="2.2" fill="#d97706" stroke="#291104" strokeWidth="0.6" />
        </svg>

        {/* CONTENT INSIDE THE PLAQUE */}
        <div className="absolute inset-0 flex items-center justify-center px-4 pt-1 pointer-events-none">
          {isFreeSpins ? (
            /* Free Spins Counter: SISA SPIN strictly contained */
            <div className="flex items-center justify-center gap-2 max-w-full overflow-hidden">
              <span className="text-xs sm:text-sm font-western font-black text-amber-300 tracking-wider uppercase drop-shadow">
                {t.remainingSpins}:
              </span>
              <span className="text-xl sm:text-2xl font-western font-black text-gold-gradient drop-shadow-[0_2px_8px_rgba(245,197,66,0.9)] tabular-nums">
                {remainingFreeSpins}
              </span>
            </div>
          ) : currentWin > 0 ? (
            /* WIN DISPLAY */
            <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-full overflow-hidden">
              <div className="flex flex-col items-end leading-none">
                <span className="text-[10px] sm:text-[11px] font-western font-extrabold text-[#d4963e] tracking-widest uppercase">
                  TOTAL
                </span>
                <span className="text-[10px] sm:text-[11px] font-western font-extrabold text-[#d4963e] tracking-widest uppercase">
                  {language === 'ID' ? 'MENANG' : 'WIN'}
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-western font-black text-gold-gradient tabular-nums drop-shadow-[0_2px_6px_rgba(245,197,66,0.9)]">
                {formattedWin}
              </span>
            </div>
          ) : (
            /* IDLE STATUS MESSAGE */
            <div className="font-western text-xs sm:text-sm font-extrabold text-amber-200 tracking-wider uppercase drop-shadow">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
