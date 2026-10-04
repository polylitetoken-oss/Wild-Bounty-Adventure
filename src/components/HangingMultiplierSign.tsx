import React from 'react';
import { motion } from 'motion/react';

interface HangingMultiplierSignProps {
  currentMultiplier: number;
  isFreeSpins: boolean;
}

const SLOT_WIDTH = 68;
const VIEWPORT_WIDTH = 340;
const CENTER_OFFSET = (VIEWPORT_WIDTH - SLOT_WIDTH) / 2; // 136px

// Pre-generated static array of numbers 1 to 100
const MULTIPLIER_NUMBERS = Array.from({ length: 100 }, (_, i) => i + 1);

export const HangingMultiplierSign: React.FC<HangingMultiplierSignProps> = ({
  currentMultiplier,
  isFreeSpins,
}) => {
  // Translate the fixed number track so currentMultiplier is exactly centered
  const clampedMultiplier = Math.max(1, Math.min(100, currentMultiplier));
  const targetX = CENTER_OFFSET - (clampedMultiplier - 1) * SLOT_WIDTH;

  return (
    <div className="relative w-full max-w-[540px] sm:max-w-[560px] mx-auto select-none pt-0.5 pb-0.5 pointer-events-none">
      {/* 1. METALLIC CHAINS - 100% STATIC */}
      <div className="absolute -top-3.5 left-10 flex flex-col items-center z-10 pointer-events-none">
        <div className="w-2.5 h-4.5 rounded border-[1.5px] border-[#d89648] bg-gradient-to-b from-[#7a3f12] to-[#221208] shadow-sm" />
        <div className="w-2.5 h-4.5 -mt-1.5 rounded border-[1.5px] border-[#fde047] bg-gradient-to-b from-[#b45309] to-[#3a1d0d] shadow-sm" />
        <div className="w-4 h-4 -mt-1.5 rounded-full border-2 border-[#fffbeb] bg-gradient-to-b from-[#d97706] to-[#451a03] shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#fffbeb] shadow-[0_0_4px_#fff]" />
        </div>
      </div>

      <div className="absolute -top-3.5 right-10 flex flex-col items-center z-10 pointer-events-none">
        <div className="w-2.5 h-4.5 rounded border-[1.5px] border-[#d89648] bg-gradient-to-b from-[#7a3f12] to-[#221208] shadow-sm" />
        <div className="w-2.5 h-4.5 -mt-1.5 rounded border-[1.5px] border-[#fde047] bg-gradient-to-b from-[#b45309] to-[#3a1d0d] shadow-sm" />
        <div className="w-4 h-4 -mt-1.5 rounded-full border-2 border-[#fffbeb] bg-gradient-to-b from-[#d97706] to-[#451a03] shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#fffbeb] shadow-[0_0_4px_#fff]" />
        </div>
      </div>

      {/* 2. ARCHED WOODEN SIGN - 100% STATIC (TETAP DIAM TIDAK BERGESER) */}
      <div className="relative mx-1">
        <svg
          viewBox="0 0 440 92"
          className="w-full h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)] pointer-events-none"
        >
          <defs>
            <linearGradient id="signWoodGradHD" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#45200c" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#2e1407" stopOpacity="0.80" />
              <stop offset="70%" stopColor="#1c0b03" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#100502" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="signBronzeGradHD" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isFreeSpins ? '#fffbeb' : '#ffeed4'} />
              <stop offset="20%" stopColor={isFreeSpins ? '#fde047' : '#d89648'} />
              <stop offset="50%" stopColor={isFreeSpins ? '#b45309' : '#7a3f12'} />
              <stop offset="80%" stopColor={isFreeSpins ? '#f59e0b' : '#c5843b'} />
              <stop offset="100%" stopColor={isFreeSpins ? '#78350f' : '#4e2406'} />
            </linearGradient>

            <linearGradient id="signGoldInlayHD" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <radialGradient id="signRivetGradHD" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="45%" stopColor="#d97706" />
              <stop offset="85%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#291104" />
            </radialGradient>
          </defs>

          {/* Main Outer Beveled Frame */}
          <path
            d="M 20, 26 Q 130, 38 220, 18 Q 310, 38 420, 26 L 426, 68 Q 310, 83 220, 85 Q 130, 83 14, 68 Z"
            fill="url(#signBronzeGradHD)"
            stroke="#120602"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Wood Plank */}
          <path
            d="M 23, 28 Q 130, 40 220, 21 Q 310, 40 417, 28 L 423, 65 Q 310, 80 220, 82 Q 130, 80 17, 65 Z"
            fill="url(#signWoodGradHD)"
            stroke="#200d04"
            strokeWidth="1.5"
          />

          {/* Fine Gold Inlay Accent Trace */}
          <path
            d="M 27, 31 Q 130, 42 220, 24 Q 310, 42 413, 31 L 419, 63 Q 310, 77 220, 79 Q 130, 77 21, 63 Z"
            fill="none"
            stroke="url(#signGoldInlayHD)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Perimeter Bronze Rivets */}
          <g transform="translate(28, 36)">
            <circle r="4" fill="url(#signRivetGradHD)" stroke="#451a03" strokeWidth="1" />
            <circle r="1.3" fill="#fffbeb" opacity="0.8" cx="-1" cy="-1" />
          </g>
          <g transform="translate(412, 36)">
            <circle r="4" fill="url(#signRivetGradHD)" stroke="#451a03" strokeWidth="1" />
            <circle r="1.3" fill="#fffbeb" opacity="0.8" cx="-1" cy="-1" />
          </g>
          <g transform="translate(24, 62)">
            <circle r="4" fill="url(#signRivetGradHD)" stroke="#451a03" strokeWidth="1" />
            <circle r="1.3" fill="#fffbeb" opacity="0.8" cx="-1" cy="-1" />
          </g>
          <g transform="translate(416, 62)">
            <circle r="4" fill="url(#signRivetGradHD)" stroke="#451a03" strokeWidth="1" />
            <circle r="1.3" fill="#fffbeb" opacity="0.8" cx="-1" cy="-1" />
          </g>

          {/* Chain Connection Rings */}
          <circle cx="70" cy="30" r="5" fill="#241208" stroke="url(#signBronzeGradHD)" strokeWidth="2" />
          <circle cx="370" cy="30" r="5" fill="#241208" stroke="url(#signBronzeGradHD)" strokeWidth="2" />
        </svg>

        {/* 3. MULTIPLIER VIEWPORT AREA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="overflow-hidden relative flex items-center justify-center -translate-y-0.5"
            style={{ width: `${VIEWPORT_WIDTH}px`, height: '54px' }}
          >
            {/* FIXED STATIONARY GOLD FOCUS FRAME & GLOW (TETAP DIAM DI POSISI TENGAH) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
              {/* Stationary Gold Radiance Glow */}
              <div className="w-24 h-14 rounded-full bg-radial from-amber-400/50 via-yellow-500/20 to-transparent blur-md pointer-events-none" />

              {/* Stationary 3D Embossed Gold Lens Frame */}
              <div className="relative w-[72px] h-[38px] rounded-xl border-2 border-amber-300 shadow-[0_0_16px_rgba(245,197,66,0.85),inset_0_1px_4px_rgba(255,255,255,0.7)] bg-gradient-to-b from-[#4a220c]/60 via-transparent to-black/50 flex items-center justify-between px-2">
                <span className="text-[10px] text-yellow-300 font-bold">★</span>
                <span className="text-[10px] text-yellow-300 font-bold">★</span>
              </div>
            </div>

            {/* ONLY THE NUMBERS MOVE HORIZONTALLY THROUGH THE FIXED CENTER FRAME */}
            <motion.div
              className="absolute top-0 bottom-0 flex items-center z-10"
              animate={{ x: targetX }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              style={{ left: 0 }}
            >
              {MULTIPLIER_NUMBERS.map((val) => {
                const isCurrent = val === currentMultiplier;
                const distance = Math.abs(val - currentMultiplier);

                return (
                  <div
                    key={val}
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: `${SLOT_WIDTH}px`,
                      height: '100%',
                      opacity: isCurrent ? 1 : Math.max(0.15, 0.65 - distance * 0.18),
                    }}
                  >
                    <span
                      className={`font-western font-black tracking-wider transition-all duration-200 select-none ${
                        isCurrent
                          ? 'text-2xl sm:text-3xl text-gold-gradient drop-shadow-[0_2px_8px_rgba(245,197,66,0.95)] scale-110'
                          : 'text-lg sm:text-xl text-[#d4963e]/70 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]'
                      }`}
                    >
                      {val}×
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
