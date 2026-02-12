import { redirect } from "next/navigation";

/** トップページ - ログインページにリダイレクト */
export default function Home() {
  redirect("/login");
}
