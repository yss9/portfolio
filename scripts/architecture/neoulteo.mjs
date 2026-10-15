/**
 * 너울터(Neoulteo) system architecture, from backend application.properties,
 * the Spring AI / Spring Batch / routing packages, frontend vite.config.js and
 * the separate ai-server (FastAPI) of the neoulteo repo. Runs locally.
 */
const diagram = {
  width: 1800,
  height: 990,
  groups: [
    {
      id: "backend", x: 660, y: 50, w: 560, h: 830, tone: "green", logo: "spring",
      title: "Spring Boot Backend", subtitle: "/neoulteo · JWT", dashed: false,
    },
  ],
  boxes: [
    {
      id: "user", x: 30, y: 170, w: 220, h: 270, tone: "blue", title: "사용자",
      logos: ["glyph:users"], logoSize: 56, bullets: ["여행자", "커뮤니티 관리자"],
    },
    {
      id: "vue", x: 310, y: 110, w: 290, h: 440, tone: "blue", title: "Vue Frontend",
      logos: ["vuedotjs", "vite"], logoSize: 38, sectionCols: 1,
      sections: [
        { title: "기술", bullets: ["Vue 3 · Vite · Vue Router", "카카오맵 JS SDK"] },
        { title: "주요 화면", bullets: ["SVG 지도 홈", "관광지 검색", "일차별 여행 계획", "핫플레이스 · 커뮤니티", "AI 여행 도우미"] },
      ],
    },
    {
      id: "kakao", x: 310, y: 615, w: 290, h: 130, tone: "purple", title: "카카오맵",
      logos: ["kakao"], logoSize: 46, layout: "side", bullets: ["지도 · 장소 핀 표시", "브라우저에서 SDK 호출"],
    },
    {
      id: "lab", x: 30, y: 770, w: 570, h: 110, tone: "gray", dashed: true, layout: "side",
      title: "실험용 FastAPI AI 서버", logos: ["fastapi"], logoSize: 36,
      bullets: ["ChromaDB · sentence-transformers 문서 검색", "PDF 업로드 · GMS 모델로 답변"],
    },
    {
      id: "core", x: 685, y: 105, w: 510, h: 205, tone: "green", title: "도메인 API", cols: 2,
      bullets: ["회원 · JWT 인증", "관광지 검색", "여행 계획 · 공유 코드", "핫플레이스", "커뮤니티 · 이미지 업로드", "경로 탐색 (TMAP)"],
    },
    {
      id: "ai", x: 685, y: 335, w: 510, h: 235, tone: "green", title: "Spring AI 여행 도우미",
      logos: ["glyph:bot"], logoSize: 48, layout: "side",
      bullets: [
        "도구 호출: 관광지 검색 · 축제/행사 검색 · 날씨(연동 구조만)",
        "RAG: MySQL 관광지 후보 → 임베딩 유사도 재정렬 → 상위 K개",
        "프롬프트에 실제 관광지 근거를 붙여 답변",
      ],
    },
    {
      id: "batch", x: 685, y: 600, w: 510, h: 255, tone: "green", title: "Spring Batch · TourAPI 동기화",
      steps: ["수집", "비교·upsert", "AI 요약", "PDF 리포트"], stepsDir: "row",
      bullets: ["콘텐츠 타입 8종 수집", "ON DUPLICATE KEY UPDATE로 갱신", "호출 한도 시 받은 데이터로 계속 진행"],
    },
    {
      id: "tmap", x: 1290, y: 105, w: 230, h: 140, tone: "purple", title: "TMAP",
      logos: ["glyph:route"], logoSize: 40, layout: "side", bullets: ["자동차 경로", "거리 · 시간"],
    },
    {
      id: "gms", x: 1290, y: 335, w: 230, h: 175, tone: "purple", title: "SSAFY GMS",
      logos: ["openai"], logoSize: 40, layout: "side", bullets: ["gpt-4o-mini", "임베딩 모델", "배치 변경 요약"],
    },
    {
      id: "tourapi", x: 1290, y: 655, w: 230, h: 140, tone: "purple", title: "TourAPI",
      subtitle: "공공데이터포털", logos: ["glyph:landmark"], logoSize: 40, layout: "side", bullets: ["관광지 콘텐츠"],
    },
    {
      id: "mysql", x: 1580, y: 105, w: 190, h: 525, tone: "green", title: "MySQL", subtitle: "MyBatis",
      logos: ["mysql"], logoSize: 64,
      bullets: ["관광지", "여행 계획", "핫플레이스", "커뮤니티", "배치 메타데이터", "동기화 리포트"],
    },
    {
      id: "files", x: 1580, y: 665, w: 190, h: 190, tone: "orange", title: "파일 저장", subtitle: "로컬 폴더",
      logos: ["glyph:folder-open"], logoSize: 40, bullets: ["커뮤니티 이미지", "배치 PDF 리포트"],
    },
  ],
  edges: [
    { from: ["user", "right"], to: ["vue", "left"], fromAbs: 300, toAbs: 300, tone: "blue", label: "페이지 이용", labelDy: -17 },
    { from: ["vue", "right"], to: ["core", "left"], fromAbs: 190, toAbs: 190, tone: "blue", label: "REST API", labelDy: -17 },
    { from: ["core", "left"], to: ["vue", "right"], fromAbs: 265, toAbs: 265, tone: "green", label: "JSON 응답", labelDy: 17 },
    { from: ["vue", "bottom"], to: ["kakao", "top"], tone: "purple", label: "지도 SDK", labelDx: 52 },
    {
      from: ["vue", "left"], to: ["lab", "top"], fromAbs: 505, toAbs: 150, tone: "gray", dashed: true,
      label: "Spring AI 체크 해제 시 · PDF 업로드", labelSegment: 1, labelAt: 0.55,
    },
    { from: ["core", "right"], to: ["tmap", "left"], fromAbs: 175, toAbs: 175, tone: "purple", label: "경로 요청", labelDy: -17 },
    { from: ["core", "right"], to: ["mysql", "left"], fromAbs: 290, toAbs: 290, tone: "green", label: "MyBatis 조회·저장", labelDx: 70 },
    { from: ["ai", "right"], to: ["gms", "left"], fromAbs: 420, toAbs: 420, tone: "purple", label: "대화·임베딩", labelDy: -17 },
    { from: ["ai", "right"], to: ["mysql", "left"], fromAbs: 550, toAbs: 550, tone: "green", label: "RAG 후보 조회", labelDx: 70 },
    { from: ["batch", "right"], to: ["mysql", "left"], fromAbs: 618, toAbs: 618, tone: "green", label: "비교·upsert", labelDx: 70, labelDy: 0 },
    { from: ["batch", "right"], to: ["tourapi", "left"], fromAbs: 725, toAbs: 725, tone: "purple", label: "수집", labelDy: -17 },
    { from: ["batch", "right"], to: ["files", "left"], fromAbs: 830, toAbs: 830, tone: "orange", label: "이미지 · PDF 저장", labelDx: 70 },
  ],
  legendBox: { x: 30, y: 905, w: 1740, h: 62 },
  legend: [
    ["blue", "파란색: 사용자 요청 흐름"],
    ["green", "초록색: 데이터 조회·저장"],
    ["purple", "보라색: 외부 API 연동"],
    ["orange", "주황색: 파일 저장"],
    ["gray", "회색 점선: 실험용 구성", true],
  ],
};

export default diagram;
