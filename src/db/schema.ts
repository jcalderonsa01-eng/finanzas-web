import { pgTable, serial, text, numeric, date, timestamp } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id:        serial("id").primaryKey(),
  desc:      text("desc").notNull(),
  amount:    numeric("amount", { precision: 12, scale: 2 }).notNull(),
  type:      text("type").notNull(),      // "ingreso" | "egreso"
  category:  text("category").notNull(),
  card:      text("card").notNull(),
  date:      date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Transaction    = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
