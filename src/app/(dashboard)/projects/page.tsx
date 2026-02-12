"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
    FolderKanban,
    Plus,
    ExternalLink,
    FileText,
} from "lucide-react";

/** プロジェクトデータ型 */
interface ProjectItem {
    id: string;
    clientName: string;
    serviceType: "LINE" | "MEO";
    description: string;
    ticketCount: number;
}

/** プロジェクト一覧ページ */
export default function ProjectsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // デモデータ
    const projects: ProjectItem[] = [
        {
            id: "1",
            clientName: "美容サロンA",
            serviceType: "LINE",
            description: "LINE公式アカウント運用代行。リッチメニュー・メッセージ配信全般。",
            ticketCount: 5,
        },
        {
            id: "2",
            clientName: "レストランB",
            serviceType: "MEO",
            description: "Googleビジネスプロフィール管理・投稿代行・口コミ返信。",
            ticketCount: 3,
        },
        {
            id: "3",
            clientName: "クリニックC",
            serviceType: "LINE",
            description: "LINE公式アカウント構築・シナリオ設計・リッチメニュー作成。",
            ticketCount: 4,
        },
        {
            id: "4",
            clientName: "不動産D",
            serviceType: "MEO",
            description: "MEO対策全般。3店舗のGoogleビジネスプロフィール管理。",
            ticketCount: 2,
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ヘッダー */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FolderKanban className="w-6 h-6 text-primary" />
                        プロジェクト
                    </h1>
                    <p className="text-muted-foreground mt-1">顧客案件の管理</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-md hover:shadow-lg transition-shadow">
                            <Plus className="w-4 h-4" />
                            新規プロジェクト
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>新規プロジェクト作成</DialogTitle>
                            <DialogDescription>顧客案件の基本情報を入力してください</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>顧客名</Label>
                                <Input placeholder="例: 美容サロンA" />
                            </div>
                            <div className="space-y-2">
                                <Label>サービスタイプ</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LINE">LINE運用代行</SelectItem>
                                        <SelectItem value="MEO">MEO運用代行</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>説明</Label>
                                <Textarea placeholder="案件の概要を入力" rows={3} />
                            </div>
                            <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
                                作成する
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* プロジェクトカードグリッド */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                    <Card
                        key={project.id}
                        className="hover:shadow-lg transition-all duration-300 group animate-fade-in"
                        style={{ animationDelay: `${index * 80}ms` }}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base">{project.clientName}</CardTitle>
                                        <Badge
                                            variant="outline"
                                            className={
                                                project.serviceType === "LINE"
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                            }
                                        >
                                            {project.serviceType}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs line-clamp-2">
                                        {project.description}
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                <span>{project.ticketCount}件のチケット</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
