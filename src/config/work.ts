export interface WorkLink {
  label: string;
  url: string;
}

export interface WorkMetric {
  label: string;
  value: string;
}

export interface WorkEntry {
  slug: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  year: number;
  links: WorkLink[];
  metrics: WorkMetric[];
}
