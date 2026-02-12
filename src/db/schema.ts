import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// =============================================
// Better Auth 必須テーブル
// =============================================

/** ユーザーテーブル - Better Auth互換 + role拡張 */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role", { enum: ["front", "builder", "admin"] }).notNull().default("front"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

/** セッションテーブル - Better Auth用 */
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

/** アカウント連携テーブル - Better Auth用 */
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

/** 検証テーブル - Better Auth用 */
export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// =============================================
// アプリケーション固有テーブル
// =============================================

/** プロジェクト（顧客案件）テーブル */
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientName: text("client_name").notNull(),
  serviceType: text("service_type", { enum: ["LINE", "MEO"] }).notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

/** チケット（指示書）テーブル */
export const tickets = sqliteTable("tickets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  /** カテゴリ: LINE/MEO作業種別 */
  category: text("category", {
    enum: [
      "line_rich_menu",       // LINEリッチメニュー修正
      "line_message",         // LINEメッセージ配信
      "line_scenario",        // LINEシナリオ設定
      "line_other",           // LINE その他
      "meo_post",             // MEO投稿代行
      "meo_info_update",      // MEO情報更新
      "meo_review_reply",     // MEO口コミ返信
      "meo_other",            // MEO その他
    ],
  }).notNull(),
  /** ステータス: 下書き→レビュー中→承認済み→完了 */
  status: text("status", {
    enum: ["draft", "reviewing", "approved", "done"],
  }).notNull().default("draft"),
  /** AIからのフィードバック（JSON文字列） */
  aiFeedback: text("ai_feedback"),
  /** テンプレート固有の追加データ（JSON文字列） */
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// =============================================
// 型エクスポート
// =============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
