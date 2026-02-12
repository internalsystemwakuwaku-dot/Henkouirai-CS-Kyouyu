"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    LayoutDashboard,
    FolderKanban,
    TicketPlus,
    ClipboardList,
    LogOut,
    Zap,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** サイドバーメニュー項目 */
const menuItems = [
    {
        label: "ダッシュボード",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "プロジェクト",
        href: "/projects",
        icon: FolderKanban,
    },
    {
        label: "チケット一覧",
        href: "/tickets",
        icon: ClipboardList,
    },
    {
        label: "新規チケット",
        href: "/tickets/new",
        icon: TicketPlus,
        frontOnly: true,
    },
];

interface SidebarProps {
    userName?: string;
    userRole?: string;
}

export function Sidebar({ userName, userRole }: SidebarProps) {
    const pathname = usePathname();

    const filteredMenu = menuItems.filter((item) => {
        if (item.frontOnly && userRole === "builder") return false;
        return true;
    });

    const handleLogout = async () => {
        await signOut();
        window.location.href = "/login";
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
            {/* ロゴ */}
            <div className="flex items-center gap-3 px-6 py-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
                    <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h1 className="font-bold text-base tracking-tight text-sidebar-foreground">
                        Instruction Bridge
                    </h1>
                    <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
                        Task Management
                    </p>
                </div>
            </div>

            <Separator className="bg-sidebar-border" />

            {/* ナビゲーション */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-1">
                    {filteredMenu.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    )}
                                >
                                    <item.icon className="w-4.5 h-4.5 shrink-0" />
                                    <span className="flex-1">{item.label}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <Separator className="bg-sidebar-border" />

            {/* ユーザー情報 */}
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                        {userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-sidebar-foreground">
                            {userName || "ユーザー"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            {userRole === "front"
                                ? "🎯 フロント担当"
                                : userRole === "builder"
                                    ? "🔧 構築担当"
                                    : "👑 管理者"}
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    ログアウト
                </Button>
            </div>
        </aside>
    );
}
