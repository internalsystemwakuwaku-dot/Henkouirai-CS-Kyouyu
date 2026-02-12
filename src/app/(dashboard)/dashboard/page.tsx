"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    ClipboardList,
    Clock,
    CheckCircle2,
    AlertCircle,
    TicketPlus,
    ArrowRight,
    FileText,
    Sparkles,
} from "lucide-react";
import { statusLabels, statusColors } from "@/types";
import type { TicketStatus } from "@/types";

/** ダッシュボードのステータスカード */
function StatCard({
    title,
    value,
    icon: Icon,
    color,
    description,
}: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
}) {
    return (
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-medium">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
            </CardContent>
            {/* 装飾グラデーション */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${color.replace("bg-", "bg-").replace("/10", "")}`} />
        </Card>
    );
}

/** ダッシュボードメインページ */
export default function DashboardPage() {
    // デモ用のデータ
    const stats = {
        total: 12,
        draft: 2,
        reviewing: 3,
        approved: 4,
        done: 3,
    };

    const recentTickets = [
        {
            id: "1",
            title: "LINEリッチメニュー修正依頼",
            status: "approved" as TicketStatus,
            category: "line_rich_menu",
            createdAt: "2時間前",
            author: "田中太郎",
        },
        {
            id: "2",
            title: "MEO投稿代行 - 新春キャンペーン",
            status: "reviewing" as TicketStatus,
            category: "meo_post",
            createdAt: "5時間前",
            author: "佐藤花子",
        },
        {
            id: "3",
            title: "リッチメッセージ配信設定",
            status: "draft" as TicketStatus,
            category: "line_message",
            createdAt: "1日前",
            author: "鈴木一郎",
        },
        {
            id: "4",
            title: "Googleビジネスプロフィール営業時間更新",
            status: "done" as TicketStatus,
            category: "meo_info_update",
            createdAt: "2日前",
            author: "田中太郎",
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* ヘッダー */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        ダッシュボード
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        タスクの進行状況を一目で確認
                    </p>
                </div>
                <Link href="/tickets/new">
                    <Button className="gap-2 shadow-md hover:shadow-lg transition-shadow">
                        <TicketPlus className="w-4 h-4" />
                        新規チケット
                    </Button>
                </Link>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="レビュー中"
                    value={stats.reviewing}
                    icon={AlertCircle}
                    color="bg-yellow-500/10 text-yellow-600"
                    description="AIレビュー待ち"
                />
                <StatCard
                    title="承認済み"
                    value={stats.approved}
                    icon={CheckCircle2}
                    color="bg-green-500/10 text-green-600"
                    description="作業可能"
                />
                <StatCard
                    title="完了"
                    value={stats.done}
                    icon={ClipboardList}
                    color="bg-blue-500/10 text-blue-600"
                    description="今月完了分"
                />
                <StatCard
                    title="全チケット"
                    value={stats.total}
                    icon={FileText}
                    color="bg-primary/10 text-primary"
                    description="アクティブ"
                />
            </div>

            {/* 最近のチケット */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        最近のチケット
                    </CardTitle>
                    <Link href="/tickets">
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                            すべて表示
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentTickets.map((ticket, index) => (
                            <div
                                key={ticket.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors duration-200 animate-fade-in"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5 text-primary/60" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm truncate">{ticket.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {ticket.author} · {ticket.createdAt}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`${statusColors[ticket.status]} border-0 shrink-0 ml-3`}
                                >
                                    {statusLabels[ticket.status]}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
