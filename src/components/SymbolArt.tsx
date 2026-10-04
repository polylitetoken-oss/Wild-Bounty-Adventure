import React from 'react';
import { SymbolId } from '../types/slot';

import cowgirlWildImg from '../assets/images/wild_cowgirl_sym.png';
import goldBarsScatterImg from '../assets/images/gold_bars_scatter.png';
import banditOutlawImg from '../assets/images/bandit_outlaw_sym.png';
import revolversPairImg from '../assets/images/revolvers_pair_sym.png';
import purpleHatImg from '../assets/images/purple_hat_sym.png';
import whiskeyDecanterImg from '../assets/images/whiskey_decanter_sym.png';

import letterAImg from '../assets/images/letter_a.png';
import letterKImg from '../assets/images/letter_k.png';
import letterQImg from '../assets/images/letter_q.png';
import letterJImg from '../assets/images/letter_j.png';

export interface SymbolArtProps {
  className?: string;
}

// 1. WILD: Cowgirl Wild
export const WildArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={cowgirlWildImg}
    alt="Cowgirl Wild"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

// 2. SCATTER: Gold Bars Scatter (Cloned from reference repo)
export const ScatterArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={goldBarsScatterImg}
    alt="Gold Bars Scatter"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

// 3. BANDIT: Outlaw Bandit
export const BanditArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={banditOutlawImg}
    alt="Outlaw Bandit"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

// 4. REVOLVERS: Dual Revolvers
export const RevolversArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={revolversPairImg}
    alt="Revolvers Holster"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

// 5. HAT: Cowboy Hat
export const HatArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={purpleHatImg}
    alt="Purple Cowboy Hat"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

// 6. WHISKEY: Whiskey Decanter
export const WhiskeyArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={whiskeyDecanterImg}
    alt="Whiskey Decanter"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

// 7. A: Golden Ace Letter (Cloned from reference repo)
export const AArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={letterAImg}
    alt="Letter A"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

// 8. K: Crimson King Letter (Cloned from reference repo)
export const KArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={letterKImg}
    alt="Letter K"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

// 9. Q: Queen Letter (Cloned from reference repo)
export const QArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={letterQImg}
    alt="Letter Q"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

// 10. J: Jack Letter (Cloned from reference repo)
export const JArt: React.FC<SymbolArtProps> = ({ className = 'w-full h-full' }) => (
  <img
    src={letterJImg}
    alt="Letter J"
    className={`${className} object-contain pointer-events-none select-none`}
    draggable={false}
  />
);

export const SYMBOL_ART_MAP: Record<SymbolId, React.FC<SymbolArtProps>> = {
  WILD: WildArt,
  SCATTER: ScatterArt,
  BANDIT: BanditArt,
  REVOLVERS: RevolversArt,
  HAT: HatArt,
  WHISKEY: WhiskeyArt,
  A: AArt,
  K: KArt,
  Q: QArt,
  J: JArt,
};
