import type { Project } from "../types";

export const potner: Project = {
  slug: "potner",
  no: "01",
  name: "PotneR",
  tagline: "식물 생육 환경을 스스로 돌보는 이동형 스마트 화분",
  summary:
    "센서 상태를 기반으로 로봇의 급수·환기·일조량 관리를 자동화하고, Flutter 앱에서 식물의 상태와 성장 기록을 확인하는 IoT 서비스입니다.",
  period: "2026.07 ~ 2026.08",
  team: "6인 팀",
  role: "Flutter App · Backend · Infra",
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
    { label: "시연 영상", href: "https://www.youtube.com/watch?v=JgmYadg7w9M", kind: "video" },
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

  troubleshooting: [],

  implementationStory: {
    introduction: [
      "스마트 화분 관리 서비스 PotneR를 개발하며 가장 도전적이었던 경험은 토양 수분 부족을 감지해 로봇이 스스로 급수 스테이션으로 이동하고, 급수한 뒤 원래 위치로 복귀하는 자동 케어 시스템을 구현한 것입니다. 저는 Spring Boot 백엔드를 중심으로 MQTT 센서 수집, 이상 상태 판정, 장치 명령 발행 및 결과 처리, Flutter 앱 연동까지 담당했습니다.",
      "서버의 요청이 실제 하드웨어 동작으로 이어지는 만큼, MQTT QoS 1의 중복 전달과 네트워크 지연·순서 역전이 센서 중복 저장이나 급수 중복 실행 같은 장치 오작동으로 이어지지 않도록 설계했습니다.",
    ],
    decisions: [
      {
        title: "센서 데이터의 멱등성과 유효성 확보",
        body: "메시지 UUID 고유 키와 INSERT IGNORE로 중복 저장을 막았습니다. 장치 ID·단위·측정 시각을 검증하고 최근 값의 중앙값으로 센서 노이즈를 줄였습니다.",
      },
      {
        title: "자동 급수를 이벤트 기반 상태 전이로 설계",
        body: "수분 부족부터 이동·급수·복귀까지 상태 전이로 연결했습니다. 명령을 DB에 저장하고 커밋 이후 MQTT로 발행해 빠른 장치 응답과의 경쟁 상태를 막았습니다.",
      },
      {
        title: "명령 결과의 식별 정보와 순서 검증",
        body: "requestId와 장치 ID·명령 종류·messageId를 함께 검증했습니다. Busy Guard와 명령 목적 구분으로 급수·송풍·촬영 작업의 충돌을 막았습니다.",
      },
      {
        title: "부분 실패에서는 안전하게 체인 중단",
        body: "결과만 유실됐을 때 재시도하면 물이 두 번 공급될 수 있습니다. 실패 시 자동 급수를 중단하고 사용자 알림과 명령 이력으로 원인을 확인하도록 했습니다.",
      },
    ],
    verification: "급수량 미설정·물 부족·중복 및 지연 응답·장치 불일치·명령 실패를 단위 테스트로 확인했습니다. 같은 상태 전이 구조를 광량 확보, 자동 송풍, 성장 사진 촬영에도 적용했습니다.",
    codeReferences: [
      { label: "자동 급수 이벤트 체인", file: "AutoWateringOrchestrator.java", line: 81 },
      { label: "DB 커밋 후 MQTT 발행", file: "DeviceCommandPublishListener.java", line: 31 },
      { label: "중복 명령 차단", file: "DeviceCommandService.java", line: 100 },
      { label: "명령 결과 검증", file: "DeviceCommandResultService.java", line: 27 },
      { label: "MQTT 센서 메시지 검증", file: "SensorTelemetryMessageProcessor.java", line: 23 },
      { label: "센서 중복 저장 방지", file: "SensorReadingService.java", line: 19 },
      { label: "자동 작업 Busy Guard", file: "RobotBusyGuard.java", line: 20 },
      { label: "예외 상황 단위 테스트", file: "AutoWateringOrchestratorTest.java", line: 27 },
    ],
  },

  performance: [],
  demo: [],
};
