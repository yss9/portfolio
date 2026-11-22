import {
  emptyCollection,
  type WorkspaceApi,
  type Doc,
  type Job,
} from "./model";
import { imageExtension, maxImageBytes } from "./images";
import { publicParagraphs } from "./public-text";
export function localApi(): WorkspaceApi {
  if (process.env.NODE_ENV !== "development")
    throw new Error("개발 전용 어댑터");
  const data = emptyCollection(),
    versions = new Map<string, Doc[]>(),
    jobs = new Map<string, Job>(),
    files = new Map<string, File>();
  return {
    async load() {
      return structuredClone(data);
    },
    async capture(title, text, url, file) {
      const id = crypto.randomUUID();
      if (file) files.set(id, file);
      data.sources.unshift({
        id,
        title,
        kind: file ? "file" : url ? "url" : "memo",
        original_text: text,
        original_url: url,
        private_file_key: file ? id : undefined,
        created_at: new Date().toISOString(),
        tags: [],
      });
    },
    async file(key) {
      const file = files.get(key);
      if (!file) throw Error("파일을 찾을 수 없습니다.");
      return URL.createObjectURL(file);
    },
    async save(doc) {
      const old = data.documents.find((d) => d.id === doc.id);
      if (doc.revision !== (old?.revision ?? 0))
        throw Error("문서 버전이 충돌했습니다.");
      const next = structuredClone({ ...doc, revision: doc.revision + 1 });
      data.documents = [next, ...data.documents.filter((d) => d.id !== doc.id)];
      versions.set(doc.id, [next, ...(versions.get(doc.id) ?? [])]);
      return next;
    },
    async versions(id) {
      return structuredClone(versions.get(id) ?? []);
    },
    async task(title, documentId) {
      data.tasks.push({
        id: crypto.randomUUID(),
        title,
        status: "todo",
        document_id: documentId,
      });
    },
    async move(id, status) {
      const task = data.tasks.find((t) => t.id === id);
      if (task) task.status = status;
    },
    async job(action, sourceIds, id) {
      const existing = jobs.get(id);
      if (existing) return existing;
      const job: Job = {
        id,
        action,
        source_ids: sourceIds,
        status: "queued",
        result: data.sources
          .filter((s) => sourceIds.includes(s.id))
          .map((s) => ({
            text: s.original_text || s.title,
            sourceIds: [s.id],
          })),
      };
      jobs.set(id, job);
      return job;
    },
    async latestJob() {
      return [...jobs.values()].at(-1) ?? null;
    },
    async jobStatus(id, cancel) {
      const job = jobs.get(id)!;
      if (job.status === "queued")
        job.status = cancel ? "cancelled" : "completed";
      return structuredClone(job);
    },
    async previewImage(draftId, name) {
      const draft = data.drafts.find((d) => d.id === draftId);
      const file = files.get(name);
      if (!draft?.snapshot.images?.some((img) => img.name === name) || !file)
        throw Error("이미지를 찾지 못했습니다.");
      return URL.createObjectURL(file);
    },
    async review(doc, slug, imageIds) {
      const saved = data.documents.find(
        (d) => d.id === doc.id && d.revision === doc.revision,
      );
      if (!saved) throw Error("저장된 버전을 확인하세요.");
      const images = [];
      for (const id of imageIds) {
        const source = data.sources.find((s) => s.id === id),
          file = files.get(id);
        if (
          !source ||
          !doc.source_ids.includes(id) ||
          !file ||
          file.size > maxImageBytes
        )
          throw Error("첨부를 확인하세요.");
        const ext = imageExtension(
          new Uint8Array(await file.slice(0, 8).arrayBuffer()),
        );
        if (!ext) throw Error("PNG 또는 JPEG를 선택하세요.");
        const name = crypto.randomUUID() + "." + ext;
        files.set(name, file);
        images.push({ name, alt: source.title });
      }
      const snapshot = {
        images,
        slug,
        title: saved.title,
        paragraphs: publicParagraphs(saved.blocks_json),
      };
      if (!snapshot.paragraphs.length) throw Error("공개할 문단이 없습니다.");
      const draft = {
        id: crypto.randomUUID(),
        document_id: doc.id,
        content_revision: doc.revision,
        snapshot,
      };
      data.drafts.unshift(draft);
      return draft;
    },
    async publish(draft_id, id) {
      const publication = {
        id,
        draft_id,
        status: "failed" as const,
        error: "로컬 검토 모드에는 배포 서비스가 연결되지 않았습니다.",
      };
      data.publications.unshift(publication);
      return publication;
    },
    async deployment(id) {
      return data.publications.find((p) => p.id === id)!;
    },
  };
}
