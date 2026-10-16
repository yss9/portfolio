import type { Project } from "../types";

export const potner: Project = {
  slug: "potner",
  no: "02",
  name: "PotneR",
  tagline: "식물 생육 환경을 스스로 돌보는 이동형 스마트 화분",
  summary:
    "PotneR(Pot + Partner)는 식물의 생육 환경을 스스로 살피고 돌보는 이동형 스마트 화분 서비스입니다. 로봇과 스테이션의 센서가 토양 수분·조도·온습도를 수집하고, 수분이 부족하면 로봇이 급수 스테이션으로 이동해 급수·송풍한 뒤 제자리로 돌아옵니다. 사용자는 Flutter 앱에서 식물 상태와 환경 이력을 확인하고, 식물 일기와 성장 타임랩스로 변화를 돌아볼 수 있습니다.",
  period: "2026.07 ~ 2026.08",
  team: "6인 팀",
  award: "삼성청년 SW·AI 아카데미 프로젝트 우수상",
  role: "Flutter App · Backend · Infra",
  focus: "MQTT 재전송과 늦은 회신에도 급수가 중복되지 않도록, 명령을 DB 커밋 후에만 발행하고 회신을 명령 이력과 대조해 반영했습니다.",
  teamShort: "6인 팀 · App/BE/Infra",

  stack: [
    { group: "Application", items: ["Flutter", "Riverpod", "go_router", "Dio"] },
    { group: "Backend", items: ["Java 21", "Spring Boot", "Spring Security", "JPA"] },
    { group: "Data / Messaging", items: ["MySQL", "Flyway", "Mosquitto MQTT"] },
    { group: "Device", items: ["Raspberry Pi", "Jetson", "ROS 2", "Python"] },
    { group: "Infra", items: ["Docker Compose", "Nginx", "Jenkins", "Firebase Cloud Messaging"] },
  ],
  stackFlat: ["Flutter", "Spring Boot", "MySQL", "MQTT", "Raspberry Pi", "ROS 2", "Docker"],

  links: [
    { label: "GitHub", href: "https://github.com/yss9/potner", kind: "github" },
    { label: "영상포트폴리오", href: "https://www.youtube.com/watch?v=JgmYadg7w9M", kind: "video" },
  ],

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
  ],

  architectureImage: {
    src: "/projects/potner/architecture.png",
    alt: "PotneR Flutter 앱, Spring Boot 서버, MySQL, MQTT 브로커, 라즈베리파이와 젯슨 장치의 시스템 아키텍처",
    width: 1737,
    height: 905,
  },

  highlights: ["삼성청년 SW·AI 아카데미 프로젝트 우수상", "App · Backend · Infra 담당", "Jenkins CI/CD · 자동 롤백"],

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
      desc: "수분 부족 시 이동→급수→송풍→복귀하는 체인, 주기 환기, 하루 목표 광량을 채우기 위한 햇빛 자리 이동을 구현했습니다. 명령 결과·타임아웃·건너뜀을 이력으로 관리하고, 같은 종류의 명령이 대기 중이면 재발행을 막았습니다.",
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
      desc: "Flutter 파이프라인에 의존성 설치→정적 분석→테스트→debug APK/App Bundle 빌드를 구성하고 산출물을 보관했습니다. 서버는 Gradle 단위·통합 테스트, 추론 가중치 검증, Docker 이미지 빌드, 브랜치별 임시 DB 기동 검증 후 master에서만 배포하도록 구성했으며, Health Check 실패 시 이전 이미지로 자동 롤백하도록 구현했습니다. 공개 저장소에서는 민감한 배포 인프라 설정을 제외했습니다.",
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
      id: "implementation",
      title: "중복·지연 응답에도 급수가 반복되지 않도록",
      problem:
        "MQTT QoS 1은 같은 메시지를 다시 보낼 수 있고, 네트워크 지연으로 회신 순서가 바뀔 수 있습니다. 그대로 반영하면 센서 값이 중복 저장되거나, 결과만 유실된 급수를 재시도해 물이 두 번 공급될 수 있었습니다.",
      solution:
        "명령을 DB에 저장하고 커밋이 끝난 뒤에만 MQTT로 발행했습니다. 회신은 requestId·장치 ID·명령 종류로 대조하고 QoS 1 재전송은 messageId로 걸러냈으며, 부분 실패 시에는 자동 급수를 멈추고 명령 이력과 알림으로 원인을 남겼습니다.",
      steps: [
        {
          label: "1",
          title: "센서 데이터의 멱등성과 유효성 확보",
          body: "메시지 UUID 고유 키와 INSERT IGNORE로 중복 저장을 막았습니다. 장치 ID·단위·측정 시각을 검증하고 최근 값의 중앙값으로 센서 노이즈를 줄였습니다.",
        },
        {
          label: "2",
          title: "자동 급수를 이벤트 기반 체인으로 설계",
          body: "수분 부족부터 이동·급수·송풍·복귀까지 완료된 명령을 기준으로 다음 단계를 이어 갑니다. 명령을 DB에 저장하고 커밋 이후 MQTT로 발행해 빠른 장치 응답과의 경쟁 상태를 막았습니다.",
        },
        {
          label: "3",
          title: "명령 결과의 식별 정보와 순서 검증",
          body: "회신은 requestId·장치 ID·명령 종류로 대조하고, QoS 1 재전송은 messageId로 걸러냅니다. 같은 종류의 대기 명령은 재발행을 막고, 촬영·햇빛 이동·주기 환기는 Busy Guard로 다른 체인이 로봇을 쓰는 동안 양보시켰습니다.",
        },
        {
          label: "4",
          title: "부분 실패에서는 안전하게 체인 중단",
          body: "결과만 유실됐을 때 재시도하면 물이 두 번 공급될 수 있습니다. 실패 시 자동 급수를 중단하고 사용자 알림과 명령 이력으로 원인을 확인하도록 했습니다.",
        },
      ],
      takeaway:
        "급수량 미설정·물 부족·중복 재전송·늦은 회신·장치 불일치·명령 실패를 단위 테스트로 확인했습니다. 같은 상태 전이 구조를 광량 확보, 자동 송풍, 성장 사진 촬영에도 적용했습니다.",
    },
  ],

  performance: [],
  demo: [],
};
