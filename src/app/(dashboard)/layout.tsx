import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client";

/** ダッシュボード共通レイアウト */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: Better Authからセッション情報を取得
    // 現時点ではデモ用のデフォルト値を使用
    const userName = "デモユーザー";
    const userRole = "front";

    return (
        <DashboardLayoutClient userName={userName} userRole={userRole}>
            {children}
        </DashboardLayoutClient>
    );
}
