"use client";

import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import type { DiaryEntry } from "@/lib/vault";
import { entriesForCalendar, lunarDayLabel, monthGrid, shiftMonth } from "@/lib/calendar.mjs";

const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

export function CalendarDiary({ entries }: { entries: DiaryEntry[] }) {
  const latestMonth = entries[0]?.date.slice(0, 7) ?? new Date().toISOString().slice(0, 7);
  const [visibleMonth, setVisibleMonth] = useState(latestMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const recordDates = useMemo(() => new Set(entries.map((entry) => entry.date)), [entries]);
  const calendarDays = useMemo(() => monthGrid(visibleMonth), [visibleMonth]);
  const shownEntries = entriesForCalendar(entries, visibleMonth, selectedDate) as DiaryEntry[];
  const [year, month] = visibleMonth.split("-");

  function changeMonth(delta: number) {
    setVisibleMonth((current) => shiftMonth(current, delta));
    setSelectedDate(null);
  }

  function selectDay(day: number) {
    const date = `${visibleMonth}-${String(day).padStart(2, "0")}`;
    setSelectedDate((current) => current === date ? null : date);
  }

  return (
    <main className="journal-content time-page">
      <header className="time-page-header">
        <p className="section-eyebrow">YOUR DAYS</p>
        <h1>记录</h1>
      </header>

      <section className="calendar-panel" aria-label={`${year}年${Number(month)}月日历`}>
        <header className="calendar-toolbar">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="上一个月"><ChevronLeft size={19} /></button>
          <div><strong>{Number(month)}月</strong><span>{year}</span></div>
          <button type="button" onClick={() => changeMonth(1)} aria-label="下一个月"><ChevronRight size={19} /></button>
        </header>
        <div className="calendar-weekdays" aria-hidden="true">
          {weekDays.map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            if (!day) return <span className="calendar-empty" key={`empty-${index}`} />;
            const date = `${visibleMonth}-${String(day).padStart(2, "0")}`;
            const recorded = recordDates.has(date);
            const selected = selectedDate === date;
            const lunar = lunarDayLabel(date);
            return (
              <button
                type="button"
                className={`${recorded ? "has-record" : "no-record"} ${selected ? "is-selected" : ""}`}
                aria-pressed={selected}
                aria-label={`${date}，农历${lunar}${recorded ? "，有记录" : "，未记录"}`}
                onClick={() => selectDay(day)}
                key={date}
              >
                <span className="solar-day">{day}</span>
                <small className="lunar-day">{lunar}</small>
                {recorded && <i />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="calendar-diary-list" aria-live="polite">
        <header>
          <div>
            <p className="section-eyebrow">{selectedDate ? "SELECTED DAY" : "MONTHLY RECORDS"}</p>
            <h2>{selectedDate ? selectedDate : `${year} 年 ${Number(month)} 月`}</h2>
          </div>
          <span>{shownEntries.length} 篇</span>
        </header>

        {shownEntries.length > 0 ? (
          <div className="calendar-entry-list">
            {shownEntries.map((entry) => (
              <a className="calendar-entry" href={`/journal/diary/${entry.date}`} key={entry.date}>
                <time dateTime={entry.date}>
                  <strong>{entry.date.slice(8)}</strong>
                  <span>{entry.weekday}</span>
                </time>
                <div>
                  <div className="label-row">{entry.labels.map((label) => <span key={label}>{label}</span>)}</div>
                  <h3>{entry.lines[0]}</h3>
                  {entry.lines.slice(1, 3).map((line) => <p key={line}>{line}</p>)}
                </div>
                <FileText aria-hidden="true" size={18} />
              </a>
            ))}
          </div>
        ) : (
          <div className="calendar-empty-state">
            <FileText size={22} />
            <h3>这一天还没有记录</h3>
            <p>第一版只展示内容；需要补记时，请通过 Life Journal Skill 与 Agent 对话。</p>
          </div>
        )}
      </section>
    </main>
  );
}
