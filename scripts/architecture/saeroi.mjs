/**
 * 새로이(SAEROI) system architecture, from deploy/docker-compose.yml,
 * deploy/nginx/nginx.conf and backend application.yml of the saeroi repo.
 */
const diagram = {
  width: 1800,
  height: 990,
  groups: [
    { id: "ec2", x: 290, y: 70, w: 990, h: 800, tone: "gray", logo: "docker", title: "SSAFY EC2 · Docker Compose" },
    { id: "external", x: 1320, y: 70, w: 450, h: 800, tone: "purple", title: "외부 연동", dashed: false },
  ],
  boxes: [
    {
      id: "wallet", x: 30, y: 60, w: 230, h: 200, tone: "blue", title: "MetaMask 지갑",
      logos: ["glyph:wallet"], bullets: ["브라우저에서 서명", "ethers.js 연동"],
    },
    {
      id: "user", x: 30, y: 290, w: 230, h: 330, tone: "blue", title: "사용자",
      logos: ["glyph:users"], logoSize: 56,
      bullets: ["공급업체", "가공업체", "브랜드 담당자", "구매자", "관리자"],
    },
    {
      id: "jenkins", x: 320, y: 125, w: 250, h: 180, tone: "orange", title: "Jenkins",
      logos: ["jenkins"], bullets: ["이미지 빌드", "운영·테스트 재배포"],
    },
    {
      id: "nginx", x: 320, y: 335, w: 250, h: 235, tone: "blue", title: "Nginx",
      logos: ["nginx"], bullets: ["HTTPS · 리버스 프록시", "/ → 프론트엔드", "/api → 백엔드", "/jenkins · /test 스택"],
    },
    {
      id: "frontend", x: 320, y: 640, w: 250, h: 210, tone: "blue", title: "React Frontend",
      logos: ["react", "typescript", "vite"], logoSize: 38,
      bullets: ["React · TypeScript · Vite", "TanStack Query", "ethers.js 지갑 서명"],
    },
    {
      id: "backend", x: 620, y: 125, w: 630, h: 420, tone: "green", title: "Spring Boot Backend",
      subtitle: "Java 21 · Spring Boot · JPA", logos: ["spring"], logoSize: 64, layout: "side",
      sections: [
        { title: "업무 도메인", bullets: ["소재 거래·가공·생산·판매 API", "카카오페이 결제 · 이탈 거래 정리"] },
        { title: "AI 에이전트", bullets: ["업무 도구 31개", "쓰기 17개는 승인 카드로 실행", "승인 시점 최신 상태 재검증"] },
        { title: "블록체인 연동", bullets: ["지갑 서명 영수증 확인 워커", "관리자 실시간 블록 SSE"] },
        { title: "파일 · OCR", bullets: ["증빙 파일 저장 (볼륨 · MinIO)", "계근표 OCR·무게 인식 요청"] },
      ],
    },
    {
      id: "mysql", x: 620, y: 610, w: 190, h: 240, tone: "green", title: "MySQL 8.0",
      logos: ["mysql"], logoSize: 64, bullets: ["거래·생산 상태", "대화 이력", "승인 대기 작업"],
    },
    {
      id: "storage", x: 830, y: 610, w: 220, h: 240, tone: "orange", title: "파일 저장소",
      subtitle: "STORAGE_TYPE으로 선택", logos: ["glyph:hard-drive", "minio"], logoSize: 40,
      bullets: ["기본: Docker 볼륨", "s3 설정 시 MinIO", "증빙 · 제품 이미지"],
    },
    {
      id: "ocr", x: 1070, y: 610, w: 180, h: 240, tone: "green", title: "AI 서버", subtitle: "FastAPI · 내부망",
      logos: ["fastapi"], logoSize: 44, bullets: ["계근표 OCR", "저울 무게 인식"],
    },
    {
      id: "besu", x: 1345, y: 125, w: 400, h: 250, tone: "purple", title: "Hyperledger Besu",
      subtitle: "SSAFY 외부 노드 · Chain ID 31221", logos: ["glyph:blocks"], logoSize: 60, layout: "side",
      bullets: ["MaterialToken", "Marketplace", "ProcessingRegistry", "ProductionRegistry"],
    },
    {
      id: "gms", x: 1345, y: 405, w: 400, h: 170, tone: "purple", title: "SSAFY GMS",
      logos: ["claude", "openai"], logoSize: 40, layout: "side",
      bullets: ["LLM 프록시 (Claude · OpenAI)", "에이전트 도구 호출"],
    },
    {
      id: "kakao", x: 1345, y: 605, w: 400, h: 180, tone: "purple", title: "Kakao API",
      logos: ["kakao"], logoSize: 52, layout: "side",
      bullets: ["카카오페이 결제 준비·승인", "카카오 로컬: 주소 → 좌표"],
    },
  ],
  edges: [
    { from: ["user", "right"], to: ["nginx", "left"], fromAbs: 455, toAbs: 455, tone: "blue", label: "HTTPS", labelDy: -17 },
    { from: ["nginx", "bottom"], to: ["frontend", "top"], tone: "blue", label: "/ 화면", labelDx: 46 },
    { from: ["nginx", "right"], to: ["backend", "left"], fromAbs: 452, toAbs: 452, tone: "blue", label: "/api", labelDy: -17 },
    { from: ["jenkins", "right"], to: ["backend", "left"], fromAbs: 215, toAbs: 215, tone: "orange", label: "빌드·배포", labelDy: -17 },
    { from: ["backend", "bottom"], to: ["mysql", "top"], fromAbs: 715, toAbs: 715, tone: "green", label: "JPA" },
    { from: ["backend", "bottom"], to: ["storage", "top"], fromAbs: 940, toAbs: 940, tone: "orange", label: "파일 업로드" },
    { from: ["backend", "bottom"], to: ["ocr", "top"], fromAbs: 1160, toAbs: 1160, tone: "green", label: "OCR·무게 인식" },
    { from: ["backend", "right"], to: ["besu", "left"], fromAbs: 250, toAbs: 250, tone: "purple", label: "영수증 확인", labelDy: -17 },
    { from: ["backend", "right"], to: ["gms", "left"], fromAbs: 490, toAbs: 490, tone: "purple", label: "LLM 호출", labelDy: -17 },
    { from: ["backend", "right"], to: ["kakao", "left"], fromAbs: 528, toAbs: 695, mid: 1298, tone: "purple", label: "결제·주소", labelSegment: 1, labelDx: 0 },
    {
      from: ["wallet", "top"], to: ["besu", "top"], toAbs: 1545,
      points: [[null, 34], [1545, 34]], tone: "purple", label: "트랜잭션 서명·전송",
    },
  ],
  legendBox: { x: 30, y: 905, w: 1740, h: 62 },
  legend: [
    ["blue", "파란색: 사용자 요청 흐름"],
    ["green", "초록색: 데이터 조회·저장"],
    ["purple", "보라색: 외부 API · 블록체인"],
    ["orange", "주황색: 파일 업로드 · 배포"],
  ],
};

export default diagram;
