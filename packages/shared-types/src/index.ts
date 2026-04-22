export type EventType =
  | "transition"
  | "stop"
  | "discovery"
  | "observation"
  | "document"
  | "storm";

export interface SourceSummary {
  id: number;
  title: string;
  author: string;
  source_type: string;
  publication_year: number | null;
  origin: string;
  archive_link: string;
  description: string;
}

export interface ExpeditionSummary {
  id: number;
  title: string;
  slug: string;
  summary: string;
  period_start: string;
  period_end: string;
  status: "draft" | "published";
}
