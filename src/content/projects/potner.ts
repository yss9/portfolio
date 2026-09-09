import type { Project } from "../types";

export const potner: Project = {
  slug: "potner",
  no: "06",
  name: "PotneR",
  tagline: "식물 생육 환경을 스스로 돌보는 이동형 스마트 화분",
  summary:
    "Flutter 앱에서 식물의 토양 수분·조도·온습도와 성장 기록을 확인하고, Spring Boot 서버와 MQTT 장치 제어를 통해 급수·환기·일조량 관리를 자동화한 IoT 서비스입니다. 사진 일기와 전후 비교로 돌봄의 결과도 시간 흐름에 따라 확인할 수 있습니다.",
  period: "2026.07 – 2026.09",
  team: "팀 프로젝트",
  role: "App(Frontend) · Backend · Infra",
  teamShort: "팀 프로젝트 · FE/BE/Infra",

  stack: [
    { group: "Application", items: ["Flutter", "Riverpod", "go_router", "Dio"] },
    { group: "Backend", items: ["Java 21", "Spring Boot", "Spring Security", "JPA"] },
    { group: "Data / Messaging", items: ["MySQL", "Flyway", "Mosquitto MQTT"] },
    { group: "Device", items: ["Raspberry Pi", "Jetson", "ROS 2", "Python"] },
    { group: "Infra", items: ["Docker Compose", "Nginx", "Jenkins", "Firebase Cloud Messaging"] },
  ],
  stackFlat: ["Flutter", "Spring Boot", "MySQL", "MQTT", "Raspberry Pi", "ROS 2", "Docker"],

  links: [],

  preview: {
    src: "/projects/potner/overview.png",
    alt: "PotneR 홈에서 반려 식물 로지의 행복 상태와 토양 수분·조도·온도·습도 센서 값이 표시된 화면",
  },

  screenshots: [
    {
      src: "/projects/potner/overview.png",
      alt: "PotneR 홈 화면에 반려 식물 로지의 사진, 행복 상태, 토양 수분·조도·온도·습도 센서 정보가 표시된 모습",
      caption: "통합 홈 — 식물 상태와 네 가지 환경 센서 값을 한눈에 확인",
    },
    {
      src: "/projects/potner/environment.png",
      alt: "PotneR 환경 정보 화면에서 현재 토양 수분·조도·온도·습도와 24시간 토양 수분 변화 그래프를 확인하는 모습",
      caption: "환경 분석 — 실시간 센서 값과 기간별 추이를 식물의 적정 범위와 함께 시각화",
    },
    {
      src: "/projects/potner/diary.png",
      alt: "PotneR 일기 상세 화면에 새 꽃봉오리 사진, 날짜, 관찰 기록과 상태 리포트가 표시된 모습",
      caption: "성장 일기 — 촬영 사진과 그날의 돌봄·환경을 연결한 관찰 기록",
    },
    {
      src: "/projects/potner/growth-comparison.png",
      alt: "PotneR 성장 비교 화면에서 2026년 9월 1일과 9월 9일의 식물 사진을 나란히 비교하는 모습",
      caption: "성장 비교 — 두 날짜의 사진을 나란히 놓고 타임랩스로 변화 확인",
    },
    {
      src: "/projects/potner/login.png",
      alt: "PotneR 로고와 이메일·비밀번호 입력란, 회원가입 링크가 있는 로그인 화면",
      caption: "로그인 — 토큰 기반 인증으로 개인 식물과 장치 데이터에 접근",
    },
  ],

  highlights: ["SSAFY 공통 프로젝트 우수상", "App · Backend · Infra 담당", "Jenkins CI/CD · 자동 롤백"],

  features: [
    {
      title: "JWT 인증과 사용자 계정 흐름",
      desc: "Spring Security 기반 회원가입·로그인·토큰 재발급 API와 Flutter의 토큰 저장·자동 로그인 흐름을 구현했습니다. 이메일 중복 확인, 비밀번호 변경, 알림 설정, 회원 탈퇴까지 계정 생명주기를 연결했습니다.",
      category: "Frontend · Backend",
    },
    {
      title: "식물 등록·프로필·맞춤 케어 설정",
      desc: "식물 분류와 종별 생육 기준을 바탕으로 등록 API와 Flutter 화면을 구현했습니다. 애칭·대표 사진·데려온 날짜·꽃말·성격을 프로필에 제공하고, 급수량과 하루 목표 광량을 사용자가 직접 조정하도록 구성했습니다.",
      category: "Frontend · Backend",
    },
    {
      title: "센서 수집·상태 판정·환경 대시보드",
      desc: "Mosquitto 센서 메시지를 구독해 장치별 토양 수분·조도·온습도를 검증·저장하고 중복 저장의 동시성 문제를 처리했습니다. 최신값과 기간별 이력 API, 일일 광량 판정 및 Flutter 환경 그래프까지 구현했습니다.",
      category: "Frontend · Backend",
    },
    {
      title: "IoT 장치 등록과 상태 관리",
      desc: "로봇과 Raspberry Pi 장치를 각각 등록하고 식물에 배정하는 API, Heartbeat 기반 연결 상태와 배터리 잔량 조회를 구현했습니다. 앱에서는 장치 등록·관리와 로봇 행동 상태를 표시했습니다.",
      category: "Frontend · Backend",
    },
    {
      title: "자동 급수·환기·햇빛 재배치",
      desc: "수분 부족 시 이동→급수→복귀하는 체인, 주기 환기, 하루 목표 광량을 채우기 위한 햇빛 자리 이동을 구현했습니다. 명령 결과·타임아웃·건너뜀을 이력으로 관리하고 작업 중인 로봇의 명령 충돌을 차단했습니다.",
      category: "Backend",
    },
    {
      title: "수동 주행·위치 설정·SLAM 제어",
      desc: "스테이션과 햇빛 자리 좌표 관리, 방향 버튼을 통한 수동 주행, 앱에서 지도 제작을 시작·종료하는 MQTT 명령 통로와 Flutter 제어 화면을 구현했습니다.",
      category: "Frontend · Backend",
    },
    {
      title: "성장 사진·포토 로그·타임랩스",
      desc: "장치 및 사용자 사진 업로드, 대표 사진 변경, 날짜별 포토 로그와 상세 조회·삭제를 구현했습니다. 두 날짜의 사진 비교와 2x~8x 타임랩스 재생까지 Flutter 화면으로 연결했습니다.",
      category: "Frontend · Backend · Infra",
    },
    {
      title: "LLM 식물 일기와 페르소나",
      desc: "매일 저녁 식물별 일기를 생성·저장하는 흐름을 구현했습니다. 센서 요약뿐 아니라 그날의 급수·송풍·이동과 하루의 날씨·돌봄 맥락을 프롬프트에 포함하고, 화면용 성격과 일기 지시문을 분리했습니다.",
      category: "Backend · Infra",
    },
    {
      title: "FCM 알림과 화면 딥링크",
      desc: "센서 이상, 물 부족, 배수 트레이, 분갈이 및 싹·잎·꽃 성장 이벤트의 알림 생성과 FCM 발송을 구현했습니다. 알림을 누르면 해당 식물·날짜의 포토 로그를 바로 열도록 딥링크를 연결했습니다.",
      category: "Frontend · Backend · Infra",
    },
    {
      title: "Jenkins 멀티브랜치 CI/CD와 자동 롤백",
      desc: "Flutter 파이프라인에 의존성 설치→정적 분석→테스트→debug APK/App Bundle 빌드를 구성하고 산출물을 보관했습니다. 서버는 Gradle 단위·통합 테스트, 추론 가중치 검증, Docker 이미지 빌드, 브랜치별 임시 DB 기동 검증 후 master에서만 배포하도록 구성했으며, Health Check 실패 시 이전 이미지로 자동 롤백하도록 구현했습니다.",
      category: "Infra",
    },
  ],

  architecture: [
    {
      id: "flutter",
      label: "Flutter App",
      role: "Riverpod 상태 관리, API 데이터 렌더링, 성장 기록·환경 그래프·푸시 딥링크 제공",
      band: "client",
    },
    {
      id: "spring",
      label: "Spring Boot",
      role: "인증, 식물·센서·사진·일기 도메인과 자동 케어 오케스트레이션 담당",
      band: "server",
    },
    {
      id: "mqtt",
      label: "Mosquitto MQTT",
      role: "서버의 장치 명령과 Raspberry Pi·Jetson의 센서/작업 결과를 비동기로 중계",
      band: "realtime",
    },
    {
      id: "devices",
      label: "Raspberry Pi · Jetson · ROS 2",
      role: "센서 수집, 펌프·팬 제어, 사진 촬영, 자율 주행과 도킹 수행",
      band: "external",
    },
    {
      id: "mysql",
      label: "MySQL · Photo Volume",
      role: "사용자·식물·센서·명령 이력과 성장 사진을 영속화하고 Nginx로 사진 제공",
      band: "data",
    },
    {
      id: "jenkins",
      label: "Jenkins · Docker Compose · Nginx",
      role: "멀티브랜치 CI, 테스트용 격리 환경, 이미지 배포, Health Check와 자동 롤백 수행",
      band: "infra",
    },
  ],
  architectureIntent:
    "앱의 요청과 IoT 장치의 비동기 동작을 Spring Boot의 명령 이력으로 연결해, 작업 중복·타임아웃·결과 반영을 한 흐름에서 추적하도록 구성했습니다.",

  troubleshooting: [
    {
      id: "jenkins-pipeline",
      title: "Jenkins 멀티브랜치 CI/CD를 운영 데이터와 분리",
      problem:
        "기능 브랜치도 동시에 빌드되는 환경에서 공유 Gradle 캐시가 잠기고, 검증용 Spring Boot가 운영 DB에 Flyway를 적용하거나 운영 MQTT client ID와 충돌할 위험이 있었습니다. 배포 실패를 감지해 이전 버전으로 되돌리는 절차도 필요했습니다.",
      steps: [
        {
          label: "App",
          title: "재현 가능한 Flutter 빌드",
          body: "Flutter 3.44.0 컨테이너 이미지를 고정하고 pub·Gradle·Android SDK를 named volume으로 캐시했습니다. 브랜치 병렬 빌드에서 Gradle journal lock이 충돌한 문제는 APK/AAB 빌드 구간에만 flock을 적용해 해결했습니다.",
        },
        {
          label: "Server",
          title: "브랜치별 격리 검증",
          body: "Gradle 단위·Testcontainers 통합 테스트 후 브랜치명과 빌드 번호가 포함된 임시 이미지·컨테이너·MySQL 스키마를 생성했습니다. 별도 MQTT client ID로 기동하고 Actuator Health Check까지 통과한 이미지에만 배포 자격을 부여했습니다.",
        },
        {
          label: "Deploy",
          title: "master 전용 배포와 자동 롤백",
          body: "Server-master에서만 릴리스 이미지를 태깅하고 Docker Compose 설정을 고정 배포 경로에 동기화했습니다. 새 컨테이너와 Nginx 경유 Health Check가 실패하면 보관해 둔 이전 이미지로 자동 재기동하도록 배포 스크립트를 구성했습니다.",
        },
        {
          label: "Secret",
          title: "자격증명 안전 주입",
          body: "JWT·MQTT·LLM·Firebase 값은 Jenkins Credentials에서 주입했습니다. Firebase 키는 named volume으로 옮긴 뒤 non-root UID의 읽기 권한과 service_account 유형을 검증해, 배포는 성공했지만 푸시만 조용히 비활성화되는 문제를 막았습니다.",
        },
      ],
      takeaway:
        "CI와 CD를 단순 명령 실행이 아니라 운영 데이터 격리, 재현 가능한 빌드, 비밀값 보호, 실패 시 복구까지 포함한 하나의 안전장치로 설계했습니다.",
    },
    {
      id: "care-run",
      title: "자동 케어 한 회차의 명령 상태 일관성",
      problem:
        "급수·송풍·재배치가 순차적으로 연결되는 동안 장치가 작업을 건너뛰거나 로봇이 이미 작업 중이면 회차가 멈추거나 명령이 충돌할 수 있었습니다.",
      steps: [
        { label: "문제", title: "장치별 결과가 서로 다름", body: "완료·건너뜀·실패·타임아웃을 동일하게 처리하면 다음 케어 단계로 진행할 수 없었습니다." },
        { label: "판단", title: "명령 이력을 상태 머신으로 관리", body: "명령 발행 시점부터 결과 회신까지 상태를 저장하고, 작업 중인 로봇에는 재배치 명령이 끼어들지 않도록 가드를 두었습니다." },
        { label: "개선", title: "건너뜀과 실제 가동 시간 분리", body: "급수 건너뜀도 정상적인 판정 결과로 처리하고 펌프와 팬의 실제 가동 시간을 올바른 이력에 기록했습니다." },
      ],
      takeaway: "비동기 장치 제어에서는 성공/실패 이분법보다 업무 의미를 반영한 상태 모델과 멱등한 결과 반영이 중요했습니다.",
    },
    {
      id: "photo-route",
      title: "사진 저장·배포 경로의 수명 분리",
      problem:
        "성장 사진을 배포 디렉터리에 저장하면 새 배포 때 사라지고, 서버 절대 URL을 저장하면 도메인이나 HTTPS 전환에 취약했습니다.",
      steps: [
        { label: "저장", title: "named volume으로 분리", body: "사진을 배포 파일과 분리된 Docker named volume에 저장해 재배포 후에도 유지했습니다." },
        { label: "서빙", title: "Nginx 읽기 전용 제공", body: "백엔드만 사진을 쓰고 Nginx는 정해진 UUID 경로를 읽기 전용으로 제공하도록 역할을 나눴습니다." },
        { label: "계약", title: "상대 경로 응답", body: "API는 /media 이하의 상대 경로를 반환하고 앱이 API origin에 결합해 환경별 주소 설정을 줄였습니다." },
      ],
      takeaway: "사용자 생성 파일은 배포 산출물과 수명이 다르므로 저장 위치와 공개 URL 계약을 처음부터 분리해야 했습니다.",
    },
  ],

  performance: [],
  demo: [],
};
