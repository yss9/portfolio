import type { StackGroup } from "./types";

export const profile = {
  name: "서영석",
  role: "Backend Developer",
  headline:
    "기능 구현에서 멈추지 않고, 문제를 분석하고 개선 결과를 수치로 검증하는 백엔드 개발자를 지향합니다.",
  email: "yse2196@gmail.com",
  github: "https://github.com/yss9",
  githubLabel: "github.com/yss9",

  intro: [
    "저는 새로운 기능을 빠르게 만드는 것보다, 기존 서비스의 구조와 흐름을 이해하고 안정적으로 개선하는 과정을 중요하게 생각합니다.",
    "프로젝트에서는 사용자 흐름과 데이터 처리 과정을 먼저 파악하고, 백엔드 API와 데이터베이스가 자연스럽게 연결되도록 구현해왔습니다.",
    "문제가 발생하면 로그, 실행 순서, 쿼리와 데이터 흐름을 따라 원인을 좁히고, 성능 개선 전후를 수치로 검증하며 서비스의 안정성과 완성도를 높여왔습니다.",
  ],

  principles: [
    {
      title: "목적 중심의 기능 구현",
      desc: "단순한 코드 작성을 넘어, 서비스의 목적과 실제 사용자 흐름을 고려하여 서비스를 개발합니다.",
    },
    {
      title: "데이터 기반 문제 해결",
      desc: "추측이 아닌 로그, 실행 순서, 데이터 흐름을 추적하여 문제의 원인을 논리적으로 좁혀나갑니다.",
    },
    {
      title: "수치로 증명하는 성능",
      desc: "JMeter를 활용하여 병목 유형을 분석하고, Before/After 수치를 통해 성능 개선 성과를 검증합니다.",
    },
  ],

  facts: [
    { label: "학력", value: "영남대학교 컴퓨터공학과 졸업" },
    { label: "전공 평점", value: "3.84 / 4.5" },
    { label: "자격증", value: "정보처리기사" },
    { label: "교육", value: "삼성청년 SW·AI 아카데미 (2026.01 ~ )" },
  ],
};

export const techStack: (StackGroup & { desc: string })[] = [
  {
    group: "Backend",
    items: ["Java", "Spring Boot", "Spring Security", "JPA", "QueryDSL"],
    desc: "REST API 개발, 사용자 인증/인가, 파일 업로드 처리, 동적 쿼리를 활용한 복잡한 검색 로직 구현에 활용합니다.",
  },
  {
    group: "Database",
    items: ["MySQL", "PostgreSQL", "SQLite"],
    desc: "JPA 기반 데이터 저장/조회와 AWS RDS 연동 경험이 있습니다. 인덱스·쿼리 튜닝은 학습과 테스트 범위에서 검증하며 적용했습니다.",
  },
  {
    group: "Realtime",
    items: ["WebSocket", "STOMP", "WebRTC", "Redis Pub/Sub"],
    desc: "실시간 채팅, WebRTC 시그널링, 메시지 중계 구조를 프로젝트 범위 안에서 설계하고 구현했습니다.",
  },
  {
    group: "Infra / Cloud",
    items: ["EC2 / S3 / RDS", "CloudFront", "Docker", "GitHub Actions"],
    desc: "컨테이너 기반 배포, HTTPS 보안 설정(ALB/ACM), 정적·동적 리소스 분리 및 CI/CD 파이프라인을 구축합니다.",
  },
  {
    group: "Testing / Tools",
    items: ["Git / GitHub", "JMeter", "IntelliJ"],
    desc: "Git/GitHub 기반 버전 관리와 JMeter를 활용한 병목 구간의 Before/After 수치 비교를 수행했습니다.",
  },
  {
    group: "Frontend",
    items: ["React", "Vue", "Next.js", "JavaScript"],
    desc: "백엔드 API와 연결되는 사용자 흐름을 이해하고, 프로젝트에 필요한 화면을 직접 구현했습니다.",
  },
];
