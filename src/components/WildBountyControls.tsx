import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Coins, Zap, Minus, Plus, Menu, RotateCcw, Play, Flame } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import { Language, TRANSLATIONS } from '../utils/translations';

interface WildBountyControlsProps {
  balance: number;
  bet: number;
  win: number;
  currency: 'USD' | 'IDR';
  language?: Language;
  isSpinning: boolean;
  isTurbo: boolean;
  autoSpinsRemaining: number;
  isFreeSpins?: boolean;
  remainingFreeSpins?: number;
  currentLevel?: number;
  currentLevelTitle?: string;
  baseMultiplier?: number;
  onToggleTurbo: () => void;
  onDecreaseBet: () => void;
  onIncreaseBet: () => void;
  onSpin: () => void;
  onToggleAuto: () => void;
  onOpenMenu: () => void;
}

// Highly Detailed Western Bison Skull SVG Icon for Spin Button Background
const BisonSkullSvg: React.FC<{ className?: string; isEnergized?: boolean }> = ({
  className = 'w-full h-full',
  isEnergized = false,
}) => (
  <svg
    viewBox="0 0 120 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="bisonHornLeft" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stopColor="#1a0c04" />
        <stop offset="35%" stopColor="#5a3818" />
        <stop offset="70%" stopColor="#9a6e3d" />
        <stop offset="100%" stopColor="#e5d3b6" />
      </linearGradient>

      <linearGradient id="bisonHornRight" x1="90%" y1="0%" x2="10%" y2="100%">
        <stop offset="0%" stopColor="#1a0c04" />
        <stop offset="35%" stopColor="#5a3818" />
        <stop offset="70%" stopColor="#9a6e3d" />
        <stop offset="100%" stopColor="#e5d3b6" />
      </linearGradient>

      <linearGradient id="bisonBoneGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#faf5ec" />
        <stop offset="25%" stopColor="#e8dec8" />
        <stop offset="65%" stopColor="#bfa47d" />
        <stop offset="100%" stopColor="#7a542a" />
      </linearGradient>

      <radialGradient id="socketDark" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0a0402" />
        <stop offset="85%" stopColor="#220e05" />
        <stop offset="100%" stopColor="#3d1d0c" />
      </radialGradient>
    </defs>

    {/* Left Sweeping Curved Bison Horn */}
    <path
      d="M 52 44 C 36 38 22 28 12 16 C 5 7 3 3 2 1 C 5 6 12 18 24 26 C 35 32 44 38 50 42 Z"
      fill="url(#bisonHornLeft)"
      stroke="#120602"
      strokeWidth="1"
    />
    <path d="M 16 19 C 14 16 12 14 10 10" stroke="#3d210d" strokeWidth="1.2" opacity="0.7" />
    <path d="M 23 25 C 20 22 17 19 15 15" stroke="#3d210d" strokeWidth="1.2" opacity="0.7" />
    <path d="M 33 31 C 29 27 25 24 22 20" stroke="#3d210d" strokeWidth="1.2" opacity="0.7" />

    {/* Right Sweeping Curved Bison Horn */}
    <path
      d="M 68 44 C 84 38 98 28 108 16 C 115 7 117 3 118 1 C 115 6 108 18 96 26 C 85 32 76 38 70 42 Z"
      fill="url(#bisonHornRight)"
      stroke="#120602"
      strokeWidth="1"
    />
    <path d="M 104 19 C 106 16 108 14 110 10" stroke="#3d210d" strokeWidth="1.2" opacity="0.7" />
    <path d="M 97 25 C 100 22 103 19 105 15" stroke="#3d210d" strokeWidth="1.2" opacity="0.7" />
    <path d="M 87 31 C 91 27 95 24 98 20" stroke="#3d210d" strokeWidth="1.2" opacity="0.7" />

    {/* Main Skull Cranium Bone */}
    <path
      d="M 40 34 Q 60 28 80 34 L 83 48 L 76 66 L 68 96 L 52 96 L 44 66 L 37 48 Z"
      fill="url(#bisonBoneGrad)"
      stroke="#3a1c09"
      strokeWidth="1.5"
    />

    {/* Brow Ridge & Forehead Suture Lines */}
    <path d="M 46 38 Q 60 34 74 38" stroke="#7a542a" strokeWidth="1.5" fill="none" opacity="0.8" />
    <path d="M 60 35 L 60 48" stroke="#5a3818" strokeWidth="1" fill="none" opacity="0.7" />

    {/* Deep Eye Socket Cavities */}
    <ellipse cx="49" cy="54" rx="5.5" ry="7.5" transform="rotate(-8 49 54)" fill="url(#socketDark)" />
    <ellipse cx="71" cy="54" rx="5.5" ry="7.5" transform="rotate(8 71 54)" fill="url(#socketDark)" />

    {/* Nasal Cavity Bone & Snout Cavities */}
    <path
      d="M 57 72 L 63 72 L 62 86 L 58 86 Z"
      fill="#140702"
      stroke="#5a3818"
      strokeWidth="0.8"
    />
    <ellipse cx="58" cy="85" rx="1.5" ry="2.5" fill="#000000" />
    <ellipse cx="62" cy="85" rx="1.5" ry="2.5" fill="#000000" />

    {/* Energized Gold Glow for Active Spin */}
    {isEnergized && (
      <circle
        cx="60"
        cy="60"
        r="48"
        stroke="#fde047"
        strokeWidth="2"
        strokeDasharray="6 4"
        className="animate-spin"
        opacity="0.8"
        style={{ transformOrigin: 'center' }}
      />
    )}
  </svg>
);

export const WildBountyControls: React.FC<WildBountyControlsProps> = ({
  balance,
  bet,
  win,
  currency,
  language = 'ID',
  isSpinning,
  isTurbo,
  autoSpinsRemaining,
  isFreeSpins = false,
  remainingFreeSpins = 0,
  currentLevel,
  currentLevelTitle,
  baseMultiplier = 1,
  onToggleTurbo,
  onDecreaseBet,
  onIncreaseBet,
  onSpin,
  onToggleAuto,
  onOpenMenu,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ID;

  const formatVal = (num: number) => {
    if (currency === 'IDR') {
      return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleDecreaseWithSound = () => {
    sound.playBetChange();
    onDecreaseBet();
  };

  const handleIncreaseWithSound = () => {
    sound.playBetChange();
    onIncreaseBet();
  };

  return (
    <div className="w-full max-w-[540px] sm:max-w-[560px] mx-auto select-none pt-0 pb-2 px-1 sm:px-2 flex flex-col gap-2.5 sm:gap-3.5">
      {/* 1. UNIFIED PANEL: PAPAN LEVEL + PAPAN BALANCE/BET/WIN DINAIKKAN KE ATAS */}
      <div className="w-full flex flex-col -mt-4 sm:-mt-6 rounded-2xl bg-gradient-to-b from-[#2e170c]/95 via-[#1e0e06]/95 to-[#120703]/95 border-2 border-[#9a5324] shadow-[0_6px_20px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* ROW 1: PAPAN LEVEL (MENYATU SEBAGAI BAGIAN ATAS CONTAINER PANEL DENGAN UKURAN LEBIH BESAR) */}
        {currentLevel && (
          <div className="w-full px-3.5 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between text-xs sm:text-sm text-stone-300 bg-[#160a04]/90 border-b border-[#6e3919]/60">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
              <span className="font-bold text-stone-100 shrink-0 text-xs sm:text-sm">
                {t.level} {currentLevel}:
              </span>
              <span className="text-amber-200 font-semibold truncate text-xs sm:text-sm">{currentLevelTitle}</span>
            </div>
            <div className="font-mono font-black text-amber-400 shrink-0 pl-2 text-xs sm:text-sm tracking-wide">
              DASAR X{baseMultiplier} • 3+ SCATTER = 10 FS
            </div>
          </div>
        )}

        {/* ROW 2: HUD BALANCE, BET, WIN (DIPERBESAR SECARA PROPORSIONAL) */}
        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center px-1.5 sm:px-3 py-2 sm:py-2.5">
          {/* BAGIAN KIRI: HAMBURGER + ICON DOMPET & JUMLAH BALANCE (DEKAT KE GARIS BATAS KIRI, FONT KUNING EMAS) */}
          <div className="flex items-center justify-start gap-1.5 sm:gap-2 min-w-0 pl-0.5 overflow-hidden">
            {/* HAMBURGER MENU BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenMenu();
              }}
              className="flex items-center justify-center p-2 sm:p-2.5 rounded-xl text-amber-300 hover:text-yellow-300 hover:bg-amber-900/30 active:scale-95 transition-all cursor-pointer shrink-0 touch-manipulation"
              title={t.menuTitle}
            >
              <Menu className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5" />
            </button>

            {/* DIVIDER 1 */}
            <div className="h-7 sm:h-8 w-[2px] bg-[#6e3919]/70 shrink-0 mx-0.5" />

            {/* SALDO / BALANCE (DIGESER KE KIRI MENDEKATI BATAS, FONT KUNING EMAS BESAR) */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden pr-1">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0 drop-shadow" />
              <span
                className="truncate text-yellow-400 font-mono text-sm sm:text-base md:text-lg font-black tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                title={formatVal(balance)}
              >
                {currency === 'IDR' ? 'Rp ' : '$'}{formatVal(balance)}
              </span>
            </div>
          </div>

          {/* BAGIAN TENGAH: TARUHAN / BET (TEPAT DIATAS TOMBOL SPIN, FONT BESAR) */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 shrink-0 border-x-2 border-[#6e3919]/60">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
            <span
              className="truncate text-amber-200 font-mono text-sm sm:text-base md:text-lg font-black tracking-tight"
              title={formatVal(bet)}
            >
              {formatVal(bet)}
            </span>
          </div>

          {/* BAGIAN KANAN: WIN / MENANG (TEPAT DI ATAS CELAH ANTARA TOMBOL '+' DAN 'AUTO', FONT BESAR) */}
          <div className="flex items-center justify-center sm:justify-start sm:pl-10 md:pl-12 min-w-0 overflow-hidden">
            <motion.div
              key={win}
              initial={{ scale: win > 0 ? 1.15 : 1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden"
            >
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  win > 0 ? 'border-yellow-300 bg-amber-500/40 shadow-[0_0_10px_rgba(253,224,71,0.85)]' : 'border-amber-400/60 bg-amber-950/60'
                }`}
              >
                <span className="text-xs sm:text-sm text-yellow-300 font-black leading-none">★</span>
              </div>
              <span
                className={`truncate font-mono text-base sm:text-lg md:text-xl font-black tracking-tight transition-colors ${
                  win > 0
                    ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.95)]'
                    : 'text-amber-300'
                }`}
                title={formatVal(win)}
              >
                {formatVal(win)}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. FREE SPIN BOARD vs NORMAL CONTROLS DOCK */}
      {isFreeSpins ? (
        /* SCATTER / FREE SPIN MODE BOARD (MENGGANTIKAN AREA TOMBOL TURBO / − / SPIN / + / AUTO) */
        <div className="w-full px-0.5 sm:px-1 pt-1 pb-1 animate-in zoom-in-95 duration-200">
          <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#3d1d0c] via-[#241006] to-[#120502] border-[3px] border-[#d4963e] shadow-[0_8px_24px_rgba(0,0,0,0.95),inset_0_2px_8px_rgba(245,197,66,0.35)] px-6 sm:px-8 py-3.5 sm:py-4.5 flex items-center justify-between overflow-hidden">
            {/* Western Wood Plank Grain Texture Background */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_36px,rgba(0,0,0,0.6)_36px,rgba(0,0,0,0.6)_38px)]" />

            {/* Decorative Corner Rivets */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#fde047] border border-[#78350f] shadow-sm" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#fde047] border border-[#78350f] shadow-sm" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#fde047] border border-[#78350f] shadow-sm" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#fde047] border border-[#78350f] shadow-sm" />

            {/* Subtle Ambient Gold Radiance Glow */}
            <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none animate-pulse" />

            {/* LEFT: FREE SPIN on top, REMAINING right below it */}
            <div className="relative z-10 flex flex-col justify-center">
              <span className="font-western font-black text-2xl sm:text-3xl md:text-4xl text-gold-gradient tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] leading-tight">
                FREE SPIN
              </span>
              <span className="font-western font-black text-xs sm:text-sm md:text-base text-amber-300 tracking-[0.25em] uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] -mt-0.5">
                REMAINING
              </span>
            </div>

            {/* RIGHT: COUNTDOWN NUMBER (BERUKURAN BESAR & SANGAT MUDAH DIBACA) */}
            <div className="relative z-10 flex items-center justify-center pl-4">
              <motion.span
                key={remainingFreeSpins}
                initial={{ scale: 1.25, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="font-western font-black text-5xl sm:text-6xl md:text-7xl text-gold-gradient tracking-tight drop-shadow-[0_4px_16px_rgba(245,197,66,0.95)] tabular-nums leading-none"
              >
                {remainingFreeSpins}
              </motion.span>
            </div>
          </div>
        </div>
      ) : (
        /* NORMAL CONTROLS DOCK: TOMBOL TURBO, −, SPIN, +, AUTO DIPERBESAR SECARA PROPORSIONAL & SEJAJAR */
        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full px-1 sm:px-2 pt-0.5 pointer-events-auto select-none">
          {/* LEFT CLUSTER: Turbo & Minus (-) - DIPERBESAR & TETAP SEJAJAR */}
          <div className="flex items-center justify-end gap-3.5 sm:gap-5 pr-3 sm:pr-4 md:pr-5">
            {/* Turbo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleTurbo();
              }}
              className={`flex flex-col items-center justify-center w-14.5 h-14.5 sm:w-16.5 sm:h-16.5 rounded-full border-2 transition-all cursor-pointer shadow-xl active:scale-95 touch-manipulation select-none ${
                isTurbo
                  ? 'bg-amber-500/35 border-yellow-400 shadow-[0_0_18px_rgba(245,197,66,0.9)] scale-105'
                  : 'bg-[#1b1009] border-[#d4963e] hover:border-yellow-400'
              }`}
              title="Toggle Turbo Speed"
            >
              <Zap
                className={`w-6 h-6 sm:w-7 sm:h-7 ${
                  isTurbo ? 'text-yellow-300 fill-yellow-300 animate-pulse' : 'text-amber-300'
                }`}
              />
              <span className="text-[9px] sm:text-[10px] font-black text-amber-200 uppercase tracking-tight -mt-0.5">
                {t.turbo}
              </span>
            </button>

            {/* Minus Button (-) */}
            <button
              disabled={isSpinning || bet <= 400}
              onClick={(e) => {
                e.stopPropagation();
                handleDecreaseWithSound();
              }}
              className="flex items-center justify-center w-13.5 h-13.5 sm:w-15.5 sm:h-15.5 rounded-full bg-gradient-to-b from-[#3a2010] to-[#1a0e07] border-2 border-[#d4963e] text-amber-200 hover:brightness-115 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shadow-xl touch-manipulation select-none"
              title="Decrease Bet"
            >
              <Minus className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 stroke-[3.5]" />
            </button>
          </div>

          {/* CENTER: GRAND SPIN BUTTON (DIPERBESAR PROPORSIONAL) */}
          <div className="flex items-center justify-center shrink-0 px-2 sm:px-3">
            <button
              disabled={isSpinning}
              onClick={(e) => {
                e.stopPropagation();
                onSpin();
              }}
              className="relative flex items-center justify-center w-26 h-26 sm:w-31 sm:h-31 md:w-34 md:h-34 rounded-full bg-gradient-to-b from-[#7a3c14] via-[#4a230b] to-[#1e0d04] border-[4px] border-[#f0b254] shadow-[0_12px_36px_rgba(0,0,0,0.95),inset_0_2px_14px_rgba(255,255,255,0.45),0_0_28px_rgba(240,178,84,0.55)] transition-all overflow-hidden select-none hover:brightness-115 active:scale-95 cursor-pointer touch-manipulation"
              title={t.spin}
            >
              {/* Outer Inlay Gold Ring */}
              <div className="absolute inset-1 rounded-full border border-amber-400/50 pointer-events-none" />

              {/* BISON SKULL BACKGROUND SVG */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 opacity-65">
                <BisonSkullSvg
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
                  isEnergized={isSpinning}
                />
              </div>

              {/* Subtle Vignette Overlay for Skull Depth */}
              <div className="absolute inset-0 rounded-full bg-radial from-transparent via-[#200e05]/30 to-[#100602]/70 pointer-events-none" />

              {/* FOREGROUND CONTROLS OVER BISON SKULL */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                {autoSpinsRemaining > 0 ? (
                  // In Auto Spin Mode
                  <div className="flex flex-col items-center justify-center animate-in zoom-in-75">
                    <span className="text-[10px] sm:text-[11px] font-western font-bold text-amber-300 uppercase tracking-wider drop-shadow">
                      {t.auto}
                    </span>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-western font-black text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                      {autoSpinsRemaining}
                    </span>
                  </div>
                ) : isSpinning ? (
                  // Active Spinning Spinner with Rotating Arrows
                  <div className="flex items-center justify-center">
                    <RotateCcw className="w-11 h-11 sm:w-13 sm:h-13 text-amber-300 animate-spin stroke-[3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]" />
                  </div>
                ) : (
                  // Idle Circulating Double Curved Arrows
                  <div className="flex items-center justify-center text-amber-300">
                    <RotateCcw className="w-11 h-11 sm:w-14 sm:h-14 stroke-[3.2] text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] transition-transform group-hover:rotate-45" />
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* RIGHT CLUSTER: Plus (+) & Auto Spin - DIPERBESAR & TETAP SEJAJAR */}
          <div className="flex items-center justify-start gap-3.5 sm:gap-5 pl-3 sm:pl-4 md:pl-5">
            {/* Plus Button (+) */}
            <button
              disabled={isSpinning || bet >= 1228800}
              onClick={(e) => {
                e.stopPropagation();
                handleIncreaseWithSound();
              }}
              className="flex items-center justify-center w-13.5 h-13.5 sm:w-15.5 sm:h-15.5 rounded-full bg-gradient-to-b from-[#3a2010] to-[#1a0e07] border-2 border-[#d4963e] text-amber-200 hover:brightness-115 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shadow-xl touch-manipulation select-none"
              title="Increase Bet"
            >
              <Plus className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 stroke-[3.5]" />
            </button>

            {/* Auto Spin Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleAuto();
              }}
              className={`flex flex-col items-center justify-center w-14.5 h-14.5 sm:w-16.5 sm:h-16.5 rounded-full border-2 transition-all cursor-pointer shadow-xl active:scale-95 touch-manipulation select-none ${
                autoSpinsRemaining > 0
                  ? 'bg-red-950/85 border-red-500 shadow-[0_0_18px_rgba(239,68,68,0.85)] animate-pulse'
                  : 'bg-[#1b1009] border-[#d4963e] hover:border-amber-400'
              }`}
              title="Auto Spin"
            >
              <Play
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  autoSpinsRemaining > 0 ? 'text-red-400 fill-red-400' : 'text-amber-300 fill-amber-300'
                }`}
              />
              <span className="text-[9px] sm:text-[10px] font-black text-amber-200 uppercase tracking-tight mt-0.5">
                {t.auto}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
