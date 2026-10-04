import React from 'react';
import { motion } from 'motion/react';

interface HangingMultiplierSignProps {
  currentMultiplier: number;
  isFreeSpins: boolean;
}

export const HangingMultiplierSign: React.FC<HangingMultiplierSignProps> = ({
  currentMultiplier,
  isFreeSpins,
}) => {
  // 5 dynamic multiplier values: [curr-2, curr-1, curr, curr+1, curr+2]
  const visibleValues = [-2, -1, 0, 1, 2].map((offset) => {
    const val = currentMultiplier + offset;
    return {
      offset,
      val,
      visible: val >= 1,
    };
  });

  return (
    <div className="relative w-full max-w-[500px] sm:max-w-[530px] mx-auto select-none pt-0 pb-1 pointer-events-none z-10">
      {/* 1. METALLIC CHAINS - CONNECTED FLUSH TO TOP HEADER */}
      <div className="absolute -top-2 left-10 flex flex-col items-center z-10 pointer-events-none">
        <div className="w-2.5 h-3.5 rounded border-[1.5px] border-[#d89648] bg-gradient-to-b from-[#7a3f12] to-[#221208] shadow-sm" />
        <div className="w-2.5 h-3.5 -mt-1 rounded border-[1.5px] border-[#fde047] bg-gradient-to-b from-[#b45309] to-[#3a1d0d] shadow-sm" />
        <div className="w-3.5 h-3.5 -mt-1 rounded-full border-2 border-[#fffbeb] bg-gradient-to-b from-[#d97706] to-[#451a03] shadow-md flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#fffbeb] shadow-[0_0_4px_#fff]" />
        </div>
      </div>

      <div className="absolute -top-2 right-10 flex flex-col items-center z-10 pointer-events-none">
        <div className="w-2.5 h-3.5 rounded border-[1.5px] border-[#d89648] bg-gradient-to-b from-[#7a3f12] to-[#221208] shadow-sm" />
        <div className="w-2.5 h-3.5 -mt-1 rounded border-[1.5px] border-[#fde047] bg-gradient-to-b from-[#b45309] to-[#3a1d0d] shadow-sm" />
        <div className="w-3.5 h-3.5 -mt-1 rounded-full border-2 border-[#fffbeb] bg-gradient-to-b from-[#d97706] to-[#451a03] shadow-md flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#fffbeb] shadow-[0_0_4px_#fff]" />
        </div>
      </div>

      {/* 2. ARCHED WOODEN SIGN SVG BASE (20% Reduced Height, Clean Responsive Scale) */}
      <div className="relative mx-1">
        <svg
          viewBox="0 0 440 74"
          className="w-full h-auto drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)] pointer-events-none"
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
            d="M 20, 20 Q 130, 30 220, 14 Q 310, 30 420, 20 L 425, 56 Q 310, 68 220, 70 Q 130, 68 15, 56 Z"
            fill="url(#signBronzeGradHD)"
            stroke="#120602"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Wood Plank */}
          <path
            d="M 23, 22 Q 130, 32 220, 16 Q 310, 32 417, 22 L 422, 53 Q 310, 65 220, 67 Q 130, 65 18, 53 Z"
            fill="url(#signWoodGradHD)"
            stroke="#200d04"
            strokeWidth="1.5"
          />

          {/* Fine Gold Inlay Accent Trace */}
          <path
            d="M 27, 25 Q 130, 34 220, 19 Q 310, 34 413, 25 L 418, 51 Q 310, 62 220, 64 Q 130, 62 22, 51 Z"
            fill="none"
            stroke="url(#signGoldInlayHD)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Perimeter Bronze Rivets */}
          <g transform="translate(28, 28)">
            <circle r="3.5" fill="url(#signRivetGradHD)" stroke="#451a03" strokeWidth="1" />
            <circle r="1.1" fill="#fffbeb" opacity="0.8" cx="-1" cy="-1" />
          </g>
          <g transform="translate(412, 28)">
            <circle r="3.5" fill="url(#signRivetGradHD)" stroke="#451a03" strokeWidth="1" />
            <circle r="1.1" fill="#fffbeb" opacity="0.8" cx="-1" cy="-1" />
          </g>
          <g transform="translate(24, 52)">
            <circle r="3.5" fill="url(#signRivetGradHD)" stroke="#451a03" strokeWidth="1" />
            <circle r="1.1" fill="#fffbeb" opacity="0.8" cx="-1" cy="-1" />
          </g>
          <g transform="translate(416, 52)">
            <circle r="3.5" fill="url(#signRivetGradHD)" stroke="#451a03" strokeWidth="1" />
            <circle r="1.1" fill="#fffbeb" opacity="0.8" cx="-1" cy="-1" />
          </g>

          {/* Chain Connection Rings */}
          <circle cx="70" cy="24" r="4.5" fill="#241208" stroke="url(#signBronzeGradHD)" strokeWidth="1.8" />
          <circle cx="370" cy="24" r="4.5" fill="#241208" stroke="url(#signBronzeGradHD)" strokeWidth="1.8" />
        </svg>

        {/* 3. MULTIPLIER VIEWPORT AREA: Lensa tepat di tengah papan, glow stacked di belakang, angka di atas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[84%] max-w-[340px] h-[46px] flex items-center justify-center overflow-visible">
            {/* (a) FIXED GOLD FOCUS FRAME & GLOW: Ditumpuk tepat di titik yang sama di tengah (z-0), tanpa tanda ★ */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
              {/* Stationary Gold Radiance Glow - Absolute Behind Lens */}
              <div className="absolute w-24 h-12 rounded-full bg-radial from-amber-400/50 via-yellow-500/18 to-transparent blur-md pointer-events-none" />

              {/* Clean Gold Lens Frame Border (No ★ Stars) */}
              <div className="relative w-[72px] sm:w-[80px] h-[32px] sm:h-[36px] rounded-xl border-2 border-amber-300 shadow-[0_0_14px_rgba(245,197,66,0.85)] bg-amber-950/25 pointer-events-none" />
            </div>

            {/* (b) 5 DYNAMIC MULTIPLIER VALUES: Di atas bingkai fokus (z-20), angka aktif tepat di tengah lensa */}
            <motion.div
              key={currentMultiplier}
              initial={{ scale: 0.92, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 25,
              }}
              className="relative z-20 w-full grid grid-cols-5 items-center justify-items-center"
            >
              {visibleValues.map((item) => {
                const isCenter = item.offset === 0;

                if (!item.visible) {
                  return <div key={item.offset} className="w-full" />;
                }

                return (
                  <div
                    key={item.offset}
                    className="flex items-center justify-center w-full select-none"
                  >
                    <span
                      className={`font-western font-black tracking-tight transition-all duration-200 ${
                        isCenter
                          ? 'text-xl sm:text-2xl text-gold-gradient drop-shadow-[0_2px_8px_rgba(245,197,66,0.95)] scale-110'
                          : Math.abs(item.offset) === 1
                          ? 'text-xs sm:text-sm text-amber-300/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] scale-90'
                          : 'text-[10px] sm:text-xs text-[#d4963e]/35 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] scale-75'
                      }`}
                    >
                      {item.val}×
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

