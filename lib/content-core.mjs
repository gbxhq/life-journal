import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const DEFAULT_CONTENT = {
  diary: "diary.md",
  people: "person.md",
  places: "places.md",
  thoughts: "thoughts.md",
  media: "media.md",
  experiences_index: "experiences.md",
  experiences_directory: "experiences",
};

function clean(raw = "") {
  return raw.replace(/\r\n?/g, "\n").replace(/^\uFEFF/, "");
}

async function readText(filePath, optional = false) {
  try {
    return clean(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (optional && error?.code === "ENOENT") return "";
    throw error;
  }
}

function splitLevelTwo(raw) {
  const lines = clean(raw).split("\n");
  const sections = [];
  let current = null;

  for (const line of lines) {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match) {
      if (current) sections.push(current);
      current = { heading: match[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function nonEmptyLines(lines) {
  return lines.map((line) => line.trim()).filter(Boolean);
}

function parseDateLink(line) {
  const match = line.match(
    /^-\s*\[(\d{4}-\d{2}-\d{2})\]\((?:\.\.\/)?diary\.md#(?:diary-)?(\d{4}-\d{2}-\d{2})\)\s*(.*)$/,
  );
  if (!match) return null;
  return {
    date: match[1],
    sourceDate: match[2],
    summary: match[3].trim(),
  };
}

export function slugify(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

export function parseDiary(raw) {
  return splitLevelTwo(raw)
    .filter(({ heading }) => ISO_DATE.test(heading))
    .map(({ heading: date, lines }) => {
      const body = [...lines];
      while (body[0]?.trim() === "") body.shift();
      const meta = body.shift()?.trim() ?? "";
      while (body[0]?.trim() === "") body.shift();

      const boldMeta = meta.match(/^\*\*(.*?)\*\*\s*·\s*([^·]+?)(?:\s*·\s*(.+))?$/);
      const plainMeta = meta.match(/^([^·]+?)(?:\s*·\s*(.+))?$/);
      const labels = boldMeta?.[1]
        ? boldMeta[1].split("·").map((item) => item.trim()).filter(Boolean)
        : [];

      return {
        date,
        labels,
        weekday: (boldMeta?.[2] ?? plainMeta?.[1] ?? "").trim(),
        lunar: (boldMeta?.[3] ?? plainMeta?.[2] ?? "").trim(),
        lines: nonEmptyLines(body),
      };
    });
}

export function parsePeople(raw) {
  return splitLevelTwo(raw).map(({ heading: name, lines }) => {
    const descriptionLine = lines.find((line) => /^\*\*描述：\*\*/.test(line.trim()));
    const description = descriptionLine?.replace(/^\s*\*\*描述：\*\*\s*/, "").trim() ?? "";
    const events = lines.map((line) => parseDateLink(line.trim())).filter(Boolean);
    return { id: slugify(name), name, description, events };
  });
}

export function parsePlaces(raw) {
  return splitLevelTwo(raw).map(({ heading: name, lines }) => {
    const properties = {};
    const visits = [];

    for (const sourceLine of lines) {
      const line = sourceLine.trim();
      const visit = parseDateLink(line);
      if (visit) {
        visits.push(visit);
        continue;
      }
      const property = line.match(/^-\s*([^：]+)：\s*(.*)$/);
      if (property) properties[property[1].trim()] = property[2].trim();
    }

    let coordinate = null;
    const coordinateText = properties["坐标"];
    const coordinateMatch = coordinateText?.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (coordinateMatch) {
      coordinate = {
        longitude: Number(coordinateMatch[1]),
        latitude: Number(coordinateMatch[2]),
        system: properties["坐标系"] || "unknown",
        source: properties["坐标来源"] || "unknown",
        confirmedAt: properties["坐标确认"] || "",
      };
    }

    return {
      id: slugify(name),
      name,
      type: properties["类型"] || "未分类",
      adminArea: properties["行政区"] || "",
      aliases: (properties["别名"] || "")
        .split(/[、,，]/)
        .map((item) => item.trim())
        .filter(Boolean),
      coordinate,
      coordinatePending: coordinateText === "待确认" || !coordinate,
      visits,
    };
  });
}

export function parseThoughts(raw) {
  return splitLevelTwo(raw)
    .map(({ heading, lines }) => {
      const match = heading.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/);
      if (!match) return null;
      return {
        date: match[1],
        title: match[2].trim(),
        body: nonEmptyLines(lines).join("\n"),
      };
    })
    .filter(Boolean);
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

const MEDIA_CATEGORIES = {
  读书: "book",
  电影: "movie",
  游戏: "game",
  音乐: "music",
};

export function parseMedia(raw) {
  const lines = clean(raw).split("\n");
  const items = [];
  let category = "other";
  let status = "未分类";
  let headers = [];

  for (const line of lines) {
    const levelTwo = line.match(/^##\s+(.+?)\s*$/);
    if (levelTwo) {
      const name = Object.keys(MEDIA_CATEGORIES).find((key) => levelTwo[1].includes(key));
      category = name ? MEDIA_CATEGORIES[name] : "other";
      headers = [];
      continue;
    }

    const levelThree = line.match(/^###\s+(.+?)\s*$/);
    if (levelThree) {
      status = levelThree[1].trim();
      headers = [];
      continue;
    }

    if (!line.trim().startsWith("|")) continue;
    const cells = splitTableRow(line);
    if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) continue;
    if (!headers.length) {
      headers = cells;
      continue;
    }
    if (cells.every((cell) => !cell)) continue;

    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    const title = row["书名"] || row["片名"] || row["游戏名"] || row["专辑名"] || row["歌名"];
    if (!title) continue;

    items.push({
      category,
      status,
      date: row["日期"] || "",
      title,
      creator: row["作者"] || row["艺人"] || "",
      context: row["平台"] || row["年份"] || "",
      note: row["感想"] || row["进度"] || "",
    });
  }

  return items;
}

export function parseFrontmatter(raw) {
  const text = clean(raw);
  if (!text.startsWith("---\n")) return { data: {}, body: text };
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) return { data: {}, body: text };
  return {
    data: YAML.parse(text.slice(4, end)) || {},
    body: text.slice(end + 5),
  };
}

export function parseExperience(raw, fileName) {
  const { data, body } = parseFrontmatter(raw);
  const sections = Object.fromEntries(
    splitLevelTwo(body).map(({ heading, lines }) => [heading, nonEmptyLines(lines).join("\n")]),
  );
  const sourceDates = [...body.matchAll(/diary\.md#(?:diary-)?(\d{4}-\d{2}-\d{2})/g)].map(
    (match) => match[1],
  );

  return {
    slug: path.basename(fileName, path.extname(fileName)),
    title: data.title || path.basename(fileName, path.extname(fileName)),
    category: data.category || "未分类",
    status: data.status || "草稿",
    created: String(data.created || ""),
    updated: String(data.updated || ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    sections,
    sourceDates,
  };
}

function isDescending(values) {
  return values.every((value, index) => index === 0 || values[index - 1] >= value);
}

export function validateVault(vault) {
  const issues = [];
  const diaryDates = vault.diary.map((entry) => entry.date);
  const diaryDateSet = new Set(diaryDates);

  if (diaryDateSet.size !== diaryDates.length) {
    issues.push({ level: "error", code: "duplicate-diary-date", message: "日记存在重复日期标题" });
  }
  if (!isDescending(diaryDates)) {
    issues.push({ level: "error", code: "diary-order", message: "日记日期没有严格按倒序排列" });
  }

  for (const person of vault.people) {
    if (!person.description) {
      issues.push({ level: "error", code: "person-description", message: `人物“${person.name}”缺少描述` });
    }
    if (!isDescending(person.events.map((event) => event.date))) {
      issues.push({ level: "error", code: "person-order", message: `人物“${person.name}”的经历没有按倒序排列` });
    }
    for (const event of person.events) {
      if (!diaryDateSet.has(event.sourceDate)) {
        issues.push({ level: "error", code: "broken-person-link", message: `人物“${person.name}”链接到不存在的日记 ${event.sourceDate}` });
      }
    }
  }

  for (const place of vault.places) {
    if (!isDescending(place.visits.map((visit) => visit.date))) {
      issues.push({ level: "error", code: "place-order", message: `地点“${place.name}”的到访没有按倒序排列` });
    }
    for (const visit of place.visits) {
      if (!diaryDateSet.has(visit.sourceDate)) {
        issues.push({ level: "error", code: "broken-place-link", message: `地点“${place.name}”链接到不存在的日记 ${visit.sourceDate}` });
      }
    }
    if (place.coordinate) {
      const { longitude, latitude, system } = place.coordinate;
      if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        issues.push({ level: "error", code: "coordinate-range", message: `地点“${place.name}”的坐标超出有效范围` });
      }
      if (!["WGS84", "GCJ-02", "BD-09"].includes(system)) {
        issues.push({ level: "warning", code: "coordinate-system", message: `地点“${place.name}”使用未知坐标系` });
      }
    }
  }

  for (const experience of vault.experiences) {
    if (!ISO_DATE.test(experience.created) || !ISO_DATE.test(experience.updated)) {
      issues.push({ level: "error", code: "experience-date", message: `经验“${experience.title}”的日期格式无效` });
    }
    for (const sourceDate of experience.sourceDates) {
      if (!diaryDateSet.has(sourceDate)) {
        issues.push({ level: "error", code: "broken-experience-link", message: `经验“${experience.title}”链接到不存在的日记 ${sourceDate}` });
      }
    }
  }

  const configText = JSON.stringify(vault.config);
  if (/\/(Users|home)\//.test(configText) || /[A-Za-z]:\\\\Users\\\\/.test(configText)) {
    issues.push({ level: "error", code: "absolute-path", message: "公开配置包含本机绝对路径" });
  }

  return issues;
}

export async function loadVault(vaultDir) {
  const configPath = path.join(vaultDir, "life.config.yml");
  const config = YAML.parse(await readText(configPath)) || {};
  const content = { ...DEFAULT_CONTENT, ...(config.content || {}) };

  const [diaryRaw, peopleRaw, placesRaw, thoughtsRaw, mediaRaw] = await Promise.all([
    readText(path.join(vaultDir, content.diary)),
    readText(path.join(vaultDir, content.people)),
    readText(path.join(vaultDir, content.places)),
    readText(path.join(vaultDir, content.thoughts)),
    readText(path.join(vaultDir, content.media)),
  ]);

  const experiencesDir = path.join(vaultDir, content.experiences_directory);
  const experienceEntries = await fs.readdir(experiencesDir, { withFileTypes: true }).catch(() => []);
  const experienceFiles = experienceEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "TEMPLATE.md")
    .sort((a, b) => a.name.localeCompare(b.name));
  const experiences = await Promise.all(
    experienceFiles.map(async (entry) =>
      parseExperience(await readText(path.join(experiencesDir, entry.name)), entry.name),
    ),
  );

  const vault = {
    config,
    diary: parseDiary(diaryRaw),
    people: parsePeople(peopleRaw),
    places: parsePlaces(placesRaw),
    thoughts: parseThoughts(thoughtsRaw),
    media: parseMedia(mediaRaw),
    experiences,
  };

  return {
    ...vault,
    issues: validateVault(vault),
    summary: {
      diaryDays: vault.diary.length,
      people: vault.people.length,
      places: vault.places.length,
      confirmedPlaces: vault.places.filter((place) => Boolean(place.coordinate)).length,
      thoughts: vault.thoughts.length,
      media: vault.media.length,
      experiences: vault.experiences.length,
    },
  };
}
