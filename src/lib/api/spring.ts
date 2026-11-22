import type { WorkspaceApi } from "./model";

export const apiBase = process.env.NEXT_PUBLIC_WORKSPACE_API_URL?.replace(
  /\/$/,
  "",
);
type Session = { authenticated: boolean; csrf: string };

async function request(path: string, init: RequestInit = {}) {
  if (!apiBase) throw new Error("관리자 API 주소를 설정하세요.");
  const response = await fetch(apiBase + path, {
    ...init,
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) {
    if (response.status === 401 && path.startsWith("/workspace")) {
      window.dispatchEvent(new Event("workspace-session-expired"));
    }
    const error = await response.json().catch(() => null);
    throw new Error(error?.error ?? "요청을 완료하지 못했습니다.");
  }
  return response;
}
export async function session(): Promise<Session> {
  return (await request("/session")).json();
}
async function mutate(
  path: string,
  method: string,
  body?: BodyInit,
  json = false,
) {
  const { csrf } = await session();
  const headers = new Headers({ "X-CSRF-TOKEN": csrf });
  if (json) headers.set("Content-Type", "application/json");
  return request(path, { method, headers, body });
}
export async function login(email: string, password: string) {
  await mutate("/login", "POST", new URLSearchParams({ email, password }));
}
export async function logoutOwner() {
  await mutate("/logout", "POST");
}
async function read(path: string) {
  const response = await request("/workspace" + path);
  return response.status === 204 ? null : response.json();
}
async function write(path: string, method: string, body?: unknown) {
  const response = await mutate(
    "/workspace" + path,
    method,
    body === undefined ? undefined : JSON.stringify(body),
    body !== undefined,
  );
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}
async function privateFile(path: string) {
  return URL.createObjectURL(await (await request("/workspace" + path)).blob());
}
export function remoteApi(): WorkspaceApi {
  return {
    load: () => read(""),
    async capture(title, text, url, file) {
      const form = new FormData();
      form.set("title", title);
      form.set("text", text);
      form.set("url", url);
      if (file) form.set("file", file);
      await mutate("/workspace/sources", "POST", form);
    },
    file: (id) => privateFile("/files/" + encodeURIComponent(id)),
    save: (doc) => write("/documents/" + doc.id, "PUT", doc),
    versions: (id) => read("/documents/" + id + "/versions"),
    task: (title, documentId) =>
      write("/tasks", "POST", { title, documentId: documentId || null }),
    move: (id, status) => write("/tasks/" + id, "PATCH", { status }),
    job: (purpose, sourceIds, id) =>
      write("/jobs", "POST", { id, purpose, sourceIds }),
    latestJob: () => read("/jobs/latest"),
    jobStatus: (id, cancel) =>
      cancel ? write("/jobs/" + id + "/cancel", "POST") : read("/jobs/" + id),
    review: (doc, slug, imageIds) =>
      write("/drafts", "POST", {
        id: doc.id,
        revision: doc.revision,
        slug,
        imageIds,
      }),
    previewImage: (id, name) =>
      privateFile("/drafts/" + id + "/images/" + encodeURIComponent(name)),
    publish: (draftId, id) => write("/publications", "POST", { id, draftId }),
    deployment: (id) => read("/publications/" + id),
  };
}
