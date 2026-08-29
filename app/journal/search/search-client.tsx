"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

interface SearchRecord {
  type: string;
  title: string;
  text: string;
  href: string;
  date: string;
}

export function SearchClient({ records }: { records: SearchRecord[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("zh-CN");
  const results = useMemo(() => {
    if (!normalized) return records.slice(0, 8);
    return records.filter((record) => `${record.type} ${record.title} ${record.text}`.toLocaleLowerCase("zh-CN").includes(normalized));
  }, [normalized, records]);

  return (
    <section className="search-panel">
      <label className="search-input">
        <Search aria-hidden="true" size={20} />
        <span className="sr-only">搜索生活记录</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索人物、地点、日记或经验…" />
      </label>
      <div className="search-summary">{normalized ? `找到 ${results.length} 条结果` : "最近内容"}</div>
      <div className="search-results">
        {results.map((record, index) => (
          <a href={record.href} className="search-result" key={`${record.type}-${record.title}-${index}`}>
            <span>{record.type}</span>
            <div><h2>{record.title}</h2><p>{record.text.slice(0, 110)}</p></div>
            <time>{record.date}</time>
          </a>
        ))}
        {results.length === 0 && <p className="empty-state">没有找到匹配内容。换一个更短的关键词试试。</p>}
      </div>
    </section>
  );
}
