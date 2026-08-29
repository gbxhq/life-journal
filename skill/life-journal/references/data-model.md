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

Write new dates as `YYYY-MM-DD`. Only read legacy compact dates when the local `AI_GUIDE.md` explicitly defines how to interpret them.
