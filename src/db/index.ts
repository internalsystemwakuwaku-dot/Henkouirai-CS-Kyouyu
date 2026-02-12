import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Turso DBクライアントの遅延初期化（ビルド時にDB接続を避ける）
let _db: ReturnType<typeof drizzle> | null = null;

function getClient() {
    return createClient({
        url: process.env.TURSO_DATABASE_URL || "file:local.db",
        authToken: process.env.TURSO_AUTH_TOKEN,
    });
}

export function getDb() {
    if (!_db) {
        _db = drizzle(getClient(), { schema });
    }
    return _db;
}

// 後方互換のためのエクスポート
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
    get(_, prop) {
        return (getDb() as Record<string | symbol, unknown>)[prop];
    },
});
