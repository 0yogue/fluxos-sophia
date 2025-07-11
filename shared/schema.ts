import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const salespeople = pgTable("salespeople", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  isActive: boolean("is_active").notNull().default(true),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  salespersonId: integer("salesperson_id").notNull(),
  customerId: text("customer_id").notNull(),
  customerName: text("customer_name"),
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  duration: integer("duration_minutes"), // in minutes
  responseTime: integer("response_time_seconds"), // FOCO in seconds
  hasSale: boolean("has_sale").notNull().default(false),
  saleAmount: real("sale_amount"),
  scriptScore: integer("script_score"), // 0-100
  sentiment: text("sentiment"), // positive, negative, neutral
  transcript: text("transcript"),
  llmAnalysis: text("llm_analysis"), // JSON string
});

export const scriptSteps = pgTable("script_steps", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  stepName: text("step_name").notNull(),
  completed: boolean("completed").notNull().default(false),
  notes: text("notes"),
});

export const insertSalespersonSchema = createInsertSchema(salespeople).omit({
  id: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
});

export const insertScriptStepSchema = createInsertSchema(scriptSteps).omit({
  id: true,
});

export type InsertSalesperson = z.infer<typeof insertSalespersonSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertScriptStep = z.infer<typeof insertScriptStepSchema>;

export type Salesperson = typeof salespeople.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type ScriptStep = typeof scriptSteps.$inferSelect;
