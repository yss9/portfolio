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
  /** Brief, reader-facing explanation of the chosen fix. */
  solution?: string;
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
  /** Preserve the full screenshot when a cropped preview would hide the UI. */
  fit?: "contain";
};

export type ImplementationStory = {
  introduction: string[];
  decisions: { title: string; body: string }[];
  verification: string;
  codeReferences: { label: string; file: string; line: number }[];
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
  /** Confirmed project award; omit when no award is recorded. */
  award?: string;
  /** Training programme the project was built in, shown on the home card. */
  program?: string;
  /** Two or three lines about the service for the home project card. */
  blurb?: string;
  role: string;
  /** One verified contribution or design decision for the project card. */
  focus: string;
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
  /** Optional implementation narrative for projects better explained by design decisions. */
  implementationStory?: ImplementationStory;
  /** Optional closing line printed under the troubleshooting list. */
  troubleshootingNote?: string;
  /** Documented design/implementation decisions. Used for projects that don't
   *  (yet) have a measured troubleshooting write-up, so nothing is invented. */
  designNotes?: Troubleshooting[];
  performance: PerfCase[];
  demo: DemoScreen[];
  /** Screenshot captured from the project's real frontend source. */
  preview: { src: string; alt: string; kind?: "screen" | "diagram" };
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

/** Verbatim excerpt from a project repository, shown on the detail page. */
export type CodeExcerpt = {
  title: string;
  /** repository and ref the excerpt was copied from */
  repo: string;
  /** repo-relative path */
  file: string;
  /** e.g. "L50–65" or "L9–13, L31–33" */
  lines: string;
  language: CodeBlock["language"];
  caption: string;
  code: string;
};

export type TestGroup = {
  file: string;
  /** `name` is the test method; `desc` explains it for readers. */
  cases: { name: string; desc: string }[];
};

export type ProjectEvidence = {
  flow?: {
    title: string;
    steps: { label: string; detail?: string; guard?: boolean }[];
    guards: string[];
  };
  /** keyed by troubleshooting id, or "implementation" for implementationStory */
  cases: Record<string, { code: CodeExcerpt[]; tests: TestGroup[] }>;
};

/** A 3–5 s silent loop recorded from the project's real frontend with demo data. */
export type DemoClip = {
  id: string;
  /** public path to the MP4 */
  src: string;
  /** public path to the first-frame poster */
  poster: string;
  title: string;
  caption: string;
  device: "desktop" | "phone";
};
