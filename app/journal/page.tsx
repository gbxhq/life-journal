import type { Metadata } from "next";
import { vault } from "@/lib/vault";
import { CalendarDiary } from "./calendar-diary";

export const metadata: Metadata = {
  title: "记录 · Life Journal",
  description: "通过日历浏览有记录和未记录的日子。",
};

export default function JournalPage() {
  return <CalendarDiary entries={vault.diary} />;
}
