import React from 'react';
import { motion } from 'motion/react';
import { GridTile } from '../types/slot';
import { NUM_COLUMNS, REEL_ROW_COUNTS } from '../utils/slotEngine';
import { SlotSymbolGraphic } from './SlotSymbolGraphic';
import { BulletHitEffect } from './BulletHitEffect';
import westernRevolver3dImg from '../assets/images/western_revolver_3d.png';

export type WinAnimStage = 'IDLE' | 'EXPANDING' | 'HOLD' | 'SHATTERING';

interface WildBountyReelsProps {
  grid: GridTile[][]; // 6 columns: [3, 4, 5, 5, 4, 3] = 24 tiles
  winningTileIds: string[];
  winAnimStage: WinAnimStage;
  isSpinExiting: boolean;
  isTurbo: boolean;
  isCascading?: boolean;
  isFreeSpins?: boolean;
  remainingFreeSpins?: number;
  hasWildWin?: boolean;
  currentMultiplier?: number;
}

// PRECISE BOARD DIMENSIONS
const PITCH_X = 96;
const PITCH_Y = 108;
const PAD_X = 48;
const PAD_Y = 46;
const SVG_WIDTH = 6 * PITCH_X + 2 * PAD_X; // 672
const SVG_HEIGHT = 5 * PITCH_Y + 2 * PAD_Y; // 632

// Outer Board Frame Path
const OUTER_BOARD_PATH = [
  'M 336, 16',
  'L 24, 108',
  'L 24, 514',
  'L 308, 620',
  'Q 336, 626 364, 620',
  'L 648, 514',
  'L 648, 108',
  'Z',
].join(' ');

// Inner Board Fill Path
const INNER_BOARD_PATH = [
  'M 336, 22',
  'L 30, 112',
  'L 30, 510',
  'L 310, 614',
  'Q 336, 620 362, 614',
  'L 642, 510',
  'L 642, 112',
  'Z',
].join(' ');

// Perimeter Bronze/Gold Rivets
const BOARD_RIVETS = [
  { x: 336, y: 22 },
  { x: 260, y: 44 },
  { x: 180, y: 68 },
  { x: 100, y: 90 },
  { x: 30, y: 112 },
  { x: 412, y: 44 },
  { x: 492, y: 68 },
  { x: 572, y: 90 },
  { x: 642, y: 112 },
  { x: 30, y: 190 },
  { x: 30, y: 270 },
  { x: 30, y: 350 },
  { x: 30, y: 430 },
  { x: 30, y: 510 },
  { x: 642, y: 190 },
  { x: 642, y: 270 },
  { x: 642, y: 350 },
  { x: 642, y: 430 },
  { x: 642, y: 510 },
  { x: 100, y: 536 },
  { x: 170, y: 562 },
  { x: 240, y: 588 },
  { x: 310, y: 614 },
  { x: 362, y: 614 },
  { x: 432, y: 588 },
  { x: 502, y: 562 },
  { x: 572, y: 536 },
];

export const WildBountyReels: React.FC<WildBountyReelsProps> = ({
  grid,
  winningTileIds,
  winAnimStage,
  isSpinExiting,
  isTurbo,
  isCascading = false,
  isFreeSpins = false,
  remainingFreeSpins = 0,
  hasWildWin = false,
  currentMultiplier = 1,
}) => {
  const isSpinEntering = !isCascading && grid.some((col) => col.some((t) => t.isNew));

  // Simpan grid sebelumnya agar simbol yang sudah ada di bingkai terlihat turun keluar, bukan menghilang
  const prevGridRef = React.useRef<GridTile[][]>(grid);

  React.useEffect(() => {
    if (!isSpinEntering && !isCascading) {
      prevGridRef.current = grid;
    }
  }, [grid, isSpinEntering, isCascading]);

  return (
    <div className="relative w-full max-w-[560px] sm:max-w-[580px] mx-auto select-none px-0.5 overflow-hidden">
      {/* MAIN WILD BOUNTY WOODEN BOARD CONTAINER - BACKGROUND COKLAT TRANSPARAN */}
      <div
        className={`relative w-full transition-all duration-300 ${
          isFreeSpins
            ? 'filter drop-shadow-[0_0_24px_rgba(245,197,66,0.65)]'
            : 'drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]'
        }`}
        style={{
          aspectRatio: `${SVG_WIDTH} / ${SVG_HEIGHT}`,
          transform: 'translateZ(0)',
        }}
      >
        {/* SVG LAYER: WOODEN BOARD, 3600 WAYS ENGRAVINGS, METALLIC RIM & RIVETS */}
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            {/* Background Coklat Agak Transparan untuk Box Bingkai (Opacity 0.36 to 0.48) */}
            <linearGradient id="boardWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3d1b0a" stopOpacity="0.44" />
              <stop offset="25%" stopColor="#220e04" stopOpacity="0.36" />
              <stop offset="70%" stopColor="#140702" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#080201" stopOpacity="0.48" />
            </linearGradient>

            {/* Bronze/Gold Beveled Metallic Outer Frame */}
            <linearGradient id="bronzeFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isFreeSpins ? '#fffbeb' : '#ffeed4'} />
              <stop offset="20%" stopColor={isFreeSpins ? '#fde047' : '#d89648'} />
              <stop offset="50%" stopColor={isFreeSpins ? '#b45309' : '#7a3f12'} />
              <stop offset="80%" stopColor={isFreeSpins ? '#f59e0b' : '#c5843b'} />
              <stop offset="100%" stopColor={isFreeSpins ? '#78350f' : '#4e2406'} />
            </linearGradient>

            {/* Gold Highlight Inlay */}
            <linearGradient id="goldInlayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Metallic Rivet Gradient */}
            <radialGradient id="boardRivetGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="45%" stopColor="#d97706" />
              <stop offset="85%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#291104" />
            </radialGradient>
          </defs>

          {/* 1. Deep Board Interior Fill - BACKGROUND BINGKAI AGAK TRANSPARAN */}
          <path
            d={INNER_BOARD_PATH}
            fill="url(#boardWoodGrad)"
            stroke="#1f0c04"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* 2. Solid Outer Frame Rim (Between Outer and Inner Path only, preserving interior transparency) */}
          <path
            d={`${OUTER_BOARD_PATH} ${INNER_BOARD_PATH}`}
            fillRule="evenodd"
            fill="url(#bronzeFrameGrad)"
            stroke="#120602"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Heavy Outer Rim Border Stroke */}
          <path
            d={OUTER_BOARD_PATH}
            fill="none"
            stroke="#120602"
            strokeWidth="7.5"
            strokeLinejoin="round"
          />

          {/* Heavy Inner Metallic Bevel Trim */}
          <path
            d={INNER_BOARD_PATH}
            fill="none"
            stroke="url(#bronzeFrameGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* 4. MOTIF GARIS KAYU DI TEPI BAGIAN DALAM BINGKAI (Carved Wood Grain Striations & Timber Texture) */}
          <g className="wood-grain-inner-motifs" opacity="0.85">
            {/* Top-Left Slanted Timber Wood Grain Lines (Parallel to -16.4° slope) */}
            <path d="M 32, 106 Q 180, 58 330, 20" fill="none" stroke="#683416" strokeWidth="2.8" opacity="0.75" strokeLinecap="round" />
            <path d="M 36, 102 Q 185, 54 326, 23" fill="none" stroke="#2e1205" strokeWidth="1.8" opacity="0.85" strokeLinecap="round" />
            <path d="M 42, 98 Q 190, 51 324, 27" fill="none" stroke="#a45524" strokeWidth="2.0" opacity="0.65" strokeLinecap="round" />
            <path d="M 48, 95 Q 195, 48 321, 30" fill="none" stroke="#48210e" strokeWidth="1.5" opacity="0.70" strokeLinecap="round" />
            <path d="M 54, 92 Q 200, 46 318, 34" fill="none" stroke="#c46f32" strokeWidth="1.3" opacity="0.55" strokeLinecap="round" />

            {/* Top-Right Slanted Timber Wood Grain Lines (Parallel to +16.4° slope) */}
            <path d="M 640, 106 Q 492, 58 342, 20" fill="none" stroke="#683416" strokeWidth="2.8" opacity="0.75" strokeLinecap="round" />
            <path d="M 636, 102 Q 487, 54 346, 23" fill="none" stroke="#2e1205" strokeWidth="1.8" opacity="0.85" strokeLinecap="round" />
            <path d="M 630, 98 Q 482, 51 348, 27" fill="none" stroke="#a45524" strokeWidth="2.0" opacity="0.65" strokeLinecap="round" />
            <path d="M 624, 95 Q 477, 48 351, 30" fill="none" stroke="#48210e" strokeWidth="1.5" opacity="0.70" strokeLinecap="round" />
            <path d="M 618, 92 Q 472, 46 354, 34" fill="none" stroke="#c46f32" strokeWidth="1.3" opacity="0.55" strokeLinecap="round" />

            {/* Left Timber Upright Side Grain Lines */}
            <path d="M 31, 114 Q 27, 310 31, 508" fill="none" stroke="#2e1205" strokeWidth="2.5" opacity="0.80" strokeLinecap="round" />
            <path d="M 35, 116 Q 38, 312 35, 506" fill="none" stroke="#753918" strokeWidth="2.0" opacity="0.70" strokeLinecap="round" />
            <path d="M 39, 118 Q 42, 314 39, 504" fill="none" stroke="#b05f28" strokeWidth="1.6" opacity="0.60" strokeLinecap="round" />
            <path d="M 43, 120 Q 39, 315 43, 502" fill="none" stroke="#48210e" strokeWidth="1.8" opacity="0.75" strokeLinecap="round" />

            {/* Right Timber Upright Side Grain Lines */}
            <path d="M 641, 114 Q 645, 310 641, 508" fill="none" stroke="#2e1205" strokeWidth="2.5" opacity="0.80" strokeLinecap="round" />
            <path d="M 637, 116 Q 634, 312 637, 506" fill="none" stroke="#753918" strokeWidth="2.0" opacity="0.70" strokeLinecap="round" />
            <path d="M 633, 118 Q 630, 314 633, 504" fill="none" stroke="#b05f28" strokeWidth="1.6" opacity="0.60" strokeLinecap="round" />
            <path d="M 629, 120 Q 633, 315 629, 502" fill="none" stroke="#48210e" strokeWidth="1.8" opacity="0.75" strokeLinecap="round" />

            {/* Bottom Shield Taper Slanted Timber Grain Lines */}
            <path d="M 33, 508 Q 170, 560 308, 614" fill="none" stroke="#48210e" strokeWidth="2.6" opacity="0.80" strokeLinecap="round" />
            <path d="M 38, 504 Q 175, 555 312, 608" fill="none" stroke="#944a1d" strokeWidth="1.8" opacity="0.65" strokeLinecap="round" />
            <path d="M 44, 500 Q 180, 550 316, 602" fill="none" stroke="#2e1205" strokeWidth="1.5" opacity="0.75" strokeLinecap="round" />
            <path d="M 639, 508 Q 502, 560 364, 614" fill="none" stroke="#48210e" strokeWidth="2.6" opacity="0.80" strokeLinecap="round" />
            <path d="M 634, 504 Q 497, 555 360, 608" fill="none" stroke="#944a1d" strokeWidth="1.8" opacity="0.65" strokeLinecap="round" />
            <path d="M 628, 500 Q 492, 550 356, 602" fill="none" stroke="#2e1205" strokeWidth="1.5" opacity="0.75" strokeLinecap="round" />

            {/* Carved Wood Timber Knots */}
            <ellipse cx="36" cy="240" rx="3.5" ry="9" fill="none" stroke="#240c03" strokeWidth="1.4" opacity="0.85" />
            <ellipse cx="36" cy="240" rx="2" ry="5" fill="#3a1606" opacity="0.7" />
            <ellipse cx="636" cy="380" rx="3.5" ry="9" fill="none" stroke="#240c03" strokeWidth="1.4" opacity="0.85" />
            <ellipse cx="636" cy="380" rx="2" ry="5" fill="#3a1606" opacity="0.7" />
          </g>

          {/* 5. Fine Gold Inlay Trace */}
          <path
            d={INNER_BOARD_PATH}
            fill="none"
            stroke="url(#goldInlayGrad)"
            strokeWidth="2.2"
            opacity="0.85"
          />

          {/* 6. 6 Column Guide Divider Lines (Crisp vertical cell division) */}
          {[1, 2, 3, 4, 5].map((c) => {
            const x = PAD_X + c * PITCH_X;
            return (
              <line
                key={`div-${c}`}
                x1={x}
                y1={38}
                x2={x}
                y2={SVG_HEIGHT - 32}
                stroke="#e5a952"
                strokeWidth="1.6"
                strokeDasharray="4 5"
                opacity="0.28"
              />
            );
          })}

          {/* 7. Perimeter Bronze Rivets */}
          {BOARD_RIVETS.map((r, i) => (
            <g key={`rivet-${i}`} transform={`translate(${r.x}, ${r.y})`}>
              <circle r="4.8" fill="url(#boardRivetGrad)" stroke="#381302" strokeWidth="1.2" />
              <circle r="1.6" fill="#fffbeb" opacity="0.8" cx="-1" cy="-1" />
            </g>
          ))}
        </svg>

        {/* 2. REEL GRID TILES LAYER (STRICTLY CLIPPED TO BOARD INTERIOR, ZERO OVERLAP, z-20) */}
        <div
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
          style={{
            // Hardware-accelerated clip path matching the exact inner board contour
            clipPath:
              'polygon(50% 3.5%, 4.5% 17.7%, 4.5% 80.7%, 46.1% 97.2%, 50% 98.1%, 53.9% 97.2%, 95.5% 80.7%, 95.5% 17.7%)',
            transform: 'translateZ(0)',
          }}
        >
          {Array.from({ length: NUM_COLUMNS }).map((_, colIdx) => {
            const colTiles = grid[colIdx] || [];
            const prevColTiles = prevGridRef.current[colIdx] || [];
            const colRowCount = REEL_ROW_COUNTS[colIdx];
            const offsetY = ((5 - colRowCount) * PITCH_Y) / 2;
            const totalDropDistance = colRowCount * PITCH_Y;

            const colLeftPct = ((PAD_X + colIdx * PITCH_X) / SVG_WIDTH) * 100;
            const colWidthPct = (PITCH_X / SVG_WIDTH) * 100;
            const tileHeightPct = (PITCH_Y / SVG_HEIGHT) * 100;

            // NORMAL MODE: JATUH BERURUTAN DARI KIRI KE KANAN (colIdx * 0.08s) DENGAN BOBOT NATURAL
            // TURBO MODE: JATUH SEREMPAK SEMUA KOLOM DALAM DURASI INSTAN (0.15s)
            const spinDropDuration = isTurbo ? 0.15 : 0.52;
            const spinColDelay = isTurbo ? 0 : colIdx * 0.08; // Berurutan kiri ke kanan di Normal Mode
            const cascadeDropDuration = isTurbo ? 0.11 : 0.38;

            return (
              <div
                key={colIdx}
                className="absolute top-0 bottom-0 overflow-visible"
                style={{
                  left: `${colLeftPct}%`,
                  width: `${colWidthPct}%`,
                }}
              >
                {/* 1. SIMBOL SEBELUMNYA DI BINGKAI: TURUN KE BAWAH KELUAR BINGKAI SECARA BERURUTAN */}
                {isSpinEntering &&
                  prevColTiles.map((oldTile) => {
                    const visualY = PAD_Y + offsetY + oldTile.row * PITCH_Y;
                    const visualYPct = (visualY / SVG_HEIGHT) * 100;
                    return (
                      <motion.div
                        key={`old_${oldTile.id}_${colIdx}`}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: totalDropDistance + 60, opacity: 0.95 }}
                        transition={{
                          duration: isTurbo ? 0.12 : 0.44,
                          delay: spinColDelay,
                          ease: isTurbo ? 'easeOut' : [0.45, 0, 1, 1], // Akselerasi gravitasi jatuh ke bawah
                        }}
                        className="absolute left-0 right-0 w-full flex items-center justify-center z-10 pointer-events-none"
                        style={{
                          top: `${visualYPct}%`,
                          height: `${tileHeightPct}%`,
                          willChange: 'transform',
                          transform: 'translate3d(0, 0, 0)',
                        }}
                      >
                        <div className="relative flex items-center justify-center w-full h-full overflow-visible pointer-events-none">
                          <SlotSymbolGraphic
                            symbolId={oldTile.symbol}
                            isGoldFramed={oldTile.isGoldFramed}
                          />
                        </div>
                      </motion.div>
                    );
                  })}

                {/* 2. SIMBOL BARU YANG TURUN MENGISI BINGKAI SECARA BERURUTAN DI NORMAL MODE */}
                {colTiles.map((tile) => {
                  const isWinning = winningTileIds.includes(tile.id);
                  const isScatter = tile.symbol === 'SCATTER';
                  const isWild = tile.symbol === 'WILD';

                  // Exact cell vertical alignment
                  const visualY = PAD_Y + offsetY + tile.row * PITCH_Y;
                  const visualYPct = (visualY / SVG_HEIGHT) * 100;

                  // Initial offset for drop animation
                  let initialY = 0;
                  if (isSpinEntering) {
                    initialY = -totalDropDistance;
                  } else if (isCascading) {
                    if (tile.dropRows && tile.dropRows > 0) {
                      initialY = -(tile.dropRows * PITCH_Y);
                    }
                  }

                  const hasDrop = initialY !== 0;
                  const isSpecialOverlap = (isScatter && isWinning) || tile.transformedToWild;

                  return (
                    <motion.div
                      key={tile.id}
                      initial={{
                        y: initialY,
                        scale: 1,
                        opacity: 1,
                      }}
                      animate={{
                        // Normal Mode: Jatuh berbobot & santai → akselerasi gravitasi → sedikit bounce/settle saat mendarat (4.0px → -1.0px → 0px)
                        // Turbo Mode: Super cepat & instan → settle minimal (0.8px → 0px)
                        y: hasDrop
                          ? isTurbo
                            ? [initialY, 0.8, 0]
                            : [initialY, 4.0, -1.0, 0]
                          : 0,
                        scale: isSpecialOverlap
                          ? 1.15
                          : isWinning
                          ? 1.05
                          : 1,
                        opacity: 1,
                      }}
                      transition={
                        isSpinEntering
                          ? {
                              duration: spinDropDuration,
                              delay: spinColDelay, // Normal: Berurutan kiri ke kanan, Turbo: Serentak
                              times: isTurbo ? [0, 0.88, 1] : [0, 0.78, 0.90, 1],
                              ease: isTurbo ? 'easeOut' : [0.25, 1, 0.5, 1],
                            }
                          : isCascading && hasDrop
                          ? {
                              duration: cascadeDropDuration,
                              delay: 0,
                              times: isTurbo ? [0, 0.88, 1] : [0, 0.78, 0.90, 1],
                              ease: isTurbo ? 'easeOut' : [0.25, 1, 0.5, 1],
                            }
                          : isWinning
                          ? { duration: isTurbo ? 0.08 : 0.18, ease: 'easeInOut' }
                          : {
                              duration: isTurbo ? 0.08 : 0.15,
                              ease: 'easeOut',
                            }
                      }
                      className={`absolute left-0 right-0 w-full flex items-center justify-center ${
                        isSpecialOverlap ? 'z-40 overflow-visible' : isWinning ? 'z-30' : 'z-20'
                      }`}
                      style={{
                        top: `${visualYPct}%`,
                        height: `${tileHeightPct}%`,
                        willChange: 'transform',
                        transform: 'translate3d(0, 0, 0)',
                      }}
                    >
                      {/* BULLET HIT HOLE & SOFT SMOKE EFFECT (BEFORE & DURING BREAK) */}
                      {isWinning && winAnimStage !== 'IDLE' && (
                        <BulletHitEffect
                          isTurbo={isTurbo}
                          stage={winAnimStage === 'SHATTERING' ? 'SHATTERING' : winAnimStage === 'HOLD' ? 'HOLD' : 'EXPANDING'}
                        />
                      )}

                      {/* MAIN SYMBOL GRAPHIC (Centered inside cell, strictly aligned, no overlap) */}
                      <div
                        className={`relative flex items-center justify-center w-full h-full overflow-visible pointer-events-none transition-all ${
                          isWinning && winAnimStage === 'SHATTERING'
                            ? tile.isGoldFramed
                              ? 'scale-110 brightness-125 duration-200'
                              : 'opacity-0 scale-90 blur-[2px] duration-300 ease-out'
                            : 'opacity-100 scale-100 duration-150'
                        }`}
                      >
                        <SlotSymbolGraphic
                          symbolId={tile.symbol}
                          isWinning={isWinning}
                          hasWildWin={hasWildWin}
                          isGoldFramed={tile.isGoldFramed}
                          transformedToWild={tile.transformedToWild}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* 3. FOREGROUND LAYER (z-50): DUA REVOLVER 3D & CORNER BRACKETS DI LAYER PALING DEPAN SEHINGGA SIMBOL TIDAK MENIMPA PISTOL */}
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="absolute inset-0 w-full h-full z-50 pointer-events-none select-none overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="fgBronzeFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4963e" />
              <stop offset="50%" stopColor="#8c471a" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>

          {/* DUA REVOLVER 3D DI KIRI DAN KANAN BINGKAI (LAYER TERDEPAN z-50) */}
          {/* Revolver Kiri: Laras menutupi bingkai atas (-16.43°), gagang atas & hammer menutupi sudut kiri atas bingkai (24, 108) di depan simbol */}
          <g
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.98)) drop-shadow(0 2px 6px rgba(0,0,0,1))',
            }}
            transform="translate(336, 16) rotate(-16.43) translate(-390, -42)"
          >
            <image
              href={westernRevolver3dImg}
              x="0"
              y="0"
              width="390"
              height="175"
              preserveAspectRatio="none"
            />
          </g>

          {/* Revolver Kanan: Laras menutupi bingkai atas (+16.43°), gagang atas & hammer menutupi sudut kanan atas bingkai (648, 108) di depan simbol */}
          <g
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.98)) drop-shadow(0 2px 6px rgba(0,0,0,1))',
            }}
            transform="translate(336, 16) scale(-1, 1) rotate(-16.43) translate(-390, -42)"
          >
            <image
              href={westernRevolver3dImg}
              x="0"
              y="0"
              width="390"
              height="175"
              preserveAspectRatio="none"
            />
          </g>

          {/* Solid Bronze Bolster Brackets securing Gagang Revolver to Left & Right Frame Corners */}
          <g transform="translate(24, 110)">
            <ellipse rx="7" ry="14" fill="url(#fgBronzeFrameGrad)" stroke="#120602" strokeWidth="1.5" />
            <circle cy="-5" r="2.2" fill="#fffbeb" />
            <circle cy="5" r="2.2" fill="#fffbeb" />
          </g>
          <g transform="translate(648, 110)">
            <ellipse rx="7" ry="14" fill="url(#fgBronzeFrameGrad)" stroke="#120602" strokeWidth="1.5" />
            <circle cy="-5" r="2.2" fill="#fffbeb" />
            <circle cy="5" r="2.2" fill="#fffbeb" />
          </g>
        </svg>

        {/* 4. TOP STATUS BADGE (z-50): SISA SPIN or PAY ANYWHERE */}
        <div className="absolute top-6 sm:top-7 left-0 right-0 z-50 flex items-center justify-center pointer-events-none">
          {isFreeSpins && remainingFreeSpins > 0 ? (
            <div className="px-3.5 py-0.5 rounded-full bg-gradient-to-b from-amber-500 via-amber-700 to-amber-950 border border-yellow-300 shadow-[0_2px_12px_rgba(245,197,66,0.9)] animate-pulse">
              <span className="text-[10px] text-yellow-100 font-western font-black tracking-wider uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                ★ SISA SPIN: {remainingFreeSpins} ★
              </span>
            </div>
          ) : (
            <div className="px-3 py-0.5 rounded-full bg-gradient-to-b from-[#2a1408]/90 to-[#120703]/90 border border-amber-500/50 shadow-md">
              <span className="text-[9px] text-amber-300/90 font-western font-bold tracking-widest uppercase">
                PAY ANYWHERE
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
