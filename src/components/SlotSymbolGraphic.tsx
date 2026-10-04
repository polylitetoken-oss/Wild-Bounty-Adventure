import React from 'react';
import { motion } from 'motion/react';
import { SymbolId } from '../types/slot';
import { SYMBOLS } from '../utils/slotEngine';
import { SYMBOL_ART_MAP } from './SymbolArt';

interface SlotSymbolGraphicProps {
  symbolId: SymbolId;
  className?: string;
  isWinning?: boolean;
  hasWildWin?: boolean;
  isGoldFramed?: boolean;
  transformedToWild?: boolean;
  isSettled?: boolean;
}

export const SlotSymbolGraphic: React.FC<SlotSymbolGraphicProps> = ({
  symbolId,
  className = 'w-full h-full',
  isWinning = false,
  hasWildWin = false,
  isGoldFramed = false,
  transformedToWild = false,
  isSettled = true,
}) => {
  const sym = SYMBOLS[symbolId];
  const ArtComponent = SYMBOL_ART_MAP[symbolId] || sym?.art;
  if (!ArtComponent) return null;

  const isWild = symbolId === 'WILD';
  const isScatter = symbolId === 'SCATTER';
  const isLetter = symbolId === 'A' || symbolId === 'K' || symbolId === 'Q' || symbolId === 'J';

  // 3D Dimensional Lighting, Specular Highlights & Depth Shading
  const getSymbolFilters = () => {
    if (isWild && isWinning) {
      return 'drop-shadow(0 0 18px rgba(253, 224, 71, 0.98)) drop-shadow(0 8px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.95))';
    }
    if (isWinning) {
      if (hasWildWin) {
        return 'drop-shadow(0 0 14px rgba(251, 191, 36, 0.95)) drop-shadow(0 8px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.95))';
      }
      return 'drop-shadow(0 0 12px rgba(245, 197, 66, 0.9)) drop-shadow(0 8px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.95))';
    }
    if (isScatter) {
      return 'drop-shadow(0 0 12px rgba(245, 197, 66, 0.92)) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.9)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.95))';
    }
    if (isGoldFramed) {
      return 'drop-shadow(0 0 8px rgba(245, 197, 66, 0.8)) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.9)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.95))';
    }
    switch (symbolId) {
      case 'BANDIT':
        return 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.55)) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.92)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.95))';
      case 'REVOLVERS':
        return 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.55)) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.92)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.95))';
      case 'HAT':
        return 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.5)) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.92)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.95))';
      case 'WHISKEY':
        return 'drop-shadow(0 0 6px rgba(217, 119, 6, 0.55)) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.92)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.95))';
      default:
        // Royal card letters: clean 3D chisel drop shadow
        return 'drop-shadow(0 5px 8px rgba(0, 0, 0, 0.9)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.95))';
    }
  };

  return (
    <div className={`relative ${className} flex items-center justify-center select-none overflow-visible`}>
      {/* GOLDEN CROSSHAIR TARGET RETICLE SIGHT (BIDIKAN EMAS BEHIND WINNING SYMBOL - Kecil & Proporsional, Tidak untuk Scatter) */}
      {isWinning && !isScatter && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
          animate={{ scale: [0.6, 1.05, 1.0], opacity: 1, rotate: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-[6%] flex items-center justify-center pointer-events-none z-0 overflow-visible"
        >
          {/* Subtle Golden Radial Ambient Aura */}
          <div className="absolute inset-1 rounded-full bg-radial from-yellow-300/60 via-amber-400/25 to-transparent blur-[4px] animate-pulse" />

          {/* Golden Crosshair Sight SVG (Proportional & stays inside symbol area) */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible drop-shadow-[0_0_10px_rgba(253,224,71,0.9)] filter"
          >
            <defs>
              <linearGradient id="goldTargetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fef08a" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Outer Golden Target Circle - Smaller & inside cell */}
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="rgba(245, 158, 11, 0.15)"
              stroke="url(#goldTargetGrad)"
              strokeWidth="3.2"
            />

            {/* Inner Concentric Circle */}
            <circle
              cx="50"
              cy="50"
              r="18"
              fill="none"
              stroke="url(#goldTargetGrad)"
              strokeWidth="2"
              opacity="0.85"
            />

            {/* Center Small Ring & Dot */}
            <circle cx="50" cy="50" r="4.5" fill="none" stroke="#ffffff" strokeWidth="1.8" />
            <circle cx="50" cy="50" r="1.8" fill="#ffffff" />

            {/* 4 Main Crosshair Lines */}
            <line x1="50" y1="10" x2="50" y2="24" stroke="url(#goldTargetGrad)" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="50" y1="76" x2="50" y2="90" stroke="url(#goldTargetGrad)" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="10" y1="50" x2="24" y2="50" stroke="url(#goldTargetGrad)" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="76" y1="50" x2="90" y2="50" stroke="url(#goldTargetGrad)" strokeWidth="2.8" strokeLinecap="round" />

            {/* Inner Crosshair Ticks */}
            <line x1="50" y1="30" x2="50" y2="38" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="50" y1="62" x2="50" y2="70" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="30" y1="50" x2="38" y2="50" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="62" y1="50" x2="70" y2="50" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}

      {/* 1. BINTANG DAVID (HEXAGRAM) BINGKAI EMAS DI BELAKANG SIMBOL (TANPA TEKS, 100% TERLIHAT UTUH DI BELAKANG) */}
      {isGoldFramed && !isWild && !isScatter && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {/* Subtle golden ambient aura */}
          <div
            className={`absolute w-[114%] h-[114%] rounded-full bg-radial from-amber-400/40 via-yellow-500/18 to-transparent blur-[5px] transition-all duration-300 ${
              isWinning ? 'opacity-100 scale-115 animate-pulse' : 'opacity-85 scale-105'
            }`}
          />

          {/* Hexagram (Star of David) Golden Frame behind the symbol */}
          <svg
            viewBox="0 0 100 100"
            className="w-[114%] h-[114%] overflow-visible drop-shadow-[0_0_12px_rgba(245,197,66,0.95)] filter"
          >
            <defs>
              <linearGradient id="goldHexStarGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Triangle 1 (Points Up) */}
            <polygon
              points="50,2 93,75 7,75"
              fill="rgba(245, 158, 11, 0.12)"
              stroke="url(#goldHexStarGrad3D)"
              strokeWidth={isWinning ? '5.2' : '4.4'}
              strokeLinejoin="round"
            />

            {/* Triangle 2 (Points Down) */}
            <polygon
              points="50,98 7,25 93,25"
              fill="rgba(245, 158, 11, 0.12)"
              stroke="url(#goldHexStarGrad3D)"
              strokeWidth={isWinning ? '5.2' : '4.4'}
              strokeLinejoin="round"
            />

            {/* 6 Golden Rivets at 6 Hexagram Vertices */}
            <circle cx="50" cy="2" r="3" fill="#fffbeb" stroke="#78350f" strokeWidth="1" />
            <circle cx="93" cy="75" r="3" fill="#fffbeb" stroke="#78350f" strokeWidth="1" />
            <circle cx="7" cy="75" r="3" fill="#fffbeb" stroke="#78350f" strokeWidth="1" />
            <circle cx="50" cy="98" r="3" fill="#fffbeb" stroke="#78350f" strokeWidth="1" />
            <circle cx="7" cy="25" r="3" fill="#fffbeb" stroke="#78350f" strokeWidth="1" />
            <circle cx="93" cy="25" r="3" fill="#fffbeb" stroke="#78350f" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* 2. GOLDEN AURA FOR WINNING WILD */}
      {isWild && isWinning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[125%] h-[125%] rounded-full bg-radial from-yellow-300/60 via-amber-500/30 to-transparent blur-md animate-pulse" />
        </div>
      )}

      {/* 3. GOLDEN RADIANCE BEHIND SCATTER (EMAS BATANGAN) */}
      {isScatter && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div
            className={`w-[125%] h-[125%] rounded-full bg-radial from-amber-400/50 via-yellow-500/25 to-transparent blur-md transition-all duration-300 ${
              isWinning ? 'opacity-100 scale-120' : 'opacity-90 scale-105'
            }`}
          />
        </div>
      )}

      {/* 4. VISUAL FLARE WHEN HEXAGONAL SYMBOL TRANSFORMS TO WILD */}
      {transformedToWild && (
        <motion.div
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-radial from-yellow-200 via-amber-400 to-transparent blur-lg z-40 pointer-events-none"
        />
      )}

      {/* 5. GAME SYMBOL ARTWORK (Enlarged cloned letter & scatter symbols, stay large on settle/win without shrinking) */}
      <motion.div
        initial={false}
        animate={
          isWinning || transformedToWild
            ? { scale: 1.32 }
            : isScatter
            ? isSettled
              ? { scale: 1.38 }
              : { scale: 1.10 }
            : isWild
            ? isSettled
              ? { scale: 1.22 }
              : { scale: 1.12 }
            : isLetter
            ? { scale: 1.22 }
            : { scale: 1.10 }
        }
        transition={
          (isScatter || isWild) && isSettled
            ? { duration: 0.45, ease: 'easeOut' }
            : { duration: 0.22, ease: 'easeOut' }
        }
        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none select-none overflow-visible"
        style={{
          filter: getSymbolFilters(),
        }}
      >
        <ArtComponent className="w-full h-full object-contain pointer-events-none select-none" />
      </motion.div>

      {/* 6. PROMINENT 3D EMBOSSED "WILD" BADGE AT BASE OF COWGIRL */}
      {isWild && (
        <div
          className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-md border pointer-events-none whitespace-nowrap transition-all duration-200 shadow-md ${
            isWinning
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-yellow-100 text-stone-950 font-western font-black text-[9px] shadow-[0_0_12px_rgba(253,224,71,0.9)] animate-pulse'
              : 'bg-gradient-to-b from-[#78350f] via-[#451a03] to-[#1c0a02] border-amber-400 text-amber-200 font-western font-black text-[8.5px]'
          }`}
          style={{ fontFamily: "'Rye', 'Cinzel', serif" }}
        >
          ★ WILD ★
        </div>
      )}
    </div>
  );
};
