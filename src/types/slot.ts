export type SymbolId =
  | 'WILD'
  | 'SCATTER'
  | 'BANDIT'
  | 'REVOLVERS'
  | 'HAT'
  | 'WHISKEY'
  | 'A'
  | 'K'
  | 'Q'
  | 'J';

export interface SlotSymbol {
  id: SymbolId;
  name: string;
  payouts: [number, number, number]; // 6-7, 8-9, 10+ symbols anywhere
  isWild?: boolean;
  isScatter?: boolean;
  color: string;
  image?: string;
  art?: React.ComponentType<{ className?: string }>;
}

export interface GridTile {
  id: string; // Unique persistent ID, used as React key
  symbol: SymbolId;
  col: number; // 0 to 5
  row: number; // 0 to 4
  isWinning?: boolean;
  isNew?: boolean; // True if just dropped into the column during tumble
  dropRows?: number; // Exact number of rows this tile drops during cascade tumble
  isGoldFramed?: boolean; // Special Gold Frame on Reels 3 & 4 with potential to transform into WILD
  transformedToWild?: boolean; // True when gold framed symbol just converted into WILD after winning
}

export interface WinningWay {
  symbol: SymbolId;
  count: number; // 6-7, 8-9, 10+
  payout: number;
  symbolPositions: { reel: number; row: number }[];
  winningTileIds: string[];
}

export interface ShiftedTileInfo {
  id: string;
  col: number;
  fromRow: number;
  toRow: number;
}

export interface CascadeStep {
  grid: GridTile[][];
  winningTileIds: string[];
  winningWays: WinningWay[];
  multiplier: number;
  hasWild?: boolean;
  stepWin: number;
  scatterCount: number;
  scatterPositions: { reel: number; row: number }[];
  explodedTiles: GridTile[];
  shiftedTiles: ShiftedTileInfo[];
  newTiles: GridTile[];
  transformedTileIds?: string[]; // IDs of Gold Frame tiles that transformed into WILD
}

export interface SpinExecutionResult {
  initialGrid: GridTile[][];
  steps: CascadeStep[];
  totalWin: number;
  totalScatters: number;
  awardedFreeSpins: number;
  finalGrid: GridTile[][];
  maxMultiplierReached: number;
  levelUpOccurred: boolean;
  newLevel: number;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BONUS_RELOAD';
  method: string;
  amount: number;
  currency: 'USD' | 'IDR';
  timestamp: number;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING';
  reference: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  country: string;
  biggestWin: number;
  level: number;
  multiplier: number;
  timestamp: string;
  isCurrentPlayer?: boolean;
}
