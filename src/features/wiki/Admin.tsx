"use client";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Brand } from "../desktop/Identity";
import {
  apiBase,
  login,
  logoutOwner,
  remoteApi,
  session,
} from "@/lib/api/spring";
import type { WorkspaceApi } from "@/lib/api/model";
const Workspace = dynamic(() => import("./Workspace"));
export default function Admin() {
  const [api, setApi] = useState<WorkspaceApi | null>(null),
    [local, setLocal] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (!apiBase) return;
    let live = true;
    const expired = () => {
      setApi(null);
      setMessage("세션이 만료되었습니다. 다시 로그인하세요.");
    };
    window.addEventListener("workspace-session-expired", expired);
    session()
      .then((state) => {
        if (live && state.authenticated) setApi(remoteApi());
      })
      .catch(() => {
        if (live) setMessage("관리자 서버에 연결할 수 없습니다.");
      });
    return () => {
      live = false;
      window.removeEventListener("workspace-session-expired", expired);
    };
  }, []);
  const logout = useCallback(async () => {
    if (!local) await logoutOwner();
    setApi(null);
    setLocal(false);
  }, [local]);
  if (api) return <Workspace api={api} logout={logout} local={local} />;
  return (
    <div className="os-shell entry">
      <header className="os-bar">
        <Brand />
        <span className="bar-spacer" />
        <Link href="/desktop/">공개 데스크톱</Link>
      </header>
      <div className="entry-center">
        <section className="login-card">
          <LockKeyhole size={30} />
          <h1>개인 작업 공간</h1>
          {apiBase ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (busy) return;
                setBusy(true);
                setMessage("");
                const f = new FormData(e.currentTarget);
                try {
                  await login(
                    String(f.get("email")),
                    String(f.get("password")),
                  );
                  setApi(remoteApi());
                } catch {
                  setMessage("로그인에 실패했습니다. 계정 정보를 확인하세요.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label>
                이메일
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="username"
                />
              </label>
              <label>
                비밀번호
                <input
                  required
                  type="password"
                  name="password"
                  autoComplete="current-password"
                />
              </label>
              <button className="solid-button" disabled={busy}>
                로그인
              </button>
            </form>
          ) : (
            <p>
              관리자 인증 서버 연결이 필요합니다. 연결 후 소유자 계정으로
              로그인할 수 있습니다.
            </p>
          )}
          <p role="status">{message}</p>
          {process.env.NODE_ENV === "development" && !apiBase && (
            <button
              className="solid-button"
              onClick={async () => {
                const { localApi } = await import("@/lib/api/local");
                setLocal(true);
                setApi(localApi());
              }}
            >
              로컬 개발 검토 열기
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
