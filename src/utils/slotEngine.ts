import {
  CascadeStep,
  GridTile,
  ShiftedTileInfo,
  SlotSymbol,
  SpinExecutionResult,
  SymbolId,
  WinningWay,
} from '../types/slot';

import cowgirlWildImg from '../assets/images/cowgirl_wild.png';
import outlawBanditImg from '../assets/images/outlaw_bandit.png';
import goldBarsScatterImg from '../assets/images/gold_bars_scatter.png';
import revolversHolsterImg from '../assets/images/revolvers_holster.png';
import whiskeyDecanterImg from '../assets/images/whiskey_decanter.png';
import purpleCowboyHatImg from '../assets/images/purple_cowboy_hat.png';
import letterAImg from '../assets/images/letter_a.png';
import letterKImg from '../assets/images/letter_k.png';
import letterQImg from '../assets/images/letter_q.png';
import letterJImg from '../assets/images/letter_j.png';

// 10 Original Game Asset PNGs
export const COWGIRL_WILD_IMG = cowgirlWildImg;
export const OUTLAW_BANDIT_IMG = outlawBanditImg;
export const GOLD_BARS_SCATTER_IMG = goldBarsScatterImg;
export const REVOLVERS_HOLSTER_IMG = revolversHolsterImg;
export const WHISKEY_DECANTER_IMG = whiskeyDecanterImg;
export const PURPLE_COWBOY_HAT_IMG = purpleCowboyHatImg;
export const LETTER_A_IMG = letterAImg;
export const LETTER_K_IMG = letterKImg;
export const LETTER_Q_IMG = letterQImg;
export const LETTER_J_IMG = letterJImg;

// Exact 3-4-5-5-4-3 Shield Grid: 24 tiles total
export const NUM_COLUMNS = 6;
export const MAX_ROWS = 5;
export const REEL_ROW_COUNTS = [3, 4, 5, 5, 4, 3] as const;

let globalTileCounter = 0;
export function nextTileId(): string {
  globalTileCounter++;
  return `tile_${Date.now()}_${globalTileCounter}_${Math.random().toString(36).substring(2, 6)}`;
}

export const SYMBOLS: Record<SymbolId, SlotSymbol> = {
  WILD: {
    id: 'WILD',
    name: 'Cowgirl Wild',
    payouts: [0, 0, 0], // Wild substitutes for the regular symbol with highest count
    isWild: true,
    color: '#F59E0B',
    image: COWGIRL_WILD_IMG,
  },
  SCATTER: {
    id: 'SCATTER',
    name: 'Gold Bars Scatter',
    payouts: [0, 0, 0], // 3+ Scatters award 10 Free Spins
    isScatter: true,
    color: '#EF4444',
    image: GOLD_BARS_SCATTER_IMG,
  },
  BANDIT: {
    id: 'BANDIT',
    name: 'Outlaw Bandit',
    payouts: [8, 20, 40], // 6-7, 8-9, 10+
    color: '#EF4444',
    image: OUTLAW_BANDIT_IMG,
  },
  REVOLVERS: {
    id: 'REVOLVERS',
    name: 'Dual Revolvers',
    payouts: [4, 10, 20],
    color: '#F59E0B',
    image: REVOLVERS_HOLSTER_IMG,
  },
  HAT: {
    id: 'HAT',
    name: 'Cowboy Hat',
    payouts: [2.5, 6, 12],
    color: '#A855F7',
    image: PURPLE_COWBOY_HAT_IMG,
  },
  WHISKEY: {
    id: 'WHISKEY',
    name: 'Saloon Whiskey',
    payouts: [1.5, 4, 8],
    color: '#D97706',
    image: WHISKEY_DECANTER_IMG,
  },
  A: {
    id: 'A',
    name: 'Golden Ace',
    payouts: [1.0, 2.0, 6],
    color: '#FBBF24',
    image: LETTER_A_IMG,
  },
  K: {
    id: 'K',
    name: 'Crimson King',
    payouts: [0.8, 1.5, 5],
    color: '#DC2626',
    image: LETTER_K_IMG,
  },
  Q: {
    id: 'Q',
    name: 'Sage Queen',
    payouts: [0.6, 1.2, 4],
    color: '#10B981',
    image: LETTER_Q_IMG,
  },
  J: {
    id: 'J',
    name: 'Frontier Jack',
    payouts: [0.4, 0.8, 3],
    color: '#3B82F6',
    image: LETTER_J_IMG,
  },
};

// Cryptographic RNG
export function getCryptoRandomFloat(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / 0x100000000;
  }
  return Math.random();
}

export function generateRandomHex(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function hashToFloat(hexString: string): number {
  const subHex = hexString.substring(0, 8);
  const intVal = parseInt(subHex, 16);
  return intVal / 0xffffffff;
}

// Level-based multiplier calculation:
// Level awal = 0.
// Level yang dicapai hold/persistent dan menjadi patokan dasar multiplier.
// Contoh: Level 2 -> multiplier dasar menggunakan Level 2.
// Level 0 -> multiplier dasar = 1.
export function getBaseMultiplier(level: number, isFreeSpins: boolean = false): number {
  const clamped = Math.max(0, Math.min(1000, level));
  if (isFreeSpins) {
    return Math.max(8, clamped);
  }
  return Math.max(1, clamped);
}

export interface LevelConfig {
  level: number;
  title: string;
  color: string;
}

export function getLevelConfig(level: number): LevelConfig {
  const clamped = Math.max(0, Math.min(1000, level));
  if (clamped === 0) {
    return { level: 0, title: 'Tumbleweed Rookie', color: '#94A3B8' };
  } else if (clamped === 1) {
    return { level: 1, title: 'Deputy Greenhorn', color: '#38BDF8' };
  } else if (clamped === 2) {
    return { level: 2, title: 'Frontier Gunslinger', color: '#F59E0B' };
  } else if (clamped === 3) {
    return { level: 3, title: 'Bounty Hunter', color: '#EC4899' };
  } else if (clamped === 4) {
    return { level: 4, title: 'Federal Marshal', color: '#EAB308' };
  } else if (clamped === 5) {
    return { level: 5, title: 'Wild Bounty Legend', color: '#F97316' };
  } else if (clamped <= 25) {
    return { level: clamped, title: `Outlaw Veteran Lvl ${clamped}`, color: '#F43F5E' };
  } else if (clamped <= 100) {
    return { level: clamped, title: `El Dorado Marshal Lvl ${clamped}`, color: '#EAB308' };
  } else {
    return { level: clamped, title: `Apex Sovereign Lvl ${clamped}`, color: '#EF4444' };
  }
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 0, title: 'Tumbleweed Rookie', color: '#94A3B8' },
  { level: 1, title: 'Deputy Greenhorn', color: '#38BDF8' },
  { level: 2, title: 'Frontier Gunslinger', color: '#F59E0B' },
  { level: 3, title: 'Bounty Hunter', color: '#EC4899' },
  { level: 4, title: 'Federal Marshal', color: '#EAB308' },
  { level: 5, title: 'Wild Bounty Legend', color: '#F97316' },
];

export const BASE_MULTIPLIERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const FREE_SPIN_MULTIPLIERS = [8, 9, 10, 11, 12, 13, 14, 15, 16];

// Cryptographically fair reel weights:
// - WILD TIDAK boleh turun dari RNG langsung (hanya muncul via ubin hexagonal/gold frame yang menang)
// - SCATTER weight: 3 (realistic frequency: 0, 1, 2 tease, 3+ free spins)
export const REEL_WEIGHTS: { symbol: SymbolId; weight: number }[] = [
  { symbol: 'J', weight: 26 },
  { symbol: 'Q', weight: 24 },
  { symbol: 'K', weight: 22 },
  { symbol: 'A', weight: 20 },
  { symbol: 'WHISKEY', weight: 16 },
  { symbol: 'HAT', weight: 14 },
  { symbol: 'REVOLVERS', weight: 12 },
  { symbol: 'BANDIT', weight: 10 },
  { symbol: 'SCATTER', weight: 3 }, // Cryptographic SCATTER
];

export function getRandomSymbol(seedFloat: number, _level: number): SymbolId {
  const totalWeight = REEL_WEIGHTS.reduce((acc, curr) => acc + curr.weight, 0);
  let threshold = seedFloat * totalWeight;

  for (const item of REEL_WEIGHTS) {
    if (threshold < item.weight) {
      return item.symbol;
    }
    threshold -= item.weight;
  }
  return 'J';
}

// Gold Frame Rule:
// - Hanya dapat muncul pada reel 3 (col 2) dan reel 4 (col 3).
// - WILD dan SCATTER tidak boleh menjadi Gold Frame.
// - Memiliki peluang RNG tersendiri (sekitar 20% per ubin pada reel 3 & 4).
// - Terkadang tidak ada, terkadang ada 1, terkadang beberapa.
export function shouldTileBeGoldFramed(col: number, symbol: SymbolId): boolean {
  if (col !== 2 && col !== 3) return false;
  if (symbol === 'WILD' || symbol === 'SCATTER') return false;
  return getCryptoRandomFloat() < 0.20;
}

// Check if two tiles are physically adjacent on the 3-4-5-5-4-3 shield grid
export function areTilesAdjacent(c1: number, r1: number, c2: number, r2: number): boolean {
  if (c1 === c2) {
    return Math.abs(r1 - r2) === 1;
  }
  if (Math.abs(c1 - c2) === 1) {
    const y1 = (5 - REEL_ROW_COUNTS[c1]) / 2 + r1;
    const y2 = (5 - REEL_ROW_COUNTS[c2]) / 2 + r2;
    return Math.abs(y1 - y2) <= 1.05;
  }
  return false;
}

// Generate an initial 3-4-5-5-4-3 shield grid (24 tiles total) using pure cryptographic RNG
// - Setiap tile dihasilkan secara independen oleh RNG kriptografi
// - Tanpa pola tetap
// - Peluang menang dan kalah terjadi secara natural
export function generateInitialTileGrid(level: number): GridTile[][] {
  const grid: GridTile[][] = [];
  for (let col = 0; col < NUM_COLUMNS; col++) {
    const rowCount = REEL_ROW_COUNTS[col];
    const colTiles: GridTile[] = [];
    for (let row = 0; row < rowCount; row++) {
      const symbol = getRandomSymbol(getCryptoRandomFloat(), level);
      const isGoldFramed = shouldTileBeGoldFramed(col, symbol);
      colTiles.push({
        id: nextTileId(),
        symbol,
        col,
        row,
        isGoldFramed,
      });
    }
    grid.push(colTiles);
  }
  return grid;
}

// Evaluate Winning Combinations on the Shield Grid:
// - Pay Anywhere (6+ simbol sama di mana saja pada papan)
// - ATAU Connected Cluster (5+ simbol berdekatan)
// - WILD menggantikan simbol biasa untuk melengkapi kemenangan
// - Bisa menghasilkan beberapa kelompok simbol yang menang dalam satu spin
// - Tidak membuat hasil spin selalu menang atau selalu pecah (kekalahan normal terjadi secara natural)
export function evaluatePayAnywhere(
  grid: GridTile[][],
  totalBet: number
): {
  winningWays: WinningWay[];
  totalPayout: number;
  winningTileIds: string[];
} {
  const regularSymbols: SymbolId[] = ['BANDIT', 'REVOLVERS', 'HAT', 'WHISKEY', 'A', 'K', 'Q', 'J'];
  const allTiles: GridTile[] = [];
  const wildTiles: GridTile[] = [];

  for (let col = 0; col < NUM_COLUMNS; col++) {
    const rowCount = REEL_ROW_COUNTS[col];
    for (let row = 0; row < rowCount; row++) {
      const tile = grid[col]?.[row];
      if (tile) {
        allTiles.push(tile);
        if (tile.symbol === 'WILD') {
          wildTiles.push(tile);
        }
      }
    }
  }

  const winningWays: WinningWay[] = [];
  const winningTileIdSet = new Set<string>();
  let totalPayout = 0;

  // Evaluasi setiap simbol biasa secara independen:
  // KETENTUAN CLUSTER BREAK:
  // - Hanya cluster simbol yang benar-benar terhubung secara valid yang boleh break.
  // - Simbol berbeda tidak boleh digabung menjadi satu cluster.
  // - 2 simbol saja DILARANG break (begitu pula 3 simbol; minimum cluster adalah 4 simbol).
  // - WILD tetap mengikuti aturan WILD yang ada (menghubungkan ubin cluster yang bersebelahan).
  // - Setiap cluster dihitung secara terpisah.
  // - Simbol yang tidak termasuk cluster valid TETAP berada di board dan tidak boleh ikut hilang.
  for (const sym of regularSymbols) {
    const symTiles = allTiles.filter((t) => t.symbol === sym);
    if (symTiles.length === 0) continue;

    // Kumpulan kandidat untuk simbol ini: hanya ubin sym dan ubin WILD
    const candidatePool = [...symTiles, ...wildTiles];
    const visitedSymTileIds = new Set<string>();

    for (const startTile of symTiles) {
      if (visitedSymTileIds.has(startTile.id)) continue;

      // Temukan seluruh ubin yang terhubung langsung atau tidak langsung dengan startTile
      const clusterTiles: GridTile[] = [startTile];
      const clusterTileIdSet = new Set<string>([startTile.id]);
      visitedSymTileIds.add(startTile.id);
      const queue: GridTile[] = [startTile];

      while (queue.length > 0) {
        const current = queue.shift()!;
        for (const candidate of candidatePool) {
          if (
            !clusterTileIdSet.has(candidate.id) &&
            areTilesAdjacent(current.col, current.row, candidate.col, candidate.row)
          ) {
            clusterTileIdSet.add(candidate.id);
            clusterTiles.push(candidate);
            queue.push(candidate);
            if (candidate.symbol === sym) {
              visitedSymTileIds.add(candidate.id);
            }
          }
        }
      }

      // Hitung jumlah simbol asli dalam cluster ini
      const regularCountInCluster = clusterTiles.filter((t) => t.symbol === sym).length;
      const totalClusterSize = clusterTiles.length;

      // SYARAT MUTLAK CLUSTER VALID SESUAI ATURAN RESMI PAYTABLE:
      // - Minimum cluster adalah >= 6 simbol (kategori 6-7, 8-9, 10+).
      // - 2, 3, 4, dan 5 simbol DILARANG KERAS break!
      // - Minimal memiliki setidaknya 4 simbol asli dalam cluster agar tidak mudah pecah.
      if (totalClusterSize >= 6 && regularCountInCluster >= 4) {
        const symConfig = SYMBOLS[sym];
        let payoutRate = 0;

        if (totalClusterSize >= 10) {
          payoutRate = symConfig.payouts[2];
        } else if (totalClusterSize >= 8) {
          payoutRate = symConfig.payouts[1];
        } else if (totalClusterSize >= 6) {
          payoutRate = symConfig.payouts[0];
        }

        const winAmount = totalBet * payoutRate;
        const clusterTileIds = clusterTiles.map((t) => t.id);
        clusterTileIds.forEach((id) => winningTileIdSet.add(id));
        totalPayout += winAmount;

        winningWays.push({
          symbol: sym,
          count: totalClusterSize,
          payout: winAmount,
          symbolPositions: clusterTiles.map((t) => ({ reel: t.col, row: t.row })),
          winningTileIds: clusterTileIds,
        });
      }
    }
  }

  return {
    winningWays,
    totalPayout,
    winningTileIds: Array.from(winningTileIdSet),
  };
}

// Full Cascade Step Engine for 24-tile Shield Grid:
// - Evaluates 6+ scatter-pays
// - Identifies exploded tiles
// - Surviving tiles fall down by gravity per column
// - Fresh tiles enter from above the frame with isNew: true
export function executeFullCascadeSpin(
  initialGrid: GridTile[][],
  totalBet: number,
  currentLevel: number,
  scattersCollected: number,
  isFreeSpins: boolean = false
): SpinExecutionResult {
  const steps: CascadeStep[] = [];
  // Clone grid of GridTiles
  let currentGrid: GridTile[][] = initialGrid.map((colTiles) =>
    colTiles.map((tile) => ({ ...tile }))
  );
  const baseLevelMultiplier = getBaseMultiplier(currentLevel, isFreeSpins);
  let cascadeIndex = 0;
  let totalWin = 0;
  let totalScatters = 0;
  const scatterPositions: { reel: number; row: number }[] = [];

  // Count initial scatters on the 24 tiles
  for (let col = 0; col < NUM_COLUMNS; col++) {
    const rowCount = REEL_ROW_COUNTS[col];
    for (let row = 0; row < rowCount; row++) {
      if (currentGrid[col]?.[row]?.symbol === 'SCATTER') {
        totalScatters++;
        scatterPositions.push({ reel: col, row });
      }
    }
  }

  while (cascadeIndex < 10) {
    const { winningWays, totalPayout, winningTileIds } = evaluatePayAnywhere(currentGrid, totalBet);

    // Multiplier Rules:
    // - Multiplier harus mengikuti winning event yang benar-benar terjadi.
    // - Jangan memberikan multiplier tinggi hanya karena ada WILD di grid yang tidak ikut pecah.
    // - Setiap peningkatan multiplier harus berasal dari hasil win/cascade yang benar-benar valid.
    // - Di mode Free Spins: multiplier aktif untuk setiap winning step (dimulai dari baseLevelMultiplier dan naik per cascade).
    // - Di mode Reguler: multiplier aktif jika ada WILD yang berpartisipasi dalam winning combination (hasWildInWinning).
    const hasWildInWinning = winningTileIds.some((id) => {
      for (const col of currentGrid) {
        for (const t of col) {
          if (t.id === id && t.symbol === 'WILD') return true;
        }
      }
      return false;
    });
    const hasWild = hasWildInWinning;

    const isMultiplierActive = isFreeSpins || hasWildInWinning;
    const stepMultiplier = baseLevelMultiplier + cascadeIndex;
    const appliedMultiplier = isMultiplierActive ? stepMultiplier : 1;
    const stepWin = Math.round(totalPayout * appliedMultiplier);
    totalWin += stepWin;

    // Snapshot current grid with isWinning flags marked
    const markedGrid: GridTile[][] = currentGrid.map((colTiles) =>
      colTiles.map((t) => ({
        ...t,
        isWinning: winningTileIds.includes(t.id),
      }))
    );

    const transformedTileIds: string[] = [];
    const explodedTiles: GridTile[] = [];

    currentGrid.forEach((colTiles) => {
      colTiles.forEach((t) => {
        if (winningTileIds.includes(t.id)) {
          if (t.isGoldFramed && t.symbol !== 'WILD' && t.symbol !== 'SCATTER') {
            transformedTileIds.push(t.id);
          } else {
            explodedTiles.push(t);
          }
        }
      });
    });

    if (winningWays.length === 0) {
      steps.push({
        grid: markedGrid,
        winningTileIds: [],
        winningWays: [],
        multiplier: isMultiplierActive ? stepMultiplier : baseLevelMultiplier,
        hasWild: false,
        stepWin: 0,
        scatterCount: cascadeIndex === 0 ? totalScatters : 0,
        scatterPositions: cascadeIndex === 0 ? scatterPositions : [],
        explodedTiles: [],
        shiftedTiles: [],
        newTiles: [],
        transformedTileIds: [],
      });
      break; // No wins, cascade ends
    }

    // CASCADE PHYSICS (Gravity per column):
    const nextGrid: GridTile[][] = [];
    const shiftedTiles: ShiftedTileInfo[] = [];
    const allNewTilesInStep: GridTile[] = [];

    for (let col = 0; col < NUM_COLUMNS; col++) {
      const colRowCount = REEL_ROW_COUNTS[col];
      // Ubin yang bertahan di kolom ini:
      // 1. Ubin yang TIDAK menang
      // 2. Ubin Gold Frame yang MENANG: berubah menjadi WILD di posisinya!
      const surviving: GridTile[] = [];
      for (const t of currentGrid[col]) {
        if (transformedTileIds.includes(t.id)) {
          // ALUR GOLD FRAME: ikut WIN -> berubah menjadi WILD untuk cascade berikutnya!
          surviving.push({
            ...t,
            symbol: 'WILD',
            isGoldFramed: false,
            transformedToWild: true,
            isWinning: false,
          });
        } else if (!winningTileIds.includes(t.id)) {
          surviving.push({
            ...t,
            isWinning: false,
            transformedToWild: false,
          });
        }
      }
      const neededCount = colRowCount - surviving.length;

      // Surviving tiles shift down by neededCount
      const updatedSurviving: GridTile[] = surviving.map((t, idx) => {
        const targetRow = neededCount + idx;
        if (t.row !== targetRow) {
          shiftedTiles.push({
            id: t.id,
            col,
            fromRow: t.row,
            toRow: targetRow,
          });
        }
        return {
          ...t,
          row: targetRow,
          isWinning: false,
          isNew: false,
        };
      });

      // New tiles entering from top of column using pure Cryptographic RNG
      const newColTiles: GridTile[] = [];
      for (let r = 0; r < neededCount; r++) {
        const newSymbol = getRandomSymbol(getCryptoRandomFloat(), currentLevel);
        const isGoldFramed = shouldTileBeGoldFramed(col, newSymbol);
        const newTile: GridTile = {
          id: nextTileId(),
          symbol: newSymbol,
          col,
          row: r,
          isWinning: false,
          isNew: true,
          isGoldFramed,
          transformedToWild: false,
        };
        newColTiles.push(newTile);
        allNewTilesInStep.push(newTile);
      }

      nextGrid.push([...newColTiles, ...updatedSurviving]);
    }

    steps.push({
      grid: markedGrid,
      winningTileIds,
      winningWays,
      multiplier: isMultiplierActive ? stepMultiplier : baseLevelMultiplier,
      hasWild,
      stepWin,
      scatterCount: cascadeIndex === 0 ? totalScatters : 0,
      scatterPositions: cascadeIndex === 0 ? scatterPositions : [],
      explodedTiles,
      shiftedTiles,
      newTiles: allNewTilesInStep,
      transformedTileIds,
    });

    currentGrid = nextGrid;
    cascadeIndex++;
  }

  // Count total scatters on currentGrid (which includes initial scatters + any new scatters from cascades)
  totalScatters = 0;
  scatterPositions.length = 0;
  for (let col = 0; col < NUM_COLUMNS; col++) {
    const rowCount = REEL_ROW_COUNTS[col];
    for (let row = 0; row < rowCount; row++) {
      if (currentGrid[col]?.[row]?.symbol === 'SCATTER') {
        totalScatters++;
        scatterPositions.push({ reel: col, row });
      }
    }
  }

  if (steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    lastStep.scatterCount = totalScatters;
    lastStep.scatterPositions = scatterPositions;
  }

  // Scatter & Free Spins Rule:
  // - Mode normal: 3 scatter = 10 free spin, tiap scatter tambahan = +2 free spin.
  // - Saat free spin berjalan: 3 atau lebih scatter hanya menambah 5 free spin (tetap 5).
  // - Scatter tambahan selama Free Spin tidak menaikkan Level.
  // - Level tidak naik dari spin biasa, win, cascade, atau multiplier.
  // - Level naik +1 hanya setelah seluruh Free Spin habis.
  let awardedFreeSpins = 0;

  if (totalScatters >= 3) {
    if (isFreeSpins) {
      awardedFreeSpins = 5; // Retrigger gives fixed 5 free spins; does NOT increment level
    } else {
      awardedFreeSpins = 10 + (totalScatters - 3) * 2;
    }
  }

  const maxMultiplierReached = baseLevelMultiplier + Math.max(0, cascadeIndex - 1);

  return {
    initialGrid,
    steps,
    totalWin,
    totalScatters,
    awardedFreeSpins,
    finalGrid: currentGrid,
    maxMultiplierReached,
    levelUpOccurred: false,
    newLevel: currentLevel,
  };
}
