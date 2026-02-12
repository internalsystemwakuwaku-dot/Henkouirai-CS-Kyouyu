"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NewProject } from "@/db/schema";

/** プロジェクト一覧を取得 */
export async function getProjects() {
    return await db.select().from(projects).orderBy(projects.createdAt);
}

/** プロジェクトをIDで取得 */
export async function getProjectById(id: string) {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0] || null;
}

/** プロジェクトを作成 */
export async function createProject(data: Omit<NewProject, "id" | "createdAt" | "updatedAt">) {
    const result = await db.insert(projects).values(data).returning();
    return result[0];
}

/** プロジェクトを更新 */
export async function updateProject(id: string, data: Partial<Omit<NewProject, "id" | "createdAt" | "updatedAt">>) {
    const result = await db
        .update(projects)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
    return result[0];
}

/** プロジェクトを削除 */
export async function deleteProject(id: string) {
    await db.delete(projects).where(eq(projects.id, id));
}
