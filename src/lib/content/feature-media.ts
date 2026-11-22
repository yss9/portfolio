import { clips } from "@/content/clips";

// Link a feature to an existing recording only when the captured screen shows it.
const featureClips: Record<string, Record<string, string>> = {
  saeroi: {
    "Material–Brand 소재 거래": "saeroi-marketplace",
    "브랜드 AI 여정 어시스턴트": "saeroi-agent-chat",
    "승인형 업무 실행": "saeroi-agent-confirm",
  },
  potner: {
    "센서 수집·상태 판정·환경 대시보드": "potner-environment",
    "성장 사진·포토 로그·타임랩스": "potner-timelapse",
    "LLM 식물 일기와 페르소나": "potner-diary",
  },
  neoulteo: {
    "관광지 검색": "neoulteo-attractions",
    "여행 계획": "neoulteo-plan-builder",
    "AI 여행 도우미": "neoulteo-ai-chat",
  },
  saybridge: {
    "WebRTC 화상 연결": "saybridge-video",
    "실시간 메시징": "saybridge-video",
    "동적 강의 검색": "saybridge-courses",
  },
  glople: {
    "개인 맞춤형 추천": "glople-mbti",
    "키워드 필터링": "glople-keyword",
    "실시간 매칭 / 채팅": "glople-chat",
  },
  bluememories: {
    "일기 작성·조회 구현": "bluememories-write",
    "AI 감정 분석 연동": "bluememories-analysis",
    "맞춤형 콘텐츠 추천": "bluememories-analysis",
    "공유 일기장 확장": "bluememories-shared",
  },
  mofy: {
    "사용자 메시지 기능": "mofy-message",
    "이미지 색상 팔레트 추출": "mofy-palette",
    "스타일 공유 (OOTD)": "mofy-style",
    "중고 거래": "mofy-market",
  },
};
export function featureMedia(slug: string, title: string) {
  return clips[slug]?.find((c) => c.id === featureClips[slug]?.[title]);
}
