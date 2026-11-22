import type { Project } from "../types";

export const cirgentServiceFeatures = [
  {
    title: "부품 데이터시트에서 규칙 생성",
    desc: "AI가 동작 전압, 커패시터 용량 같은 조건과 출처를 정리합니다. 부품별 기준은 Rule DB에서 확인합니다.",
  },
  {
    title: "BOM·넷리스트 자동 검증",
    desc: "부품 목록과 연결 정보를 보드 단위로 묶어 올립니다. 등록한 규칙을 적용한 뒤 판정 분포와 부품별 결과를 확인합니다.",
  },
  {
    title: "기준값과 설계값 비교",
    desc: "예를 들어 입력 커패시터 기준이 10 µF인데 4.7 µF가 연결된 경우, 판정 상세에서 기준과 실제 값, 관련 위치를 함께 확인합니다.",
  },
  {
    title: "블록 회로도에서 연결 추적",
    desc: "부품의 핀과 넷을 선택하면 같은 연결을 쓰는 주변 블록까지 따라가며 검토할 수 있습니다.",
  },
  {
    title: "수동 검토와 작업 이력",
    desc: "자동으로 확정하기 어려운 CHECK 항목은 엔지니어가 근거를 확인해 PASS 또는 FAIL로 기록합니다. 작업 이력에서 남은 검토를 찾습니다.",
  },
  {
    title: "PDF 보고서 내보내기",
    desc: "최종 판정과 오류 항목별 근거를 A4 보고서로 내보냅니다. 리포트에서 판정·분류로 필터링하고 부품·핀·넷으로 찾을 수 있습니다.",
  },
];

export const cirgent: Project = {
  slug: "cirgent",
  no: "09",
  name: "CIRGENT",
  note: {
    headline: "판정 결과에서 회로의 근거까지",
    contribution: "결과 검토와 작업 이력 화면을 만들었습니다. 엔지니어가 판정을 수정하고, 다른 화면으로 이동한 뒤에도 남은 검토를 이어갈 수 있게 했습니다. 로그인·회원가입과 랜딩 페이지를 구현하고, 대형 회로도에서 핀을 선택할 때 발생하는 렌더링 지연을 개선했습니다.",
  },
  tagline: "설계 규칙 추출부터 회로 검증과 보고서까지",
  summary:
    "부품 데이터시트에서 검증 규칙을 만들고, 부품 목록(BOM)과 넷리스트를 올려 회로를 검증하는 엔지니어용 웹 도구입니다. 기준값과 실제 설계값을 대조하고, 블록 회로도에서 연결을 추적하며, 자동 판정이 어려운 항목은 직접 검토해 PDF 보고서에 반영합니다.",
  period: "2026.10 ~ 2026.11",
  team: "6인 팀",
  program: "삼성청년 SW·AI 아카데미 기업연계 프로젝트",
  role: "프론트엔드 · 결과 검토·작업 이력, 성능 개선, 인증·랜딩",
  focus:
    "결과 검토와 작업 이력, 로그인·회원가입, 랜딩을 구현했습니다. 가상 대형 보드에서 렌더링 병목을 측정해 검증 폴링, 작업 이력, 부품 목록, SVG 회로도를 개선하고 라우트별로 번들을 분리했습니다. 기업연계 보안 요건에 따라 프로젝트 소스는 비공개입니다.",
  teamShort: "SSAFY 기업연계 · 프론트엔드",
  stack: [
    { group: "프론트엔드", items: ["React 19", "TypeScript", "Vite", "TanStack Query", "React Router", "SVG"] },
    { group: "검증 서버", items: ["Python", "FastAPI"] },
    { group: "테스트", items: ["MSW", "Vitest", "Playwright"] },
  ],
  stackFlat: ["React", "TypeScript", "TanStack Query", "Playwright"],
  links: [],
  preview: {
    src: "/projects/cirgent/summary.webp",
    alt: "CIRGENT의 샘플 보드 검증 요약 화면. 판정 분포와 부품별 검증 결과가 보입니다.",
    kind: "screen",
  },
  screenshots: [
    {
      src: "/projects/cirgent/summary.webp",
      alt: "샘플 보드를 연 CIRGENT 화면에서 FAIL·CHECK·PASS 분포, 부품별 결과와 수동 판정 상태를 확인할 수 있습니다.",
      caption: "검증 요약 — 샘플 보드의 판정 분포와 부품별 결과",
      fit: "contain",
    },
    {
      src: "/projects/cirgent/detail.webp",
      alt: "샘플 회로의 입력 커패시터 검증 기준과 실제 값, 입력 핀을 강조한 회로도가 함께 보이는 상세 창",
      caption: "판정 근거 — 규칙의 기준값과 설계값을 비교하고 관련 핀을 확인",
      fit: "contain",
    },
    {
      src: "/projects/cirgent/block.webp",
      alt: "샘플 보드의 부품 목록과 선택한 MCU 블록의 SVG 회로도",
      caption: "블록 회로도 — 부품 목록에서 관심 블록을 골라 핀과 연결을 확인",
      fit: "contain",
    },
    {
      src: "/projects/cirgent/report.webp",
      alt: "샘플 보드에서 FAIL을 선택해 위반 사유를 부품별로 확인하는 리포트 화면",
      caption: "리포트 — 판정으로 필터링한 항목과 부품별 검증 근거",
      fit: "contain",
    },
    {
      src: "/projects/cirgent/rules.webp",
      alt: "샘플 부품의 검증 기준, 대상 핀, 데이터시트 출처를 보여 주는 규칙 관리 화면",
      caption: "규칙 관리 — 부품별 검증 기준과 데이터시트 근거 확인",
      fit: "contain",
    },
  ],
  highlights: ["근거 중심 회로 검토", "400핀 가상 블록 렌더 856.6 ms → 9.1 ms", "SVG 출력 252건 동일"],
  features: [
    {
      title: "판정과 근거를 대조하는 검토 화면",
      desc: "검토 화면에서 FAIL·CHECK 항목을 우선 탐색할 수 있도록 구성했습니다. 검토자는 부품을 선택해 기준값, 설계값, 관련 핀과 회로도를 함께 확인하고, 자동 판정이 모호하면 수동으로 판정을 남길 수 있습니다.",
      category: "프론트엔드",
    },
    {
      title: "남은 검토를 보여주는 작업 이력",
      desc: "검증 중인 보드, 확인할 부품이 남은 보드, 검토가 끝난 보드를 구분했습니다. 이력과 요약 화면이 같은 기준으로 진행률을 계산해 검토를 재개할 보드를 찾기 쉽습니다.",
      category: "프론트엔드",
    },
    {
      title: "큰 회로도에서도 필요한 요소만 다시 렌더링",
      desc: "React Profiler로 병목을 확인하고 넷과 부품의 선택 상태가 관련 핀 행에만 전달되도록 개선했습니다. 가상 400핀 블록에서 클릭당 React 렌더 시간 중앙값이 856.6 ms에서 9.1 ms로 줄었고 SVG 출력 252건이 기존과 일치했습니다.",
      category: "성능 개선",
    },
    {
      title: "변경마다 실행하는 화면 테스트",
      desc: "CI에서 코드 검사, 단위 테스트와 빌드를 실행하도록 구성했습니다. Playwright 브라우저 테스트는 MSW 샘플 응답을 사용해 검토 흐름을 반복 검증했습니다.",
      category: "테스트 · CI",
    },
    ...cirgentServiceFeatures.map((feature) => ({ ...feature, category: "팀 전체 기능" })),
  ],
  architecture: [
    { id: "viewer", label: "React 뷰어", role: "검증 진행, 회로도와 결과 검토 화면을 표시합니다.", band: "client" },
    { id: "analysis", label: "FastAPI 검증 서버", role: "BOM과 넷리스트를 읽고 설계 규칙에 따른 검증 결과를 반환합니다.", band: "server" },
    { id: "overrides", label: "브라우저 저장소", role: "리포트별로 수동 판정과 보정 기록을 보관합니다.", band: "data" },
  ],
  architectureIntent: "자동 검증 결과와 엔지니어의 보정 기록을 함께 조회할 수 있습니다.",
  troubleshooting: [
    {
      id: "review-navigation",
      title: "화면을 옮기면 직전에 수정한 판정이 사라지는 문제",
      problem:
        "결과 검토 화면에서 판정을 바꾸고 바로 회로도로 이동하면 이전 판정이 다시 나타났습니다.",
      steps: [
        {
          label: "원인",
          title: "두 화면이 같은 기록을 읽는 시점",
          body: "변경을 0.4초 동안 모아서 저장하는 사이에 새 화면이 먼저 열렸습니다. 이때 브라우저 저장소에서 읽은 이전 값이 방금 수정한 판정을 덮어썼습니다.",
        },
        {
          label: "수정",
          title: "저장을 기다리는 값도 화면 간에 공유",
          body: "공용 저장 훅이 아직 기록하지 않은 값을 저장 키별로 보관하도록 바꿨습니다. 같은 리포트를 여는 화면은 대기 중인 최신 값으로 시작합니다.",
        },
      ],
      takeaway: "수동 판정 직후 회로도로 전환하는 브라우저 테스트로 두 화면에서 같은 판정이 보이는지 확인했습니다.",
    },
  ],
  performance: [
    {
      id: "svg-rendering",
      title: "넷을 선택할 때 회로도의 관련 핀 행만 다시 그림",
      summary: "넷은 같은 신호를 공유하는 핀들의 연결입니다. 넷 선택을 바꿀 때 회로도 전역이 다시 그려지는 비용과, 부모가 SVG 요소를 전부 순회하는 비용을 차례로 줄였습니다.",
      before: { label: "개선 전", notes: ["선택 상태가 공용 객체에 들어 있어 관련 없는 SVG 요소도 새 참조를 받았습니다. 요소별 메모이제이션을 적용한 뒤에도 부모가 매번 약 2,600개 요소를 순회했습니다."] },
      after: { label: "개선 후", notes: ["선택된 넷과 부품이 포함된 행에만 강조 상태를 전달하고, 같은 핀 행의 요소를 그리기 순서대로 묶어 재사용했습니다. SVG 출력 252건의 해시가 변경 전과 일치했습니다."] },
      metrics: [
        { label: "가상 400핀 블록 클릭 렌더", before: "856.6 ms", after: "9.1 ms", delta: "−98.9%", better: "lower" },
        { label: "일반 블록 클릭 렌더", before: "74.9 ms", after: "7.5 ms", delta: "−90.0%", better: "lower" },
      ],
      condition: "개발 모드 React Profiler 실제 렌더 시간, 같은 브라우저 세션에서 클릭 16회 중앙값. 가상 400핀 IC는 SVG 노드 11,806개를 포함합니다.",
    },
    {
      id: "polling-isolation",
      title: "검증 폴링을 진행 상태 화면에만 반영",
      summary: "1초 간격 폴링의 응답이 도착할 때마다 진행 상황과 관계없는 회로도 화면까지 다시 그려지는 문제를 해결했습니다.",
      before: { label: "개선 전", notes: ["검증 진행 상태와 화면 설정이 같은 Context에 있었고 함수 참조도 매번 바뀌어 구독 화면 전체가 다시 렌더링됐습니다."] },
      after: { label: "개선 후", notes: ["진행 상태 Context를 분리하고 함수 참조를 고정했습니다. 같은 상태를 받은 경우 기존 값을 재사용했습니다."] },
      metrics: [{ label: "회로도 렌더 합계 (폴링 6초)", before: "789 ms", after: "0 ms", delta: "−100%", better: "lower" }],
      condition: "가상 대형 보드, 개발 모드 React Profiler, 6초 측정 3회 중앙값. 진행 상태 화면은 계속 갱신합니다.",
    },
    {
      id: "history-cache",
      title: "작업 이력에서 보드 변환 결과를 재사용",
      summary: "리포트가 도착하거나 작업 이력이 다시 그려질 때, 기존 리포트 전체의 보드 변환을 반복하는 비용을 줄였습니다.",
      before: { label: "개선 전", notes: ["검증 결과를 보드 모델로 변환하고 체크포인트를 모으는 계산을 리포트마다 다시 수행했습니다."] },
      after: { label: "개선 후", notes: ["원본 리포트 참조와 보드 변환 조건으로 WeakMap 캐시를 구성했습니다. 수동 판정은 그때그때 반영해 최신 상태를 유지했습니다."] },
      metrics: [
        { label: "리포트 10건 반복 계산", before: "210.9 ms", after: "1.6 ms", delta: "−99.2%", better: "lower" },
        { label: "첫 로딩 최대 렌더 구간", before: "3,654 ms", after: "849 ms", delta: "−77%", better: "lower" },
      ],
      condition: "리포트 10건 기준. 반복 계산은 워밍업 뒤 Node 벤치마크 중앙값, 첫 로딩은 개발 모드 브라우저 측정입니다.",
    },
    {
      id: "parts-list",
      title: "회로도 클릭과 부품 목록 집계를 분리",
      summary: "화면을 구간별로 프로파일링해 대형 보드의 클릭 렌더 비용 중 약 78%가 부품 목록에서 발생하는 것을 확인했습니다.",
      before: { label: "개선 전", notes: ["선택한 핀이 바뀌면 판정 내용이 그대로여도 목록에서 블록 210개의 체크포인트를 다시 세고 모든 행을 렌더링했습니다."] },
      after: { label: "개선 후", notes: ["판정 조회 함수의 참조를 안정화하고 집계와 행을 메모이제이션했습니다. 판정이나 목록이 바뀔 때만 집계를 다시 계산합니다."] },
      metrics: [{ label: "부품 목록 클릭 렌더", before: "184 ms", after: "32 ms", delta: "−83%", better: "lower" }],
      condition: "개발 모드 React Profiler. 샘플을 확장한 가상 대형 보드 기준이며 블록 210개와 검증 결과 1,560건을 사용했습니다.",
    },
    {
      id: "route-bundles",
      title: "공개 랜딩과 검증 앱의 코드를 라우트에 따라 로딩",
      summary: "랜딩 방문자가 검증 워크스페이스 코드까지 받던 초기 로딩 구조를 바꿨습니다.",
      before: { label: "개선 전", notes: ["라우터가 앱 화면을 정적 import해 최초 진입 청크에 함께 포함했습니다."] },
      after: { label: "개선 후", notes: ["React Router의 라우트 지연 로딩으로 앱 화면을 열 때 청크를 가져오도록 변경했습니다. 파일 불러오기 화면의 초기 전송량은 7.3 KB 늘었습니다."] },
      metrics: [
        { label: "진입 JS 청크 (gzip)", before: "165.1 KB", after: "126.8 KB", delta: "−23%", better: "lower" },
        { label: "랜딩 최초 JS 전송량 (gzip)", before: "287.3 KB", after: "246.3 KB", delta: "−14%", better: "lower" },
      ],
      condition: "Vite 프로덕션 빌드 결과. 랜딩의 값은 진입 청크와 정적 의존 청크의 gzip 크기 합계입니다.",
    },
  ],
  demo: [],
};
