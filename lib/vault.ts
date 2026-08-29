import rawVault from "@/generated/vault.json";
import rawTheme from "@/generated/theme.json";

export interface DiaryEntry {
  date: string;
  labels: string[];
  weekday: string;
  lunar: string;
  lines: string[];
}

export interface PersonEvent {
  date: string;
  sourceDate: string;
  summary: string;
}

export interface Person {
  id: string;
  name: string;
  description: string;
  events: PersonEvent[];
}

export interface Place {
  id: string;
  name: string;
  type: string;
  adminArea: string;
  aliases: string[];
  coordinate: null | {
    longitude: number;
    latitude: number;
    system: string;
    source: string;
    confirmedAt: string;
  };
  coordinatePending: boolean;
  visits: PersonEvent[];
}

export interface Thought {
  date: string;
  title: string;
  body: string;
}

export interface MediaItem {
  category: "book" | "movie" | "game" | "music" | "other";
  status: string;
  date: string;
  title: string;
  creator: string;
  context: string;
  note: string;
}

export interface Experience {
  slug: string;
  title: string;
  category: string;
  status: string;
  created: string;
  updated: string;
  tags: string[];
  sections: Record<string, string>;
  sourceDates: string[];
}

export interface VaultData {
  config: {
    site?: { title?: string; description?: string };
    privacy?: { show_exact_coordinates?: boolean };
  };
  diary: DiaryEntry[];
  people: Person[];
  places: Place[];
  thoughts: Thought[];
  media: MediaItem[];
  experiences: Experience[];
  issues: Array<{ level: string; code: string; message: string }>;
  summary: {
    diaryDays: number;
    people: number;
    places: number;
    confirmedPlaces: number;
    thoughts: number;
    media: number;
    experiences: number;
  };
}

export const vault = rawVault as VaultData;
export const theme = rawTheme as { id: string; name: string; mode: string };

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("zh-CN", options ?? {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${date}T12:00:00+08:00`));
}

export function yearMonth(date: string) {
  return date.slice(0, 7);
}

export function mediaLabel(category: MediaItem["category"]) {
  return { book: "读书", movie: "电影", game: "游戏", music: "音乐", other: "其他" }[category];
}

export function relatedPeople(date: string) {
  return vault.people.filter((person) => person.events.some((event) => event.sourceDate === date));
}

export function relatedPlaces(date: string) {
  return vault.places.filter((place) => place.visits.some((visit) => visit.sourceDate === date));
}

export function relatedExperiences(date: string) {
  return vault.experiences.filter((experience) => experience.sourceDates.includes(date));
}
