import React, { useId } from 'react';
import { motion } from 'motion/react';
import { SymbolId } from '../types/slot';
import { SYMBOL_ART_MAP } from './SymbolArt';

interface BulletHitEffectProps {
  symbolId?: SymbolId;
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
  { id: 2, size: 25, xOffset: 18, yOffset: -14, delayMsNormal: 120, delayMsTurbo: 35, sparkSize: 36 },
  { id: 3, size: 28, xOffset: -16, yOffset: 16, delayMsNormal: 240, delayMsTurbo: 70, sparkSize: 40 },
  { id: 4, size: 34, xOffset: 12, yOffset: 12, delayMsNormal: 360, delayMsTurbo: 105, sparkSize: 46 },
];

// 8 Pecahan Simbol (Polygon Shards) yang saling menutupi area 100x100
interface ShardDef {
  id: number;
  clipPath: string;
  dx: number;
  dy: number;
  rot: number;
}

const SYMBOL_SHARDS: ShardDef[] = [
  { id: 1, clipPath: 'polygon(0% 0%, 50% 0%, 35% 38%, 0% 28%)', dx: -28, dy: -26, rot: -28 },
  { id: 2, clipPath: 'polygon(50% 0%, 100% 0%, 100% 32%, 65% 38%)', dx: 30, dy: -28, rot: 32 },
  { id: 3, clipPath: 'polygon(0% 28%, 35% 38%, 42% 64%, 0% 68%)', dx: -34, dy: -4, rot: -22 },
  { id: 4, clipPath: 'polygon(35% 38%, 65% 38%, 58% 64%, 42% 64%)', dx: 2, dy: -18, rot: 15 },
  { id: 5, clipPath: 'polygon(65% 38%, 100% 32%, 100% 68%, 58% 64%)', dx: 34, dy: 4, rot: 26 },
  { id: 6, clipPath: 'polygon(0% 68%, 42% 64%, 48% 100%, 0% 100%)', dx: -26, dy: 28, rot: -35 },
  { id: 7, clipPath: 'polygon(42% 64%, 58% 64%, 54% 100%, 48% 100%)', dx: 4, dy: 32, rot: 18 },
  { id: 8, clipPath: 'polygon(58% 64%, 100% 68%, 100% 100%, 54% 100%)', dx: 28, dy: 28, rot: 36 },
];

// 6 Kepulan Asap Abu-Hangat (#d6cfc4 ke #8a8176)
interface SmokePuffDef {
  id: number;
  x: number;
  y: number;
  size: number;
  riseY: number;
  driftX: number;
  delayMs: number;
}

const SMOKE_PUFFS: SmokePuffDef[] = [
  { id: 1, x: -18, y: -16, size: 36, riseY: -42, driftX: -8, delayMs: 0 },
  { id: 2, x: 18, y: -14, size: 38, riseY: -44, driftX: 10, delayMs: 40 },
  { id: 3, x: -16, y: 16, size: 42, riseY: -38, driftX: -12, delayMs: 60 },
  { id: 4, x: 12, y: 12, size: 46, riseY: -40, driftX: 8, delayMs: 80 },
  { id: 5, x: 0, y: 0, size: 48, riseY: -48, driftX: 0, delayMs: 20 },
  { id: 6, x: -4, y: -8, size: 40, riseY: -36, driftX: 6, delayMs: 70 },
];

export const BulletHitEffect: React.FC<BulletHitEffectProps> = ({
  symbolId = 'WILD',
  isTurbo = false,
  stage,
}) => {
  const instanceId = useId().replace(/[:]/g, '_');
  const showShootingHoles = stage === 'HOLD';
  const showShattering = stage === 'SHATTERING';
  const ArtComponent = SYMBOL_ART_MAP[symbolId] || SYMBOL_ART_MAP.WILD;

  // Render a Single SVG Bullet Hole
  const renderSingleHole = (hole: BulletHoleDef, suffix = '') => {
    const scorchId = `scorch_${instanceId}_${hole.id}_${suffix}`;
    const rimId = `rim_${instanceId}_${hole.id}_${suffix}`;

    return (
      <div
        key={`hole_${hole.id}_${suffix}`}
        className="absolute flex items-center justify-center pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.98)]"
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
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40 overflow-visible select-none">
      {/* 1. SHOOTING PHASE: 4 TEMBAKAN BERURUTAN DENGAN IMPACT FLASH & KEPULAN ASAP DI LUBANG */}
      {showShootingHoles && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
          {FOUR_BULLET_HOLES.map((hole) => {
            const delaySec = (isTurbo ? hole.delayMsTurbo : hole.delayMsNormal) / 1000;

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

                {/* Kepulan Asap Kecil di Titik Lubang Saat Tembakan Mengenai Simbol */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 0, y: hole.yOffset, x: hole.xOffset }}
                  animate={{
                    scale: [0.3, 1.3, 1.6],
                    opacity: [0, 0.75, 0],
                    y: hole.yOffset - 18,
                    x: hole.xOffset + (hole.id % 2 === 0 ? 6 : -6),
                  }}
                  transition={{
                    duration: isTurbo ? 0.35 : 0.6,
                    delay: delaySec + 0.05,
                    ease: 'easeOut',
                  }}
                  className="absolute rounded-full bg-radial from-[#d6cfc4] to-[#8a8176] blur-[2.5px] pointer-events-none z-45"
                  style={{ width: '22px', height: '22px' }}
                />

                {/* 3D Bekas Lubang Peluru Otentik dengan 2px Getar (Shake) */}
                <motion.div
                  initial={{ scale: 0, opacity: 0, x: hole.xOffset, y: hole.yOffset }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: [hole.xOffset, hole.xOffset + (hole.id % 2 === 0 ? 2 : -2), hole.xOffset],
                    y: [hole.yOffset, hole.yOffset - 2, hole.yOffset],
                  }}
                  transition={{
                    duration: isTurbo ? 0.09 : 0.14,
                    delay: delaySec,
                    ease: [0.175, 0.885, 0.32, 1.275],
                  }}
                  className="absolute flex items-center justify-center pointer-events-none select-none z-40"
                >
                  {renderSingleHole(hole, 'live')}
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* 2. SHATTERING PHASE: 8 SERPIHAN DARI SIMBOL ITU SENDIRI + LUBANG PELURU TETAP MENEMPEL PADA SERPIHAN */}
      {showShattering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible z-50">
          {/* (a) 8 Symbol Shards */}
          {SYMBOL_SHARDS.map((shard) => {
            const shardDuration = isTurbo ? 0.25 : 0.45;

            return (
              <motion.div
                key={`shard_${shard.id}`}
                initial={{
                  x: 0,
                  y: 0,
                  rotate: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: shard.dx,
                  y: shard.dy,
                  rotate: shard.rot,
                  opacity: [1, 0.9, 0],
                  scale: [1, 0.95, 0.8],
                }}
                transition={{
                  duration: shardDuration,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-visible"
                style={{
                  clipPath: shard.clipPath,
                  WebkitClipPath: shard.clipPath,
                  willChange: 'transform, opacity',
                }}
              >
                {/* 1. Re-render the Actual Symbol Component Inside Shard */}
                <div className="w-[88%] h-[88%] flex items-center justify-center pointer-events-none select-none">
                  <ArtComponent className="w-full h-full object-contain pointer-events-none" />
                </div>

                {/* 2. The 4 Bullet Holes Carried Inside the Flying Shards */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                  {FOUR_BULLET_HOLES.map((hole) => renderSingleHole(hole, `shard_${shard.id}`))}
                </div>
              </motion.div>
            );
          })}

          {/* (b) 6 Kepulan Asap Ringan & Tipis Abu-Hangat (#d6cfc4 ke #8a8176) */}
          {SMOKE_PUFFS.map((smoke) => {
            const smokeDuration = isTurbo ? 0.45 : 0.8;
            const delaySec = (isTurbo ? smoke.delayMs * 0.4 : smoke.delayMs) / 1000;

            return (
              <motion.div
                key={`smoke_${smoke.id}`}
                initial={{
                  x: smoke.x,
                  y: smoke.y,
                  scale: 0.5,
                  opacity: 0.3,
                }}
                animate={{
                  x: smoke.x + smoke.driftX,
                  y: smoke.y + smoke.riseY,
                  scale: [0.5, 1.1, 1.4],
                  opacity: [0.3, 0.15, 0],
                }}
                transition={{
                  duration: smokeDuration,
                  delay: delaySec,
                  ease: 'easeOut',
                }}
                className="absolute rounded-full bg-radial from-[#e2dcce]/40 to-[#9e9587]/20 blur-[3px] pointer-events-none z-30"
                style={{
                  width: `${smoke.size * 0.8}px`,
                  height: `${smoke.size * 0.8}px`,
                  willChange: 'transform, opacity',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
