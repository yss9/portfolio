import type { Project } from "../types";

export const awsDeploy: Project = {
  slug: "aws-deploy",
  no: "06",
  name: "AWS Deploy",
  tagline: "풀스택 애플리케이션 배포 자동화 파이프라인",
  summary:
    "백엔드는 Docker 컨테이너화하여 EC2에서 실행하고, 프론트엔드는 S3와 CloudFront로 정적 배포를 수행했습니다. GitHub Actions를 통해 전체 배포 파이프라인을 자동화하고, Route 53과 ACM으로 도메인·인증서를 연결했습니다.",
  period: "2025.09",
  team: "1인 구축",
  role: "인프라 설계 및 배포 자동화 구축",
  teamShort: "1인 구축 · 인프라",

  stack: [
    { group: "Application", items: ["Node.js", "React", "Vite"] },
    { group: "Container / CI", items: ["Docker", "GitHub Actions"] },
    { group: "AWS", items: ["S3", "CloudFront", "Route 53", "ALB", "EC2", "RDS", "ACM"] },
  ],
  stackFlat: ["Docker", "GitHub Actions", "EC2", "S3", "CloudFront", "ALB", "RDS", "ACM", "Route 53"],

  links: [
    { label: "todo-list-server", href: "https://github.com/yss9/todo-list-server", kind: "github" },
    { label: "todo-list-client", href: "https://github.com/yss9/todo-list-client", kind: "github" },
  ],

  highlights: ["Mixed Content 해결", "RDS 연결 오류 추적", "CI/CD SSH Timeout 분석"],

  features: [
    {
      title: "Frontend 배포",
      desc: "React Build 산출물을 S3 정적 호스팅에 올리고 CloudFront CDN으로 배포",
    },
    {
      title: "Backend 배포",
      desc: "GitHub Actions에서 Docker 이미지를 빌드해 EC2 컨테이너로 배포",
    },
    {
      title: "Database 연동",
      desc: "EC2 서버와 RDS PostgreSQL을 Security Group으로 격리해 연동",
    },
    {
      title: "HTTPS 구성",
      desc: "CloudFront/ALB + ACM 인증서를 활용해 외부 요청 구간 전체에 HTTPS 적용",
    },
    {
      title: "DNS 연결",
      desc: "Route 53으로 도메인을 연결하고 ACM 인증서를 리전별로 적용",
    },
  ],

  architecture: [
    {
      id: "route53",
      label: "Route 53",
      role: "www(프론트)와 api(백엔드) 레코드를 각각 CloudFront와 ALB로 라우팅",
      band: "infra",
    },
    {
      id: "cloudfront",
      label: "CloudFront + S3",
      role: "React 빌드 산출물을 S3 오리진에서 받아 CDN으로 배포, us-east-1 ACM 인증서 사용",
      band: "client",
    },
    {
      id: "alb",
      label: "ALB + ACM",
      role: "ap-northeast-2 인증서로 HTTPS(443)를 종료하고 EC2로 트래픽 전달",
      band: "infra",
    },
    {
      id: "ec2",
      label: "EC2 + Docker",
      role: "Node.js 서버를 컨테이너로 실행, Security Group으로 ALB에서 오는 트래픽만 허용",
      band: "server",
    },
    {
      id: "rds",
      label: "RDS PostgreSQL",
      role: "EC2 Security Group에서만 5432 접근을 허용하도록 격리",
      band: "data",
    },
    {
      id: "gha",
      label: "GitHub Actions",
      role: "push를 트리거로 프론트는 S3에, 백엔드는 EC2에 배포하는 파이프라인 실행",
      band: "infra",
    },
  ],
  architectureIntent:
    "정적 리소스와 동적 API의 진입 경로를 분리하고, 각 구간마다 인증서와 Security Group을 따로 두어 외부 노출 면을 좁혔습니다.",

  troubleshooting: [
    {
      id: "mixed-content",
      title: "Mixed Content — HTTPS 페이지의 HTTP API 차단",
      problem:
        "HTTPS 페이지에서 HTTP API 요청이 브라우저에 차단되어 통신이 되지 않았습니다.",
      steps: [
        {
          label: "원인",
          title: "프로토콜 불일치",
          body: "CloudFront는 HTTPS로 서빙되는데 EC2 API는 HTTP로 호출하고 있었습니다. Frontend와 Backend의 프로토콜이 어긋나 브라우저가 요청을 막았습니다.",
        },
        {
          label: "해결",
          title: "ALB + ACM 인증서 연결",
          body: "ALB를 앞에 두고 ACM 인증서를 연결해 Backend API Endpoint를 HTTPS로 통일했습니다.",
        },
      ],
      takeaway:
        "프론트엔드와 백엔드 간 통신 프로토콜의 일관성과 보안 계층 설계의 중요성을 확인했습니다.",
    },
    {
      id: "rds-500",
      title: "500 Internal Server Error — RDS 연결 실패",
      problem:
        "배포 직후 서버는 정상 실행됐지만 모든 API 요청에서 500 오류가 발생했습니다.",
      steps: [
        {
          label: "원인",
          title: "Security Group · Secrets · SSL",
          body: "RDS Security Group이 설정되지 않았고, Secrets 값 오류로 잘못된 DB URL이 생성되었으며, SSL 옵션도 불일치했습니다.",
        },
        {
          label: "해결",
          title: "로그 기준 단계적 확인",
          body: "docker logs로 서버 오류를 추적한 뒤 RDS 접근을 허용하고, Secrets를 검증해 DB 연결 정보와 SSL 옵션을 수정했습니다.",
        },
      ],
      takeaway:
        "로그를 기준으로 네트워크 → 인증 → DB 연결 순서로 원인의 범위를 좁혀 해결했습니다.",
    },
    {
      id: "cicd-ssh-timeout",
      title: "CI/CD SSH Timeout — Runner IP 변동",
      problem:
        "GitHub Actions 배포 단계에서 EC2 SSH 연결 시간 초과가 발생했습니다.",
      steps: [
        {
          label: "원인",
          title: "Runner 공인 IP 변경",
          body: "GitHub Actions Runner의 공인 IP가 매번 달라지는데, EC2 Security Group은 특정 IP만 허용하도록 되어 있어 접근이 차단됐습니다.",
        },
        {
          label: "해결",
          title: "접근 정책 재검토",
          body: "배포 서버 접근 정책을 재검토하고 고정 접근 환경을 검토했으며, AWS SSM 기반 배포 방식을 대안으로 고려했습니다.",
        },
      ],
      takeaway:
        "Runner IP가 고정되지 않는 환경에서는 네트워크 변동성을 고려한 배포 구조가 필요합니다.",
    },
  ],

  troubleshootingNote:
    "브라우저 오류 → 네트워크 경로 → 로드밸런서/인증서 → 서버 로그 → DB 연결. 추측으로 설정을 변경하기보다 실행 경로와 로그를 기준으로 원인의 범위를 단계적으로 좁혀 확인했습니다.",

  performance: [],

  demo: [],
};
