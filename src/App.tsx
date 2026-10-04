import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Trophy,
  HelpCircle,
  Code,
  Volume2,
  VolumeX,
  Music,
  Wallet,
  Flame,
  X,
  Menu,
  Globe,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  SlidersHorizontal,
} from 'lucide-react';
import {
  GridTile,
  Transaction,
  LeaderboardEntry,
} from './types/slot';
import {
  NUM_COLUMNS,
  REEL_ROW_COUNTS,
  LEVEL_CONFIGS,
  getLevelConfig,
  getBaseMultiplier,
  generateInitialTileGrid,
  executeFullCascadeSpin,
  sha256,
  generateRandomHex,
} from './utils/slotEngine';
import { sound } from './utils/soundEngine';
import { Language, TRANSLATIONS } from './utils/translations';
import { WildBountyReels, WinAnimStage } from './components/WildBountyReels';
import { HangingMultiplierSign } from './components/HangingMultiplierSign';
import { HorseshoeMessageBanner } from './components/HorseshoeMessageBanner';
import { WildBountyControls } from './components/WildBountyControls';
import { ThreeWinCanvas, WinTier } from './components/ThreeWinCanvas';
import { ScatterCongratsModal } from './components/ScatterCongratsModal';
import { FreeSpinsTotalWinModal } from './components/FreeSpinsTotalWinModal';
import { SaloonSafeBonus } from './components/SaloonSafeBonus';
import { PaymentModal } from './components/PaymentModal';
import { ProvablyFairModal } from './components/ProvablyFairModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PaytableModal } from './components/PaytableModal';
import { NativeEngineModal } from './components/NativeEngineModal';
import { AutoSpinModal } from './components/AutoSpinModal';
import originalDesertBg from './assets/images/wild_bounty_banner_1791020853754.jpg';

// Bet Steps Ladder: 400 -> 600 (+200) -> x2 subsequent steps (1200, 2400, 4800, ...)
const BET_STEPS = [
  400,
  600,
  1200,
  2400,
  4800,
  9600,
  19200,
  38400,
  76800,
  153600,
  307200,
  614400,
  1228800,
];

export default function App() {
  // Language State (ID / EN)
  const [language, setLanguage] = useState<Language>('ID');
  const t = TRANSLATIONS[language] || TRANSLATIONS.ID;

  // Player Balance & Wallet
  const [balance, setBalance] = useState<number>(100000);
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('IDR');
  const [bet, setBet] = useState<number>(400);
  const [currentWin, setCurrentWin] = useState<number>(0);

  // Progressive Scatter Level: Level awal = 0, Hold/Persistent, Max 1000
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('wild_bounty_player_level');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return Math.max(0, Math.min(1000, parsed));
      }
    } catch {}
    return 0;
  });
  const [scattersCollected, setScattersCollected] = useState<number>(0);

  // Free Spins State
  const [isFreeSpins, setIsFreeSpins] = useState<boolean>(false);
  const [remainingFreeSpins, setRemainingFreeSpins] = useState<number>(0);
  const [totalFreeSpinsSession, setTotalFreeSpinsSession] = useState<number>(10);
  const [freeSpinsTotalWon, setFreeSpinsTotalWon] = useState<number>(0);
  const [freeSpinsSummaryBanner, setFreeSpinsSummaryBanner] = useState<{
    active: boolean;
    totalWon: number;
  } | null>(null);
  const [freeSpinsTotalWinModal, setFreeSpinsTotalWinModal] = useState<{
    active: boolean;
    totalWon: number;
  } | null>(null);

  // Scatter Congratulations Popup State
  const [showScatterCongrats, setShowScatterCongrats] = useState<boolean>(false);
  const [scatterCongratsAwarded, setScatterCongratsAwarded] = useState<number>(10);

  // Active Multiplier based on Level
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('wild_bounty_player_level');
      const lvl = saved !== null ? parseInt(saved, 10) : 0;
      return getBaseMultiplier(isNaN(lvl) ? 0 : lvl, false);
    } catch {
      return 1;
    }
  });
  const [hasWildWin, setHasWildWin] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('BAYAR DI MANA SAJA!');

  // Uniform 6x5 Grid of GridTiles using Cryptographic RNG
  const [grid, setGrid] = useState<GridTile[][]>(() => generateInitialTileGrid(0));
  const [winningTileIds, setWinningTileIds] = useState<string[]>([]);
  const [winAnimStage, setWinAnimStage] = useState<WinAnimStage>('IDLE');
  const [isSpinExiting, setIsSpinExiting] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isCascading, setIsCascading] = useState<boolean>(false);

  // Controls & Options
  const [isTurbo, setIsTurbo] = useState<boolean>(false);
  const [autoSpinsRemaining, setAutoSpinsRemaining] = useState<number>(0);
  const autoRemainingRef = useRef<number>(0);
  const scatterHitStepRef = useRef<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Provably Fair Real RNG Seeds
  const [serverSeed, setServerSeed] = useState<string>(() => generateRandomHex(32));
  const [serverSeedHash, setServerSeedHash] = useState<string>('');
  const [clientSeed, setClientSeed] = useState<string>('wild-bounty-player-2026');
  const [nonce, setNonce] = useState<number>(1);
  const [lastRevealedServerSeed, setLastRevealedServerSeed] = useState<string | null>(null);

  // Modals & Menu
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [paymentTab, setPaymentTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'HISTORY'>('DEPOSIT');
  const [showFairness, setShowFairness] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showPaytable, setShowPaytable] = useState<boolean>(false);
  const [showNativeSpecs, setShowNativeSpecs] = useState<boolean>(false);
  const [showSafeBonus, setShowSafeBonus] = useState<boolean>(false);
  const [showAutoSpinModal, setShowAutoSpinModal] = useState<boolean>(false);

  // Bet Stepping Handlers (Min 400 -> 600 (+200) -> x2 steps up to 1.2M)
  const handleIncreaseBet = () => {
    setBet((prev) => {
      const idx = BET_STEPS.indexOf(prev);
      if (idx !== -1 && idx < BET_STEPS.length - 1) {
        return BET_STEPS[idx + 1];
      }
      if (prev < 400) return 400;
      if (prev === 400) return 600;
      return Math.min(1228800, prev * 2);
    });
  };

  const handleDecreaseBet = () => {
    setBet((prev) => {
      const idx = BET_STEPS.indexOf(prev);
      if (idx > 0) {
        return BET_STEPS[idx - 1];
      }
      if (prev === 600) return 400;
      if (prev > 600) return Math.max(400, Math.floor(prev / 2));
      return 400;
    });
  };

  const handleSelectAutoSpins = (count: number) => {
    setShowAutoSpinModal(false);
    autoRemainingRef.current = count;
    setAutoSpinsRemaining(count);
    // 2. AUTO SPIN JEDA AWAL: Berikan jeda singkat agar UI Auto Spin terlihat aktif terlebih dahulu sebelum spin pertama
    setTimeout(() => {
      if (autoRemainingRef.current > 0 && !isSpinning && !isCascading) {
        handleSpin();
      }
    }, 800);
  };

  // Win Celebration Canvas State & Pause-Resume Resolver
  const [winCelebration, setWinCelebration] = useState<{
    active: boolean;
    tier: WinTier;
    amount: number;
  }>({ active: false, tier: 'BIG_WIN', amount: 0 });
  const winCelebrationResolverRef = useRef<(() => void) | null>(null);

  const handleWinCelebrationComplete = () => {
    setWinCelebration((prev) => ({ ...prev, active: false }));
    if (winCelebrationResolverRef.current) {
      const resolve = winCelebrationResolverRef.current;
      winCelebrationResolverRef.current = null;
      resolve();
    }
  };

  const showWinPopupAndWait = (tier: WinTier, amount: number): Promise<void> => {
    return new Promise((resolve) => {
      winCelebrationResolverRef.current = resolve;
      setWinCelebration({ active: true, tier, amount });
      sound.playWin(true);
    });
  };

  // Transactions Ledger
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TX-DEP-884920',
      type: 'DEPOSIT',
      method: 'QRIS Instant Transfer',
      amount: 100000,
      currency: 'IDR',
      timestamp: Date.now() - 1800000,
      status: 'COMPLETED',
      reference: 'GW-SECURE-9182AB',
    },
  ]);

  // Global Leaderboard Mock Entries
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, playerName: 'Gunslinger_Tex', country: 'US 🇺🇸', biggestWin: 38400, level: 5, multiplier: 35.0, timestamp: '10m ago' },
    { rank: 2, playerName: 'BanditQueen_ID', country: 'ID 🇮🇩', biggestWin: 29500, level: 5, multiplier: 35.0, timestamp: '24m ago' },
    { rank: 3, playerName: 'ElDorado_MX', country: 'MX 🇲🇽', biggestWin: 18200, level: 4, multiplier: 15.0, timestamp: '1h ago' },
    { rank: 4, playerName: 'You (Bounty Hunter)', country: 'ID 🇮🇩', biggestWin: 4800, level: 1, multiplier: 8.0, timestamp: 'Just now', isCurrentPlayer: true },
  ]);

  // Pre-calculate SHA-256 Server Seed Hash for Provably Fair
  useEffect(() => {
    sha256(serverSeed).then((hash) => setServerSeedHash(hash));
  }, [serverSeed]);

  // Sync player persistent level with server and localStorage
  const updatePersistentLevel = (newLvl: number) => {
    const clamped = Math.max(0, Math.min(1000, newLvl));
    setCurrentLevel(clamped);
    try {
      localStorage.setItem('wild_bounty_player_level', String(clamped));
    } catch {}
    fetch('/api/player/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: clamped }),
    }).catch(() => {});
  };

  useEffect(() => {
    fetch('/api/player/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.level === 'number') {
          const localSaved = localStorage.getItem('wild_bounty_player_level');
          const localVal = localSaved !== null ? parseInt(localSaved, 10) : 0;
          const bestLevel = Math.max(0, Math.min(1000, Math.max(data.level, isNaN(localVal) ? 0 : localVal)));
          setCurrentLevel(bestLevel);
          setCurrentMultiplier(getBaseMultiplier(bestLevel, isFreeSpins));
          try {
            localStorage.setItem('wild_bounty_player_level', String(bestLevel));
          } catch {}
        }
      })
      .catch(() => {});
  }, [isFreeSpins]);

  // Built-in Gameplay BGM State
  const [isMusicActive, setIsMusicActive] = useState<boolean>(false);

  // Subscribe to SoundEngine BGM changes
  useEffect(() => {
    const unsub = sound.subscribeBgmState((state) => {
      setIsMusicActive(state.isPlaying);
    });
    return () => unsub();
  }, []);

  // Auto-start BGM on user first gesture/interaction in game with seamless continuous repeat
  useEffect(() => {
    const handleFirstGesture = () => {
      sound.unlockAudio();
      if (!isMuted) {
        sound.startCowboyBGM();
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });
    window.addEventListener('click', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [isMuted]);

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (next && isMusicActive) {
      setIsMusicActive(false);
    }
  };

  // Toggle Cowboy Saloon BGM
  const handleToggleMusic = () => {
    if (isMuted) {
      setIsMuted(false);
      sound.setMuted(false);
    }
    const playing = sound.toggleBGM();
    setIsMusicActive(playing);
  };

  // CORE SPIN FUNCTION
  const handleSpin = async () => {
    if (isSpinning || isCascading || showScatterCongrats) return;
    if (!isFreeSpins && balance < bet) {
      autoRemainingRef.current = 0;
      setAutoSpinsRemaining(0);
      setShowPayment(true);
      return;
    }

    // PERBAIKAN 6: Setiap putaran auto: angka sisa berkurang 1 TEPAT saat putaran dimulai (sebelum animasi keluar)
    if (!isFreeSpins && autoRemainingRef.current > 0) {
      autoRemainingRef.current -= 1;
      setAutoSpinsRemaining(autoRemainingRef.current);
    }

    // Decrement free spins if in Free Spins mode
    if (isFreeSpins) {
      const nextRemaining = Math.max(0, remainingFreeSpins - 1);
      setRemainingFreeSpins(nextRemaining);
      const currentSpinNum = Math.max(1, totalFreeSpinsSession - nextRemaining);
      setStatusMessage(`${t.freeSpin} ${currentSpinNum} / ${totalFreeSpinsSession}`);
    } else {
      setBalance((prev) => prev - bet);
      setStatusMessage(t.payAnywhere);
    }

    // PERBAIKAN 7: Reset scatter hit step count for this spin
    scatterHitStepRef.current = 0;

    setCurrentWin(0);
    setWinningTileIds([]);
    setWinAnimStage('IDLE');
    setHasWildWin(false);
    setIsSpinning(true);
    setCurrentMultiplier(getBaseMultiplier(currentLevel, isFreeSpins));

    // Direct continuous downward roll through the frame
    setIsSpinExiting(false);
    if (isTurbo) {
      sound.playTurboTumble();
    } else {
      sound.playCowboySpin();
    }

    const newGrid = generateInitialTileGrid(currentLevel);
    const enteringGrid: GridTile[][] = newGrid.map((colTiles) =>
      colTiles.map((t) => ({ ...t, isNew: true }))
    );
    setGrid(enteringGrid);

    // Landing timing synchronized with visual drop cadence:
    // Mode Turbo: Turun serentak super cepat, mendarat pada 150ms
    // Mode Normal: Jatuh berurutan dari kiri ke kanan (delay c * 80ms + descent 440ms)
    if (isTurbo) {
      setTimeout(() => {
        sound.playReelStop(false);
        let turboScatters = 0;
        enteringGrid.forEach((col) => {
          col.forEach((t) => {
            if (t.isNew && t.symbol === 'SCATTER') turboScatters++;
          });
        });
        for (let s = 0; s < turboScatters; s++) {
          sound.playCashRegisterCring(scatterHitStepRef.current);
          scatterHitStepRef.current = Math.min(6, scatterHitStepRef.current + 1);
        }
      }, 150);
    } else {
      [0, 1, 2, 3, 4, 5].forEach((c) => {
        const colScatters = enteringGrid[c].filter(
          (t) => t.isNew && t.symbol === 'SCATTER'
        ).length;
        const colLandingTime = c * 80 + 440;
        setTimeout(() => {
          sound.playReelStop(false);
          for (let s = 0; s < colScatters; s++) {
            sound.playCashRegisterCring(scatterHitStepRef.current);
            scatterHitStepRef.current = Math.min(6, scatterHitStepRef.current + 1);
          }
        }, colLandingTime);
      });
    }

    // Allow full smooth descent animation to finish settling seamlessly
    const settleDuration = isTurbo ? 200 : 920;
    setTimeout(() => {
      // Clear isNew flag and start cascade evaluation
      const settledGrid: GridTile[][] = enteringGrid.map((colTiles) =>
        colTiles.map((t) => ({ ...t, isNew: false, dropRows: 0 }))
      );
      setGrid(settledGrid);

      const result = executeFullCascadeSpin(
        settledGrid,
        bet,
        currentLevel,
        scattersCollected,
        isFreeSpins
      );

      animateCascadeSteps(settledGrid, result);
    }, settleDuration);
  };

  // Sequential Cascade Tumble Animation:
  // (a) membesar ke 1.2 dalam 0.25s (turbo 0.12s) dengan ring emas
  // (b) tahan sekitar 0.15s (turbo 0.08s) - jika Big Win, jeda/pause hingga popup selesai!
  // (c) pecah bersamaan ke 0 dengan partikel emas dalam 0.25s (turbo 0.12s)
  // (d) jatuh serentak mengisi kekosongan (0.35s, turbo 0.2s)
  const animateCascadeSteps = (
    currentGridState: GridTile[][],
    result: ReturnType<typeof executeFullCascadeSpin>
  ) => {
    const { steps, totalWin, totalScatters, awardedFreeSpins } = result;
    let stepIndex = 0;
    let runningGrid = currentGridState;
    let hasShownMidCascadeWinPopup = false;

    const playNextStep = async () => {
      if (stepIndex >= steps.length) {
        // All cascades of this spin complete
        setIsSpinning(false);
        setIsCascading(false);
        setWinningTileIds([]);
        setWinAnimStage('IDLE');

        // Advance Provably Fair nonce & server seed
        setLastRevealedServerSeed(serverSeed);
        setServerSeed(generateRandomHex(32));
        setNonce((n) => n + 1);

        // Win calculation per spin
        if (totalWin > 0) {
          setBalance((prev) => prev + totalWin);
          setCurrentWin(totalWin);
          if (isFreeSpins) {
            setFreeSpinsTotalWon((prev) => prev + totalWin);
          }
          setStatusMessage(`KEMENANGAN TOTAL ${currency === 'IDR' ? 'Rp ' : '$'}${totalWin.toLocaleString()}!`);

          // 1. TINGKAT KEMENANGAN TOTAL (Jika belum ditampilkan saat cascade step)
          const winRatio = totalWin / bet;
          if (winRatio >= 10 && !hasShownMidCascadeWinPopup) {
            let finalTier: WinTier = 'BIG_WIN';
            if (winRatio >= 100) finalTier = 'EPIC_WIN';
            else if (winRatio >= 50) finalTier = 'MEGA_WIN';
            else if (winRatio >= 25) finalTier = 'SUPER_BIG_WIN';

            // Win popup harus selesai terlebih dahulu sebelum putaran berikutnya atau auto spin dilanjutkan
            await showWinPopupAndWait(finalTier, totalWin);
          } else {
            sound.playWin(false);
          }
        } else {
          setStatusMessage(isFreeSpins ? 'MULTIPLIER BERKELIPATAN' : 'MULTIPLIER DOUBLES AFTER');
        }

        // 3. SCATTER POPUP (HANYA 1 POPUP, TIDAK DOUBLE)
        const boardScatterCount = runningGrid.reduce(
          (acc, col) => acc + col.filter((t) => t.symbol === 'SCATTER').length,
          0
        );
        const effectiveScatters = Math.max(totalScatters, boardScatterCount);
        let effectiveAwardedFreeSpins = awardedFreeSpins;
        if (effectiveAwardedFreeSpins === 0 && effectiveScatters >= 3) {
          effectiveAwardedFreeSpins = isFreeSpins ? 5 : 10 + (effectiveScatters - 3) * 2;
        }

        if (effectiveAwardedFreeSpins > 0) {
          const triggerScatterSequence = () => {
            const scatterIds: string[] = [];
            runningGrid.forEach((col) => {
              col.forEach((t) => {
                if (t.symbol === 'SCATTER') scatterIds.push(t.id);
              });
            });
            setWinningTileIds(scatterIds);
            setWinAnimStage('EXPANDING');

            sound.playScatterFanfare();
            setScattersCollected((prev) => prev + effectiveScatters);

            setTimeout(() => {
              setScatterCongratsAwarded(effectiveAwardedFreeSpins);
              setShowScatterCongrats(true);
            }, 600);
          };

          triggerScatterSequence();
          return;
        } else if (effectiveScatters > 0) {
          setScattersCollected((prev) => prev + effectiveScatters);
        }

        // Check if Free Spins ended
        if (isFreeSpins && remainingFreeSpins <= 1) {
          const finalWon = freeSpinsTotalWon + totalWin;
          setFreeSpinsTotalWinModal({ active: true, totalWon: finalWon });
          setStatusMessage(`TOTAL MENANG: ${currency === 'IDR' ? 'Rp ' : '$'}${finalWon.toLocaleString()}`);
          return;
        }

        // Normal Auto-Spin loop: Jalankan setelah popup selesai
        if (!isFreeSpins && autoRemainingRef.current > 0) {
          setTimeout(() => {
            if (autoRemainingRef.current > 0 && balance >= bet) {
              handleSpin();
            } else {
              autoRemainingRef.current = 0;
              setAutoSpinsRemaining(0);
            }
          }, isTurbo ? 200 : 700);
        }

        return;
      }

      const currentStep = steps[stepIndex];
      setCurrentMultiplier(currentStep.multiplier);
      const isWildStep = !!currentStep.hasWild && currentStep.multiplier > 1;
      setHasWildWin(isWildStep || (isFreeSpins && currentStep.multiplier > 1));

      if (currentStep.winningWays.length > 0) {
        setIsCascading(true);
        setWinningTileIds(currentStep.winningTileIds);

        // Rangkaian 4 Suara Tembakan Nyata: Tembakan 1 → Tembakan 2 → Tembakan 3 → Tembakan 4
        sound.playGunshot(0);
        setTimeout(() => sound.playGunshot(1), isTurbo ? 45 : 130);
        setTimeout(() => sound.playGunshot(2), isTurbo ? 90 : 260);
        setTimeout(() => sound.playGunshot(3), isTurbo ? 135 : 390);

        const clusterParts = currentStep.winningWays.map((w) => `${w.count} ${w.symbol}`).join(' + ');
        if (isFreeSpins && currentStep.multiplier > 1) {
          setStatusMessage(`${clusterParts} (FS X${currentStep.multiplier}) +${currency === 'IDR' ? 'Rp ' : '$'}${currentStep.stepWin.toLocaleString()}`);
        } else if (isWildStep) {
          setStatusMessage(`${clusterParts} (WILD X${currentStep.multiplier}) +${currency === 'IDR' ? 'Rp ' : '$'}${currentStep.stepWin.toLocaleString()}`);
        } else {
          setStatusMessage(`${clusterParts} +${currency === 'IDR' ? 'Rp ' : '$'}${currentStep.stepWin.toLocaleString()}`);
        }

        // (a) 4 SHOT MARKS (Shot 1 → Shot 2 → Shot 3 → Shot 4)
        setWinAnimStage('EXPANDING');
        const expandTime = isTurbo ? 200 : 540;

        setTimeout(async () => {
          // (b) SHORT PAUSE: 4 lubang peluru mengepul asap sebelum meledak
          setWinAnimStage('HOLD');

          // 1. WIN POPUP HARUS MENGHENTIKAN SPIN:
          // Jika step ini menghasilkan Big Win (>= 10x bet):
          // Pause cascade dan tunggu hingga Win Popup selesai terlebih dahulu!
          const stepWinRatio = currentStep.stepWin / bet;
          if (stepWinRatio >= 10) {
            let stepTier: WinTier = 'BIG_WIN';
            if (stepWinRatio >= 100) stepTier = 'EPIC_WIN';
            else if (stepWinRatio >= 50) stepTier = 'MEGA_WIN';
            else if (stepWinRatio >= 25) stepTier = 'SUPER_BIG_WIN';

            hasShownMidCascadeWinPopup = true;
            await showWinPopupAndWait(stepTier, currentStep.stepWin);
          }

          const holdTime = isTurbo ? 80 : 200;

          setTimeout(() => {
            // (c) EXPLOSION: Simbol pecah menjadi koin emas & serpihan + asap mesiu
            setWinAnimStage('SHATTERING');
            const shatterTime = isTurbo ? 180 : 420;

            setTimeout(() => {
              // (c2) JEDA RUANG KOSONG (EMPTY GAP):
              // Hapus simbol yang pecah, sedangkan ubin Gold Frame yang menang bertransformasi menjadi WILD!
              const transformedIdSet = new Set(currentStep.transformedTileIds || []);
              const winningIdSet = new Set(
                currentStep.winningTileIds.filter((id) => !transformedIdSet.has(id))
              );
              const clearedGrid: GridTile[][] = runningGrid.map((colTiles) =>
                colTiles
                  .filter((t) => !winningIdSet.has(t.id))
                  .map((t) => {
                    if (transformedIdSet.has(t.id)) {
                      return {
                        ...t,
                        symbol: 'WILD',
                        isGoldFramed: false,
                        transformedToWild: true,
                        isWinning: false,
                      };
                    }
                    return t;
                  })
              );
              runningGrid = clearedGrid;
              setGrid(clearedGrid);
              setWinningTileIds([]);
              setWinAnimStage('IDLE');
              setHasWildWin(false);

              const pauseAfterShatter = isTurbo ? 50 : 160;

              setTimeout(() => {
                // (d) NEW SYMBOL DROP: SIMBOL BARU & BERGESER MULAI TURUN DARI ATAS MENGISI RUANG KOSONG
                const nextSourceGrid = steps[stepIndex + 1]?.grid ?? result.finalGrid;
                const newTileIdSet = new Set(currentStep.newTiles.map((t) => t.id));

                const shiftedMap = new Map<string, number>();
                currentStep.shiftedTiles.forEach((s) => {
                  shiftedMap.set(s.id, s.toRow - s.fromRow);
                });

                const newCountByCol = new Map<number, number>();
                currentStep.newTiles.forEach((t) => {
                  newCountByCol.set(t.col, (newCountByCol.get(t.col) || 0) + 1);
                });

                const nextGrid: GridTile[][] = nextSourceGrid.map((colTiles, cIdx) =>
                  colTiles.map((t) => {
                    let dropRows = 0;
                    if (newTileIdSet.has(t.id)) {
                      dropRows = newCountByCol.get(cIdx) || 1;
                    } else if (shiftedMap.has(t.id)) {
                      dropRows = shiftedMap.get(t.id) || 0;
                    }
                    return {
                      ...t,
                      isWinning: false,
                      isNew: newTileIdSet.has(t.id),
                      dropRows,
                    };
                  })
                );

                runningGrid = nextGrid;
                setGrid(nextGrid);
                if (isTurbo) {
                  sound.playTurboTumble();
                } else {
                  sound.playCoin();
                }

                // Suara scatter saat mendarat pada cascade tumble
                const tumbleDuration = isTurbo ? 140 : 320;
                setTimeout(() => {
                  let scatterLanded = false;
                  nextGrid.forEach((col) => {
                    col.forEach((t) => {
                      if (t.isNew && t.symbol === 'SCATTER') {
                        scatterLanded = true;
                      }
                    });
                  });
                  if (scatterLanded) {
                    sound.playCashRegisterCring(scatterHitStepRef.current);
                    scatterHitStepRef.current = Math.min(6, scatterHitStepRef.current + 1);
                  }
                }, tumbleDuration);

                // (e) SIMBOL MENDARAT PENUH + JEDA DIAM SEBELUM EVALUASI CASCADE BERIKUTNYA
                const tumbleDropWait = isTurbo ? 180 : 540;
                setTimeout(() => {
                  const settled = runningGrid.map((colTiles) =>
                    colTiles.map((t) => ({ ...t, isNew: false, dropRows: 0 }))
                  );
                  runningGrid = settled;
                  setGrid(settled);

                  stepIndex++;
                  playNextStep();
                }, tumbleDropWait);
              }, pauseAfterShatter);
            }, shatterTime);
          }, holdTime);
        }, expandTime);
      } else {
        stepIndex++;
        playNextStep();
      }
    };

    playNextStep();
  };

  // 5. FREE SPIN AUTO RUN LOOP
  useEffect(() => {
    if (
      isFreeSpins &&
      remainingFreeSpins > 0 &&
      !isSpinning &&
      !isCascading &&
      !showScatterCongrats &&
      !freeSpinsTotalWinModal &&
      !winCelebration.active &&
      !freeSpinsSummaryBanner
    ) {
      const delay = isTurbo ? 400 : 800;
      const timer = setTimeout(() => {
        handleSpin();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [
    isFreeSpins,
    remainingFreeSpins,
    isSpinning,
    isCascading,
    showScatterCongrats,
    freeSpinsTotalWinModal,
    winCelebration.active,
    freeSpinsSummaryBanner,
    isTurbo,
  ]);

  // Handler when Scatter Congrats Popup closes:
  // 3. SCATTER POPUP JANGAN DOUBLE: Langsung jalankan Free Spins tanpa popup kedua/duplikat
  const handleScatterCongratsClose = () => {
    setShowScatterCongrats(false);
    setWinningTileIds([]);
    setWinAnimStage('IDLE');

    sound.playScatterFanfare();

    if (!isFreeSpins) {
      setIsFreeSpins(true);
      setRemainingFreeSpins(scatterCongratsAwarded);
      setTotalFreeSpinsSession(scatterCongratsAwarded);
      setFreeSpinsTotalWon(0);
      setStatusMessage(`FREE SPIN 1 / ${scatterCongratsAwarded}`);
    } else {
      setRemainingFreeSpins((prev) => prev + scatterCongratsAwarded);
      setTotalFreeSpinsSession((prev) => prev + scatterCongratsAwarded);
      setStatusMessage(`RETRIGGER! +${scatterCongratsAwarded} FREE SPINS!`);
    }
  };

  const handleFreeSpinsTotalWinComplete = () => {
    setFreeSpinsTotalWinModal(null);
    setIsFreeSpins(false);
    setRemainingFreeSpins(0);
    setFreeSpinsTotalWon(0);

    // Setelah seluruh Free Spin habis, Level naik +1 (Level maksimum = 1000)
    const nextLevel = Math.min(1000, currentLevel + 1);
    updatePersistentLevel(nextLevel);
    setCurrentMultiplier(getBaseMultiplier(nextLevel, false));
    sound.playScatterFanfare();
    setStatusMessage(`LEVEL UP! LEVEL ${nextLevel} TERCAPAI (MULTIPLIER DASAR X${getBaseMultiplier(nextLevel, false)})`);
  };

  const handleDepositSuccess = (amount: number, tx: Transaction) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleWithdrawSuccess = (amount: number, tx: Transaction) => {
    setBalance((prev) => Math.max(0, prev - amount));
    setTransactions((prev) => [tx, ...prev]);
  };

  const currentLevelConfig = getLevelConfig(currentLevel);

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0e0704] text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black overflow-hidden relative font-sans">
      {/* POPUP SELAMAT SAAT SCATTER (Emas Batangan, 3s auto countdown atau klik START) */}
      {showScatterCongrats && (
        <ScatterCongratsModal
          freeSpinsAwarded={scatterCongratsAwarded}
          onClose={handleScatterCongratsClose}
          language={language}
        />
      )}

      {/* GRAND TOTAL KEMENANGAN FREE SPIN MODAL (Animasi hitung tung-tung-tung, tap to finish) */}
      {freeSpinsTotalWinModal?.active && (
        <FreeSpinsTotalWinModal
          totalWon={freeSpinsTotalWinModal.totalWon}
          currency={currency}
          onComplete={handleFreeSpinsTotalWinComplete}
          language={language}
        />
      )}

      {/* COMPACT FREE SPINS SUMMARY BANNER AT COMPLETION */}
      {freeSpinsSummaryBanner && (
        <div
          onClick={() => setFreeSpinsSummaryBanner(null)}
          className="fixed top-12 sm:top-14 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[380px] pointer-events-auto cursor-pointer animate-in slide-in-from-top-4 select-none"
        >
          <div className="relative rounded-2xl bg-gradient-to-b from-[#3a1d0d] via-[#241107] to-[#120703] border-2 border-amber-400 p-3 text-center shadow-2xl">
            <div className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
              🏆 TOTAL KEMENANGAN FREE SPIN 🏆
            </div>
            <div className="text-xl sm:text-2xl font-western font-black text-gold-gradient my-0.5">
              +{currency === 'IDR' ? 'Rp ' : '$'}{freeSpinsSummaryBanner.totalWon.toLocaleString()}
            </div>
            <div className="text-[9px] text-stone-400">Kembali ke mode permainan normal</div>
          </div>
        </div>
      )}

      {/* Original Western Canyon Background from repository */}
      <div
        className="fixed inset-0 pointer-events-none opacity-90 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${originalDesertBg})`,
        }}
      />

      {/* FREE SPINS ACTIVE 3D GOLDEN BORDER & SHOWDOWN LIGHTING */}
      {isFreeSpins && (
        <div className="fixed inset-0 pointer-events-none z-10 border-4 border-amber-400/40 shadow-[inset_0_0_60px_rgba(245,197,66,0.3)] animate-pulse" />
      )}

      {/* 4. COMPACT HEADER (Western Title ONLY) */}
      <header className="relative z-30 px-3 py-1.5 bg-[#120804]/90 border-b border-[#523015] flex items-center justify-center backdrop-blur-sm max-w-[560px] sm:max-w-[580px] mx-auto w-full shrink-0">
        <h1 className="font-western text-lg sm:text-xl font-black text-gold-gradient tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center">
          {t.title}
        </h1>
      </header>

      {/* 3. MAIN GAME CONTAINER (Expanded width approaching screen edges with balanced height) */}
      <main className="relative z-20 flex-1 min-h-0 flex flex-col items-center justify-between sm:justify-evenly px-0.5 sm:px-1 py-0.5 max-w-[560px] sm:max-w-[580px] mx-auto w-full overflow-hidden">
        {/* Top Hanging Wooden Multiplier Sign */}
        <div className="w-full shrink-0">
          <HangingMultiplierSign
            currentMultiplier={currentMultiplier}
            isFreeSpins={isFreeSpins}
          />
        </div>

        {/* 6-Pointed Sheriff Star Badge Box Grid (Bingkai Utama) */}
        <div className="w-full shrink-0 relative flex items-center justify-center my-0.5">
          <WildBountyReels
            grid={grid}
            winningTileIds={winningTileIds}
            winAnimStage={winAnimStage}
            isSpinExiting={isSpinExiting}
            isTurbo={isTurbo}
            isCascading={isCascading}
            isFreeSpins={isFreeSpins}
            remainingFreeSpins={remainingFreeSpins}
            hasWildWin={hasWildWin}
            currentMultiplier={currentMultiplier}
          />

          {/* Papan Kemenangan Total / Celebration Overlay TEPAT DI TENGAH BINGKAI */}
          {winCelebration.active && (
            <ThreeWinCanvas
              active={winCelebration.active}
              tier={winCelebration.tier}
              amount={winCelebration.amount}
              currency={currency}
              onComplete={handleWinCelebrationComplete}
            />
          )}
        </div>

        {/* Plakat Status Message / Sisa Spin - TEPAT SEBAGAI PANGKUAN BINGKAI ATAS */}
        <div className="w-full shrink-0 relative flex items-center justify-center -mt-3.5 sm:-mt-4.5 z-20">
          <HorseshoeMessageBanner
            message={statusMessage}
            isFreeSpins={isFreeSpins}
            remainingFreeSpins={remainingFreeSpins}
            currentWin={currentWin}
            currency={currency}
            language={language}
          />
        </div>

        {/* CONTROLS DOCK: UNIFIED LEVEL + BALANCE/BET/WIN PANEL & CONTROLS */}
        <div className="w-full shrink-0 pt-0.5">
          <WildBountyControls
            balance={balance}
            bet={bet}
            win={currentWin}
            currency={currency}
            language={language}
            isSpinning={isSpinning || isCascading}
            isTurbo={isTurbo}
            autoSpinsRemaining={autoSpinsRemaining}
            isFreeSpins={isFreeSpins}
            remainingFreeSpins={remainingFreeSpins}
            currentLevel={currentLevel}
            currentLevelTitle={currentLevelConfig.title}
            baseMultiplier={getBaseMultiplier(currentLevel, isFreeSpins)}
            onToggleTurbo={() => setIsTurbo((t) => !t)}
            onDecreaseBet={handleDecreaseBet}
            onIncreaseBet={handleIncreaseBet}
            onSpin={handleSpin}
            onToggleAuto={() => {
              if (isFreeSpins) return;
              if (autoSpinsRemaining > 0) {
                setAutoSpinsRemaining(0);
              } else {
                setShowAutoSpinModal(true);
              }
            }}
            onOpenMenu={() => setShowMenu(true)}
          />
        </div>
      </main>

      {/* 4. FULL HAMBURGER MENU (Deposit, Withdraw, History Tx, Setting: Sound Nyala/Mati ONLY & Western Font) */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none font-western">
          <div className="w-84 sm:w-92 bg-[#1c0e07] border-l-2 border-[#824c20] p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto font-western">
            <div className="space-y-3.5">
              {/* Menu Title Bar */}
              <div className="flex items-center justify-between border-b border-[#523015] pb-2.5">
                <span className="font-western text-lg font-black text-gold-gradient tracking-wide">{t.menuTitle}</span>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. DEPOSIT & WITHDRAW & HISTORY TX ACTIONS */}
              <div className="grid grid-cols-2 gap-2">
                {/* Deposit Button */}
                <button
                  onClick={() => {
                    setPaymentTab('DEPOSIT');
                    setShowPayment(true);
                    setShowMenu(false);
                  }}
                  className="p-3 rounded-2xl bg-gradient-to-b from-[#2a451e] via-[#1c3014] to-[#12200c] border-2 border-emerald-500/80 text-emerald-300 hover:border-emerald-400 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-lg group font-western"
                >
                  <ArrowDownLeft className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-western font-black tracking-wide uppercase">{t.deposit}</span>
                </button>

                {/* Withdraw Button */}
                <button
                  onClick={() => {
                    setPaymentTab('WITHDRAW');
                    setShowPayment(true);
                    setShowMenu(false);
                  }}
                  className="p-3 rounded-2xl bg-gradient-to-b from-[#4a2e12] via-[#2f1b0a] to-[#1a0e05] border-2 border-amber-500/80 text-amber-300 hover:border-amber-400 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-lg group font-western"
                >
                  <ArrowUpRight className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-western font-black tracking-wide uppercase">{t.withdraw}</span>
                </button>
              </div>

              {/* History Tx Button (Full Width displaying Tx Withdraw dan Deposit) */}
              <button
                onClick={() => {
                  setPaymentTab('HISTORY');
                  setShowPayment(true);
                  setShowMenu(false);
                }}
                className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#6b3a16] text-amber-300 hover:border-amber-400 flex items-center justify-between px-3 cursor-pointer transition-all active:scale-95 shadow-sm font-western"
              >
                <div className="flex items-center gap-2.5 font-western">
                  <div className="p-1.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-800">
                    <History className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-left font-western">
                    <div className="text-xs font-western font-bold text-stone-100">{t.historyTx}</div>
                    <div className="text-[10px] font-western text-stone-400">{t.historyDesc}</div>
                  </div>
                </div>
                <span className="text-[10px] font-western font-bold px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-amber-400">
                  {transactions.length}
                </span>
              </button>

              {/* 2. SETTING SECTION (Single Sound Nyala/Mati, Language EN/ID, Currency) */}
              <div className="p-3 rounded-2xl bg-[#221208] border border-[#523015] space-y-2.5 font-western">
                <div className="text-xs font-western font-black text-gold-gradient tracking-wider uppercase border-b border-[#3d200d] pb-1">
                  ⚙️ {t.settings}
                </div>

                <div className="grid grid-cols-1 gap-2 font-western">
                  {/* Single Sound On/Off (Nyala/Mati) Button */}
                  <button
                    onClick={handleToggleMute}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer shadow-sm active:scale-95 font-western ${
                      isMuted
                        ? 'bg-stone-900/90 border-stone-700 text-stone-400'
                        : 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,197,66,0.3)]'
                    }`}
                    title={isMuted ? t.soundOff : t.soundOn}
                  >
                    <div className="flex items-center gap-2 font-western">
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-stone-400 shrink-0" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="text-xs font-western font-bold uppercase">
                        {t.sound}
                      </span>
                    </div>
                    <span className={`text-xs font-western font-black px-2.5 py-0.5 rounded ${
                      isMuted
                        ? 'bg-stone-800 text-stone-400'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {isMuted ? (language === 'ID' ? 'MATI' : 'OFF') : (language === 'ID' ? 'NYALA' : 'ON')}
                    </span>
                  </button>
                </div>

                {/* Secondary Option: Language & Currency */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-western">
                  <button
                    onClick={() => {
                      const nextLang: Language = language === 'ID' ? 'EN' : 'ID';
                      setLanguage(nextLang);
                      sound.playBetChange();
                    }}
                    className="py-2 px-2.5 rounded-xl bg-[#2e170a] border border-[#7a421e] text-xs font-western font-bold text-amber-200 hover:border-amber-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Switch Language / Ganti Bahasa"
                  >
                    <Globe className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span className="font-western">{language === 'ID' ? '🇮🇩 ID' : '🇺🇸 EN'}</span>
                  </button>

                  <button
                    onClick={() => setCurrency((c) => (c === 'IDR' ? 'USD' : 'IDR'))}
                    className="py-2 px-2.5 rounded-lg bg-[#2a160c] border border-[#5a3014] text-xs font-western font-bold text-amber-300 hover:border-amber-400 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="font-western">{currency}</span>
                  </button>
                </div>
              </div>

              {/* Current Level & Scatter Progression Card */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/60 to-[#291408] border border-amber-600/50 space-y-2 font-western">
                <div className="flex items-center justify-between font-western">
                  <div className="text-xs font-western font-bold text-amber-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-500" />
                    <span>{t.level} {currentLevel}: {currentLevelConfig.title}</span>
                  </div>
                  <span className="text-[10px] font-western px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    BASE X{getBaseMultiplier(currentLevel, false)}
                  </span>
                </div>
                <div className="text-[10px] font-western text-amber-200/90 leading-relaxed">
                  {language === 'ID'
                    ? `Level ${currentLevel} hold/persistent • Patokan multiplier dasar X${getBaseMultiplier(currentLevel, false)} • Naik +1 setelah seluruh Free Spin habis (Maks. 1000)`
                    : `Level ${currentLevel} persistent • Base multiplier X${getBaseMultiplier(currentLevel, false)} • Level +1 after all Free Spins end (Max 1000)`}
                </div>
              </div>

              {/* Game Feature Modals */}
              <div className="space-y-1.5 text-xs font-western">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowFairness(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-western font-semibold cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-western">{t.provablyFair}</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowLeaderboard(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-western font-semibold cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="font-western">{t.leaderboard}</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowPaytable(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-western font-semibold cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span className="font-western">{t.paytable}</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowSafeBonus(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-western font-semibold cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="font-western">{t.safeBonus}</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowNativeSpecs(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-western font-semibold cursor-pointer"
                >
                  <Code className="w-4 h-4 text-purple-400" />
                  <span className="font-western">{t.specs}</span>
                </button>
              </div>
            </div>

            <div className="text-[10.5px] font-western text-stone-400 text-center border-t border-[#523015] pt-2.5 mt-3">
              {t.footerText}
            </div>
          </div>
        </div>
      )}

      {/* Saloon Safe Vault Heist Bonus */}
      {showSafeBonus && (
        <SaloonSafeBonus
          currentBet={bet}
          currentLevel={currentLevel}
          onFinish={(winAmt) => {
            setBalance((prev) => prev + winAmt);
            setWinCelebration({ active: true, tier: 'MEGA_WIN', amount: winAmt });
          }}
          onClose={() => setShowSafeBonus(false)}
        />
      )}

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        currentBalance={balance}
        currency={currency}
        language={language}
        onDepositSuccess={handleDepositSuccess}
        onWithdrawSuccess={handleWithdrawSuccess}
        transactions={transactions}
        initialTab={paymentTab}
      />

      {/* Provably Fair Modal */}
      <ProvablyFairModal
        isOpen={showFairness}
        onClose={() => setShowFairness(false)}
        serverSeedHash={serverSeedHash}
        clientSeed={clientSeed}
        nonce={nonce}
        lastRevealedServerSeed={lastRevealedServerSeed}
        onUpdateClientSeed={(newSeed) => setClientSeed(newSeed)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        entries={leaderboard}
        playerBestWin={4800}
        playerLevel={currentLevel}
      />

      {/* Paytable Modal */}
      <PaytableModal
        isOpen={showPaytable}
        onClose={() => setShowPaytable(false)}
        currentLevel={currentLevel}
      />

      {/* Native SDK Specs Modal */}
      <NativeEngineModal
        isOpen={showNativeSpecs}
        onClose={() => setShowNativeSpecs(false)}
      />

      {/* Auto Spin Selection Modal (10, 30, 50, 80, 800) */}
      <AutoSpinModal
        isOpen={showAutoSpinModal}
        onClose={() => setShowAutoSpinModal(false)}
        onSelectAutoSpins={handleSelectAutoSpins}
        language={language}
      />
    </div>
  );
}
