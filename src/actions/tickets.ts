"use server";

import { db } from "@/db";
import { tickets, users } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import type { NewTicket } from "@/db/schema";

/** チケット一覧を取得（ロールに応じたフィルタリング） */
export async function getTickets(userRole: string, projectId?: string) {
    // Builder は承認済みと完了のみ閲覧可能
    const allowedStatuses = userRole === "builder"
        ? ["approved", "done"] as const
        : ["draft", "reviewing", "approved", "done"] as const;

    const conditions = [
        inArray(tickets.status, [...allowedStatuses]),
    ];

    if (projectId) {
        conditions.push(eq(tickets.projectId, projectId));
    }

    const result = await db
        .select({
            ticket: tickets,
            author: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
        .from(tickets)
        .leftJoin(users, eq(tickets.authorId, users.id))
        .where(and(...conditions))
        .orderBy(desc(tickets.createdAt));

    return result;
}

/** チケットをIDで取得 */
export async function getTicketById(id: string) {
    const result = await db
        .select({
            ticket: tickets,
            author: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
        .from(tickets)
        .leftJoin(users, eq(tickets.authorId, users.id))
        .where(eq(tickets.id, id));

    return result[0] || null;
}

/** チケットを作成（AIレビュー承認後のみ） */
export async function createTicket(data: Omit<NewTicket, "id" | "createdAt" | "updatedAt">) {
    const result = await db.insert(tickets).values(data).returning();
    return result[0];
}

/** チケットを更新 */
export async function updateTicket(
    id: string,
    data: Partial<Omit<NewTicket, "id" | "createdAt" | "updatedAt">>
) {
    const result = await db
        .update(tickets)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(tickets.id, id))
        .returning();
    return result[0];
}

/** チケットステータスを更新 */
export async function updateTicketStatus(id: string, status: string) {
    return await updateTicket(id, { status: status as "draft" | "reviewing" | "approved" | "done" });
}

/** チケットを削除 */
export async function deleteTicket(id: string) {
    await db.delete(tickets).where(eq(tickets.id, id));
}

/** ダッシュボード用の統計情報を取得 */
export async function getTicketStats(userRole: string) {
    const allTickets = await getTickets(userRole);

    const stats = {
        total: allTickets.length,
        draft: allTickets.filter((t) => t.ticket.status === "draft").length,
        reviewing: allTickets.filter((t) => t.ticket.status === "reviewing").length,
        approved: allTickets.filter((t) => t.ticket.status === "approved").length,
        done: allTickets.filter((t) => t.ticket.status === "done").length,
    };

    return stats;
}
