import type { Project } from "../types";

export const saybridge: Project = {
  slug: "saybridge",
  no: "03",
  name: "SayBridge",
  tagline: "화상채팅 기반 외국어 교육 플랫폼",
  summary:
    "관심사에 맞는 수업을 선택하고 선생님과 1:1 화상 수업을 진행하는 서비스입니다. 수업 개설부터 화상 통화, 실시간 채팅, 과제 제출까지 전체 학습 흐름을 통합 구현했습니다.",
  period: "2025.01 ~ 2025.05",
  team: "1인 개발",
  role: "프론트엔드 및 백엔드 개발",
  teamShort: "1인 개발 · FE/BE",

  stack: [
    { group: "Backend", items: ["Spring Boot", "Spring Security", "JWT", "OAuth2", "Spring Data JPA", "QueryDSL"] },
    { group: "Frontend", items: ["React"] },
    { group: "Realtime", items: ["WebSocket", "STOMP", "WebRTC"] },
    { group: "Data", items: ["MySQL", "Redis", "AWS S3"] },
  ],
  stackFlat: ["Spring Boot", "React", "MySQL", "Redis", "WebRTC", "WebSocket", "JWT", "S3"],

  links: [{ label: "GitHub", href: "https://github.com/yss9/SayBridge", kind: "github" }],

  preview: {
    src: "/projects/saybridge/course-detail.png",
    alt:
      "SayBridge 영어 회화 강의 상세 화면에서 공지와 과제 제출 상태를 확인하는 모습",
  },

  screenshots: [
    {
      src: "/projects/saybridge/webcam.png",
      alt: "SayBridge 1대1 화상 수업 화면에서 두 사용자의 웹캠 영상과 실시간 채팅을 함께 확인하는 모습",
      caption: "1:1 화상 수업 — WebRTC 영상 통화와 실시간 채팅을 한 화면에서 진행",
    },
    {
      src: "/projects/saybridge/courses.png",
      alt: "SayBridge 언어와 난이도 필터 아래 영어·일본어·스페인어 강의 카드가 표시된 강의 목록",
      caption: "강의 탐색 — 언어·난이도 복합 필터와 추천 강의 목록",
    },
    {
      src: "/projects/saybridge/course-detail.png",
      alt: "SayBridge English Conversation Lab 강의의 최근 공지와 과제 제출·수정·취소 버튼이 표시된 상세 화면",
      caption: "강의 상세 — 공지, 첨부 자료, 학생별 과제 제출 상태를 한 화면에서 관리",
    },
    {
      src: "/projects/saybridge/mypage.png",
      alt: "SayBridge 학생 마이페이지에 현재 수강 중인 세 강의와 리뷰 작성 상태가 표시된 화면",
      caption: "마이페이지 — 수강 강의, 프로필, 리뷰 작성 여부를 모아 확인",
    },
  ],

  architectureImage: {
    src: "/projects/saybridge/architecture.png",
    alt: "SayBridge React 프론트엔드, Spring Boot 백엔드, MySQL, Redis, S3와 WebRTC 화상 수업 구조를 보여주는 시스템 아키텍처",
    width: 1229,
    height: 655,
  },

  highlights: ["WebRTC 협상 순서 안정화", "WebSocket/STOMP 실시간 메시징", "QueryDSL 동적 강의 검색"],

  features: [
    {
      title: "인증 및 권한 관리",
      desc: "Spring Security/OAuth2/JWT 기반 소셜 로그인 및 역할별 접근 제어",
    },
    {
      title: "WebRTC 화상 연결",
      desc: "브라우저 간 미디어 스트림 P2P 연결을 통한 실시간 화상 수업 구현",
    },
    {
      title: "실시간 메시징",
      desc: "WebSocket/STOMP 기반의 시그널링 처리 및 수업 중 실시간 채팅 중계",
    },
    {
      title: "동적 강의 검색",
      desc: "QueryDSL을 활용하여 언어·레벨 등 복합 조건의 동적 강의 검색 구현",
    },
    {
      title: "파일 시스템 분리",
      desc: "S3를 활용한 강의 자료/과제 파일 저장 및 과제 제출 상태 조회 구조 개선",
    },
  ],

  architecture: [
    {
      id: "react",
      label: "React",
      role: "수업 탐색, 신청, 화상 수업, 채팅, 과제 제출 화면 및 클라이언트 로직 담당",
      band: "client",
    },
    {
      id: "spring",
      label: "Spring Boot",
      role: "인증(JWT), 강의/과제 CRUD, 파일 업로드 REST API 및 비즈니스 로직 처리",
      band: "server",
    },
    {
      id: "stomp",
      label: "WebSocket / STOMP",
      role: "실시간 채팅 메시지 중계 및 WebRTC 연결을 위한 시그널링 데이터 교환",
      band: "realtime",
    },
    {
      id: "webrtc",
      label: "WebRTC",
      role: "서버 부하를 최소화하기 위한 브라우저 간(P2P) 영상·음성 미디어 스트림 연결",
      band: "realtime",
    },
    {
      id: "storage",
      label: "MySQL · S3 · Redis",
      role: "영속 데이터(MySQL), 강의·과제 파일(S3), 저장된 채팅 메시지 ID 목록(Redis)을 분리해 관리",
      band: "data",
    },
  ],
  architectureIntent:
    "영상 스트림은 P2P로 흘려 서버 부하를 줄이고, 서버는 시그널링과 영속 데이터만 책임지도록 역할을 나눴습니다.",

  troubleshooting: [
    {
      id: "webrtc-black-screen",
      title: "WebRTC 협상 순서 안정화",
      problem:
        "미디어 스트림 준비, STOMP 연결, 상대방 입장과 Offer 생성이 서로 다른 비동기 흐름에서 실행되어 초기 연결 시점에 따라 영상 연결 상태가 달라졌습니다.",
      steps: [
        {
          label: "1",
          title: "문제 현상",
          body: "Offer/Answer 시그널링은 진행됐지만 일부 연결에서 상대방 영상이 표시되지 않아, 시그널링 메시지와 미디어 트랙 준비 시점을 함께 추적했습니다.",
        },
        {
          label: "2",
          title: "원인 추적",
          body: "getUserMedia, addTrack, STOMP connect, 상대방 join, createOffer의 실행 순서를 나눠 확인해 자동 시그널링의 비동기 순서 문제로 범위를 좁혔습니다.",
        },
        {
          label: "3",
          title: "확인한 구조적 문제",
          body: "로컬 스트림 준비와 STOMP 연결이 분리되어 있고, 상대방 준비 여부와 무관하게 협상이 시작될 수 있어 PeerConnection 상태에 따라 연결 결과가 달라질 수 있었습니다.",
        },
        {
          label: "4",
          title: "해결",
          body: "로컬 미디어 트랙을 먼저 PeerConnection에 등록한 뒤 STOMP를 연결하고, 상대방 join과 stable 상태를 확인한 경우에만 Offer를 생성하도록 순서를 재구성했습니다.",
        },
        {
          label: "5",
          title: "결과",
          body: "초기 협상 순서를 하나의 흐름으로 통제해 연결 시점에 따른 불안정성을 줄였습니다. 시그널링 성공 여부뿐 아니라 트랙 등록과 PeerConnection 상태를 함께 확인하도록 개선했습니다.",
        },
      ],
      code: [
        {
          filename: "webrtc-signaling.js",
          language: "javascript",
          code: `// 1) 먼저 로컬 미디어를 확보하고 PeerConnection에 등록
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => {
      if (pc.signalingState !== 'closed') {
        pc.addTrack(track, stream);
      }
    });
  })
  .then(connectStomp);

// 2) 상대방 입장(join) 후 stable 상태에서 Offer 생성
case 'join':
  if (isInitiator && !negotiatingRef.current
      && pc.signalingState === 'stable') {
    negotiatingRef.current = true;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    stompRef.current.publish({
      destination: '/app/video.signal',
      body: JSON.stringify({
        type: 'offer',
        sdp: pc.localDescription,
        chatCode,
      }),
    });
  }
  break;`,
        },
      ],
      takeaway:
        "현재 저장소에서는 특정 SDP m-line 누락을 직접 입증할 로그가 없으므로 원인을 단정하지 않고, 코드와 이력으로 확인되는 미디어 준비·상대방 입장·Offer 생성 순서의 안정화에 초점을 맞췄습니다.",
    },
  ],

  performance: [],

  demo: [
    {
      id: "courses",
      label: "강의 탐색",
      caption:
        "언어·레벨·키워드를 조합한 복합 조건 검색. 실제 서비스에서는 QueryDSL로 조건이 있을 때만 where 절에 붙는 동적 쿼리로 처리했습니다.",
    },
    {
      id: "course",
      label: "강의 상세 · 신청",
      caption:
        "정원과 현재 수강 인원을 확인하고 수강 신청을 보냅니다. 신청 상태는 선생님 승인에 따라 변경됩니다.",
    },
    {
      id: "video",
      label: "화상 수업",
      caption:
        "WebRTC P2P 영상 연결과 STOMP 채팅이 함께 동작하는 수업 화면입니다. 좌측 패널에서 시그널링 진행 순서를 확인할 수 있습니다.",
    },
    {
      id: "mypage",
      label: "마이페이지 · 권한",
      caption:
        "STUDENT / TEACHER / ADMIN 역할에 따라 접근 가능한 메뉴가 달라집니다. Spring Security의 역할별 접근 제어를 화면으로 옮겼습니다.",
    },
  ],
};
