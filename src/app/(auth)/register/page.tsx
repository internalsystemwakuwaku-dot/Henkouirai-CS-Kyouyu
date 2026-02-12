"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Loader2, UserPlus, Zap } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<string>("front");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = await (signUp.email as any)({
                name,
                email,
                password,
                role,
            });

            if (result.error) {
                setError("登録に失敗しました。メールアドレスが既に使用されている可能性があります。");
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("登録中にエラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md animate-fade-in relative z-10">
                {/* ロゴ・タイトル */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                        <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Instruction Bridge
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        新しいアカウントを作成
                    </p>
                </div>

                <Card className="shadow-xl border-border/50 backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl">新規登録</CardTitle>
                        <CardDescription>
                            必要事項を入力してアカウントを作成してください
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">氏名</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="山田 太郎"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">パスワード</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="8文字以上"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">役割</Label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="役割を選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="front">
                                            <span className="flex items-center gap-2">
                                                🎯 フロント担当
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="builder">
                                            <span className="flex items-center gap-2">
                                                🔧 構築担当
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 font-medium"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <UserPlus className="w-4 h-4 mr-2" />
                                )}
                                {loading ? "登録中..." : "アカウントを作成"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            既にアカウントをお持ちですか？{" "}
                            <Link
                                href="/login"
                                className="text-primary hover:underline font-medium"
                            >
                                ログイン
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
