import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

/** AI指示レビューAPIのリクエストボディ */
interface ReviewRequest {
    content: string;
    category: string;
    title: string;
    metadata?: Record<string, string>;
}

/** AI指示レビューAPIのレスポンス */
interface ReviewResponse {
    status: "OK" | "NG";
    feedback: string[];
    summary?: string;
}

/** カテゴリ別の必須確認事項 */
const categoryChecklist: Record<string, string[]> = {
    line_rich_menu: [
        "修正対象のリッチメニュー名またはスクリーンショット",
        "修正箇所の具体的な位置（座標やセクション名）",
        "修正後のデザイン指示（色、テキスト、画像等）",
        "リンク先URL（変更がある場合）",
        "反映希望日時",
    ],
    line_message: [
        "配信対象のセグメント（全員/特定タグ等）",
        "配信メッセージの完全なテキスト",
        "画像やリッチメッセージの有無と素材",
        "配信日時",
        "テスト配信の要否",
    ],
    line_scenario: [
        "シナリオのトリガー条件",
        "各ステップの具体的なメッセージ内容",
        "分岐条件がある場合のフロー図",
        "タグ付け設定",
        "適用開始日時",
    ],
    line_other: [
        "作業内容の詳細な説明",
        "対象アカウント名",
        "期待する完成イメージ",
        "期限",
    ],
    meo_post: [
        "投稿するGoogleビジネスプロフィール名",
        "投稿テキストの完全な内容",
        "投稿画像（添付またはURL）",
        "投稿カテゴリ（最新情報/イベント/特典）",
        "投稿日時",
    ],
    meo_info_update: [
        "更新対象のGoogleビジネスプロフィール名",
        "更新する項目（営業時間/住所/電話番号/説明文等）",
        "更新後の具体的な内容",
        "反映希望日時",
    ],
    meo_review_reply: [
        "対象の口コミ内容（スクリーンショットまたはテキスト）",
        "返信のトーン・方針",
        "返信テキスト案（あれば）",
        "対応期限",
    ],
    meo_other: [
        "作業内容の詳細な説明",
        "対象のGoogleビジネスプロフィール名",
        "期待する完成イメージ",
        "期限",
    ],
};

/** システムプロンプトを構築 */
function buildSystemPrompt(category: string): string {
    const checklist = categoryChecklist[category] || [];
    const checklistText = checklist.map((item, i) => `${i + 1}. ${item}`).join("\n");

    return `あなたは厳格なLINE/MEO構築専門のエンジニアです。渡された指示書を見て、作業内容が100%明確か判定してください。

## 判定基準
以下のチェックリストに基づいて、指示書の完全性を評価してください：

${checklistText}

## 判定ルール
- 上記のチェックリスト項目が指示書に含まれていない、または曖昧な場合は **NG** と判定してください。
- すべての項目が明確に記載されている場合は **OK** と判定してください。
- 「後で送ります」「別途連絡」などの曖昧な表現はNGとしてください。

## 出力形式（必ずこの形式で回答してください）
JSONのみで回答してください。他のテキストは不要です。

### NGの場合:
\`\`\`json
{
  "status": "NG",
  "feedback": [
    "具体的な不足点1",
    "具体的な不足点2"
  ]
}
\`\`\`

### OKの場合:
\`\`\`json
{
  "status": "OK",
  "feedback": [],
  "summary": "指示内容の要約"
}
\`\`\``;
}

export async function POST(request: NextRequest) {
    try {
        // APIキーの確認
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI APIキーが設定されていません" },
                { status: 500 }
            );
        }

        const body: ReviewRequest = await request.json();
        const { content, category, title, metadata } = body;

        // 入力検証
        if (!content || !category || !title) {
            return NextResponse.json(
                { error: "指示内容、カテゴリ、タイトルは必須です" },
                { status: 400 }
            );
        }

        // メタデータを指示内容に付加
        let fullContent = `## タイトル\n${title}\n\n## 指示内容\n${content}`;
        if (metadata && Object.keys(metadata).length > 0) {
            fullContent += "\n\n## 追加情報\n";
            for (const [key, value] of Object.entries(metadata)) {
                if (value) {
                    fullContent += `- ${key}: ${value}\n`;
                }
            }
        }

        // AI分析を実行
        const { text } = await generateText({
            model: openai("gpt-4o"),
            system: buildSystemPrompt(category),
            prompt: fullContent,
        });

        // JSONレスポンスの解析
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return NextResponse.json(
                { error: "AIからの応答を解析できませんでした" },
                { status: 500 }
            );
        }

        const result: ReviewResponse = JSON.parse(jsonMatch[0]);

        return NextResponse.json(result);
    } catch (error) {
        console.error("AIレビューエラー:", error);
        return NextResponse.json(
            { error: "AIレビュー処理中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
