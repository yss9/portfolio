/** Shared content model for the portfolio. Every project page is rendered
 *  from one `Project` object — no per-project layout code. */

export type Metric = {
  label: string;
  before: string;
  after: string;
  /** e.g. "-97.5%" — pre-computed so the copy matches the deck exactly */
  delta?: string;
  /** whether a lower number is the win (latency) or a higher one (throughput) */
  better?: "lower" | "higher";
};

export type CodeBlock = {
  filename?: string;
  language: "java" | "sql" | "javascript" | "json" | "bash" | "yaml" | "text";
  code: string;
};

export type Step = {
  label: string;
  title: string;
  body: string;
};

export type Troubleshooting = {
  id: string;
  title: string;
  /** the one-line problem statement */
  problem: string;
  steps: Step[];
  code?: CodeBlock[];
  takeaway: string;
};

export type PerfCase = {
  id: string;
  title: string;
  summary: string;
  before: { label: string; code: CodeBlock; notes?: string[] };
  after: { label: string; code: CodeBlock; notes?: string[] };
  metrics: Metric[];
  /** measurement setup — JMeter thread counts, data volume */
  condition?: string;
};

export type ArchLayer = {
  id: string;
  label: string;
  role: string;
  /** which visual band the node sits in */
  band: "client" | "server" | "realtime" | "data" | "external" | "infra";
};

export type Feature = {
  title: string;
  desc: string;
  /** Optional ownership area shown as a badge on the project detail page. */
  category?: string;
};

export type StackGroup = {
  group: string;
  items: string[];
};

export type LinkRef = {
  label: string;
  href: string;
  kind: "github" | "video" | "site";
};

/** One tab inside a project's interactive mock demo. */
export type DemoScreen = {
  id: string;
  label: string;
  /** what this screen is demonstrating, shown under the tab bar */
  caption: string;
};

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type Project = {
  slug: string;
  /** ordinal shown in the project map, e.g. "01" */
  no: string;
  name: string;
  tagline: string;
  summary: string;
  period: string;
  team: string;
  role: string;
  /** short label for the card grid, e.g. "1인 개발 · FE/BE" */
  teamShort: string;
  stack: StackGroup[];
  /** flat list for compact chips on the home card */
  stackFlat: string[];
  links: LinkRef[];
  features: Feature[];
  architecture: ArchLayer[];
  /** intent line printed under the architecture diagram */
  architectureIntent: string;
  troubleshooting: Troubleshooting[];
  /** Optional closing line printed under the troubleshooting list. */
  troubleshootingNote?: string;
  /** Documented design/implementation decisions. Used for projects that don't
   *  (yet) have a measured troubleshooting write-up, so nothing is invented. */
  designNotes?: Troubleshooting[];
  performance: PerfCase[];
  demo: DemoScreen[];
  /** Screenshot captured from the project's real frontend source. */
  preview: { src: string; alt: string };
  /** Real service screens shown on the project detail page. */
  screenshots?: ProjectScreenshot[];
  /** Optional architecture diagram shown below the system layers. */
  architectureImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  /** headline numbers surfaced on the home card */
  highlights: string[];
};
