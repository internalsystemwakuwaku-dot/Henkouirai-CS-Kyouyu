"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    FileText,
    User,
    Calendar,
    FolderOpen,
    CheckCircle2,
    MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { statusLabels, statusColors, categoryLabels } from "@/types";
import type { TicketStatus, TicketCategory } from "@/types";

/** チケット詳細ページ */
export default function TicketDetailPage() {
    const params = useParams();
    const ticketId = params.id as string;

    // デモデータ
    const ticket = {
        id: ticketId,
        title: "LINEリッチメニュー修正依頼",
        content:
            "メインリッチメニューの左下ボタンのテキストを「ご予約はこちら」に変更し、タップ時のリンク先URLを https://example.com/reserve に設定してください。\n\n対象メニュー: メインメニュー\n画像の修正は不要です。テキストとリンク先のみ変更をお願いします。",
        status: "approved" as TicketStatus,
        category: "line_rich_menu" as TicketCategory,
        createdAt: "2025-02-12 15:00",
        author: "田中太郎",
        projectName: "美容サロンA",
        aiFeedback: null,
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* 戻るリンク */}
            <Link href="/tickets">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    チケット一覧に戻る
                </Button>
            </Link>

            {/* ヘッダーカード */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className={`${statusColors[ticket.status]} border-0`}
                                >
                                    {statusLabels[ticket.status]}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {categoryLabels[ticket.category]}
                                </Badge>
                            </div>
                            <CardTitle className="text-xl">{ticket.title}</CardTitle>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-primary/60" />
                        </div>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{ticket.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FolderOpen className="w-4 h-4" />
                            <span>{ticket.projectName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{ticket.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>AIレビュー済み</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 指示内容 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        指示内容
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm max-w-none">
                        <div className="p-4 rounded-xl bg-muted/40 whitespace-pre-wrap text-sm leading-relaxed">
                            {ticket.content}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* アクションボタン（Builder用） */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 gap-2">
                            作業開始
                        </Button>
                        <Button className="flex-1 gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            完了にする
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
