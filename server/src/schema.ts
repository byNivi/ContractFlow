// Idempotent DDL. Safe to run on every boot.
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS contracts (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL DEFAULT 'Agreement',
  status        TEXT NOT NULL DEFAULT 'Active',
  risk          TEXT NOT NULL DEFAULT 'Low',
  compliance    INTEGER NOT NULL DEFAULT 90,
  updated       TEXT NOT NULL DEFAULT '',
  clauses_detected INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clauses (
  id           TEXT PRIMARY KEY,
  contract_id  TEXT REFERENCES contracts(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  party        TEXT NOT NULL DEFAULT '',
  deadline     TEXT NOT NULL DEFAULT '',
  risk         TEXT NOT NULL DEFAULT 'Low',
  status       TEXT NOT NULL DEFAULT 'Active',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id           TEXT PRIMARY KEY,
  contract_id  TEXT REFERENCES contracts(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  owner        TEXT NOT NULL DEFAULT '',
  due          TEXT NOT NULL DEFAULT '',
  priority     TEXT NOT NULL DEFAULT 'Medium',
  status       TEXT NOT NULL DEFAULT 'Pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id          TEXT PRIMARY KEY,
  time        TEXT NOT NULL DEFAULT '',
  event       TEXT NOT NULL,
  actor       TEXT NOT NULL DEFAULT 'ContractFlow AI',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integrations (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  kind        TEXT NOT NULL DEFAULT '',
  connected   BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS approvals (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  recommendation TEXT NOT NULL DEFAULT '',
  risk           TEXT NOT NULL DEFAULT 'Medium',
  reason         TEXT NOT NULL DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'Awaiting Approval'
);
`;
