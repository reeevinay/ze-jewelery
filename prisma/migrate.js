#!/usr/bin/env node
/**
 * Aurelius Jewelry — Database Migration Runner
 *
 * Usage:
 *   node prisma/migrate.js
 *
 * Reads DATABASE_URL from .env.local and runs prisma/schema.sql
 * Uses the `postgres` npm package which supports multi-statement queries
 * including PL/pgSQL function bodies correctly.
 */

const fs   = require('fs');
const path = require('path');

// ─── Load .env.local ──────────────────────────────────────────────────────────
try {
  const envPath = path.join(__dirname, '../.env.local');
  const envFile = fs.readFileSync(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) process.env[key] = val;
  }
} catch {
  // .env.local not found — rely on shell environment
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('');
  console.error('❌  DATABASE_URL is not set.');
  console.error('    Add it to .env.local:');
  console.error('    DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require');
  console.error('');
  process.exit(1);
}

// ─── Split SQL correctly, handling PL/pgSQL $$ blocks ────────────────────────
/**
 * Splits a SQL file into individual statements without breaking on semicolons
 * inside dollar-quoted PL/pgSQL bodies ($$...$$).
 */
function splitStatements(sql) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let i = 0;

  while (i < sql.length) {
    // Detect start/end of $$ dollar-quoting
    if (sql[i] === '$' && sql[i + 1] === '$') {
      inDollarQuote = !inDollarQuote;
      current += '$$';
      i += 2;
      continue;
    }

    // Only split on ; when outside a dollar-quoted block
    if (sql[i] === ';' && !inDollarQuote) {
      const stmt = current.trim();
      // Skip pure comment blocks or empty strings
      const withoutComments = stmt.replace(/--[^\n]*/g, '').trim();
      if (withoutComments.length > 0) {
        statements.push(stmt);
      }
      current = '';
      i++;
      continue;
    }

    current += sql[i];
    i++;
  }

  // Catch any trailing statement without a final semicolon
  const trailing = current.trim();
  if (trailing.replace(/--[^\n]*/g, '').trim().length > 0) {
    statements.push(trailing);
  }

  return statements;
}

// ─── Run migration ────────────────────────────────────────────────────────────
async function migrate() {
  // Dynamically require postgres — installed as a project dependency
  let postgres;
  try {
    postgres = require('postgres');
  } catch {
    console.error('');
    console.error('❌  Could not load the `postgres` package.');
    console.error('    Run:  npm install  (from the project root)');
    console.error('');
    process.exit(1);
  }

  const sql = postgres(dbUrl, {
    ssl: dbUrl.includes('sslmode=require') ? 'require' : false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15,
    onnotice: () => {}, // suppress NOTICE messages
  });

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql  = fs.readFileSync(schemaPath, 'utf-8');
  const statements = splitStatements(schemaSql);

  console.log('');
  console.log('🚀  Aurelius Jewelry — running database migration…');
  console.log(`    ${statements.length} statements to execute`);
  console.log('');

  let executed = 0;
  for (const stmt of statements) {
    // Show a short preview of what we're running
    const preview = stmt.replace(/\s+/g, ' ').slice(0, 60);
    process.stdout.write(`    ⟳  ${preview}…`);

    try {
      await sql.unsafe(stmt);
      process.stdout.write(' ✓\n');
      executed++;
    } catch (err) {
      process.stdout.write(' ✗\n');
      console.error('');
      console.error(`❌  Statement failed:`);
      console.error(`    ${stmt.slice(0, 200)}`);
      console.error('');
      console.error(`    Error: ${err.message}`);
      console.error('');
      await sql.end();
      process.exit(1);
    }
  }

  await sql.end();

  console.log('');
  console.log('✅  Migration complete!');
  console.log('');
  console.log('    Tables created:');
  console.log('      • customers');
  console.log('      • products');
  console.log('      • orders');
  console.log('      • order_items');
  console.log('');
  console.log('    Indexes + triggers installed.');
  console.log('    2 sample products inserted (rings + necklaces).');
  console.log('');
  console.log('    Next: npm run dev');
  console.log('');
}

migrate().catch((err) => {
  console.error('❌  Unexpected error:', err.message);
  process.exit(1);
});
