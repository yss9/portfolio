# 서영석 · Backend Developer Portfolio

상태와 데이터 흐름을 설계한 경험을 중심으로 정리한 백엔드 개발자 포트폴리오입니다. 홈에서는 대표 프로젝트 세 개와 검증된 결과를 먼저 소개하고, 나머지 프로젝트는 목록에서 탐색합니다.

- Next.js 16 App Router
- React 19 · TypeScript
- Tailwind CSS v4
- Vercel 배포

## 프로젝트

| # | 프로젝트 | 내용 |
|---|---|---|
| 01 | 새로이 | 블록체인 기반 업사이클링 플랫폼 · 삼성청년 SW/AI 프로젝트 우수상 |
| 02 | PotneR | MQTT 센서 수집과 자동 케어를 연결한 IoT 식물 관리 서비스 · 삼성청년 SW/AI 프로젝트 우수상 |
| 03 | Neoulteo | 공공 관광 데이터·배치·AI 여행 도우미를 결합한 여행 플랫폼 |
| 04 | SayBridge | WebRTC 화상 수업과 실시간 채팅을 구현한 1인 개발 교육 플랫폼 |
| 05 | Glople | 사용자 특성·키워드 기반 여행 추천 커뮤니티 |
| 06 | BlueMemories | AI 감정 분석과 공유 일기장을 제공하는 멘탈케어 서비스 |
| 07 | MOFY | 색상 팔레트 추출과 사용자 메시지를 제공하는 패션 커뮤니티 |
| 08 | AWS Deploy | S3·CloudFront 및 Docker·EC2 배포 자동화 파이프라인 |

프로젝트 상세 페이지는 큰 프로젝트 이미지 갤러리를 먼저 보여주고, 소개와 역할, 개요(대상·배경·목표), 본인 기여, 문제 해결·설계, 검증 결과, 기술 선택 이유, 시스템 구성, 배운 점으로 이어집니다. 갤러리의 썸네일로 다른 화면을 선택할 수 있습니다. 팀 전체 기능과 본인 담당, 당시 구현과 사후 개선을 구분하며, 상세 목차로 각 항목에 바로 이동할 수 있습니다. 정량적 성능 수치는 로컬 JMeter에서 동일 시나리오로 측정한 Before/After 값과 테스트 조건을 함께 표기하며, 변경 코드는 각 프로젝트 Git 이력에서 확인할 수 있습니다. 프로젝트 종료 후 진행한 개선은 당시 구현과 구분해 사후 리팩터링으로 명시합니다.

메인은 첫 소개 → 개발 경험·기술 활용 → AI 활용 과정 → 프로젝트 순서로 구성합니다. 첫 화면의 프로젝트 바로가기 버튼으로 목록에 바로 이동할 수 있습니다. 새로이 상세 개요는 블록체인의 역할과 지갑 서명·온체인 결과·서버 상태 반영 흐름을 먼저 설명하고, 팀 전체 구조와 본인의 연동 기여를 구분합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

프로덕션 빌드는 다음 명령으로 확인합니다.

```bash
npm run build
```

## Vercel 배포

GitHub의 `main` 브랜치가 Vercel 프로젝트에 연결되어 있습니다. `main` 브랜치가 갱신되면 Next.js 프로젝트로 자동 빌드 및 배포됩니다.

- Build Command: `next build`
- Output Directory: Next.js 기본값
- Environment Variables: 없음

## 콘텐츠 구조

```text
src/
├─ app/
│  ├─ page.tsx
│  ├─ projects/[slug]/page.tsx
│  ├─ layout.tsx
│  └─ globals.css
├─ content/
│  ├─ profile.ts
│  ├─ types.ts
│  └─ projects/
└─ components/
   ├─ site/
   └─ ui/
```

- 프로필, 기술 활용 경험, AI 개발 과정: `src/content/profile.ts`
- 대표 프로젝트의 강조 문구: `src/content/showcase.ts`
- 프로젝트 배경·목표·기술 선택·배운 점: `src/content/project-stories.ts`
- 프로젝트 글과 수치: `src/content/projects/<slug>.ts`
- 색상과 타이포그래피: `src/app/globals.css`

실제 서비스 화면은 `public/projects/<slug>`에 저장하고, 각 프로젝트 카드의 대표 이미지와 상세 페이지 갤러리에서 사용합니다. 캡처 스크립트는 실제 프론트엔드 빌드 또는 개발 서버를 실행하고 API 계약에 맞춘 로컬 fixture만 주입해 재현합니다.

- `scripts/capture-real-services.mjs`: SayBridge, Glople, BlueMemories
- `scripts/capture-mofy-neoulteo.mjs`: MOFY, Neoulteo

## 데이터 안내

프로젝트 설명은 현재 공개 코드와 Git 이력을 기준으로 작성했습니다. 외부 인프라 설정처럼 저장소만으로 재현할 수 없는 내용은 콘솔 구성 또는 당시 경험임을 별도로 표시합니다.
