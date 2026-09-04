import type { Project } from "../types";

export const saybridge: Project = {
  slug: "saybridge",
  no: "01",
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

  highlights: ["WebRTC 검은 화면 해결", "N+1 · 100 → 1 쿼리", "응답 16.75ms → 3.99ms"],

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
      role: "영속 데이터(MySQL), 파일(S3), 메시지 중계 확장성(Redis)을 고려한 데이터 설계",
      band: "data",
    },
  ],
  architectureIntent:
    "영상 스트림은 P2P로 흘려 서버 부하를 줄이고, 서버는 시그널링과 영속 데이터만 책임지도록 역할을 나눴습니다.",

  troubleshooting: [
    {
      id: "webrtc-black-screen",
      title: "WebRTC 검은 화면 해결",
      problem:
        "Offer/Answer 교환은 정상이었지만 상대방 영상이 표시되지 않는 검은 화면 발생 — SDP 교환 성공 여부만으로는 미디어 스트림 연결 상태를 보장할 수 없음",
      steps: [
        {
          label: "1",
          title: "문제 현상",
          body: "WebSocket 시그널링 로그상 Offer/Answer 교환 정상 완료. 그러나 양측 화면 모두 검은 화면 유지, 미디어 스트림 수신 없음",
        },
        {
          label: "2",
          title: "원인 추적",
          body: "브라우저 콘솔에서 SDP를 직접 복사해 상대방에게 수동 주입하는 테스트 진행. WebRTC 코어 연결 문제와 자동화 시그널링 로직 문제를 분리해 범위 축소",
        },
        {
          label: "3",
          title: "실제 원인",
          body: "SDP 로그 비교 결과, addTrack() 완료 전에 createOffer()가 먼저 실행됨. 자동 생성 SDP에서 m-line 누락 및 direction 비활성 상태 확인",
        },
        {
          label: "4",
          title: "해결",
          body: "async/await로 미디어 트랙 등록 완료를 보장한 이후 Offer SDP를 생성하도록 실행 순서 제어",
        },
        {
          label: "5",
          title: "결과",
          body: "영상 연결 정상화. SDP 생성 시점과 PeerConnection 상태를 함께 확인해야 하며, 시그널링 성공이 곧 미디어 연결 성공을 의미하지 않음을 학습",
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
        "시그널링 성공이 곧 미디어 연결 성공은 아닙니다. SDP 생성 시점과 PeerConnection 상태를 함께 확인해야 합니다.",
    },
  ],

  performance: [
    {
      id: "homework-n-plus-1",
      title: "과제 제출 상태 조회 N+1 제거",
      summary:
        "게시글 목록에서 학생의 과제 제출 상태를 표시하기 위해 게시글마다 단건 조회가 반복되는 N+1 패턴을 발견했습니다. 이를 IN 조건 배치 조회와 Projection으로 최적화하여 DB 부하를 줄이고 응답 속도를 개선했습니다.",
      before: {
        label: "Before: 반복 쿼리 (N+1)",
        code: {
          language: "java",
          code: `for (postId : postIds) {
    submission = findSubmission(postId, user);
    if (submission != null) {
        result.put(postId, submission.url);
    }
}`,
        },
        notes: ["게시글 수만큼 단건 조회 반복", "목록 크기에 비례해 쿼리 증가"],
      },
      after: {
        label: "After: IN 조건 배치 조회",
        code: {
          language: "sql",
          code: `SELECT postId, attachmentUrl
FROM Homework
WHERE studentId = :studentId
  AND postId IN :coursePostIds`,
        },
        notes: ["한 번의 쿼리로 전체 제출 상태 수집", "Projection으로 필요한 컬럼만 조회"],
      },
      metrics: [
        { label: "DB Query / Request", before: "100", after: "1", delta: "-99%", better: "lower" },
        { label: "Avg Response Time", before: "16.75ms", after: "3.99ms", delta: "-76.2%", better: "lower" },
        { label: "p95 Latency", before: "20ms", after: "5ms", delta: "-75.0%", better: "lower" },
        { label: "Error Rate", before: "0%", after: "0%", better: "lower" },
      ],
      condition: "측정 도구: JMeter · 조건: 30 threads × 20 loops (Total 600)",
    },
  ],

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
      id: "homework",
      label: "과제 제출 현황",
      caption:
        "N+1을 제거한 바로 그 화면입니다. 조회 방식을 전환하면 발생하는 쿼리 수가 어떻게 달라지는지 직접 확인할 수 있습니다.",
    },
    {
      id: "mypage",
      label: "마이페이지 · 권한",
      caption:
        "STUDENT / TEACHER / ADMIN 역할에 따라 접근 가능한 메뉴가 달라집니다. Spring Security의 역할별 접근 제어를 화면으로 옮겼습니다.",
    },
  ],
};
