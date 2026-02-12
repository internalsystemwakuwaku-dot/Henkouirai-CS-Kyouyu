"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    TicketPlus,
    Sparkles,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Send,
    RotateCcw,
    FileText,
} from "lucide-react";
import {
    categoryLabels,
    categoryTemplateFields,
} from "@/types";
import type { TicketCategory } from "@/types";

/** AIレビュー結果の型 */
interface AIReviewResult {
    status: "OK" | "NG";
    feedback: string[];
    summary?: string;
}

/** チケット作成ページ（AIレビュー付き） */
export default function NewTicketPage() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<TicketCategory | "">("");
    const [content, setContent] = useState("");
    const [metadata, setMetadata] = useState<Record<string, string>>({});
    const [projectId, setProjectId] = useState("");

    // AIレビュー関連
    const [reviewResult, setReviewResult] = useState<AIReviewResult | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    /** テンプレートフィールドの値を更新 */
    const handleMetadataChange = useCallback((fieldName: string, value: string) => {
        setMetadata((prev) => ({ ...prev, [fieldName]: value }));
    }, []);

    /** AIレビュー実行 */
    const handleReview = async () => {
        if (!title || !category || !content) return;

        setIsReviewing(true);
        setReviewResult(null);

        try {
            const response = await fetch("/api/ai/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, category, content, metadata }),
            });

            if (!response.ok) {
                const error = await response.json();
                setReviewResult({
                    status: "NG",
                    feedback: [error.error || "レビューに失敗しました"],
                });
                return;
            }

            const result: AIReviewResult = await response.json();
            setReviewResult(result);
        } catch {
            setReviewResult({
                status: "NG",
                feedback: ["ネットワークエラーが発生しました。再度お試しください。"],
            });
        } finally {
            setIsReviewing(false);
        }
    };

    /** チケット送信 */
    const handleSubmit = async () => {
        if (reviewResult?.status !== "OK") return;

        setIsSubmitting(true);
        try {
            // TODO: Server Action経由でDB保存
            // await createTicket({ ... })
            await new Promise((r) => setTimeout(r, 1000)); // デモ用遅延
            setIsSubmitted(true);
        } catch {
            alert("送信に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    /** フォームリセット */
    const handleReset = () => {
        setTitle("");
        setCategory("");
        setContent("");
        setMetadata({});
        setReviewResult(null);
        setIsSubmitted(false);
    };

    // テンプレートフィールド
    const templateFields = category ? categoryTemplateFields[category] || [] : [];

    // 送信完了画面
    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto animate-fade-in">
                <Card className="text-center py-12">
                    <CardContent className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold">送信完了！</h2>
                        <p className="text-muted-foreground">
                            チケットが構築担当チームに送信されました。
                        </p>
                        <Button onClick={handleReset} className="gap-2 mt-4">
                            <TicketPlus className="w-4 h-4" />
                            新しいチケットを作成
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* ヘッダー */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <TicketPlus className="w-6 h-6 text-primary" />
                    新規チケット作成
                </h1>
                <p className="text-muted-foreground mt-1">
                    AIが指示内容をレビューし、不足情報を指摘します
                </p>
            </div>

            {/* メインフォーム */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">指示内容の入力</CardTitle>
                    <CardDescription>
                        カテゴリを選択し、具体的な指示内容を入力してください
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* プロジェクト選択 */}
                    <div className="space-y-2">
                        <Label>プロジェクト（顧客名）</Label>
                        <Select value={projectId} onValueChange={setProjectId}>
                            <SelectTrigger>
                                <SelectValue placeholder="プロジェクトを選択" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="demo-1">美容サロンA</SelectItem>
                                <SelectItem value="demo-2">レストランB</SelectItem>
                                <SelectItem value="demo-3">クリニックC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* カテゴリ選択 */}
                    <div className="space-y-2">
                        <Label>カテゴリ <span className="text-destructive">*</span></Label>
                        <Select
                            value={category}
                            onValueChange={(v) => {
                                setCategory(v as TicketCategory);
                                setMetadata({});
                                setReviewResult(null);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="作業カテゴリを選択" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="line_rich_menu" className="py-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">LINE</Badge>
                                        リッチメニュー修正
                                    </div>
                                </SelectItem>
                                <SelectItem value="line_message" className="py-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">LINE</Badge>
                                        メッセージ配信
                                    </div>
                                </SelectItem>
                                <SelectItem value="line_scenario" className="py-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">LINE</Badge>
                                        シナリオ設定
                                    </div>
                                </SelectItem>
                                <SelectItem value="line_other" className="py-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">LINE</Badge>
                                        その他
                                    </div>
                                </SelectItem>
                                <SelectItem value="meo_post" className="py-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">MEO</Badge>
                                        投稿代行
                                    </div>
                                </SelectItem>
                                <SelectItem value="meo_info_update" className="py-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">MEO</Badge>
                                        情報更新
                                    </div>
                                </SelectItem>
                                <SelectItem value="meo_review_reply" className="py-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">MEO</Badge>
                                        口コミ返信
                                    </div>
                                </SelectItem>
                                <SelectItem value="meo_other" className="py-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">MEO</Badge>
                                        その他
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* タイトル */}
                    <div className="space-y-2">
                        <Label>タイトル <span className="text-destructive">*</span></Label>
                        <Input
                            placeholder="チケットのタイトルを入力"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setReviewResult(null);
                            }}
                        />
                    </div>

                    {/* テンプレートフィールド */}
                    {templateFields.length > 0 && (
                        <>
                            <Separator />
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    {categoryLabels[category as TicketCategory]} - 必須項目
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    テンプレートに沿って必要事項を入力してください
                                </p>
                            </div>
                            <div className="space-y-4">
                                {templateFields.map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <Label className="flex items-center gap-1.5">
                                            {field.label}
                                            {field.required && (
                                                <span className="text-destructive text-xs">*必須</span>
                                            )}
                                        </Label>
                                        {field.type === "textarea" ? (
                                            <Textarea
                                                placeholder={field.placeholder}
                                                value={metadata[field.name] || ""}
                                                onChange={(e) =>
                                                    handleMetadataChange(field.name, e.target.value)
                                                }
                                                rows={3}
                                            />
                                        ) : field.type === "datetime" ? (
                                            <Input
                                                type="datetime-local"
                                                value={metadata[field.name] || ""}
                                                onChange={(e) =>
                                                    handleMetadataChange(field.name, e.target.value)
                                                }
                                            />
                                        ) : (
                                            <Input
                                                type={field.type === "url" ? "url" : "text"}
                                                placeholder={field.placeholder}
                                                value={metadata[field.name] || ""}
                                                onChange={(e) =>
                                                    handleMetadataChange(field.name, e.target.value)
                                                }
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* メイン指示内容 */}
                    <div className="space-y-2">
                        <Label>指示内容 <span className="text-destructive">*</span></Label>
                        <Textarea
                            placeholder="構築担当への具体的な指示を入力してください。&#10;&#10;例: メインリッチメニューの左下ボタンのテキストを「ご予約はこちら」に変更し、タップ時のリンク先URLを https://example.com/reserve に設定してください。"
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                setReviewResult(null);
                            }}
                            rows={6}
                            className="resize-none"
                        />
                    </div>

                    {/* AIレビューボタン */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={handleReview}
                            disabled={!title || !category || !content || isReviewing}
                            className="flex-1 gap-2 h-11"
                            variant={reviewResult ? "outline" : "default"}
                        >
                            {isReviewing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    AIがレビュー中...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    {reviewResult ? "再レビュー" : "AIで確認する"}
                                </>
                            )}
                        </Button>
                        {reviewResult && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setReviewResult(null)}
                                className="gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                リセット
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* AIフィードバック表示 */}
            {reviewResult && (
                <Card
                    className={`animate-slide-in-right ${reviewResult.status === "OK" ? "ai-feedback-ok" : "ai-feedback-ng"
                        }`}
                >
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {reviewResult.status === "OK" ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span className="text-green-700">AIレビュー: 承認</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <span className="text-red-700">AIレビュー: 要修正</span>
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {reviewResult.status === "NG" && (
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    以下の点を修正してください：
                                </p>
                                <ul className="space-y-2">
                                    {reviewResult.feedback.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm"
                                        >
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 text-xs font-bold shrink-0 mt-0.5">
                                                {i + 1}
                                            </span>
                                            <span className="text-red-800 dark:text-red-200">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xs text-muted-foreground mt-2">
                                    ※ 指示内容を修正して再度「AIで確認する」を押してください
                                </p>
                            </div>
                        )}

                        {reviewResult.status === "OK" && (
                            <div className="space-y-3">
                                {reviewResult.summary && (
                                    <p className="text-sm text-green-800 dark:text-green-200 p-3 rounded-lg bg-green-50 dark:bg-green-500/10">
                                        {reviewResult.summary}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    指示内容が明確です。「送信」ボタンを押してチケットを登録してください。
                                </p>
                            </div>
                        )}

                        {/* 送信ボタン（OKの場合のみ有効） */}
                        {reviewResult.status === "OK" && (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full h-11 gap-2 animate-pulse-glow"
                                size="lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        送信中...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        チケットを送信
                                    </>
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
