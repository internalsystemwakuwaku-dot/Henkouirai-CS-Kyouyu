/** ユーザーロール */
export type UserRole = "front" | "builder" | "admin";

/** サービスタイプ */
export type ServiceType = "LINE" | "MEO";

/** チケットステータス */
export type TicketStatus = "draft" | "reviewing" | "approved" | "done";

/** チケットカテゴリ */
export type TicketCategory =
    | "line_rich_menu"
    | "line_message"
    | "line_scenario"
    | "line_other"
    | "meo_post"
    | "meo_info_update"
    | "meo_review_reply"
    | "meo_other";

/** カテゴリのラベルマッピング */
export const categoryLabels: Record<TicketCategory, string> = {
    line_rich_menu: "LINEリッチメニュー修正",
    line_message: "LINEメッセージ配信",
    line_scenario: "LINEシナリオ設定",
    line_other: "LINE その他",
    meo_post: "MEO投稿代行",
    meo_info_update: "MEO情報更新",
    meo_review_reply: "MEO口コミ返信",
    meo_other: "MEO その他",
};

/** ステータスのラベルマッピング */
export const statusLabels: Record<TicketStatus, string> = {
    draft: "下書き",
    reviewing: "レビュー中",
    approved: "承認済み",
    done: "完了",
};

/** ステータスの色マッピング */
export const statusColors: Record<TicketStatus, string> = {
    draft: "bg-gray-100 text-gray-700",
    reviewing: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    done: "bg-blue-100 text-blue-700",
};

/** カテゴリ別テンプレート必須フィールド */
export interface TemplateField {
    name: string;
    label: string;
    type: "text" | "textarea" | "url" | "datetime" | "file";
    required: boolean;
    placeholder: string;
}

/** カテゴリ別テンプレートフィールド定義 */
export const categoryTemplateFields: Record<TicketCategory, TemplateField[]> = {
    line_rich_menu: [
        { name: "target_menu", label: "対象リッチメニュー", type: "text", required: true, placeholder: "メインメニュー / サブメニュー等" },
        { name: "edit_area", label: "修正箇所", type: "textarea", required: true, placeholder: "左下のボタンのテキストを「予約する」に変更" },
        { name: "image_url", label: "画像URL/参考資料", type: "url", required: false, placeholder: "https://..." },
        { name: "link_url", label: "リンク先URL", type: "url", required: false, placeholder: "https://..." },
        { name: "deadline", label: "反映希望日時", type: "datetime", required: true, placeholder: "" },
    ],
    line_message: [
        { name: "segment", label: "配信対象", type: "text", required: true, placeholder: "全会員 / タグ「新規」等" },
        { name: "message_text", label: "配信メッセージ", type: "textarea", required: true, placeholder: "配信する完全なテキストを入力" },
        { name: "image_url", label: "画像URL", type: "url", required: false, placeholder: "https://..." },
        { name: "delivery_datetime", label: "配信日時", type: "datetime", required: true, placeholder: "" },
        { name: "test_required", label: "テスト配信の要否", type: "text", required: true, placeholder: "必要 / 不要" },
    ],
    line_scenario: [
        { name: "trigger", label: "トリガー条件", type: "text", required: true, placeholder: "友だち追加時 / タグ付与時等" },
        { name: "steps", label: "各ステップの内容", type: "textarea", required: true, placeholder: "ステップ1: ... ステップ2: ..." },
        { name: "tag_settings", label: "タグ付け設定", type: "text", required: false, placeholder: "「来店済み」タグを付与" },
        { name: "start_datetime", label: "適用開始日時", type: "datetime", required: true, placeholder: "" },
    ],
    line_other: [
        { name: "details", label: "作業内容の詳細", type: "textarea", required: true, placeholder: "具体的な作業内容を記述" },
        { name: "account_name", label: "対象アカウント名", type: "text", required: true, placeholder: "" },
        { name: "expected_result", label: "期待する完成イメージ", type: "textarea", required: true, placeholder: "" },
        { name: "deadline", label: "期限", type: "datetime", required: true, placeholder: "" },
    ],
    meo_post: [
        { name: "profile_name", label: "Googleビジネスプロフィール名", type: "text", required: true, placeholder: "店舗名を入力" },
        { name: "post_text", label: "投稿テキスト", type: "textarea", required: true, placeholder: "投稿する完全なテキストを入力" },
        { name: "image_url", label: "投稿画像URL", type: "url", required: false, placeholder: "https://..." },
        { name: "post_category", label: "投稿カテゴリ", type: "text", required: true, placeholder: "最新情報 / イベント / 特典" },
        { name: "post_datetime", label: "投稿日時", type: "datetime", required: true, placeholder: "" },
    ],
    meo_info_update: [
        { name: "profile_name", label: "Googleビジネスプロフィール名", type: "text", required: true, placeholder: "店舗名を入力" },
        { name: "update_item", label: "更新する項目", type: "text", required: true, placeholder: "営業時間 / 住所 / 電話番号 / 説明文等" },
        { name: "update_content", label: "更新後の具体的な内容", type: "textarea", required: true, placeholder: "" },
        { name: "deadline", label: "反映希望日時", type: "datetime", required: true, placeholder: "" },
    ],
    meo_review_reply: [
        { name: "review_content", label: "対象の口コミ内容", type: "textarea", required: true, placeholder: "口コミの内容をコピー&ペースト" },
        { name: "reply_tone", label: "返信のトーン", type: "text", required: true, placeholder: "丁寧 / カジュアル / お詫び等" },
        { name: "reply_draft", label: "返信テキスト案", type: "textarea", required: false, placeholder: "あればテキスト案を入力" },
        { name: "deadline", label: "対応期限", type: "datetime", required: true, placeholder: "" },
    ],
    meo_other: [
        { name: "details", label: "作業内容の詳細", type: "textarea", required: true, placeholder: "具体的な作業内容を記述" },
        { name: "profile_name", label: "Googleビジネスプロフィール名", type: "text", required: true, placeholder: "" },
        { name: "expected_result", label: "期待する完成イメージ", type: "textarea", required: true, placeholder: "" },
        { name: "deadline", label: "期限", type: "datetime", required: true, placeholder: "" },
    ],
};
