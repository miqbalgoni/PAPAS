const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const ws = require('ws');

// In a real TypeScript project, we'd be able to import this directly
// For now, we'll define a minimal schema structure for basic functionality
const schema = {};

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Create a convenience wrapper that includes direct pool access for raw queries
const dbWithQueries = {
  ...db,
  query: (text, params) => pool.query(text, params)
};

module.exports = {
  pool,
  db: dbWithQueries
};