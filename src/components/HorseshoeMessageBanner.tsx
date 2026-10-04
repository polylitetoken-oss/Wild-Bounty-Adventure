import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../utils/translations';
import { sound } from '../utils/soundEngine';

interface HorseshoeMessageBannerProps {
  message: string;
  currentMultiplier: number;
  currentWin: number;
  currency: 'USD' | 'IDR';
  language?: Language;
  isTurbo?: boolean;
  activeMultiplierDrop?: { value: number; id: string } | null;
  onMultiplierImpact?: () => void;
  onMultiplierComplete?: () => void;
}

export type MultiplierImpactStage =
  | 'NONE'
  | 'ENTER_CENTER'
  | 'CENTER_IMPACT'
  | 'RUSH_DOWN'
  | 'BOARD_IMPACT';

export const HorseshoeMessageBanner: React.FC<HorseshoeMessageBannerProps> = ({
  message,
  currentMultiplier = 1,
  currentWin,
  currency,
  isTurbo = false,
  activeMultiplierDrop = null,
  onMultiplierImpact,
  onMultiplierComplete,
}) => {
  const [impactStage, setImpactStage] = useState<MultiplierImpactStage>('NONE');

  useEffect(() => {
    if (!activeMultiplierDrop) {
      setImpactStage('NONE');
      return;
    }

    // MANDATORY ANIMATION SEQUENCE:
    // 1. Enter to Center (200ms)
    // 2. Scale Up & Impact at Center (260ms)
    // 3. Rush Down to Banner (180ms)
    // 4. Land & Shatter on Board (240ms) -> Multiplier Applied!
    const tEnter = isTurbo ? 140 : 200;
    const tCenter = isTurbo ? 180 : 260;
    const tRush = isTurbo ? 130 : 180;
    const tImpact = isTurbo ? 180 : 240;

    setImpactStage('ENTER_CENTER');

    const timer1 = setTimeout(() => {
      setImpactStage('CENTER_IMPACT');

      const timer2 = setTimeout(() => {
        setImpactStage('RUSH_DOWN');

        const timer3 = setTimeout(() => {
          setImpactStage('BOARD_IMPACT');
          sound.playCashRegisterCring();
          if (onMultiplierImpact) onMultiplierImpact();

          const timer4 = setTimeout(() => {
            setImpactStage('NONE');
            if (onMultiplierComplete) onMultiplierComplete();
          }, tImpact);

          return () => clearTimeout(timer4);
        }, tRush);

        return () => clearTimeout(timer3);
      }, tCenter);

      return () => clearTimeout(timer2);
    }, tEnter);

    return () => clearTimeout(timer1);
  }, [activeMultiplierDrop?.id, isTurbo]);

  const formattedWin =
    currency === 'IDR'
      ? `Rp ${currentWin.toLocaleString('id-ID')}`
      : `$${currentWin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="relative w-full max-w-[530px] sm:max-w-[560px] mx-auto select-none mb-1 px-1 overflow-visible">
      {/* 3D GOLDEN HORSESHOE AT TOP CENTER - CLASPING BASE OF FRAME */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)]">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <defs>
            <linearGradient id="horseshoeGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="25%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          <path
            d="M 6, 26 C 4, 18 6, 6 16, 6 C 26, 6 28, 18 26, 26 L 21, 25 C 22, 18 20, 11 16, 11 C 12, 11 10, 18 11, 25 Z"
            fill="url(#horseshoeGold)"
            stroke="#451a03"
            strokeWidth="1.2"
          />
          <circle cx="8.5" cy="12" r="0.9" fill="#1e0e05" />
          <circle cx="8" cy="17" r="0.9" fill="#1e0e05" />
          <circle cx="9" cy="22" r="0.9" fill="#1e0e05" />
          <circle cx="23.5" cy="12" r="0.9" fill="#1e0e05" />
          <circle cx="24" cy="17" r="0.9" fill="#1e0e05" />
          <circle cx="23" cy="22" r="0.9" fill="#1e0e05" />
        </svg>
      </div>

      {/* SVG PREMIUM ARCHED WOODEN RIBBON BANNER WITH BEVELED GOLD TRIM */}
      <div className="relative z-10 overflow-visible">
        <svg viewBox="0 0 520 85" className="w-full h-auto drop-shadow-[0_8px_22px_rgba(0,0,0,0.95)] pointer-events-none">
          <defs>
            <linearGradient id="bannerWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4d260f" />
              <stop offset="25%" stopColor="#311507" />
              <stop offset="70%" stopColor="#1e0a03" />
              <stop offset="100%" stopColor="#0d0401" />
            </linearGradient>

            <linearGradient id="bannerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="20%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <linearGradient id="bannerInlayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Arched Wooden Ribbon Main Plaque Body */}
          <path
            d="M 28, 22 L 140, 18 Q 260, 6 380, 18 L 492, 22 L 508, 42 L 492, 62 L 380, 66 Q 260, 78 140, 66 L 28, 62 L 12, 42 Z"
            fill="url(#bannerWoodGrad)"
            stroke="url(#bannerGoldGrad)"
            strokeWidth="3.8"
            strokeLinejoin="round"
          />

          {/* Inner Accent Gold Inlay Trace Line */}
          <path
            d="M 34, 26 L 142, 22 Q 260, 11 378, 22 L 486, 26 L 498, 42 L 486, 58 L 378, 62 Q 260, 72 142, 62 L 34, 58 L 22, 42 Z"
            fill="none"
            stroke="url(#bannerInlayGrad)"
            strokeWidth="1.8"
            opacity="0.85"
          />

          {/* Corner Bronze Screws/Rivets */}
          <circle cx="36" cy="28" r="2.8" fill="#fde047" stroke="#451a03" strokeWidth="0.8" />
          <circle cx="484" cy="28" r="2.8" fill="#fde047" stroke="#451a03" strokeWidth="0.8" />
          <circle cx="36" cy="56" r="2.8" fill="#fde047" stroke="#451a03" strokeWidth="0.8" />
          <circle cx="484" cy="56" r="2.8" fill="#fde047" stroke="#451a03" strokeWidth="0.8" />
        </svg>

        {/* CONTENT INSIDE THE BANNER PLAQUE (ABSOLUTELY NO LABEL TEXT) */}
        <div className="absolute inset-0 flex items-center justify-center px-4 pt-1 pointer-events-none overflow-visible">
          {/* ANIMATED MULTIPLIER NUMBER (2-STEP FALL & IMPACT AT CENTER & BOARD) */}
          <AnimatePresence>
            {activeMultiplierDrop && impactStage !== 'NONE' && (
              <React.Fragment key={activeMultiplierDrop.id}>
                {/* MOVING MULTIPLIER NUMBER BADGE */}
                <motion.div
                  initial={{ y: -160, scale: 0.7, opacity: 0 }}
                  animate={
                    impactStage === 'ENTER_CENTER'
                      ? { y: -68, scale: 1.3, opacity: 1 }
                      : impactStage === 'CENTER_IMPACT'
                      ? { y: -68, scale: [1.3, 2.5, 2.2], opacity: 1 }
                      : impactStage === 'RUSH_DOWN'
                      ? { y: 0, scale: 1.15, opacity: 1 }
                      : { y: 0, scale: 1.0, opacity: 0.95 }
                  }
                  transition={{
                    duration:
                      impactStage === 'ENTER_CENTER'
                        ? isTurbo ? 0.14 : 0.20
                        : impactStage === 'CENTER_IMPACT'
                        ? isTurbo ? 0.18 : 0.26
                        : impactStage === 'RUSH_DOWN'
                        ? isTurbo ? 0.13 : 0.18
                        : 0.18,
                    ease: impactStage === 'RUSH_DOWN' ? 'easeIn' : 'easeOut',
                  }}
                  className="absolute z-50 flex items-center justify-center pointer-events-none"
                >
                  {/* RADIANT GOLD GLOW AURA DURING CENTER IMPACT */}
                  {impactStage === 'CENTER_IMPACT' && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 2.2, opacity: 0.85 }}
                      exit={{ opacity: 0 }}
                      className="absolute w-36 h-36 rounded-full bg-radial from-yellow-200 via-amber-400/80 to-transparent blur-md pointer-events-none"
                    />
                  )}

                  {/* MULTIPLIER BADGE */}
                  <div className="px-4 py-1.5 rounded-2xl bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 border-2 border-yellow-100 shadow-[0_0_32px_rgba(253,224,71,1)] flex items-center gap-1 transform">
                    <span className="font-western font-black text-3xl sm:text-4xl text-stone-950 tracking-wider drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                      ×{activeMultiplierDrop.value}
                    </span>
                  </div>
                </motion.div>

                {/* BOARD IMPACT SHOCKWAVE FLASH INSIDE BANNER */}
                {impactStage === 'BOARD_IMPACT' && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute w-40 h-16 rounded-full bg-radial from-yellow-200 via-amber-400 to-transparent blur-md z-40 pointer-events-none"
                  />
                )}
              </React.Fragment>
            )}
          </AnimatePresence>

          {/* MAIN BANNER DISPLAY: NO "MULTIPLIER BOARD" OR "TOTAL WIN" TEXT LABELS */}
          {currentWin > 0 ? (
            <div className="flex items-center justify-center gap-3.5 max-w-full overflow-hidden">
              {currentMultiplier > 1 && (
                <span className="text-xl sm:text-2xl font-western font-black text-amber-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  ×{currentMultiplier}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-western font-black text-gold-gradient tabular-nums drop-shadow-[0_2px_10px_rgba(245,197,66,0.95)]">
                {formattedWin}
              </span>
            </div>
          ) : currentMultiplier > 1 ? (
            <div className="flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-western font-black text-gold-gradient drop-shadow-[0_2px_12px_rgba(245,197,66,0.98)] tabular-nums tracking-wide">
                ×{currentMultiplier}
              </span>
            </div>
          ) : (
            <div className="font-western text-sm sm:text-base font-extrabold text-amber-200 tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
