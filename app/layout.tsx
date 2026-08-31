import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://life-journal.ixs.im";
const title = "Life Journal · 用一两句话记录每天发生的事";
const description = "一个由 Agent 协助整理的 Markdown 人生记录 Skill：事实保持简短，感悟、人物、地点、经验和媒体分别归档。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: { title, description, type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Life Journal" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
