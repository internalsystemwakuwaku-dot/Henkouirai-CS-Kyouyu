"use client";

import { Sidebar } from "@/components/layout/sidebar";

interface DashboardLayoutClientProps {
    children: React.ReactNode;
    userName?: string;
    userRole?: string;
}

/** ダッシュボードレイアウト（クライアントコンポーネント） */
export function DashboardLayoutClient({
    children,
    userName,
    userRole,
}: DashboardLayoutClientProps) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar userName={userName} userRole={userRole} />
            <main className="pl-64">
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
