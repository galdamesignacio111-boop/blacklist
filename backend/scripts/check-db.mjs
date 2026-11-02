import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  const tableResult = await pool.query("SELECT to_regclass('public.app_state') AS table_name");
  const tableName = tableResult.rows[0]?.table_name;

  if (!tableName) {
    console.log(JSON.stringify({ table: null, rows: 0, meta: null }, null, 2));
    process.exit(0);
  }

  const countResult = await pool.query('SELECT COUNT(*)::int AS count FROM app_state');
  const metaResult = await pool.query('SELECT updated_at, updated_by FROM app_state WHERE id = 1');

  console.log(JSON.stringify({
    table: tableName,
    rows: countResult.rows[0]?.count ?? 0,
    meta: metaResult.rows[0] || null,
  }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
