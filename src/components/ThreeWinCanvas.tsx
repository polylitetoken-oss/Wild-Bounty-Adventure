import React, { useEffect, useState } from 'react';

export type WinTier = 'BIG_WIN' | 'SUPER_BIG_WIN' | 'MEGA_WIN' | 'EPIC_WIN' | 'LEVEL_UP';

interface ThreeWinCanvasProps {
  active: boolean;
  tier: WinTier;
  amount?: number;
  currency?: 'USD' | 'IDR';
  onComplete?: () => void;
}

export const ThreeWinCanvas: React.FC<ThreeWinCanvasProps> = ({
  active,
  tier,
  amount = 0,
  currency = 'IDR',
  onComplete,
}) => {
  const [displayedAmount, setDisplayedAmount] = useState<number>(0);

  // Count-up amount display
  useEffect(() => {
    if (!active) {
      setDisplayedAmount(0);
      return;
    }

    let start = 0;
    const end = amount;
    const duration = 1000; // 1s smooth count up
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedAmount(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setDisplayedAmount(end);
      }
    };

    requestAnimationFrame(updateCount);

    // Auto-dismiss: tampilkan lalu hilang
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  }, [active, amount, onComplete]);

  if (!active) return null;

  const getTierTitle = () => {
    switch (tier) {
      case 'EPIC_WIN':
        return '👑 EPIC WIN 👑';
      case 'MEGA_WIN':
        return '★★★ MEGA WIN ★★★';
      case 'SUPER_BIG_WIN':
        return '★★ SUPER BIG WIN ★★';
      case 'BIG_WIN':
        return '★ BIG WIN ★';
      case 'LEVEL_UP':
        return '⭐ STAGE UNLOCKED ⭐';
      default:
        return '★ BIG WIN ★';
    }
  };

  const formattedAmount =
    currency === 'IDR'
      ? `Rp ${displayedAmount.toLocaleString('id-ID')}`
      : `$${displayedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    /* TEPAT DI TENGAH BINGKAI - BERSIH TANPA GETAR, TANPA DENYUT, TANPA BACKDROP GLOW/KOIN 3D */
    <div
      onClick={onComplete}
      className="absolute inset-0 z-50 w-full h-full pointer-events-auto cursor-pointer flex items-center justify-center select-none p-3 animate-in fade-in duration-200"
      title="Ketuk untuk lewati"
    >
      {/* Papan Kemenangan Total Bersih (Static Solid Western Wooden Shield) */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[400px] rounded-2xl bg-gradient-to-b from-[#3a1c0b] via-[#241006] to-[#120602] border-2 border-[#d97706] shadow-[0_8px_30px_rgba(0,0,0,0.9)] px-5 py-4 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* 3D Golden Horseshoe at Top of Board */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
          <svg width="28" height="28" viewBox="0 0 32 32">
            <defs>
              <linearGradient id="horseshoeGoldClean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="30%" stopColor="#fbbf24" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            <path
              d="M 6, 26 C 4, 18 6, 6 16, 6 C 26, 6 28, 18 26, 26 L 21, 25 C 22, 18 20, 11 16, 11 C 12, 11 10, 18 11, 25 Z"
              fill="url(#horseshoeGoldClean)"
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

        {/* Content */}
        <div className="relative z-10 w-full mt-1">
          {/* Label Header */}
          <div className="text-[11px] sm:text-xs font-western font-bold text-amber-300 tracking-widest uppercase drop-shadow">
            KEMENANGAN TOTAL
          </div>

          {/* Tier Title */}
          <div className="text-sm sm:text-base font-western font-black text-[#fef08a] uppercase tracking-wider drop-shadow my-0.5">
            {getTierTitle()}
          </div>

          {/* Win Amount */}
          <div className="text-2xl sm:text-3xl font-western font-black text-gold-gradient tracking-wide tabular-nums my-1 drop-shadow-[0_2px_8px_rgba(245,197,66,0.85)]">
            +{formattedAmount}
          </div>

          {/* Tap to Skip Hint */}
          <div className="text-[9px] font-western text-amber-200/70 font-medium tracking-wider uppercase mt-1">
            Ketuk di mana saja untuk melewati
          </div>
        </div>
      </div>
    </div>
  );
};
