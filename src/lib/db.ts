import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Single connection pool shared across the app.
// In serverless (Vercel/Neon) each function invocation is short-lived,
// so we keep max=10 and a short idle_timeout.
const sql = postgres(process.env.DATABASE_URL, {
  ssl: process.env.DATABASE_URL.includes('sslmode=require') ? 'require' : false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 15,
  prepare: false, // required for Neon's HTTP proxy / pgBouncer
});

export default sql;
