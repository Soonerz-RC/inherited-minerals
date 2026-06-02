import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep the users table for future auth; not used in v1.
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ---------------------------------------------------------------------------
// Private review / sell-inquiry requests
// ---------------------------------------------------------------------------
export const reviewRequests = sqliteTable("review_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  state: text("state").notNull(),
  county: text("county"),
  // "producing" | "not_producing" | "not_sure"
  producingStatus: text("producing_status").notNull(),
  // "heir" | "current_owner" | "executor" | "not_sure"
  ownerStatus: text("owner_status"),
  // Operator name and/or royalty check details (free text).
  operatorInfo: text("operator_info"),
  // Offer amount if the owner has already received one (free text, e.g. "$25,000").
  offerAmount: text("offer_amount"),
  // "exploring" | "within_3_months" | "ready_now" | "just_curious"
  urgency: text("urgency"),
  // JSON string array of available documents
  documents: text("documents").notNull().default("[]"),
  notes: text("notes"),
  // Which landing intent the request came from (inherited | offer | value | general).
  intent: text("intent"),
  createdAt: integer("created_at").notNull(),
});

export const insertReviewRequestSchema = createInsertSchema(reviewRequests)
  .omit({ id: true, createdAt: true })
  .extend({
    name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().max(40).optional(),
    state: z.string().min(2, "Please select a state"),
    county: z.string().max(80).optional(),
    producingStatus: z.enum(["producing", "not_producing", "not_sure"]),
    ownerStatus: z.enum(["heir", "current_owner", "executor", "not_sure"]).optional(),
    operatorInfo: z.string().max(300).optional(),
    offerAmount: z.string().max(60).optional(),
    urgency: z.enum(["exploring", "within_3_months", "ready_now", "just_curious"]).optional(),
    documents: z.array(z.string()).default([]),
    notes: z.string().max(2000).optional(),
    intent: z.string().max(40).optional(),
    // Explicit agreement to the privacy/terms before we review their details.
    consent: z.literal(true, {
      errorMap: () => ({ message: "Please agree before submitting" }),
    }),
  });

export type InsertReviewRequest = z.infer<typeof insertReviewRequestSchema>;
export type ReviewRequest = typeof reviewRequests.$inferSelect;

// ---------------------------------------------------------------------------
// Community questions (intake prototype)
// ---------------------------------------------------------------------------
export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull(),
  state: text("state"),
  displayName: text("display_name"),
  createdAt: integer("created_at").notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions)
  .omit({ id: true, createdAt: true })
  .extend({
    title: z.string().min(8, "Give your question a clear title").max(160),
    body: z.string().min(15, "Add a little more detail so others can help").max(4000),
    category: z.string().min(2, "Please choose a category"),
    state: z.string().optional(),
    displayName: z.string().max(60).optional(),
  });

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// ---------------------------------------------------------------------------
// AI assistant (stubbed) — request/response contract
// ---------------------------------------------------------------------------
export const assistantRequestSchema = z.object({
  message: z.string().min(1).max(2000),
});
export type AssistantRequest = z.infer<typeof assistantRequestSchema>;

export interface AssistantResponse {
  reply: string;
  // suggested next questions
  suggestions: string[];
  // always present — content is educational, not advice
  disclaimer: string;
  // recommended/cited Learning Center articles (Phase 2 grounding)
  articles?: { slug: string; title: string; url: string }[];
  // a conversion CTA the UI can surface
  cta?: { route: string; label: string };
  // "ai" when answered by the model, "fallback" when keyless/degraded
  mode?: "ai" | "fallback";
}
