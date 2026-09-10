import type { Project } from "../types";

export const awsDeploy: Project = {
  slug: "aws-deploy",
  no: "07",
  name: "AWS Deploy",
  tagline: "풀스택 애플리케이션 배포 자동화 파이프라인",
  summary:
    "백엔드는 Docker 이미지로 빌드해 EC2에 배포하고, 프론트엔드는 S3와 CloudFront로 정적 배포했습니다. GitHub Actions 워크플로로 두 배포 경로를 자동화했으며, Route 53·ACM·ALB·RDS 구성은 AWS 콘솔에서 진행하고 저장소 문서에 아키텍처로 기록했습니다.",
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

  preview: {
    // No UI to screenshot — this project is infrastructure, so the card shows
    // the troubleshooting write-up instead of a fabricated app screen.
    src: "/shots/aws-deploy-troubleshooting.png",
    alt:
      "AWS Deploy 문제 해결 — Mixed Content 차단의 원인(프로토콜 불일치)과 해결(ALB + ACM 인증서 연결)을 단계별로 정리한 화면",
  },

  architectureImage: {
    src: "/projects/aws-deploy/architecture.png",
    alt: "AWS Route 53, CloudFront, S3, ALB, EC2, RDS와 GitHub Actions CI/CD 배포 구조를 보여주는 시스템 아키텍처",
    width: 1695,
    height: 827,
  },

  highlights: ["S3·CloudFront 자동 배포", "DockerHub·EC2 자동 배포", "AWS 네트워크 장애 분석"],

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
      desc: "Node.js 서버가 환경 변수로 RDS PostgreSQL 연결 정보를 주입받고 SSL 옵션을 사용하도록 구성",
    },
    {
      title: "HTTPS 구성",
      desc: "HTTPS 프론트엔드에서 HTTP API가 차단되는 문제를 해결하기 위해 ALB와 ACM을 사용하는 HTTPS API 구조를 AWS 콘솔에서 구성",
    },
    {
      title: "DNS 연결",
      desc: "Route 53과 ACM을 이용한 도메인·인증서 연결을 구성하고 저장소 README에 전체 요청 경로를 문서화",
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
      role: "Node.js 서버를 컨테이너로 실행하고 GitHub Actions의 SSH 배포 대상으로 사용",
      band: "server",
    },
    {
      id: "rds",
      label: "RDS PostgreSQL",
      role: "Node.js 서버의 영속 데이터 저장소로 사용하고 환경 변수와 SSL 옵션으로 연결",
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
    "정적 리소스는 S3·CloudFront, 동적 API는 ALB·EC2, 데이터는 RDS로 경로를 분리했습니다. GitHub Actions 코드는 저장소에서 확인할 수 있고 AWS 리소스 연결은 콘솔 구성과 README 아키텍처로 관리했습니다.",

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
          body: "AWS 콘솔에서 ALB와 ACM 인증서를 연결해 Backend API Endpoint를 HTTPS로 구성하고, 프론트엔드는 배포 Secret의 API URL을 주입받도록 변경했습니다.",
        },
      ],
      takeaway:
        "프론트엔드와 백엔드 간 통신 프로토콜의 일관성과 보안 계층 설계의 중요성을 확인했습니다.",
    },
    {
      id: "rds-500",
      title: "RDS 연결 오류 — 환경 변수와 SSL 확인",
      problem:
        "배포 환경에서 PostgreSQL 연결 오류가 발생해 애플리케이션 설정과 AWS 네트워크 설정을 구분해 확인했습니다.",
      steps: [
        {
          label: "원인",
          title: "연결 설정 범위 분리",
          body: "저장소에서 확인 가능한 원인은 런타임 환경 변수와 PostgreSQL SSL 옵션입니다. Security Group과 Secrets의 당시 값은 저장소에 남지 않아 코드만으로 장애 원인을 단정하지 않았습니다.",
        },
        {
          label: "해결",
          title: "로그 기준 단계적 확인",
          body: "docker logs를 기준으로 DB 환경 변수와 SSL 연결 옵션을 확인하고 서버의 PostgreSQL Pool 설정에 SSL 옵션을 추가했습니다. AWS 콘솔 설정 변경은 별도 운영 작업으로 구분했습니다.",
        },
      ],
      takeaway:
        "코드로 확인되는 SSL 설정과 당시 콘솔에서 수행한 네트워크 작업을 구분해 기록해야 재현 가능한 트러블슈팅이 됩니다.",
    },
    {
      id: "cicd-ssh-timeout",
      title: "CI/CD SSH Timeout — 대안 검토",
      problem:
        "GitHub Actions 배포 단계에서 EC2 SSH 연결 시간 초과가 발생했습니다.",
      steps: [
        {
          label: "원인",
          title: "Runner 네트워크 변동 가능성",
          body: "GitHub-hosted Runner는 고정 공인 IP를 보장하지 않으므로 특정 IP만 허용하는 EC2 접근 정책과 충돌할 수 있습니다. 당시 연결 로그가 저장소에는 남아 있지 않아 코드만으로 원인을 확정하지 않았습니다.",
        },
        {
          label: "해결",
          title: "현재 방식과 대안",
          body: "현재 워크플로는 GitHub-hosted Runner에서 SSH로 배포합니다. 고정 접근이 필요한 경우 self-hosted Runner 또는 AWS SSM으로 전환하는 방안을 검토했습니다.",
        },
      ],
      takeaway:
        "SSM은 검토한 대안이며 현재 구현된 방식은 아닙니다. 장애 로그를 추가로 확보하기 전에는 Runner IP를 확정 원인으로 단정하지 않습니다.",
    },
  ],

  troubleshootingNote:
    "GitHub Actions 워크플로와 애플리케이션 연결 코드는 저장소에서 검증할 수 있습니다. Route 53·ACM·ALB·Security Group의 실제 상태와 당시 장애 로그는 IaC로 관리되지 않아 AWS 콘솔 구성 경험으로 구분해 설명합니다.",

  performance: [],

  demo: [],
};
