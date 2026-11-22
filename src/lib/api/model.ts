import type { PartialBlock } from "@blocknote/core";
export type Source = {
  id: string;
  kind: string;
  title: string;
  original_text: string;
  original_url?: string;
  private_file_key?: string;
  created_at: string;
  tags: string[];
};
export type Doc = {
  id: string;
  title: string;
  blocks_json: PartialBlock[];
  source_ids: string[];
  related_ids: string[];
  tags: string[];
  revision: number;
};
export type Task = {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  document_id?: string | null;
};
export type Suggestion = { text: string; sourceIds: string[] };
export type Job = {
  id: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  result?: Suggestion[];
  source_ids?: string[];
  action?: string;
  error?: string;
};
export type PublicImage = { name: string; alt: string };
export type Snapshot = {
  slug: string;
  title: string;
  paragraphs: string[];
  images?: PublicImage[];
};
export type Draft = {
  id: string;
  document_id: string;
  content_revision: number;
  snapshot: Snapshot;
};
export type Publication = {
  id: string;
  draft_id: string;
  status: "deploying" | "published" | "failed";
  deployment_id?: string;
  error?: string;
};
export type Collection = {
  sources: Source[];
  documents: Doc[];
  tasks: Task[];
  drafts: Draft[];
  publications: Publication[];
};
export const emptyCollection = (): Collection => ({
  sources: [],
  documents: [],
  tasks: [],
  drafts: [],
  publications: [],
});
export interface WorkspaceApi {
  load(): Promise<Collection>;
  capture(title: string, text: string, url: string, file?: File): Promise<void>;
  file(key: string): Promise<string>;
  save(doc: Doc): Promise<Doc>;
  versions(id: string): Promise<Doc[]>;
  task(title: string, documentId?: string): Promise<void>;
  move(id: string, status: Task["status"]): Promise<void>;
  job(action: string, sourceIds: string[], id: string): Promise<Job>;
  latestJob(): Promise<Job | null>;
  jobStatus(id: string, cancel?: boolean): Promise<Job>;
  previewImage(draftId: string, name: string): Promise<string>;
  review(doc: Doc, slug: string, imageIds: string[]): Promise<Draft>;
  publish(id: string, requestId: string): Promise<Publication>;
  deployment(id: string): Promise<Publication>;
}
