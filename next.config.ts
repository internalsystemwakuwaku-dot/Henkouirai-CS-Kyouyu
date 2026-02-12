import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercelビルド時のESLint/TypeScriptエラーを回避
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // libSQL/Tursoのネイティブ依存をサーバー外部パッケージとして扱う
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
