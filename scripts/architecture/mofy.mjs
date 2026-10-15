/**
 * MOFY system architecture, from backend drfProject/settings.py, the
 * accounts / community / Search apps and the Next.js frontend of the Mofy repo.
 * Runs locally. The message feature is the author's own part.
 */
const diagram = {
  width: 1800,
  height: 990,
  groups: [
    {
      id: "django", x: 670, y: 50, w: 770, h: 830, tone: "green", logo: "django",
      title: "Django REST Backend", subtitle: "Django REST Framework · SimpleJWT", dashed: false,
    },
  ],
  boxes: [
    {
      id: "user", x: 30, y: 180, w: 220, h: 270, tone: "blue", title: "사용자",
      logos: ["glyph:users"], logoSize: 56, bullets: ["일반 사용자", "관리자 (신고 처리)"],
    },
    {
      id: "next", x: 310, y: 110, w: 300, h: 470, tone: "blue", title: "Next.js Frontend",
      logos: ["nextdotjs", "react", "antdesign"], logoSize: 36, sectionCols: 1,
      sections: [
        { title: "기술", bullets: ["Next.js 12 · React 17", "Ant Design · Emotion · Axios"] },
        { title: "주요 화면", bullets: ["홈 (연관 검색어 · 날씨)", "패션(OOTD) 게시판", "중고 거래 · 자유 게시판", "메시지 · 마이페이지"] },
      ],
    },
    {
      id: "weather", x: 310, y: 650, w: 300, h: 140, tone: "purple", title: "OpenWeatherMap",
      logos: ["glyph:cloud-sun"], logoSize: 44, layout: "side", bullets: ["현재 위치 날씨", "브라우저에서 직접 호출"],
    },
    {
      id: "env", x: 30, y: 818, w: 580, h: 62, tone: "gray", dashed: true,
      title: "실행 환경: 로컬 (Next.js ↔ Django :8000)",
    },
    {
      id: "accounts", x: 695, y: 110, w: 345, h: 210, tone: "green", title: "accounts",
      logos: ["glyph:user"], logoSize: 40, layout: "side",
      bullets: ["회원가입 · 로그인 (JWT)", "체형 · 피부 타입 프로필", "프로필 이미지", "아이디 찾기 · 비밀번호 재설정"],
    },
    {
      id: "community", x: 695, y: 345, w: 345, h: 230, tone: "green", title: "community",
      logos: ["glyph:layers"], logoSize: 40, layout: "side",
      bullets: ["boardType: 자유 · 패션 · 거래", "댓글 · 좋아요 · 신고", "스타일 랭킹", "내 글 · 좋아요한 글"],
    },
    {
      id: "message", x: 695, y: 600, w: 345, h: 250, tone: "orange", title: "메시지", badge: "담당 (공동 구현)", highlight: true,
      subtitle: "community 앱 · chat / message_box / message_detail",
      logos: ["glyph:message-square"], logoSize: 44, layout: "side",
      bullets: ["쪽지 보내기", "받은 · 보낸 쪽지함", "쪽지 상세 조회"],
    },
    {
      id: "search", x: 1065, y: 110, w: 345, h: 240, tone: "green", title: "Search",
      logos: ["scikitlearn"], logoSize: 48, layout: "side",
      bullets: ["게시글 검색", "검색 기록 · 인기 검색어", "연관 검색어", "TF-IDF + 코사인 유사도"],
    },
    {
      id: "image", x: 1065, y: 375, w: 345, h: 475, tone: "green", title: "이미지 처리",
      logos: ["python"], logoSize: 40,
      steps: ["사진 업로드", "rembg 배경 제거", "extcolors 주요 색상 추출", "팔레트 이미지 생성"],
      note: "의상 색상만 남겨 팔레트를 만듭니다",
    },
    {
      id: "sqlite", x: 1510, y: 150, w: 260, h: 290, tone: "green", title: "SQLite",
      logos: ["sqlite"], logoSize: 56, bullets: ["사용자", "게시글 · 댓글", "메시지", "검색 기록"],
    },
    {
      id: "media", x: 1510, y: 560, w: 260, h: 230, tone: "orange", title: "Media Storage", subtitle: "Django media 폴더",
      logos: ["glyph:hard-drive"], logoSize: 44, bullets: ["업로드 사진", "팔레트 이미지"],
    },
  ],
  edges: [
    { from: ["user", "right"], to: ["next", "left"], fromAbs: 315, toAbs: 315, tone: "blue", label: "페이지 이용", labelDy: -17 },
    { from: ["next", "right"], to: ["django", "left"], fromAbs: 220, toAbs: 220, tone: "blue", label: "REST API", labelDy: -17 },
    { from: ["django", "left"], to: ["next", "right"], fromAbs: 300, toAbs: 300, tone: "green", label: "JSON 응답", labelDy: 17 },
    { from: ["next", "bottom"], to: ["weather", "top"], tone: "purple", label: "현재 날씨", labelDx: 52 },
    { from: ["django", "right"], to: ["sqlite", "left"], fromAbs: 295, toAbs: 295, tone: "green", label: "ORM", labelDy: -17 },
    { from: ["image", "right"], to: ["media", "left"], fromAbs: 675, toAbs: 675, tone: "orange", label: "사진·팔레트 저장", labelDy: -17, labelDx: 18 },
  ],
  legendBox: { x: 30, y: 905, w: 1740, h: 62 },
  legend: [
    ["blue", "파란색: 사용자 요청 흐름"],
    ["green", "초록색: 데이터 조회·저장"],
    ["purple", "보라색: 외부 API 연동"],
    ["orange", "주황색: 파일 업로드 · 저장"],
  ],
};

export default diagram;
