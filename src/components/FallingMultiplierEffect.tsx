import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FallingMultiplierEffectProps {
  multiplier: number;
  stepWin: number;
  currency: 'USD' | 'IDR';
  isTurbo?: boolean;
  onImpact?: () => void;
}

// HD Gold Coins Burst when Multiplier Shatters upon landing on Total Win
const SHATTER_COINS = [
  { dx: -24, dy: -28, r: -90, s: 18 },
  { dx: 26, dy: -32, r: 120, s: 20 },
  { dx: -32, dy: 6, r: -160, s: 19 },
  { dx: 34, dy: 8, r: 180, s: 21 },
  { dx: -16, dy: 30, r: -45, s: 17 },
  { dx: 18, dy: 32, r: 60, s: 20 },
];

export const FallingMultiplierEffect: React.FC<FallingMultiplierEffectProps> = ({
  multiplier,
  isTurbo = false,
  onImpact,
}) => {
  const [hasLanded, setHasLanded] = useState(false);

  useEffect(() => {
    // Flight duration: falls from top board to bottom win counter
    const flightTime = isTurbo ? 280 : 480;
    const timer = setTimeout(() => {
      setHasLanded(true);
      if (onImpact) onImpact();
    }, flightTime);

    return () => clearTimeout(timer);
  }, [isTurbo, onImpact]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {!hasLanded ? (
          // 1. FLYING HD MULTIPLIER BADGE (Jatuh dari Papan Perkalian ke Papan Menang)
          <motion.div
            initial={{
              top: '12%',
              left: '50%',
              x: '-50%',
              scale: 0.8,
              opacity: 0.9,
            }}
            animate={{
              top: '84%',
              left: '78%',
              x: '-50%',
              scale: [0.9, 1.45, 1.1],
              opacity: 1,
            }}
            transition={{
              duration: isTurbo ? 0.28 : 0.48,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute flex items-center justify-center pointer-events-none"
          >
            {/* Glowing Golden Trail Aura */}
            <div className="absolute -inset-3 rounded-full bg-radial from-amber-400/80 via-yellow-500/50 to-transparent blur-md animate-pulse" />

            {/* HD 3D Western Multiplier Seal */}
            <div className="relative px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-[#b45309] via-[#78350f] to-[#451a03] border-2 border-yellow-300 shadow-[0_4px_20px_rgba(245,197,66,0.95)] flex items-center gap-1">
              <span className="text-sm text-yellow-200 animate-spin">★</span>
              <span className="font-western font-black text-2xl sm:text-3xl text-gold-gradient tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {multiplier}×
              </span>
              <span className="text-sm text-yellow-200 animate-spin">★</span>
            </div>
          </motion.div>
        ) : (
          // 2. MULTIPLIER PECAH MENJADI KOIN EMAS & CIPTAKAN ANGKA DI PAPAN MENANG
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ top: '84%', left: '78%', transform: 'translate(-50%, -50%)' }}
          >
            {/* Gold Impact Flash */}
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: isTurbo ? 0.22 : 0.38, ease: 'easeOut' }}
              className="absolute w-24 h-24 rounded-full bg-radial from-yellow-100 via-amber-400 to-transparent blur-sm"
            />

            {/* Shatter Coins Bursting Outwards */}
            {SHATTER_COINS.map((coin, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0.6, rotate: 0, opacity: 1 }}
                animate={{
                  x: coin.dx,
                  y: coin.dy,
                  scale: [0.8, 1.2, 0.2],
                  rotate: coin.r,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: isTurbo ? 0.28 : 0.44,
                  ease: 'easeOut',
                }}
                className="absolute flex items-center justify-center select-none"
                style={{ width: `${coin.s}px`, height: `${coin.s}px` }}
              >
                <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_2px_6px_rgba(245,197,66,0.9)]">
                  <circle cx="16" cy="16" r="14" fill="#d97706" stroke="#fef08a" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="10" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
                  <text
                    x="16"
                    y="20.5"
                    textAnchor="middle"
                    fill="#451a03"
                    fontSize="11"
                    fontWeight="900"
                    className="font-western font-black"
                  >
                    $
                  </text>
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
