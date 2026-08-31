# Data model

Read this reference when a request touches more than one content type, requires validation, or needs a new parser or migration.

## Canonical files

- `diary.md`: one `## YYYY-MM-DD` section per day, newest first.
- `person.md`: one `## name` section per person, with one confirmed description and dated shared events.
- `places.md`: one `## place` section per confirmed visitable place, with metadata and dated visits.
- `thoughts.md`: one `## YYYY-MM-DD title` section per thought.
- `media.md`: GFM tables grouped by medium and status.
- `experiences.md`: index of reusable experiences.
- `experiences/*.md`: one frontmatter-backed file per experience.

## Relationship invariant

People, places, and experiences link to an existing diary date. The diary does not add backlink rows.

## Dates

Write all new dates as `YYYY-MM-DD`. A migration may read an unambiguous legacy compact date, but must never write a new compact date or guess a missing century.

## Diary

```markdown
## YYYY-MM-DD
**事件标签** · 周X · 农历X

事实一
事实二
```

The date is the stable link target. Keep the optional label and calendar metadata on one line, then plain fact lines without bullets.

## People

```markdown
## 人物称呼

**描述：** 用户确认的身份

- [YYYY-MM-DD](diary.md#YYYY-MM-DD) 共同经历
```

Every person section has exactly one description line directly after the heading. Use `待补充` until the user supplies it.

## Places

```markdown
## 地点名称

- 类型：类型
- 行政区：行政区
- 别名：别名
- 坐标：待确认
- [YYYY-MM-DD](diary.md#YYYY-MM-DD) 到访摘要
```

After coordinate confirmation, store coordinate, coordinate system, source, provider ID when available, and the user confirmation date. Candidate results remain visibly pending and are not official coordinates.

## Thoughts

```markdown
## YYYY-MM-DD 标题

感悟正文
```

## Media

Keep the headings and GFM tables already present in `media.md`. Supported canonical groups are books, films, games, and music; status subsections may include completed, current, or planned states. Preserve existing columns and write ISO dates.

## Experiences

`experiences.md` contains the index. Each `experiences/*.md` record uses frontmatter fields `title`, `category`, `status`, `created`, `updated`, and `tags`, then the applicable sections from the bundled template. Stable statuses are `草稿`, `持续更新`, `相对稳定`, and `已废弃`.
