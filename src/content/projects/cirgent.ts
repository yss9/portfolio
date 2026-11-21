import type { Project } from "../types";

export const cirgent: Project = {
  slug: "cirgent",
  no: "09",
  name: "CIRGENT",
  tagline: "AI 기반 회로 검증 자동화",
  summary:
    "CIRGENT는 데이터시트에서 AI로 검증 규칙을 추출하고, 부품 목록(BOM)과 회로 연결 정보(넷리스트)를 바탕으로 설계를 검토하는 엔지니어용 웹 도구입니다. 검증 결과와 판단 근거를 리포트와 회로도에서 확인할 수 있습니다.",
  period: "2026",
  team: "6인 팀",
  program: "삼성 내부 프로젝트",
  role: "프론트엔드 성능 측정 및 개선",
  focus:
    "가상 대량 데이터에서 렌더 병목을 찾아 핀 400개 회로도의 클릭 렌더를 856.6 ms에서 9.1 ms로 줄였습니다.",
  teamShort: "6인 팀 · 프론트엔드",
  stack: [
    { group: "Frontend", items: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "React Router"] },
    { group: "데이터 · 시각화", items: ["TanStack Query", "SVG"] },
    { group: "측정 · 검증", items: ["React Profiler", "Node.js", "Vitest", "Playwright"] },
  ],
  stackFlat: ["React 19", "TypeScript", "Vite", "TanStack Query", "SVG"],
  links: [],
  preview: {
    kind: "diagram",
    src: "/projects/cirgent/render-benchmark.png",
    alt: "핀 400개 가상 IC의 회로도 클릭 렌더 시간. 개선 전 856.6 ms, 개선 후 9.1 ms",
  },
  highlights: ["회로도 클릭 렌더 약 94배 단축", "진입 JS 청크 23% 감소"],
  features: [
    {
      title: "대량 회로도의 병목 측정",
      desc: "일반 샘플에서 드러나지 않던 병목을 찾기 위해 가상 대형 보드와 핀 400개 IC를 만들고, React Profiler로 회로도와 부품 목록의 렌더 시간을 따로 측정했습니다.",
    },
    {
      title: "검증 진행 상태와 화면 렌더 분리",
      desc: "자주 변하는 진행 상태를 별도 Context로 분리하고 함수 참조를 안정화해, 폴링 중에도 관련 화면만 다시 그리게 했습니다.",
    },
    {
      title: "작업 이력의 반복 계산 제거",
      desc: "리포트 객체를 키로 한 WeakMap에 보드 변환 결과를 저장하고, 같은 리포트를 다시 그릴 때 그 결과를 재사용했습니다.",
    },
    {
      title: "라우트 단위 코드 분할",
      desc: "초기 화면에 포함되던 업로드·검증 화면 코드를 동적 import로 옮겨 해당 경로에 진입할 때 불러오게 했습니다.",
    },
  ],
  architecture: [
    {
      id: "review-ui",
      label: "React 워크스페이스",
      role: "파일 업로드, 검증 진행 상태, 작업 이력과 판정 근거를 제공",
      band: "client",
    },
    {
      id: "validation",
      label: "AI 규칙 추출 · 검증",
      role: "데이터시트에서 규칙을 구조화하고 설계 데이터와 비교해 판정 결과를 생성",
      band: "server",
    },
    {
      id: "rendering",
      label: "SVG 회로도 · 리포트",
      role: "판정 항목의 위치와 근거를 보여주고 회로도를 내보내기 출력에 재사용",
      band: "client",
    },
  ],
  architectureIntent:
    "검증 진행 상태와 결과 데이터를 따로 구독하고, 화면용 회로도를 PDF와 이미지 출력에서도 공유합니다.",
  troubleshooting: [
    {
      id: "svg-rendering",
      title: "회로 연결선 하나를 선택할 때 수천 요소가 다시 그려짐",
      problem:
        "선택 상태가 모든 SVG 요소에 공통으로 전달되는 객체 안에 있어, 강조할 연결선을 바꿀 때 화면 전체에 렌더 비용이 생겼습니다.",
      solution:
        "강조 여부를 부모에서 계산해 불리언 값으로 전달하고, 같은 핀 행의 요소를 모아 행 단위로 memo를 적용했습니다.",
      steps: [
        {
          label: "재현",
          title: "작은 샘플에 없던 문제를 가상 IC로 재현",
          body: "핀 400개짜리 가상 IC를 구성하고 같은 브라우저 세션에서 선택 동작을 반복해 개발 모드의 렌더 시간을 비교했습니다.",
        },
        {
          label: "분석",
          title: "요소별 memo를 적용한 뒤 남은 비용 추적",
          body: "다시 렌더된 행과 props 참조를 세어 보니 변경되는 행은 소수였고, 부모가 약 2,600개 요소를 훑는 비용이 남았습니다. 핀 행을 묶어 순회 단위를 약 330개로 줄였습니다.",
        },
        {
          label: "검증",
          title: "PDF와 이미지 출력에 쓰이는 SVG 비교",
          body: "블록, 강조, 팔레트, 표시 모드를 조합한 SVG 252가지의 해시를 수정 전후로 비교해 결과가 모두 같음을 확인했습니다.",
        },
      ],
      takeaway:
        "회로도 클릭 렌더를 약 94배 단축했고, 핀 행 묶음의 순서와 구성을 검증하는 단위 테스트를 추가했습니다.",
    },
    {
      id: "parts-list",
      title: "회로도 클릭 비용의 78%를 차지한 부품 목록",
      problem:
        "회로도에서 항목을 선택할 때 판정 결과를 다시 집계하면서 화면 왼쪽의 부품 목록 210줄도 함께 다시 그려졌습니다.",
      solution:
        "판정 함수 참조를 고정하고 결과 집계에 useMemo, 부품 행에 memo를 적용했습니다.",
      steps: [
        {
          label: "측정",
          title: "클릭 시간을 화면 영역별로 측정",
          body: "React Profiler를 회로도, 부품 목록, 상세 영역에 각각 적용했습니다. 클릭 렌더에 든 235 ms 중 184 ms가 부품 목록에서 발생했습니다.",
        },
        {
          label: "해결",
          title: "선택 변경 시 기존 집계와 행 재사용",
          body: "집계 조건에 쓰는 함수가 동일한 입력에서는 같은 참조를 유지하게 바꿨습니다. 결과가 그대로인 행은 이전 렌더를 재사용할 수 있게 했습니다.",
        },
      ],
      takeaway: "가상 보드의 부품 목록 한 번 렌더 시간을 184 ms에서 32 ms로 줄였습니다.",
    },
  ],
  performance: [
    {
      id: "render-times",
      title: "회로도 클릭과 검증 폴링",
      summary: "상태 변경에 필요한 화면만 다시 그리도록 수정한 뒤 같은 동작을 비교했습니다.",
      condition:
        "React Profiler actualDuration · 개발 모드 반복 측정 중앙값 · 가상 IC 400핀, 가상 보드 210블록 · 폴링 6초",
      metrics: [
        { label: "회로도 클릭 렌더", before: "856.6 ms", after: "9.1 ms", delta: "−98.9%" },
        { label: "부품 목록 클릭 렌더", before: "184 ms", after: "32 ms", delta: "−83%" },
        { label: "폴링 중 무관한 화면의 렌더", before: "789 ms", after: "0 ms" },
      ],
    },
    {
      id: "history-cache",
      title: "작업 이력 재계산",
      summary: "이미 변환한 리포트의 보드 데이터를 재사용해 목록을 다시 그릴 때 계산을 줄였습니다.",
      condition: "Node.js 벤치마크 · 가상 대형 리포트 10개 · 워밍업 후 반복 측정 중앙값",
      metrics: [
        { label: "작업 이력 다시 그리기", before: "210.9 ms", after: "1.6 ms", delta: "−99.2%" },
      ],
    },
    {
      id: "entry-bundle",
      title: "진입 자바스크립트 크기",
      summary: "업로드 화면 청크는 7.3 KB 늘었지만 첫 화면에서 내려받는 코드는 줄었습니다.",
      condition: "Vite 프로덕션 빌드 · gzip 기준",
      metrics: [
        { label: "진입 JS 청크", before: "165.1 KB", after: "126.8 KB", delta: "−23%" },
        { label: "랜딩 첫 화면 JS 합계", before: "287.3 KB", after: "246.3 KB", delta: "−14%" },
      ],
    },
  ],
  demo: [],
};
