import React, { useId } from 'react';
import { motion } from 'motion/react';

interface BulletHitEffectProps {
  isTurbo?: boolean;
  stage: 'EXPANDING' | 'HOLD' | 'SHATTERING';
}

// 4 Bekas Peluru Berurutan Pada Simbol (Shot 1 → Shot 2 → Shot 3 → Shot 4)
interface BulletHoleDef {
  id: number;
  size: number;
  xOffset: number;
  yOffset: number;
  delayMsNormal: number;
  delayMsTurbo: number;
  sparkSize: number;
}

const FOUR_BULLET_HOLES: BulletHoleDef[] = [
  { id: 1, size: 22, xOffset: -18, yOffset: -16, delayMsNormal: 0, delayMsTurbo: 0, sparkSize: 32 },
  { id: 2, size: 25, xOffset: 18, yOffset: -14, delayMsNormal: 130, delayMsTurbo: 45, sparkSize: 36 },
  { id: 3, size: 28, xOffset: -16, yOffset: 16, delayMsNormal: 260, delayMsTurbo: 90, sparkSize: 40 },
  { id: 4, size: 34, xOffset: 12, yOffset: 12, delayMsNormal: 390, delayMsTurbo: 135, sparkSize: 46 },
];

// Koin Emas HD yang Terlempar Saat Simbol Pecah (Dan Menghilang Tanpa Sisa Titik Kuning)
interface GoldCoinBurstConfig {
  dx: number;
  dy: number;
  rotateZ: number;
  size: number;
  symbol: string;
}

const GOLD_COIN_BURSTS: GoldCoinBurstConfig[] = [
  { dx: -28, dy: -32, rotateZ: -140, size: 18, symbol: '$' },
  { dx: 30, dy: -34, rotateZ: 150, size: 19, symbol: '★' },
  { dx: -36, dy: -6, rotateZ: -190, size: 17, symbol: '$' },
  { dx: 38, dy: -4, rotateZ: 200, size: 18, symbol: '★' },
  { dx: -26, dy: 28, rotateZ: -100, size: 17, symbol: '$' },
  { dx: 28, dy: 30, rotateZ: 170, size: 19, symbol: '★' },
  { dx: -8, dy: -38, rotateZ: -80, size: 18, symbol: '$' },
  { dx: 10, dy: 36, rotateZ: 120, size: 17, symbol: '$' },
];

export const BulletHitEffect: React.FC<BulletHitEffectProps> = ({ isTurbo = false, stage }) => {
  const instanceId = useId().replace(/[:]/g, '_');
  const showBulletHoles = stage === 'EXPANDING' || stage === 'HOLD' || stage === 'SHATTERING';
  const showShatterCoins = stage === 'SHATTERING';
  const showSoftSmoke = stage === 'HOLD' || stage === 'SHATTERING';

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40 overflow-visible select-none">
      {/* 1. EMPAT BEKAS PELURU BERURUTAN (Shot 1 → Shot 2 → Shot 3 → Shot 4) */}
      {showBulletHoles && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible transition-opacity duration-200 ${
            stage === 'SHATTERING' ? 'opacity-0 scale-95' : 'opacity-100'
          }`}
        >
          {FOUR_BULLET_HOLES.map((hole) => {
            const delaySec = (isTurbo ? hole.delayMsTurbo : hole.delayMsNormal) / 1000;
            const scorchId = `scorch_${instanceId}_${hole.id}`;
            const rimId = `rim_${instanceId}_${hole.id}`;

            return (
              <React.Fragment key={hole.id}>
                {/* 3D Impact Fiery Muzzle Spark Flash */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.8, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: isTurbo ? 0.12 : 0.18,
                    delay: delaySec,
                    ease: 'easeOut',
                  }}
                  className="absolute rounded-full bg-radial from-white via-yellow-300 to-amber-600 blur-[0.5px] pointer-events-none z-50 shadow-[0_0_16px_rgba(253,224,71,0.9)]"
                  style={{
                    width: `${hole.sparkSize}px`,
                    height: `${hole.sparkSize}px`,
                    transform: `translate(${hole.xOffset}px, ${hole.yOffset}px)`,
                  }}
                />

                {/* 3D Bekas Lubang Peluru Otentik dengan Retakan Hangus & Highlight Logam */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: isTurbo ? 0.09 : 0.14,
                    delay: delaySec,
                    ease: [0.175, 0.885, 0.32, 1.275],
                  }}
                  className="absolute flex items-center justify-center pointer-events-none select-none drop-shadow-[0_3px_8px_rgba(0,0,0,0.98)] z-40"
                  style={{
                    width: `${hole.size}px`,
                    height: `${hole.size}px`,
                    transform: `translate(${hole.xOffset}px, ${hole.yOffset}px)`,
                  }}
                >
                  <svg viewBox="0 0 32 32" className="w-full h-full overflow-visible">
                    <defs>
                      <radialGradient id={scorchId} cx="46%" cy="46%" r="54%">
                        <stop offset="0%" stopColor="#050201" />
                        <stop offset="45%" stopColor="#1a0903" />
                        <stop offset="75%" stopColor="#4a220d" />
                        <stop offset="90%" stopColor="#8c471a" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                      <radialGradient id={rimId} cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#ffedd5" />
                        <stop offset="40%" stopColor="#d97706" />
                        <stop offset="85%" stopColor="#451a03" />
                        <stop offset="100%" stopColor="#170601" />
                      </radialGradient>
                    </defs>

                    {/* Radial Fractures & Metal Scorch Cracks */}
                    <path
                      d="M 16 5 L 16 0 M 23 9 L 29 4 M 26 16 L 32 16 M 23 23 L 29 29 M 16 26 L 16 32 M 9 23 L 3 29 M 6 16 L 0 16 M 9 9 L 3 3"
                      stroke="#0d0401"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      opacity="0.95"
                    />

                    {/* Outer Bullet Scorch Mark */}
                    <circle cx="16" cy="16" r="12" fill={`url(#${scorchId})`} />

                    {/* Beveled Metallic Rim */}
                    <circle cx="16" cy="16" r="8" fill={`url(#${rimId})`} stroke="#1c0b03" strokeWidth="1" />

                    {/* Deep Dark Bullet Void */}
                    <circle cx="16" cy="16" r="4.8" fill="#000000" />

                    {/* Metallic Highlight Glint */}
                    <circle cx="13.5" cy="13.5" r="1.4" fill="#ffffff" opacity="0.95" />
                  </svg>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* 2. EXPLOSION: PECAH MENJADI KOIN EMAS HD DAN MENGHILANG TOTAL */}
      {showShatterCoins && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible z-50">
          {GOLD_COIN_BURSTS.map((coin, cIdx) => {
            const burstDuration = isTurbo ? 0.22 : 0.38;

            return (
              <motion.div
                key={`coin-${cIdx}`}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0.5,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  x: coin.dx,
                  y: [0, coin.dy - 12, coin.dy + 18],
                  scale: [0.7, 1.15, 0.1],
                  rotate: coin.rotateZ,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: burstDuration,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute flex items-center justify-center pointer-events-none select-none"
                style={{
                  width: `${coin.size}px`,
                  height: `${coin.size}px`,
                  willChange: 'transform, opacity',
                }}
              >
                {/* 3D HD Vector Golden Coin */}
                <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-[0_2px_6px_rgba(245,197,66,0.85)]">
                  <defs>
                    {/* Outer Gold Rim Gradient */}
                    <linearGradient id={`coinRimGrad-${cIdx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fffbeb" />
                      <stop offset="25%" stopColor="#fef08a" />
                      <stop offset="55%" stopColor="#d97706" />
                      <stop offset="85%" stopColor="#92400e" />
                      <stop offset="100%" stopColor="#451a03" />
                    </linearGradient>

                    {/* Coin Face Gradient */}
                    <radialGradient id={`coinFaceGrad-${cIdx}`} cx="40%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#fef9c3" />
                      <stop offset="45%" stopColor="#fbbf24" />
                      <stop offset="80%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#78350f" />
                    </radialGradient>
                  </defs>

                  {/* Coin Drop Shadow Base */}
                  <circle cx="18" cy="18" r="16" fill="#2e1405" opacity="0.6" transform="translate(0, 1.5)" />

                  {/* Outer Coin Rim */}
                  <circle cx="18" cy="18" r="16" fill={`url(#coinRimGrad-${cIdx})`} stroke="#451a03" strokeWidth="1" />

                  {/* Inner Coin Recessed Face */}
                  <circle cx="18" cy="18" r="12" fill={`url(#coinFaceGrad-${cIdx})`} stroke="#78350f" strokeWidth="0.8" />

                  {/* Center Symbol Relief ($ or Star) */}
                  <text
                    x="18"
                    y="22.5"
                    textAnchor="middle"
                    fill="#451a03"
                    fontSize="12"
                    fontWeight="900"
                    className="font-western font-black select-none"
                    style={{ textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)' }}
                  >
                    {coin.symbol}
                  </text>

                  {/* Specular Curved Highlight */}
                  <path
                    d="M 10 12 A 10 10 0 0 1 26 12"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.8"
                  />
                </svg>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 3. SOFT BILLOWING GUNSMOKE (Asap Mesiu Halus Saat Simbol Meledak) */}
      {showSoftSmoke && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
          {/* Main Soft Smoke Cloud */}
          <motion.div
            initial={{ y: 0, scale: 0.5, opacity: 0.65 }}
            animate={{
              y: -24,
              scale: 1.4,
              opacity: 0,
            }}
            transition={{
              duration: isTurbo ? 0.24 : 0.44,
              ease: 'easeOut',
            }}
            className="absolute w-18 h-18 rounded-full bg-radial from-stone-300/40 via-amber-200/15 to-transparent blur-md pointer-events-none"
          />

          {/* Secondary Gunsmoke Wisp */}
          <motion.div
            initial={{ x: -4, y: -2, scale: 0.45, opacity: 0.55 }}
            animate={{
              x: -14,
              y: -28,
              scale: 1.25,
              opacity: 0,
            }}
            transition={{
              duration: isTurbo ? 0.28 : 0.48,
              ease: 'easeOut',
              delay: 0.03,
            }}
            className="absolute w-14 h-14 rounded-full bg-radial from-stone-200/35 via-stone-400/10 to-transparent blur-sm pointer-events-none"
          />
        </div>
      )}
    </div>
  );
};
