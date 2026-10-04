import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/soundEngine';
import { Language, TRANSLATIONS } from '../utils/translations';

interface FreeSpinsTotalWinModalProps {
  totalWon: number;
  currency: 'IDR' | 'USD';
  onComplete: () => void;
  language?: Language;
}

export const FreeSpinsTotalWinModal: React.FC<FreeSpinsTotalWinModalProps> = ({
  totalWon,
  currency,
  onComplete,
  language = 'ID',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ID;
  const isID = language === 'ID';
  const [currentDisplay, setCurrentDisplay] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTickValueRef = useRef<number>(0);
  const duration = 2400; // 2.4 seconds counting duration
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete and snap to final number
  const finishCounting = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setCurrentDisplay(totalWon);
    setIsFinished(true);
    sound.playWin(true);

    // Automatically return to Normal Mode after displaying final result
    if (!autoCloseTimerRef.current) {
      autoCloseTimerRef.current = setTimeout(() => {
        onComplete();
      }, 2400);
    }
  };

  useEffect(() => {
    if (totalWon <= 0) {
      finishCounting();
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);

      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(easedProgress * totalWon);

      // Play "tung" sound at each step
      if (nextValue > lastTickValueRef.current) {
        const pitchMod = 1.0 + progress * 0.4;
        sound.playCountingTick(pitchMod);
        lastTickValueRef.current = nextValue;
      }

      setCurrentDisplay(nextValue);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        finishCounting();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, [totalWon]);

  // Click or tap anywhere to instantly finish or dismiss
  const handleTap = () => {
    if (!isFinished) {
      finishCounting();
    } else {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      onComplete();
    }
  };

  return (
    <div
      onClick={handleTap}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer select-none"
      title={isID ? 'Ketuk untuk langsung melihat total kemenangan' : 'Tap to instantly view total win'}
    >
      {/* 3D Gold & Wood Saloon Frame Card */}
      <div className="relative w-[90%] max-w-sm rounded-3xl bg-gradient-to-b from-[#3a1d0d] via-[#241107] to-[#120703] border-[3px] border-[#f5c542] p-6 text-center shadow-[0_16px_50px_rgba(0,0,0,0.95),inset_0_2px_12px_rgba(245,197,66,0.5)] animate-in zoom-in-95 duration-300">
        {/* Top Trophy & Sheriff Badge Icon */}
        <div className="relative mx-auto w-20 h-20 mb-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-radial from-amber-400/40 via-yellow-500/20 to-transparent blur-md animate-pulse" />
          <svg viewBox="0 0 100 100" className="w-18 h-18 drop-shadow-[0_0_20px_rgba(245,197,66,0.9)]">
            <polygon
              points="50,5 62,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 38,35"
              fill="url(#goldGradModal)"
              stroke="#fef08a"
              strokeWidth="2.5"
            />
            <circle cx="50" cy="50" r="16" fill="#451a03" stroke="#fef08a" strokeWidth="1.5" />
            <text
              x="50"
              y="54"
              textAnchor="middle"
              fill="#fef08a"
              fontFamily="Rye, cursive, serif"
              fontWeight="900"
              fontSize="11"
              letterSpacing="1"
            >
              WIN
            </text>
            <defs>
              <linearGradient id="goldGradModal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="30%" stopColor="#fde047" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Section Subtitle */}
        <div className="text-[11px] font-western font-bold uppercase tracking-widest text-amber-400 mb-1">
          ★ {isID ? 'SESI PUTARAN GRATIS SELESAI' : 'FREE SPINS SESSION COMPLETE'} ★
        </div>

        {/* Main Title - Matches exact Header Font & Gold Gradient */}
        <h2 className="font-western text-2xl sm:text-3xl font-black text-gold-gradient tracking-wide mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          {t.freeSpinsComplete}
        </h2>

        {/* Animated Counting Box */}
        <div className="p-4 my-3 rounded-2xl bg-gradient-to-r from-amber-950/90 via-stone-900/95 to-amber-950/90 border-2 border-amber-500/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="text-[11px] font-western text-amber-300/90 uppercase tracking-wider mb-1">
            {isID ? 'HASIL AKHIR' : 'FINAL RESULT'}
          </div>
          <div className="text-3xl sm:text-4xl font-western font-black text-gold-gradient tracking-wide drop-shadow-[0_4px_12px_rgba(245,197,66,0.85)] my-1">
            {currency === 'IDR' ? 'Rp ' : '$'}
            {currentDisplay.toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-300 font-medium mt-1">
            {isFinished
              ? isID
                ? 'Kemenangan telah ditambahkan ke Saldo!'
                : 'Winnings have been added to your balance!'
              : isID
              ? 'Menghitung total kemenangan...'
              : 'Counting total win...'}
          </div>
        </div>

        {/* Footer Hint */}
        <div className="text-[10px] text-stone-400 mt-2 font-medium animate-pulse">
          {isFinished
            ? isID
              ? 'Ketuk untuk langsung kembali ke Mode Normal...'
              : 'Tap to return to Normal Mode...'
            : isID
            ? 'Ketuk di mana saja untuk langsung melihat hasil final...'
            : 'Tap anywhere to view final result...'}
        </div>
      </div>
    </div>
  );
};

