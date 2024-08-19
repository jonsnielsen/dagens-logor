// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  boolean,
  date,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `dagens-logor_${name}`);

export const images = createTable(
  "image",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    userId: varchar("userId", { length: 254 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const quotes = createTable("quote", {
  id: serial("id").primaryKey(),
  quote: varchar("quote", { length: 1024 }).notNull(),
  personQuoted: varchar("personQuoted", { length: 64 }).notNull(),
  contextOfQuote: varchar("contextOfQuote", { length: 256 }),
  userId: varchar("userId", { length: 254 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
  archived: boolean("archived"),
});

export type QuoteDBType = typeof quotes.$inferSelect;

export const gulligheter = createTable("gulligheter", {
  id: serial("id").primaryKey(),
  gullighet: varchar("gullighet", { length: 1024 }).notNull(),
  gulligPerson: varchar("gulligPerson", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 254 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export type gullighetDBType = typeof quotes.$inferSelect;

export const calendarEvents = createTable("calendar", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 254 }).notNull(),
  description: varchar("description", { length: 1024 }),
  category: varchar("category", { length: 64 }).notNull(),
  visibility: varchar("visibility", { length: 64 }).notNull(),
  date: timestamp("date", { mode: "string" }).notNull(),
  userId: varchar("userId", { length: 254 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export type CalendarDBType = typeof calendarEvents.$inferSelect;
