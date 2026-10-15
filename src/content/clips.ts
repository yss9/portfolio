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
};
