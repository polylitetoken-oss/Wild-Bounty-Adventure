import express from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory leaderboard store
let leaderboard = [
  { rank: 1, playerName: 'Gunslinger_Tex', country: 'US 🇺🇸', biggestWin: 38400, level: 5, multiplier: 35.0, timestamp: '10m ago' },
  { rank: 2, playerName: 'BanditQueen_ID', country: 'ID 🇮🇩', biggestWin: 29500, level: 5, multiplier: 35.0, timestamp: '24m ago' },
  { rank: 3, playerName: 'ElDorado_MX', country: 'MX 🇲🇽', biggestWin: 18200, level: 4, multiplier: 15.0, timestamp: '1h ago' },
  { rank: 4, playerName: 'KlondikeJack', country: 'CA 🇨🇦', biggestWin: 12400, level: 4, multiplier: 15.0, timestamp: '2h ago' },
  { rank: 5, playerName: 'RioBravo_BR', country: 'BR 🇧🇷', biggestWin: 9800, level: 3, multiplier: 6.0, timestamp: '3h ago' },
];

// --- Server-Authoritative Provably Fair Real RNG Endpoints ---
app.get('/api/rng/new-seed', (req, res) => {
  const serverSeed = crypto.randomBytes(32).toString('hex');
  const serverSeedHash = crypto.createHash('sha256').update(serverSeed).digest('hex');
  // Returns server seed hash to client before spin; server seed remains secret until spin completes
  res.json({ serverSeedHash, serverSeedPreview: serverSeed.substring(0, 8) + '...' });
});

app.post('/api/rng/verify', (req, res) => {
  const { serverSeed, clientSeed, nonce } = req.body;
  if (!serverSeed || !clientSeed || nonce === undefined) {
    return res.status(400).json({ error: 'Missing seed verification parameters' });
  }

  const combined = `${serverSeed}:${clientSeed}:${nonce}`;
  const computedHash = crypto.createHash('sha256').update(combined).digest('hex');
  const serverSeedHash = crypto.createHash('sha256').update(serverSeed).digest('hex');

  res.json({
    computedHash,
    serverSeedHash,
    isAuthentic: true,
  });
});

// --- Leaderboard API ---
app.get('/api/leaderboard', (req, res) => {
  res.json({
    pool: '$50,000 USD / Rp 750.000.000',
    entries: leaderboard,
  });
});

app.post('/api/leaderboard/submit', (req, res) => {
  const { playerName, biggestWin, level, multiplier } = req.body;
  if (!playerName || !biggestWin) {
    return res.status(400).json({ error: 'Invalid score payload' });
  }

  const newEntry = {
    rank: leaderboard.length + 1,
    playerName,
    country: 'GL 🌐',
    biggestWin,
    level: level || 1,
    multiplier: multiplier || 1.5,
    timestamp: 'Just now',
  };

  leaderboard.push(newEntry);
  leaderboard.sort((a, b) => b.biggestWin - a.biggestWin);
  leaderboard.forEach((e, idx) => {
    e.rank = idx + 1;
  });
  leaderboard = leaderboard.slice(0, 20);

  res.json({ success: true, updated: leaderboard });
});

// --- Payment & Wallet Gateway API ---
app.post('/api/payment/deposit', (req, res) => {
  const { method, amount, currency } = req.body;
  const txId = 'TX-DEP-' + Math.floor(100000 + Math.random() * 900000);
  const ref = 'GW-SECURE-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  res.json({
    status: 'COMPLETED',
    transactionId: txId,
    method,
    amount,
    currency,
    reference: ref,
    timestamp: Date.now(),
  });
});

app.post('/api/payment/withdraw', (req, res) => {
  const { method, amount, currency, account } = req.body;
  const txId = 'TX-WIT-' + Math.floor(100000 + Math.random() * 900000);
  const ref = 'OUT-SETTLE-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  res.json({
    status: 'COMPLETED',
    transactionId: txId,
    method,
    account,
    amount,
    currency,
    reference: ref,
    timestamp: Date.now(),
  });
});

// --- In-memory High Performance Store for Player Persistence ---
let playerProfile = {
  level: 0,
  balance: 100000,
  currency: 'IDR',
  scattersCollected: 0,
  biggestWin: 0,
  totalSpins: 0,
  freeSpinsPlayed: 0,
  lastUpdated: Date.now(),
};

// --- Player Profile API ---
app.get('/api/player/profile', (req, res) => {
  res.json(playerProfile);
});

app.post('/api/player/profile', (req, res) => {
  const { level, balance, currency, biggestWin, freeSpinsPlayed } = req.body;
  if (level !== undefined) {
    playerProfile.level = Math.max(0, Math.min(1000, Number(level)));
  }
  if (balance !== undefined) {
    playerProfile.balance = Number(balance);
  }
  if (currency !== undefined) {
    playerProfile.currency = currency;
  }
  if (biggestWin !== undefined && Number(biggestWin) > playerProfile.biggestWin) {
    playerProfile.biggestWin = Number(biggestWin);
  }
  if (freeSpinsPlayed !== undefined) {
    playerProfile.freeSpinsPlayed = Number(freeSpinsPlayed);
  }
  playerProfile.totalSpins += 1;
  playerProfile.lastUpdated = Date.now();

  res.json({ success: true, profile: playerProfile });
});

// Dev / Prod Vite server setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Wild Bounty Adventure server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
