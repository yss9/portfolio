/**
 * Short demo loops recorded by `node scripts/record-clips.mjs <project>`.
 * Each one is the project's real frontend driven with demo (mock) data, since the
 * backends, wallet signing, payments and LLM are not running for the recording.
 */
import type { DemoClip } from "./types";

const clip = (
  project: string,
  id: string,
  title: string,
  caption: string,
  device: DemoClip["device"],
): DemoClip => ({
  id,
  src: `/clips/${project}/${id}.mp4`,
  poster: `/clips/${project}/${id}.jpg`,
  title,
  caption,
  device,
});

export const clips: Record<string, DemoClip[]> = {
  saeroi: [
    clip("saeroi", "saeroi-landing", "서비스 첫 화면", "버려진 소재의 다음 쓰임을 소개하는 랜딩", "desktop"),
    clip("saeroi", "saeroi-shop", "쇼핑몰 · 상품 상세", "순환 소재로 만든 상품을 고르고 상세로 이동", "desktop"),
    clip("saeroi", "saeroi-marketplace", "소재 검색", "공급업체의 폐소재를 등급·가격·남은 양으로 비교", "desktop"),
    clip("saeroi", "saeroi-agent-chat", "AI 어시스턴트 · 소재 찾기", "만들 제품을 말하면 필요한 양을 계산하고 소재를 찾아 줌", "desktop"),
    clip("saeroi", "saeroi-agent-card", "AI 어시스턴트 · 결제 카드", "구매 요청에 모델이 직접 결제하지 않고 확인할 카드를 띄움", "desktop"),
    clip("saeroi", "saeroi-agent-confirm", "AI 어시스턴트 · 승인", "생산 확정처럼 되돌리기 어려운 작업은 사람이 눌러야 실행", "desktop"),
  ],
  potner: [
    clip("potner", "potner-home", "통합 홈", "식물의 행복 상태와 네 가지 환경 센서 값", "phone"),
    clip("potner", "potner-environment", "환경 분석", "센서 이력을 항목과 기간별로 바꿔 보기", "phone"),
    clip("potner", "potner-diary", "식물 일기", "돌봄 기록으로 생성한 일기와 상태 리포트", "phone"),
    clip("potner", "potner-timelapse", "성장 비교 · 타임랩스", "1일차와 30일차를 비교하고 30일치 사진을 하루씩 재생", "phone"),
  ],
  saybridge: [
    clip("saybridge", "saybridge-courses", "강의 탐색", "언어와 레벨을 골라 조건에 맞는 강의만 검색", "desktop"),
    clip("saybridge", "saybridge-video", "1:1 화상 수업 · 채팅", "WebRTC 영상 연결 위에서 STOMP 채팅을 실시간으로 주고받음", "desktop"),
    clip("saybridge", "saybridge-homework", "과제 제출", "과제 공지에 녹음 파일을 올리면 바로 제출 상태로 바뀜", "desktop"),
    clip("saybridge", "saybridge-submissions", "과제 제출 현황 · 강사", "강사는 과제별로 학생 제출 파일과 시각을 한 번에 확인", "desktop"),
  ],
  neoulteo: [
    clip("neoulteo", "neoulteo-home-map", "지도 홈", "대한민국 지도에서 지역을 고르면 그 지역의 인기 핫플레이스가 바로 열림", "desktop"),
    clip("neoulteo", "neoulteo-attractions", "관광지 검색", "지역과 키워드로 관광지를 찾고 결과를 누르면 지도 핀으로 이동", "desktop"),
    clip("neoulteo", "neoulteo-plan-builder", "여행 계획 만들기", "저장한 관광지를 일차별 코스에 담으면 이동 경로와 거리가 바로 그려짐", "desktop"),
    clip("neoulteo", "neoulteo-plan-ai", "AI 코스 평가", "일차별 코스를 동선·일정 강도·카테고리 균형으로 평가", "desktop"),
    clip("neoulteo", "neoulteo-ai-chat", "AI 여행 도우미", "관광지 도구와 DB 관광지 문서를 근거로 답하는 여행 도우미", "desktop"),
  ],
  bluememories: [
    clip("bluememories", "bluememories-write", "일기 작성 · 발행", "본문을 쓰고 발행하면 감정 분석을 거쳐 캘린더에 오늘의 감정이 표시됨", "desktop"),
    clip("bluememories", "bluememories-analysis", "감정 분석 · 콘텐츠 추천", "긍정·중립·부정 점수와 감정에 맞춘 추천 영상을 바꿔 보기", "desktop"),
    clip("bluememories", "bluememories-calendar", "감정 캘린더 · 일기 목록", "한 달의 감정을 달력으로 보고 목록으로 전환해 훑어보기", "desktop"),
    clip("bluememories", "bluememories-shared", "공유 일기장", "여러 멤버가 이어 쓴 교환일기를 감정 점수와 함께 확인", "desktop"),
    clip("bluememories", "bluememories-community", "커뮤니티 · 댓글", "공개 일기 피드에서 글을 열어 감정 분석과 좋아요·댓글 확인", "desktop"),
  ],
  mofy: [
    clip("mofy", "mofy-message", "메시지 보내기", "받는 사람 아이디와 내용을 적어 보내면 보낸 메시지함에 바로 쌓임", "desktop"),
    clip("mofy", "mofy-inbox", "받은 메시지함", "메시지 메뉴에서 받은 메시지함을 열어 보낸 사람과 내용을 확인", "desktop"),
    clip("mofy", "mofy-home", "홈 · 추천 검색어와 날씨", "검색창을 누르면 최근·추천·인기 검색어가 뜨고 옆에는 현재 날씨", "desktop"),
    clip("mofy", "mofy-style", "스타일보드 · 게시물 상세", "OOTD 게시물을 열어 태그·본문·착용 사진을 보고 좋아요", "desktop"),
    clip("mofy", "mofy-palette", "컬러 팔레트", "사진을 올리면 배경을 지운 뒤 의상의 주요 색상을 팔레트로 보여 줌", "desktop"),
    clip("mofy", "mofy-market", "중고마켓 · 판매글 상세", "가격·판매 상태가 보이는 거래글을 열고 만날 장소를 확인", "desktop"),
  ],
  glople: [
    clip("glople", "glople-keyword", "키워드 맞춤 추천", "고른 키워드와 겹치는 키워드가 많은 여행지부터 추천", "desktop"),
    clip("glople", "glople-mbti", "MBTI 여행지 추천", "내 MBTI에 맞는 여행지에서 소개·리뷰·루트 추천으로 이동", "desktop"),
    clip("glople", "glople-route", "유사 사용자 여행 루트", "성별·나이·MBTI가 비슷한 사용자의 루트를 지도와 함께 넘겨 보기", "desktop"),
    clip("glople", "glople-home-map", "세계 지도 홈", "지도에서 나라를 고르면 최근 여행 리뷰와 예약 바로가기가 열림", "desktop"),
    clip("glople", "glople-chat", "글로플러 실시간 채팅", "현지 전문가와 WebSocket 채팅으로 여행 일정 조율", "desktop"),
  ],
};
