"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { Brand } from "../desktop/Identity";
import {
  emptyCollection,
  type Collection,
  type Doc,
  type Source,
  type WorkspaceApi,
} from "@/lib/api/model";
import { publicParagraphs } from "@/lib/api/public-text";
import Assistant from "./Assistant";
import PreviewImage from "./PreviewImage";
const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => <p>편집기를 여는 중입니다.</p>,
});
const sections = ["수집함", "Wiki", "작업", "초안", "발행"] as const;
type Section = (typeof sections)[number];
function newDoc(): Doc {
  return {
    id: crypto.randomUUID(),
    title: "",
    blocks_json: [],
    source_ids: [],
    related_ids: [],
    tags: [],
    revision: 0,
  };
}
function safeUrl(input: string) {
  try {
    const u = new URL(input);
    return ["http:", "https:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
}
export default function Workspace({
  api,
  logout,
  local,
}: {
  api: WorkspaceApi;
  logout: () => Promise<void>;
  local: boolean;
}) {
  const [data, setData] = useState<Collection>(emptyCollection),
    [section, setSection] = useState<Section>("수집함"),
    [selected, setSelected] = useState<string[]>([]),
    [source, setSource] = useState<Source | null>(null);
  const [doc, setDoc] = useState<Doc | null>(null),
    [dirty, setDirty] = useState(false),
    [editorVersion, setEditorVersion] = useState(0),
    [history, setHistory] = useState<Doc[]>([]),
    [filter, setFilter] = useState("");
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [draftId, setDraftId] = useState(""),
    [slug, setSlug] = useState("");
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [pending, setPending] = useState<(() => void) | null>(null);
  const requestVersion = useRef(0);
  const lock = useRef(false),
    releaseIds = useRef(new Map<string, string>());
  useEffect(() => {
    let live = true;
    const version = ++requestVersion.current;
    api
      .load()
      .then((d) => {
        if (live && version === requestVersion.current) setData(d);
      })
      .catch(() => {
        if (live) setMessage("목록을 불러오지 못했습니다.");
      });
    return () => {
      live = false;
    };
  }, [api]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function run(fn: () => Promise<void>, success = "") {
    if (lock.current) return false;
    lock.current = true;
    const version = ++requestVersion.current;
    setBusy(true);
    setMessage("처리 중");
    try {
      await fn();
      const latest = await api.load();
      if (version === requestVersion.current) setData(latest);
      setMessage(success);
      return true;
    } catch (e) {
      setMessage(
        "작업 실패 · " +
          (e instanceof Error
            ? e.message
            : typeof e === "object" && e && "message" in e
              ? String(e.message)
              : "연결 상태를 확인하세요."),
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function guard(fn: () => void) {
    if (lock.current) return;
    if (dirty) setPending(() => fn);
    else fn();
  }
  function choose(d: Doc) {
    setImageIds([]);
    setDoc(structuredClone(d));
    setDirty(!d.revision);
    setHistory([]);
    setEditorVersion((v) => v + 1);
    setSection("Wiki");
    setSlug("note-" + d.id.slice(0, 8));
    setMessage("");
  }
  function edit(patch: Partial<Doc>) {
    setDoc((d) => (d ? { ...d, ...patch } : d));
    setDirty(true);
  }
  async function save() {
    if (!doc?.title.trim()) {
      setMessage("문서 제목을 입력하세요.");
      return false;
    }
    return run(async () => {
      setDoc(await api.save(doc));
      setDirty(false);
    }, "저장됨");
  }
  function navigate(s: Section) {
    guard(() => {
      setSection(s);
      setMessage("");
    });
  }
  function toggleSource(id: string) {
    setSelected((v) =>
      v.includes(id) ? v.filter((x) => x !== id) : [...v, id],
    );
  }
  const draft = data.drafts.find((d) => d.id === draftId) ?? data.drafts[0];
  const activeRelease = data.publications.find((p) => p.status === "deploying");
  const currentPublications = new Map<string, string>();
  for (const release of data.publications) {
    const slug = data.drafts.find((d) => d.id === release.draft_id)?.snapshot
      .slug;
    if (
      release.status === "published" &&
      slug &&
      !currentPublications.has(slug)
    )
      currentPublications.set(slug, release.id);
  }
  useEffect(() => {
    if (!activeRelease) return;
    let done = false,
      timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        await api.deployment(activeRelease!.id);
        const version = requestVersion.current;
        const latest = await api.load();
        if (!done && !lock.current && version === requestVersion.current)
          setData(latest);
      } catch {
        if (!done) setMessage("배포 상태를 확인하지 못했습니다.");
      }
      if (!done) timer = setTimeout(poll, 5000);
    }
    timer = setTimeout(poll, 4000);
    return () => {
      done = true;
      clearTimeout(timer);
    };
  }, [api, activeRelease]);
  return (
    <div className="workspace">
      <header className="os-bar">
        <Brand />
        <span>개인 작업 공간</span>
        <span className="bar-spacer" />
        <button
          onClick={() =>
            guard(() => {
              void logout().catch(() => setMessage("로그아웃 실패"));
            })
          }
        >
          {local ? "검토 종료" : "로그아웃"}
        </button>
      </header>
      {local && (
        <p className="local-banner">
          로컬 개발 검토 · 현재 탭의 메모리에만 저장됩니다.
        </p>
      )}
      <div className="wiki-layout">
        <nav aria-label="개인 작업 공간">
          {sections.map((s) => (
            <button
              key={s}
              aria-current={section === s}
              onClick={() => navigate(s)}
            >
              {s}
            </button>
          ))}
        </nav>
        <div className="wiki-body">
          <h1>{section}</h1>
          <p role="status" className="save-state">
            {busy ? "처리 중" : message || (dirty ? "편집 중" : "")}
          </p>
          <fieldset disabled={busy}>
            {section === "수집함" && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget,
                      f = new FormData(form);
                    const url = String(f.get("url") ?? "");
                    if (url && !safeUrl(url)) {
                      setMessage("http 또는 https 주소를 입력하세요.");
                      return;
                    }
                    const file = f.get("file") as File;
                    void run(async () => {
                      await api.capture(
                        String(f.get("title")).trim(),
                        String(f.get("text")),
                        url,
                        file?.size ? file : undefined,
                      );
                      form.reset();
                    }, "수집함에 저장됨");
                  }}
                >
                  <label>
                    자료 제목
                    <input name="title" required maxLength={240} />
                  </label>
                  <label>
                    메모 또는 원문
                    <textarea name="text" rows={3} />
                  </label>
                  <label>
                    출처 URL
                    <input name="url" type="url" placeholder="https://" />
                  </label>
                  <label>
                    비공개 첨부파일
                    <input type="file" name="file" />
                  </label>
                  <button className="solid-button">자료 저장</button>
                </form>
                <p>GitHub 자동 수집 · 연결 필요</p>
                {data.sources.map((s) => (
                  <div className="source-row" key={s.id}>
                    <input
                      type="checkbox"
                      aria-label={s.title + " AI 입력"}
                      checked={selected.includes(s.id)}
                      onChange={() => toggleSource(s.id)}
                    />
                    <button onClick={() => setSource(s)}>{s.title}</button>
                    <small>
                      {new Date(s.created_at).toLocaleDateString("ko-KR")}
                    </small>
                  </div>
                ))}
                {source && (
                  <article>
                    <h3>{source.title}</h3>
                    <p>{source.original_text}</p>
                    {source.original_url && safeUrl(source.original_url) && (
                      <a
                        href={safeUrl(source.original_url)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        원문 열기
                      </a>
                    )}
                    {source.private_file_key && (
                      <button
                        onClick={() =>
                          void run(async () => {
                            const a = document.createElement("a");
                            a.href = await api.file(source.private_file_key!);
                            a.download = source.title;
                            a.click();
                            if (a.href.startsWith("blob:")) setTimeout(() => URL.revokeObjectURL(a.href), 1000);
                          })
                        }
                      >
                        첨부 다운로드
                      </button>
                    )}
                  </article>
                )}
              </>
            )}
            {section === "Wiki" && (
              <>
                <label>
                  문서 검색
                  <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="제목 또는 태그"
                  />
                </label>
                <button onClick={() => guard(() => choose(newDoc()))}>
                  새 문서
                </button>
                <div className="wiki-list">
                  {data.documents
                    .filter((d) =>
                      [d.title, ...d.tags]
                        .join(" ")
                        .toLowerCase()
                        .includes(filter.toLowerCase()),
                    )
                    .map((d) => (
                      <button key={d.id} onClick={() => guard(() => choose(d))}>
                        {d.title} · v{d.revision}
                      </button>
                    ))}
                </div>
                {doc && (
                  <>
                    <label>
                      문서 제목
                      <input
                        value={doc.title}
                        onChange={(e) => edit({ title: e.target.value })}
                      />
                    </label>
                    <label>
                      태그
                      <input
                        value={doc.tags.join(",")}
                        onChange={(e) =>
                          edit({ tags: e.target.value.split(",") })
                        }
                        placeholder="쉼표로 구분"
                      />
                    </label>
                    <Editor
                      key={editorVersion}
                      initial={doc.blocks_json}
                      change={(blocks) => edit({ blocks_json: blocks })}
                      disabled={busy}
                    />
                    <details>
                      <summary>연결된 자료 {doc.source_ids.length}개</summary>
                      {data.sources.map((s) => (
                        <label key={s.id}>
                          <input
                            type="checkbox"
                            checked={doc.source_ids.includes(s.id)}
                            onChange={() =>
                              edit({
                                source_ids: doc.source_ids.includes(s.id)
                                  ? doc.source_ids.filter((id) => id !== s.id)
                                  : [...doc.source_ids, s.id],
                              })
                            }
                          />
                          {s.title}
                        </label>
                      ))}
                    </details>
                    <details>
                      <summary>관련 문서 {doc.related_ids.length}개</summary>
                      {data.documents
                        .filter((d) => d.id !== doc.id)
                        .map((d) => (
                          <div key={d.id}>
                            <label>
                              <input
                                type="checkbox"
                                checked={doc.related_ids.includes(d.id)}
                                onChange={() =>
                                  edit({
                                    related_ids: doc.related_ids.includes(d.id)
                                      ? doc.related_ids.filter(
                                          (id) => id !== d.id,
                                        )
                                      : [...doc.related_ids, d.id],
                                  })
                                }
                              />
                              {d.title}
                            </label>
                            {doc.related_ids.includes(d.id) && (
                              <button onClick={() => guard(() => choose(d))}>
                                관련 문서 열기
                              </button>
                            )}
                          </div>
                        ))}
                    </details>
                    <button
                      className="solid-button"
                      onClick={() => void save()}
                    >
                      문서 저장
                    </button>
                    {doc.revision > 0 && (
                      <>
                        <button
                          onClick={() =>
                            void run(async () =>
                              setHistory(await api.versions(doc.id)),
                            )
                          }
                        >
                          수정 이력
                        </button>
                        {history.map((h) => (
                          <details key={h.revision}>
                            <summary>
                              v{h.revision} · {h.title}
                            </summary>
                            {publicParagraphs(h.blocks_json).map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </details>
                        ))}
                        <details>
                          <summary>공개할 첨부 이미지 선택</summary>
                          <p>
                            이 문서에 연결한 PNG·JPEG 중 최대 4개, 파일당
                            2MB까지 공개할 수 있습니다.
                          </p>
                          {data.sources
                            .filter(
                              (s) =>
                                s.kind === "file" &&
                                doc.source_ids.includes(s.id),
                            )
                            .map((s) => (
                              <label key={s.id}>
                                <input
                                  type="checkbox"
                                  checked={imageIds.includes(s.id)}
                                  disabled={
                                    !imageIds.includes(s.id) &&
                                    imageIds.length >= 4
                                  }
                                  onChange={() =>
                                    setImageIds((ids) =>
                                      ids.includes(s.id)
                                        ? ids.filter((id) => id !== s.id)
                                        : [...ids, s.id],
                                    )
                                  }
                                />
                                {s.title}
                              </label>
                            ))}
                        </details>
                        <label>
                          공개 주소
                          <input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            pattern="note-[a-z0-9-]+"
                          />
                        </label>
                        <button
                          disabled={
                            dirty || !/^note-[a-z0-9-]{1,70}$/.test(slug)
                          }
                          onClick={() =>
                            void run(async () => {
                              const d = await api.review(
                                doc,
                                slug,
                                imageIds.filter((id) =>
                                  doc.source_ids.includes(id),
                                ),
                              );
                              setDraftId(d.id);
                              setSection("초안");
                            }, "검토 버전을 생성했습니다.")
                          }
                        >
                          저장 버전 미리보기
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {section === "작업" && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget,
                      title = String(new FormData(form).get("title")).trim();
                    if (title)
                      void run(async () => {
                        await api.task(
                          title,
                          String(new FormData(form).get("document") ?? ""),
                        );
                        form.reset();
                      });
                  }}
                >
                  <label>
                    할 일<input required name="title" />
                  </label>
                  <label>
                    관련 문서
                    <select name="document">
                      <option value="">선택 안 함</option>
                      {data.documents.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button>작업 추가</button>
                </form>
                {data.tasks.map((t) => (
                  <label key={t.id}>
                    {t.title}
                    <select
                      value={t.status}
                      onChange={(e) =>
                        void run(() =>
                          api.move(t.id, e.target.value as typeof t.status),
                        )
                      }
                    >
                      <option value="todo">할 일</option>
                      <option value="doing">진행 중</option>
                      <option value="done">완료</option>
                    </select>
                  </label>
                ))}
              </>
            )}
            {section === "초안" && (
              <>
                {data.drafts.length === 0 ? (
                  <p>Wiki에서 저장한 버전의 공개 미리보기를 만드세요.</p>
                ) : (
                  <label>
                    검토할 버전
                    <select
                      value={draft?.id}
                      onChange={(e) => setDraftId(e.target.value)}
                    >
                      {data.drafts.map((d) => (
                        <option value={d.id} key={d.id}>
                          {d.snapshot.title} · v{d.content_revision}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {draft && (
                  <>
                    <article className="snapshot">
                      <small>
                        공개 미리보기 · v{draft.content_revision} · /records/
                        {draft.snapshot.slug}/
                      </small>
                      <h2>{draft.snapshot.title}</h2>
                      {draft.snapshot.images?.map((img) => (
                        <PreviewImage
                          key={draft.id + img.name}
                          api={api}
                          draftId={draft.id}
                          image={img}
                        />
                      ))}
                      {draft.snapshot.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </article>
                    <button
                      disabled={!!activeRelease}
                      onClick={() =>
                        void run(async () => {
                          const request =
                            releaseIds.current.get(draft.id) ??
                            crypto.randomUUID();
                          releaseIds.current.set(draft.id, request);
                          await api.publish(draft.id, request);
                          releaseIds.current.delete(draft.id);
                          setSection("발행");
                        })
                      }
                    >
                      검토한 버전 발행 요청
                    </button>
                  </>
                )}
              </>
            )}
            {section === "발행" && (
              <>
                {!data.publications.length && <p>요청한 배포가 없습니다.</p>}
                {data.publications.map((p) => {
                  const d = data.drafts.find((v) => v.id === p.draft_id);
                  return (
                    <article key={p.id}>
                      <h3>
                        {d?.snapshot.title} · v{d?.content_revision}
                      </h3>
                      <p>
                        {
                          {
                            deploying: "배포 중",
                            published:
                              d &&
                              currentPublications.get(d.snapshot.slug) === p.id
                                ? "현재 공개 버전"
                                : "이전 공개 버전",
                            failed: "배포 실패",
                          }[p.status]
                        }{" "}
                        {p.error}
                      </p>
                      {p.deployment_id && (
                        <small>실행 ID {p.deployment_id}</small>
                      )}
                      {p.status === "published" &&
                        d &&
                        currentPublications.get(d.snapshot.slug) === p.id && (
                          <a href={"/records/" + d.snapshot.slug + "/"}>
                            공개 글 열기
                          </a>
                        )}
                      {p.status === "deploying" && (
                        <button
                          onClick={() =>
                            void run(() =>
                              api.deployment(p.id).then(() => undefined),
                            )
                          }
                        >
                          상태 확인
                        </button>
                      )}
                    </article>
                  );
                })}
              </>
            )}
          </fieldset>
        </div>
        <Assistant
          api={api}
          local={local}
          onSource={(id) =>
            guard(() => {
              setSource(data.sources.find((s) => s.id === id) ?? null);
              setSection("수집함");
            })
          }
          sources={data.sources}
          selected={selected}
          onApply={(items) =>
            guard(() => {
              const d = newDoc();
              d.title = "정리 초안";
              d.source_ids = [...new Set(items.flatMap((s) => s.sourceIds))];
              d.blocks_json = items.map((s) => ({
                type: "paragraph",
                content: [{ type: "text", text: s.text, styles: {} }],
              }));
              choose(d);
            })
          }
        />
      </div>
      <Dialog.Root
        open={!!pending}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="scrim" />
          <Dialog.Content className="command-dialog">
            <Dialog.Title>변경한 문서가 있습니다</Dialog.Title>
            <Dialog.Description>
              이동하기 전에 변경 내용을 저장할 수 있습니다.
            </Dialog.Description>
            <div className="actions">
              <button
                onClick={async () => {
                  if (await save()) {
                    pending?.();
                    setPending(null);
                  }
                }}
              >
                저장 후 이동
              </button>
              <button onClick={() => setPending(null)}>편집 유지</button>
              <button
                onClick={() => {
                  setDirty(false);
                  setDoc(
                    (current) =>
                      data.documents.find((d) => d.id === current?.id) ?? null,
                  );
                  setEditorVersion((v) => v + 1);
                  pending?.();
                  setPending(null);
                }}
              >
                저장 없이 나가기
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
