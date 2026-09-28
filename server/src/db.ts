import pg from "pg";
import { DATABASE_URL, PG_SSL } from "./config.js";
import { SCHEMA_SQL } from "./schema.js";
import * as seed from "./data.js";

export const pool: pg.Pool | null = DATABASE_URL
  ? new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: PG_SSL ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })
  : null;

let dbUp = false;
export const isDbUp = () => dbUp;

async function seedIfEmpty() {
  if (!pool) return;
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM contracts");
  if (rows[0].n > 0) return;

  await pool.query("BEGIN");
  try {
    for (const c of seed.contracts) {
      await pool.query(
        `INSERT INTO contracts (id,name,type,status,risk,compliance,updated,clauses_detected)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
        [c.id, c.name, c.type, c.status, c.risk, c.compliance, c.updated, c.clauses_detected]
      );
    }
    for (const cl of seed.clauses) {
      await pool.query(
        `INSERT INTO clauses (id,contract_id,type,party,deadline,risk,status)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
        [cl.id, cl.contract_id, cl.type, cl.party, cl.deadline, cl.risk, cl.status]
      );
    }
    for (const t of seed.tasks) {
      await pool.query(
        `INSERT INTO tasks (id,contract_id,title,owner,due,priority,status)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
        [t.id, t.contract_id, t.title, t.owner, t.due, t.priority, t.status]
      );
    }
    for (const a of seed.audit) {
      await pool.query(
        `INSERT INTO audit_events (id,time,event,actor,created_at)
         VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
        [a.id, a.time, a.event, a.actor, a.created_at]
      );
    }
    for (const i of seed.integrations) {
      await pool.query(
        `INSERT INTO integrations (id,name,kind,connected)
         VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`,
        [i.id, i.name, i.kind, i.connected]
      );
    }
    for (const ap of seed.approvals) {
      await pool.query(
        `INSERT INTO approvals (id,title,recommendation,risk,reason,status)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
        [ap.id, ap.title, ap.recommendation, ap.risk, ap.reason, ap.status]
      );
    }
    await pool.query("COMMIT");
    console.log("[db] seeded initial dataset");
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
}

export async function initDb() {
  if (!pool) {
    dbUp = false;
    console.warn("[db] DATABASE_URL not set — running in in-memory fallback mode.");
    return;
  }
  try {
    await pool.query(SCHEMA_SQL);
    await seedIfEmpty();
    await pool.query("SELECT 1");
    dbUp = true;
    console.log("[db] PostgreSQL connected — database is the source of truth.");
  } catch (err: any) {
    dbUp = false;
    console.warn(`[db] PostgreSQL unavailable (${err?.message}). Using in-memory fallback so the demo still works.`);
  }
}
