export function shiftMonth(month, delta) {
  const [year, monthNumber] = month.split("-").map(Number);
  const next = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthGrid(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
  const mondayOffset = (firstDay + 6) % 7;
  return [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

export function entriesForCalendar(entries, visibleMonth, selectedDate) {
  return selectedDate
    ? entries.filter((entry) => entry.date === selectedDate)
    : entries.filter((entry) => entry.date.startsWith(visibleMonth));
}

const LUNAR_DAYS = [
  "",
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十",
];

export function lunarDayLabel(date) {
  try {
    const parts = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
      month: "short",
      day: "numeric",
      timeZone: "Asia/Shanghai",
    }).formatToParts(new Date(`${date}T12:00:00+08:00`));
    const month = parts.find((part) => part.type === "month")?.value ?? "";
    const day = Number(parts.find((part) => part.type === "day")?.value ?? 0);
    return day === 1 ? month : (LUNAR_DAYS[day] || "");
  } catch {
    return "";
  }
}
