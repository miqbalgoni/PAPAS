import { relations } from 'drizzle-orm';
import { 
  integer, json, pgTable, primaryKey, serial, text, boolean, 
  varchar, timestamp, decimal, index
} from 'drizzle-orm/pg-core';

// Users table (for app users)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  preferred_language: varchar('preferred_language', { length: 10 }).default('english').notNull(),
  notification_token: varchar('notification_token', { length: 255 }),
  last_login: timestamp('last_login')
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  savedDocuments: many(savedDocuments),
  savedSchools: many(savedSchools),
  chatHistory: many(chatHistory)
}));

// Schools table
export const schools = pgTable('schools', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  affiliation: varchar('affiliation', { length: 100 }),
  contact_phone: varchar('contact_phone', { length: 20 }),
  contact_email: varchar('contact_email', { length: 100 }),
  contact_website: varchar('contact_website', { length: 255 }),
  approval_status: boolean('approval_status').default(false),
  registration_number: varchar('registration_number', { length: 100 }),
  approval_date: timestamp('approval_date'),
  facilities: json('facilities').$type<string[]>(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// School relations
export const schoolsRelations = relations(schools, ({ one, many }) => ({
  feeStructure: one(feeStructures, {
    fields: [schools.id],
    references: [feeStructures.school_id]
  }),
  savedBy: many(savedSchools)
}));

// Fee structures table
export const feeStructures = pgTable('fee_structures', {
  id: serial('id').primaryKey(),
  school_id: integer('school_id').notNull().references(() => schools.id),
  nursery_annual: decimal('nursery_annual', { precision: 10, scale: 2 }),
  nursery_monthly: decimal('nursery_monthly', { precision: 10, scale: 2 }),
  primary_annual: decimal('primary_annual', { precision: 10, scale: 2 }),
  primary_monthly: decimal('primary_monthly', { precision: 10, scale: 2 }),
  middle_annual: decimal('middle_annual', { precision: 10, scale: 2 }),
  middle_monthly: decimal('middle_monthly', { precision: 10, scale: 2 }),
  secondary_annual: decimal('secondary_annual', { precision: 10, scale: 2 }),
  secondary_monthly: decimal('secondary_monthly', { precision: 10, scale: 2 }),
  approved: boolean('approved').default(false),
  last_updated: timestamp('last_updated').defaultNow().notNull()
});

// Fee structure relations
export const feeStructuresRelations = relations(feeStructures, ({ one }) => ({
  school: one(schools, {
    fields: [feeStructures.school_id],
    references: [schools.id]
  })
}));

// Documents table
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  issue_date: timestamp('issue_date'),
  issued_by: varchar('issued_by', { length: 255 }),
  summary: text('summary'),
  content: text('content').notNull(),
  download_url: varchar('download_url', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Document relations
export const documentsRelations = relations(documents, ({ many }) => ({
  savedBy: many(savedDocuments)
}));

// User's saved documents
export const savedDocuments = pgTable('saved_documents', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  document_id: integer('document_id').notNull().references(() => documents.id),
  saved_at: timestamp('saved_at').defaultNow().notNull()
}, (table) => {
  return {
    userDocumentIdx: index('user_document_idx').on(table.user_id, table.document_id),
  };
});

// Saved document relations
export const savedDocumentsRelations = relations(savedDocuments, ({ one }) => ({
  user: one(users, {
    fields: [savedDocuments.user_id],
    references: [users.id]
  }),
  document: one(documents, {
    fields: [savedDocuments.document_id],
    references: [documents.id]
  })
}));

// User's saved schools
export const savedSchools = pgTable('saved_schools', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  school_id: integer('school_id').notNull().references(() => schools.id),
  saved_at: timestamp('saved_at').defaultNow().notNull()
}, (table) => {
  return {
    userSchoolIdx: index('user_school_idx').on(table.user_id, table.school_id),
  };
});

// Saved school relations
export const savedSchoolsRelations = relations(savedSchools, ({ one }) => ({
  user: one(users, {
    fields: [savedSchools.user_id],
    references: [users.id]
  }),
  school: one(schools, {
    fields: [savedSchools.school_id],
    references: [schools.id]
  })
}));

// Chat history table
export const chatHistory = pgTable('chat_history', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  is_user: boolean('is_user').notNull(),
  language: varchar('language', { length: 10 }).default('english').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Chat history relations
export const chatHistoryRelations = relations(chatHistory, ({ one }) => ({
  user: one(users, {
    fields: [chatHistory.user_id],
    references: [users.id]
  })
}));

// Export all entity types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type School = typeof schools.$inferSelect;
export type InsertSchool = typeof schools.$inferInsert;

export type FeeStructure = typeof feeStructures.$inferSelect;
export type InsertFeeStructure = typeof feeStructures.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

export type SavedDocument = typeof savedDocuments.$inferSelect;
export type InsertSavedDocument = typeof savedDocuments.$inferInsert;

export type SavedSchool = typeof savedSchools.$inferSelect;
export type InsertSavedSchool = typeof savedSchools.$inferInsert;

export type ChatHistoryItem = typeof chatHistory.$inferSelect;
export type InsertChatHistoryItem = typeof chatHistory.$inferInsert;