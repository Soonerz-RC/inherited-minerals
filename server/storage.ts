import { users, reviewRequests, questions } from '@shared/schema';
import type {
  User,
  InsertUser,
  ReviewRequest,
  InsertReviewRequest,
  Question,
  InsertQuestion,
} from '@shared/schema';
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, desc } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

// Ensure tables exist (lightweight bootstrap so the prototype runs without a
// separate migration step). For production, switch to `drizzle-kit push`.
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS review_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    state TEXT NOT NULL,
    county TEXT,
    producing_status TEXT NOT NULL,
    documents TEXT NOT NULL DEFAULT '[]',
    notes TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL,
    state TEXT,
    display_name TEXT,
    created_at INTEGER NOT NULL
  );
`);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createReviewRequest(data: InsertReviewRequest): Promise<ReviewRequest>;
  listReviewRequests(): Promise<ReviewRequest[]>;

  createQuestion(data: InsertQuestion): Promise<Question>;
  listQuestions(): Promise<Question[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.username, username)).get();
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return db.insert(users).values(insertUser).returning().get();
  }

  async createReviewRequest(data: InsertReviewRequest): Promise<ReviewRequest> {
    return db
      .insert(reviewRequests)
      .values({
        name: data.name,
        email: data.email,
        state: data.state,
        county: data.county ?? null,
        producingStatus: data.producingStatus,
        documents: JSON.stringify(data.documents ?? []),
        notes: data.notes ?? null,
        createdAt: Date.now(),
      })
      .returning()
      .get();
  }

  async listReviewRequests(): Promise<ReviewRequest[]> {
    return db.select().from(reviewRequests).orderBy(desc(reviewRequests.createdAt)).all();
  }

  async createQuestion(data: InsertQuestion): Promise<Question> {
    return db
      .insert(questions)
      .values({
        title: data.title,
        body: data.body,
        category: data.category,
        state: data.state ?? null,
        displayName: data.displayName ?? null,
        createdAt: Date.now(),
      })
      .returning()
      .get();
  }

  async listQuestions(): Promise<Question[]> {
    return db.select().from(questions).orderBy(desc(questions.createdAt)).all();
  }
}

export const storage = new DatabaseStorage();
