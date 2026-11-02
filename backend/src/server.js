import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { query } from './db.js';
import { authRequired, signToken, staffRequired } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = Number(process.env.PORT || 8788);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const STAFF_PASSWORD = process.env.STAFF_PASSWORD || 'blacklist2026';

const DEFAULT_STATE = {
  forces: [],
  unassignedMembers: [],
};

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN }));

async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id SMALLINT PRIMARY KEY DEFAULT 1,
      state_json JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_by TEXT,
      CONSTRAINT app_state_single_row CHECK (id = 1)
    );
  `);
}

async function ensureStateRow() {
  await query(
    `INSERT INTO app_state (id, state_json, updated_by)
     VALUES (1, $1::jsonb, 'system')
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(DEFAULT_STATE)],
  );
}

app.get('/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    return res.json({ ok: true, service: 'blacklist-backend' });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/auth/login', (req, res) => {
  const role = String(req.body?.role || 'viewer').toLowerCase();

  if (role === 'viewer') {
    const token = signToken({ role: 'viewer' });
    return res.json({ token, role: 'viewer' });
  }

  if (role === 'staff') {
    const password = String(req.body?.password || '');
    if (!password || password !== STAFF_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ role: 'staff' });
    return res.json({ token, role: 'staff' });
  }

  return res.status(400).json({ error: 'Invalid role' });
});

app.get('/api/state', authRequired, async (_req, res) => {
  try {
    await ensureStateRow();
    const result = await query('SELECT state_json, updated_at FROM app_state WHERE id = 1');
    const row = result.rows[0];
    return res.json({
      state: row?.state_json || DEFAULT_STATE,
      updatedAt: row?.updated_at || null,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/state', authRequired, staffRequired, async (req, res) => {
  try {
    const nextState = req.body?.state;
    if (!nextState || typeof nextState !== 'object') {
      return res.status(400).json({ error: 'Invalid state payload' });
    }

    await ensureStateRow();
    await query(
      `UPDATE app_state
       SET state_json = $1::jsonb, updated_at = NOW(), updated_by = $2
       WHERE id = 1`,
      [JSON.stringify(nextState), req.user.role],
    );

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  await initSchema();
  await ensureStateRow();

  app.listen(PORT, () => {
    console.log(`Blacklist backend listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});
