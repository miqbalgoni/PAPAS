require('dotenv').config();
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');

// Since we can't directly require TypeScript files, we'll create the schema directly here
// These should match what's in shared/schema.ts
const schema = {};

async function main() {
  console.log('Initializing database connection...');
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('Pushing schema to database...');
  const db = drizzle(pool, { schema });
  
  try {
    // This would normally use migrations, but for simplicity we're using direct schema push
    // In a production app, you should use proper migrations
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS public;
    `);
    
    // Push schema tables
    await pool.query(`
      -- Create users table
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(100) NOT NULL UNIQUE,
        "email" VARCHAR(100) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "preferred_language" VARCHAR(10) NOT NULL DEFAULT 'english',
        "notification_token" VARCHAR(255),
        "last_login" TIMESTAMP
      );

      -- Create schools table
      CREATE TABLE IF NOT EXISTS "schools" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "location" VARCHAR(255) NOT NULL,
        "type" VARCHAR(50) NOT NULL,
        "affiliation" VARCHAR(100),
        "contact_phone" VARCHAR(20),
        "contact_email" VARCHAR(100),
        "contact_website" VARCHAR(255),
        "approval_status" BOOLEAN DEFAULT FALSE,
        "registration_number" VARCHAR(100),
        "approval_date" TIMESTAMP,
        "facilities" JSON,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Create fee_structures table
      CREATE TABLE IF NOT EXISTS "fee_structures" (
        "id" SERIAL PRIMARY KEY,
        "school_id" INTEGER NOT NULL REFERENCES "schools"("id"),
        "nursery_annual" DECIMAL(10, 2),
        "nursery_monthly" DECIMAL(10, 2),
        "primary_annual" DECIMAL(10, 2),
        "primary_monthly" DECIMAL(10, 2),
        "middle_annual" DECIMAL(10, 2),
        "middle_monthly" DECIMAL(10, 2),
        "secondary_annual" DECIMAL(10, 2),
        "secondary_monthly" DECIMAL(10, 2),
        "approved" BOOLEAN DEFAULT FALSE,
        "last_updated" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Create documents table
      CREATE TABLE IF NOT EXISTS "documents" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "category" VARCHAR(100) NOT NULL,
        "issue_date" TIMESTAMP,
        "issued_by" VARCHAR(255),
        "summary" TEXT,
        "content" TEXT NOT NULL,
        "download_url" VARCHAR(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Create saved_documents table
      CREATE TABLE IF NOT EXISTS "saved_documents" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "document_id" INTEGER NOT NULL REFERENCES "documents"("id"),
        "saved_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS "user_document_idx" ON "saved_documents" ("user_id", "document_id");

      -- Create saved_schools table
      CREATE TABLE IF NOT EXISTS "saved_schools" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "school_id" INTEGER NOT NULL REFERENCES "schools"("id"),
        "saved_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS "user_school_idx" ON "saved_schools" ("user_id", "school_id");

      -- Create chat_history table
      CREATE TABLE IF NOT EXISTS "chat_history" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "message" TEXT NOT NULL,
        "is_user" BOOLEAN NOT NULL,
        "language" VARCHAR(10) NOT NULL DEFAULT 'english',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log('Schema pushed successfully!');
  } catch (error) {
    console.error('Error pushing schema:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);