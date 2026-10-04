import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { SlotSymbolGraphic } from './SlotSymbolGraphic';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ScatterCongratsModalProps {
  freeSpinsAwarded: number;
  onClose: () => void;
  language?: Language;
}

export const ScatterCongratsModal: React.FC<ScatterCongratsModalProps> = ({
  freeSpinsAwarded,
  onClose,
  language = 'ID',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ID;
  const isID = language === 'ID';
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3);
  const closedRef = React.useRef(false);

  const handleStart = React.useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    onClose();
  }, [onClose]);

  // 3-second auto-start countdown
  useEffect(() => {
    if (secondsRemaining <= 0) {
      handleStart();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsRemaining, handleStart]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Western Carved Gold-Wood Popup Card */}
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#3a1d0d] via-[#241107] to-[#120703] border-[3px] border-[#f5c542] p-6 text-center shadow-[0_16px_50px_rgba(0,0,0,0.95),inset_0_2px_12px_rgba(245,197,66,0.5)] animate-in zoom-in-95 duration-200">
        {/* Gold Bars Scatter Icon with Radiant Aura */}
        <div className="relative mx-auto w-24 h-24 mb-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-300/60 to-amber-500/40 blur-xl animate-pulse" />
          <div className="relative">
            <SlotSymbolGraphic symbolId="SCATTER" className="w-20 h-20 drop-shadow-[0_4px_24px_rgba(245,197,66,1)]" isWinning={true} />
          </div>
        </div>

        {/* Title: SELAMAT! / CONGRATULATIONS! */}
        <div className="text-[11px] font-western font-bold uppercase tracking-widest text-amber-400 mb-0.5">
          ★ {t.congratsScatter} ★
        </div>

        {/* Main Title */}
        <h3 className="font-western text-2xl sm:text-3xl font-black text-gold-gradient tracking-wide mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          {t.scatterWon}
        </h3>

        {/* Amount Awarded */}
        <div className="p-3 my-2 rounded-2xl bg-gradient-to-r from-amber-950/90 via-stone-900/95 to-amber-950/90 border-2 border-amber-500/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="text-[11px] font-western text-stone-300">
            {isID ? 'ANDA MEMPEROLEH' : 'YOU WON'}
          </div>
          <div className="text-3xl sm:text-4xl font-western font-black text-gold-gradient tracking-wide drop-shadow-[0_4px_12px_rgba(245,197,66,0.85)] my-1">
            {freeSpinsAwarded} {isID ? 'FREE SPINS' : 'FREE SPINS'}
          </div>
          <div className="text-[10px] text-amber-300/90 font-medium">
            {isID ? 'Multiplier Dimulai dari X8!' : 'Multiplier starts at 8X!'}
          </div>
        </div>

        {/* START BUTTON with 3s Auto-Start Indicator */}
        <div className="mt-4 pt-1">
          <button
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-[#78350f] border-2 border-yellow-200 text-stone-950 font-western font-black text-lg sm:text-xl tracking-wider shadow-[0_6px_20px_rgba(245,197,66,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            <Play className="w-5 h-5 fill-stone-950 group-hover:scale-110 transition-transform" />
            <span>START ({secondsRemaining}s)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
