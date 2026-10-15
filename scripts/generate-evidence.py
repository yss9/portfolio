"""Generate src/content/evidence.ts from exact line ranges in the project repos.

Every code excerpt is copied verbatim; non-contiguous ranges are joined with a
`// ...` line. Every test name is checked against the test file's source.

Usage (from the portfolio folder): python3 scripts/generate-evidence.py
The project repositories are expected next to this portfolio folder.
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
POTNER = WORKSPACE / "potner" / "potner-server"
SAEROI = WORKSPACE / "S15P21E104"
SAEROI_REF = "origin/backend/develop"
OUT = ROOT / "src" / "content" / "evidence.ts"


def potner_src(path):
    with open(f"{POTNER}/{path}", encoding="utf-8") as f:
        return f.read().split("\n")


def saeroi_src(path):
    out = subprocess.run(
        ["git", "-C", str(SAEROI), "show", f"{SAEROI_REF}:{path}"],
        check=True, capture_output=True, text=True,
    ).stdout
    return out.split("\n")


def is_doc(block):
    return all(
        not l.strip() or l.strip().startswith(("/**", "*", "*/")) for l in block
    )


def excerpt(lines, ranges):
    picked = []
    for a, b in ranges:
        block = lines[a - 1 : b]
        assert block, (a, b)
        picked.append(block)
    # Doc-comment blocks keep their own indentation; code blocks share one dedent.
    code_lines = [l for block in picked if not is_doc(block) for l in block if l.strip()]
    indent = min(len(l) - len(l.lstrip(" ")) for l in code_lines) if code_lines else 0
    out = []
    for i, block in enumerate(picked):
        if not is_doc(block):
            block = [l[indent:] if l.strip() else "" for l in block]
        if i > 0:
            nxt = next(l for l in block if l.strip())
            pad = len(nxt) - len(nxt.lstrip(" "))
            out.append(" " * pad + "// ...")
        out.extend(block)
    while out and not out[-1].strip():
        out.pop()
    return "\n".join(out)


def label(ranges):
    return ", ".join(f"L{a}" if a == b else f"L{a}–{b}" for a, b in ranges)


def code(src, repo, path, ranges, title, caption):
    return {
        "title": title,
        "repo": repo,
        "file": path,
        "lines": label(ranges),
        "language": "java",
        "caption": caption,
        "code": excerpt(src(path), ranges),
    }


def tests(src, path, cases):
    text = "\n".join(src(path))
    for name, _ in cases:
        assert f"void {name}(" in text, f"missing test {name} in {path}"
    return {
        "file": path,
        "cases": [{"name": n, "desc": d} for n, d in cases],
    }


SA = "src/main/java/com/ssafy/upcycle/agent"
ST = "src/test/java/com/ssafy/upcycle/agent"
PA = "backend/src/main/java/com/potner/command/application"
PT = "backend/src/test/java/com/potner/command/application"
SAEROI_REPO = f"S15P21E104 · {SAEROI_REF}"
POTNER_REPO = "potner-server · Server-master"


def ko(name):
    return name.replace("_", " ")


evidence = {
    "saeroi": {
        "flow": {
            "title": "AI 도구 호출이 실제 작업이 되기까지",
            "steps": [
                {"label": "도구 호출", "detail": "모델이 업무 도구 31개 중 하나를 선택"},
                {"label": "읽기·쓰기 분기", "detail": "읽기 14개는 바로 실행, 쓰기 17개는 실행하지 않음", "guard": True},
                {"label": "확인 카드", "detail": "이미 끝난 일이거나 같은 대상의 카드가 열려 있으면 만들지 않음", "guard": True},
                {"label": "승인 시 재검증", "detail": "대화 소유자·유효기간·이미 처리됐는지 다시 확인", "guard": True},
                {"label": "도메인 실행", "detail": "기존 도메인 서비스가 업무 규칙을 최종 검사"},
            ],
            "guards": [
                "결제(PAYMENT)·확인(CONFIRM)·지갑 서명(WALLET_SIGN) 카드는 사용자가 화면에서 승인해야만 실행됩니다.",
                "방금 끝난 지갑 서명은 승인에 트랜잭션 해시가 함께 와서, 자기 카드를 '이미 처리됨'으로 오판하지 않습니다.",
            ],
        },
        "cases": {
            "stale-model-state": {
                "code": [
                    code(saeroi_src, SAEROI_REPO, f"{SA}/service/AgentTurnStore.java", [(85, 98)],
                         "실제 업무 상태를 두 번째 system 메시지로",
                         "턴을 시작할 때 서버가 읽은 거래·가공·생산 상태를 기본 프롬프트와 분리해 넣고, 그 뒤에 대화 이력을 붙입니다."),
                ],
                "tests": [
                    tests(saeroi_src, f"{ST}/AgentEventStateTests.java", [
                        ("막힌_단계는_매_턴_시스템_프롬프트로_들어간다", ko("막힌_단계는_매_턴_시스템_프롬프트로_들어간다")),
                    ]),
                ],
            },
            "approval-staleness": {
                "code": [
                    code(saeroi_src, SAEROI_REPO, f"{SA}/service/AgentToolExecutor.java",
                         [(76, 76), (90, 97), (102, 109)],
                         "쓰기 도구는 실행하지 않고 카드로",
                         "쓰기 도구는 실행 대신 확인 카드를 만들고, 같은 대상의 카드가 이미 열려 있으면 새로 만들지 않습니다. 읽기 도구만 바로 실행됩니다."),
                    code(saeroi_src, SAEROI_REPO, f"{SA}/service/AgentActionStore.java",
                         [(73, 82), (86, 97)],
                         "승인 시점에 다시 확인",
                         "카드의 소유자는 대화를 통해, 유효기간과 처리 여부는 승인 순간에 다시 확인합니다. 화면에서 먼저 처리된 일은 실패가 아니라 '이미 됨'으로 닫습니다."),
                ],
                "tests": [
                    tests(saeroi_src, f"{ST}/AgentChatServiceTests.java", [
                        (n, ko(n)) for n in [
                            "읽기_tool_은_바로_실행되고_결과가_모델에게_돌아간다",
                            "쓰기_tool_은_실행되지_않고_확인_카드만_만든다",
                        ]
                    ]),
                    tests(saeroi_src, f"{ST}/AgentStaleActionTests.java", [
                        (n, ko(n)) for n in [
                            "이미_체인에_기록된_거래에는_카드를_띄우지_않는다",
                            "카드를_만든_뒤_화면에서_먼저_처리했으면_승인해도_실행되지_않는다",
                            "방금_한_서명이_자기_카드를_이미_처리됨으로_닫지_않는다",
                            "해시가_없는_승인은_이미_처리됨_판정을_그대로_받는다",
                        ]
                    ]),
                    tests(saeroi_src, f"{ST}/PendingActionServiceTests.java", [
                        (n, ko(n)) for n in [
                            "같은_액션을_두_번_승인할_수_없다",
                            "남의_액션은_건드릴_수_없다",
                        ]
                    ]),
                    tests(saeroi_src, f"{ST}/BrandStepAutoProposeTests.java", [
                        (n, ko(n)) for n in [
                            "자동으로_띄운_카드를_모델이_또_띄우지_못한다",
                            "다른_거래의_카드는_막지_않는다",
                        ]
                    ]),
                ],
            },
        },
    },
    "potner": {
        "flow": {
            "title": "자동 급수 체인",
            "steps": [
                {"label": "수분 부족 감지", "detail": "토양 수분 LOW 알림이 커밋된 뒤 시작"},
                {"label": "스테이션 이동", "detail": "급수량 미설정·물 부족이면 시작하지 않음"},
                {"label": "급수", "detail": "회신을 대조한 뒤 다음 명령 발행", "guard": True},
                {"label": "송풍", "detail": "설정 시, 이동 없이 스테이션에서 환기"},
                {"label": "대기 장소 복귀", "detail": "송풍이 실패해도 복귀는 진행"},
            ],
            "guards": [
                "각 명령은 DB 커밋이 끝난 뒤에만 MQTT로 발행합니다.",
                "다음 단계는 완료된 명령의 종류·목적지·발행 주체로 정합니다. 체인 상태를 따로 저장하지 않아 서버가 재시작해도 회신이 오면 이어집니다.",
                "명령이 실패·BUSY·타임아웃으로 끝나면 재시도하지 않고 체인을 멈춥니다. 결과만 유실된 급수를 다시 보내면 물이 두 번 나갈 수 있기 때문입니다.",
            ],
        },
        "cases": {
            "implementation": {
                "code": [
                    code(potner_src, POTNER_REPO, f"{PA}/AutoWateringOrchestrator.java",
                         [(37, 39), (162, 169), (173, 182)],
                         "완료된 명령으로 다음 단계 결정",
                         "체인 상태 테이블 없이, 회신된 명령의 종류와 목적지만으로 급수·송풍·복귀를 이어갑니다."),
                    code(potner_src, POTNER_REPO, f"{PA}/DeviceCommandPublishListener.java",
                         [(9, 13), (31, 33), (47, 52)],
                         "커밋이 끝난 명령만 발행",
                         "장치가 몇 ms 만에 회신해도 결과 처리기가 requestId를 찾을 수 있도록, 명령 저장이 커밋된 뒤에 MQTT로 내보냅니다."),
                    code(potner_src, POTNER_REPO, f"{PA}/DeviceCommandResultService.java",
                         [(21, 25), (50, 65)],
                         "회신을 반영하기 전 검증 순서",
                         "요청·장치·명령 종류를 대조하고, QoS 1 재전송은 상태 검사보다 먼저 messageId로 걸러냅니다."),
                ],
                "tests": [
                    tests(potner_src, f"{PT}/AutoWateringOrchestratorTest.java", [
                        ("skipsTheRunWhenNoWateringAmountIsConfigured", "급수량이 설정되지 않았으면 체인을 시작하지 않음"),
                        ("skipsTheRunWhenTheStationReportsWaterLow", "스테이션 물이 부족하면 시작하지 않음"),
                        ("failureStopsTheRunWithoutRetry", "명령이 실패하면 재시도 없이 체인 중단"),
                        ("ventilationFailureStillSendsTheRobotHome", "송풍이 실패해도 로봇은 대기 장소로 복귀"),
                        ("userIssuedCommandsNeverContinueTheChain", "사용자가 직접 내린 명령은 자동 체인을 잇지 않음"),
                    ]),
                    tests(potner_src, f"{PT}/DeviceCommandResultServiceTest.java", [
                        ("ignoresADuplicateRedelivery", "같은 messageId의 재전송은 무시"),
                        ("overwritesATimedOutCommandWithTheLateResult", "타임아웃 뒤 늦게 온 회신은 실제 결과로 반영"),
                        ("rejectsAResultFromADifferentDevice", "다른 장치에서 온 회신 거부"),
                        ("rejectsAnUnknownRequestId", "알 수 없는 requestId 거부"),
                    ]),
                    tests(potner_src, "backend/src/test/java/com/potner/PotnerApplicationTests.java", [
                        ("concurrentDuplicateMessageStoresOnlyOneReading", "같은 센서 메시지가 동시에 두 번 와도 한 건만 저장 (Testcontainers MySQL)"),
                    ]),
                ],
            },
        },
    },
}

header = '''/**
 * Code and test evidence shown on the project detail pages.
 *
 * GENERATED from the project repositories by copying exact line ranges, so
 * every excerpt is verbatim. Non-contiguous ranges are joined with `// ...`.
 * Test names were checked against the test sources; the tests were not run
 * as part of generating this file.
 */
import type { ProjectEvidence } from "./types";

export const evidence: Record<string, ProjectEvidence> = '''
with open(OUT, "w", encoding="utf-8") as f:
    f.write(header + json.dumps(evidence, ensure_ascii=False, indent=2) + ";\n")
print("ok", OUT)
