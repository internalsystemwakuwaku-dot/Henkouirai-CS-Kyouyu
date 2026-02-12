import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

/** Better Auth サーバー設定 */
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "front",
                input: true,
            },
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7日間
        updateAge: 60 * 60 * 24,      // 1日ごとに更新
    },
});

export type Session = typeof auth.$Infer.Session;
