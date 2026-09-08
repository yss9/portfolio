# 서영석 · Backend Developer Portfolio

문제 분석, 아키텍처, 트러블슈팅, 성능 개선 과정을 중심으로 정리한 백엔드 개발자 포트폴리오입니다.

- Next.js 16 App Router
- React 19 · TypeScript
- Tailwind CSS v4
- Vercel 배포

## 프로젝트

| # | 프로젝트 | 내용 |
|---|---|---|
| 01 | SayBridge | 화상채팅 기반 외국어 교육 플랫폼 |
| 02 | Glople | MBTI 기반 여행지 추천 커뮤니티 |
| 03 | BlueMemories | AI 감정 기록 및 멘탈케어 커뮤니티 |
| 04 | AWS Deploy | 풀스택 배포 자동화 파이프라인 |

프로젝트 상세 페이지에는 역할과 기술 스택, 핵심 구현 기능, 시스템 구성, 문제 해결 과정, 성능 개선 전후 수치와 측정 조건이 포함되어 있습니다.

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

- 프로필과 기술 스택: `src/content/profile.ts`
- 프로젝트 글과 수치: `src/content/projects/<slug>.ts`
- 색상과 타이포그래피: `src/app/globals.css`

향후 실제 프로젝트 화면을 캡처하면 `public`에 저장하고 각 프로젝트 콘텐츠의 대표 이미지로 연결합니다.

## 데이터 안내

성능 개선 수치는 각 프로젝트에서 JMeter로 측정한 값이며, 상세 페이지에 측정 조건을 함께 표기했습니다.
