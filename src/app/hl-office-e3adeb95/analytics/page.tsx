import type { Metadata } from "next";
import { AdminAnalytics } from "@/components/admin/admin-analytics";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = { title: "品項分析｜後台", robots: { index: false, follow: false } };

export default function AdminAnalyticsPage() {
  return <AdminShell><AdminAnalytics /></AdminShell>;
}
