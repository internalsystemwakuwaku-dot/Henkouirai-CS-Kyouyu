"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";
import {
    ClipboardList,
    Filter,
    FileText,
    TicketPlus,
    Eye,
} from "lucide-react";
import {
    statusLabels,
    statusColors,
    categoryLabels,
} from "@/types";
import type { TicketStatus, TicketCategory } from "@/types";

/** チケットデータ型 */
interface TicketItem {
    id: string;
    title: string;
    status: TicketStatus;
    category: TicketCategory;
    createdAt: string;
    author: string;
    projectName: string;
}

/** チケット一覧ページ */
export default function TicketsPage() {
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // デモデータ
    const tickets: TicketItem[] = [
        {
            id: "1",
            title: "LINEリッチメニュー修正依頼",
            status: "approved",
            category: "line_rich_menu",
            createdAt: "2025-02-12 15:00",
            author: "田中太郎",
            projectName: "美容サロンA",
        },
        {
            id: "2",
            title: "MEO投稿代行 - 新春キャンペーン",
            status: "reviewing",
            category: "meo_post",
            createdAt: "2025-02-12 10:30",
            author: "佐藤花子",
            projectName: "レストランB",
        },
        {
            id: "3",
            title: "リッチメッセージ配信設定",
            status: "draft",
            category: "line_message",
            createdAt: "2025-02-11 09:00",
            author: "鈴木一郎",
            projectName: "クリニックC",
        },
        {
            id: "4",
            title: "Googleビジネスプロフィール営業時間更新",
            status: "done",
            category: "meo_info_update",
            createdAt: "2025-02-10 14:00",
            author: "田中太郎",
            projectName: "美容サロンA",
        },
        {
            id: "5",
            title: "口コミ返信 - 星4評価のお客様",
            status: "approved",
            category: "meo_review_reply",
            createdAt: "2025-02-10 11:00",
            author: "佐藤花子",
            projectName: "レストランB",
        },
    ];

    const filteredTickets = statusFilter === "all"
        ? tickets
        : tickets.filter((t) => t.status === statusFilter);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ヘッダー */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-primary" />
                        チケット一覧
                    </h1>
                    <p className="text-muted-foreground mt-1">全{filteredTickets.length}件のチケット</p>
                </div>
                <Link href="/tickets/new">
                    <Button className="gap-2 shadow-md hover:shadow-lg transition-shadow">
                        <TicketPlus className="w-4 h-4" />
                        新規チケット
                    </Button>
                </Link>
            </div>

            {/* フィルター */}
            <Card className="bg-muted/30">
                <CardContent className="py-3 px-4 flex items-center gap-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">ステータス:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40 h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">すべて</SelectItem>
                            <SelectItem value="draft">下書き</SelectItem>
                            <SelectItem value="reviewing">レビュー中</SelectItem>
                            <SelectItem value="approved">承認済み</SelectItem>
                            <SelectItem value="done">完了</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* チケットリスト */}
            <div className="space-y-3">
                {filteredTickets.map((ticket, index) => (
                    <Card
                        key={ticket.id}
                        className="hover:shadow-md transition-all duration-200 animate-fade-in group"
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                                        <FileText className="w-5 h-5 text-primary/60" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-sm truncate">{ticket.title}</h3>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            <span>{ticket.projectName}</span>
                                            <span>·</span>
                                            <span>{categoryLabels[ticket.category]}</span>
                                            <span>·</span>
                                            <span>{ticket.author}</span>
                                            <span>·</span>
                                            <span>{ticket.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Badge
                                        variant="secondary"
                                        className={`${statusColors[ticket.status]} border-0`}
                                    >
                                        {statusLabels[ticket.status]}
                                    </Badge>
                                    <Link href={`/tickets/${ticket.id}`}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredTickets.length === 0 && (
                <Card className="py-12">
                    <CardContent className="text-center text-muted-foreground">
                        <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">チケットが見つかりません</p>
                        <p className="text-sm mt-1">フィルターを変更するか、新しいチケットを作成してください</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
