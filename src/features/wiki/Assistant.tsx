"use client";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { Job, Source, Suggestion, WorkspaceApi } from "@/lib/api/model";
export default function Assistant({
  api,
  sources,
  selected,
  onApply,
  onSource,
  local,
}: {
  api: WorkspaceApi;
  sources: Source[];
  selected: string[];
  onApply: (s: Suggestion[]) => void;
  onSource: (id: string) => void;
  local: boolean;
}) {
  const [purpose, setPurpose] = useState("메모 요약"),
    [job, setJob] = useState<Job | null>(null),
    [excluded, setExcluded] = useState<number[]>([]),
    [error, setError] = useState(""),
    [requesting, setRequesting] = useState(false);
  const requestId = useRef(""),
    generation = useRef(0);
  useEffect(() => {
    let live = true;
    const initial = generation.current;
    api
      .latestJob()
      .then((v) => {
        if (live && initial === generation.current) setJob(v);
      })
      .catch(() => {
        if (live) setError("최근 작업을 읽을 수 없습니다.");
      });
    return () => {
      live = false;
    };
  }, [api]);
  const running = job?.status === "running" || job?.status === "queued";
  useEffect(() => {
    if (!job || !running) return;
    let disposed = false,
      timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const latest = await api.jobStatus(job.id);
        if (!disposed) {
          setJob(latest);
          setError("");
        }
      } catch {
        if (!disposed) {
          setError("작업 상태를 확인할 수 없습니다. 다시 조회합니다.");
          timer = setTimeout(poll, 4000);
        }
      }
    };
    timer = setTimeout(poll, 1500);
    return () => {
      disposed = true;
      clearTimeout(timer);
    };
  }, [api, job, running]);
  async function start() {
    setError("");
    setRequesting(true);
    setExcluded([]);
    const turn = ++generation.current;
    requestId.current ||= crypto.randomUUID();
    try {
      const next = await api.job(purpose, selected, requestId.current);
      if (generation.current === turn) {
        setJob(next);
        requestId.current = "";
      }
    } catch {
      setError("생성 요청을 확인하지 못했습니다. 같은 요청으로 재시도하세요.");
    } finally {
      setRequesting(false);
    }
  }
  const inputs = running ? (job.source_ids ?? selected) : selected;
  return (
    <aside className="assistant">
      <h2>
        <Sparkles size={19} /> AI 정리
      </h2>
      <p>
        {local
          ? "로컬 검토에서는 선택한 원문을 테스트 제안으로 표시합니다."
          : "수집 자료로 제안을 만들고 문단별로 검토합니다."}
      </p>
      <h3>입력 자료</h3>
      {inputs.length ? (
        inputs.map((id) => (
          <small key={id}>{sources.find((s) => s.id === id)?.title}</small>
        ))
      ) : (
        <p>수집함에서 자료를 선택하세요.</p>
      )}
      <label>
        정리 목적
        <select
          disabled={running}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          {[
            "메모 요약",
            "중복 정리",
            "원인과 해결",
            "문서 연결 제안",
            "글 초안",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <button
        disabled={!selected.length || running || requesting}
        onClick={start}
      >
        {error ? "재시도" : "제안 생성"}
      </button>
      {running && (
        <button
          onClick={async () => {
            try {
              setJob(await api.jobStatus(job!.id, true));
            } catch {
              setError("취소 요청을 확인하지 못했습니다.");
            }
          }}
        >
          생성 취소
        </button>
      )}
      <p role="status">
        {job &&
          {
            queued: "대기 중",
            running: "생성 중",
            completed: "검토할 제안",
            failed: "생성 실패",
            cancelled: "취소됨",
          }[job.status]}{" "}
        {error || job?.error}
      </p>
      {job?.status === "completed" && (
        <>
          {job.result?.map((s, i) => (
            <label key={i} className="suggestion">
              <input
                type="checkbox"
                checked={!excluded.includes(i)}
                onChange={() =>
                  setExcluded((v) =>
                    v.includes(i) ? v.filter((n) => n !== i) : [...v, i],
                  )
                }
              />
              {s.text}
              <small>
                {s.sourceIds.length
                  ? s.sourceIds.map((id) => (
                      <button
                        type="button"
                        key={id}
                        onClick={(e) => {
                          e.preventDefault();
                          onSource(id);
                        }}
                      >
                        {sources.find((x) => x.id === id)?.title ?? "원문 보기"}
                      </button>
                    ))
                  : "출처 확인 필요"}
              </small>
            </label>
          ))}
          <button
            disabled={!job.result?.some((_, i) => !excluded.includes(i))}
            onClick={() =>
              onApply(job.result!.filter((_, i) => !excluded.includes(i)))
            }
          >
            선택 문단으로 새 문서 작성
          </button>
        </>
      )}
    </aside>
  );
}
