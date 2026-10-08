export type ProjectStory = {
  audience: string;
  background: string;
  goal: string;
  choices: { technology: string; purpose: string; reason: string }[];
  learning: string;
  scopeNote?: string;
  blockchain?: {
    purpose: string;
    signature: string;
    flow: { title: string; body: string }[];
    scopeNote: string;
  };
};

/** Editorial context derived from the existing implementation records. */
export const projectStories: Record<string, ProjectStory> = {
  saeroi: {
    audience: "폐소재 공급업체 · 가공업체 · 브랜드 담당자",
    background:
      "폐소재가 공급업체에서 가공업체와 브랜드를 거쳐 제품이 되기까지 여러 업체의 업무가 이어집니다. 각 단계의 거래 기록과 현재 상태를 확인하고, 브랜드 담당자가 다음 할 일을 파악할 흐름이 필요했습니다.",
    goal: "소재 거래·가공·생산·판매의 흐름을 연결하고, 블록체인 작업의 승인 결과를 서버 상태에 반영합니다. AI는 업무를 안내하며 실제 변경은 사용자 확인과 서버 검증을 거치게 합니다.",
    blockchain: {
      purpose:
        "여러 업체가 이어가는 소재 거래에서 주문·인계·생산 등의 기록을 확인하기 위해 Hyperledger Besu를 사용합니다. MySQL은 서비스의 업무 데이터와 현재 상태를 관리하고, 블록체인에서 처리한 결과를 서버 상태와 연결합니다.",
      signature:
        "지갑 서명은 사용자가 자신의 지갑으로 블록체인에 반영할 작업을 승인하는 단계입니다. AI의 제안에 대한 확인 카드 승인과 지갑 서명은 각각 처리하며, 서버는 온체인 결과를 확인한 뒤 거래의 진행 상태를 반영합니다.",
      flow: [
        {
          title: "작업 내용 확인",
          body: "화면이나 AI 확인 카드에서 구매 대상과 실행할 업무를 확인합니다.",
        },
        {
          title: "지갑 서명",
          body: "블록체인에 반영할 작업을 사용자의 지갑으로 승인합니다.",
        },
        {
          title: "온체인 결과 확인",
          body: "서버가 블록체인에서 처리된 결과를 확인합니다.",
        },
        {
          title: "업무 상태 반영",
          body: "확인한 결과를 거래 상태와 화면의 다음 단계에 연결합니다.",
        },
      ],
      scopeNote:
        "블록체인 기반 기록은 팀 서비스의 전체 구조입니다. 본인은 Material–Brand 거래 API·화면, 지갑 서명 결과와 서버 상태의 연동, AI 어시스턴트의 승인형 실행 흐름을 담당했습니다.",
    },
    choices: [
      {
        technology: "Hyperledger Besu · 온체인 결과 연동",
        purpose: "주문·인계·생산 기록과 서버의 업무 상태 연결",
        reason:
          "팀 서비스는 블록체인에서 처리한 결과를 사용합니다. 담당 거래 흐름에서는 지갑 서명 이후의 온체인 결과를 확인하고, 서버가 관리하는 진행 상태에 반영하도록 연결했습니다.",
      },
      {
        technology: "LLM Tool Use",
        purpose: "31개 도메인 기능을 대화형 업무 도구로 연결",
        reason:
          "기존 거래·생산 기능을 다시 구현하지 않고 모델의 제안을 기존 도메인 서비스의 실행 흐름에 연결했습니다.",
      },
      {
        technology: "Spring Boot · JPA",
        purpose: "거래 상태와 승인 카드의 실행 조건 관리",
        reason:
          "모델의 대화 이력은 오래될 수 있어, 서버에서 실제 업무 상태·소유권·유효기간을 다시 확인하도록 책임을 분리했습니다.",
      },
      {
        technology: "React · ethers.js",
        purpose: "거래 화면과 블록체인 작업의 사용자 지갑 승인 연결",
        reason:
          "ethers.js를 사용하는 지갑 서명 흐름을 거래 화면에 연결했습니다. AI의 작업 확인 카드와 사용자의 지갑 승인을 구분하고, 서명 이후의 결과를 서버 거래 상태와 이어주었습니다.",
      },
    ],
    learning:
      "AI의 답변과 실제 업무 상태는 서로 다른 책임으로 다뤄야 했습니다. 제안 시점과 승인 시점 사이의 상태 변화를 확인하는 방식은 결제뿐 아니라 생산 확정 같은 변경 작업에도 적용할 수 있는 설계 기준이 됐습니다.",
    scopeNote:
      "본인 담당은 Material–Brand 거래와 AI 어시스턴트의 백엔드·프론트엔드입니다. 블록체인 설명은 전체 서비스의 맥락이며, 본인의 구현 기여는 거래·지갑 서명 결과·서버 상태를 연결한 흐름을 중심으로 표시했습니다.",
  },
  potner: {
    audience: "식물의 상태를 확인하고 자동으로 돌보고 싶은 사용자",
    background:
      "센서가 보내는 환경 값과 실제 로봇의 행동을 연결해야 했습니다. 네트워크 지연이나 중복 메시지가 발생하면 같은 급수가 다시 실행될 수 있다는 점이 핵심 제약이었습니다.",
    goal: "수분 부족 감지부터 이동·급수·복귀까지 자동화하고, 앱에서 상태와 명령 이력을 확인할 수 있게 합니다.",
    choices: [
      {
        technology: "MQTT · 명령 이력",
        purpose: "센서 수집과 장치 명령의 비동기 연결",
        reason:
          "응답의 도착 순서를 신뢰하지 않고 requestId·장치 ID·명령 종류를 검증해 현재 작업의 결과인지 판단했습니다.",
      },
      {
        technology: "Spring Boot · 이벤트 처리",
        purpose: "이동 → 급수 → 복귀의 상태 전이",
        reason:
          "명령 저장을 커밋한 뒤 발행해 빠른 장치 응답과의 경쟁을 막고, 실패 시에는 자동 체인을 중단하도록 구성했습니다.",
      },
      {
        technology: "Flutter · Riverpod",
        purpose: "상태 조회부터 수동 제어·성장 기록까지 앱 연결",
        reason:
          "서버 API와 연결한 식물·장치 상태를 화면에 제공하고, 알림 딥링크를 해당 식물과 날짜의 기록으로 연결했습니다.",
      },
      {
        technology: "Jenkins · Docker",
        purpose: "테스트·빌드·배포와 Health Check",
        reason:
          "브랜치별 임시 DB로 기동을 검증하고 배포 후 Health Check 실패 시 이전 이미지로 돌아가도록 구성했습니다.",
      },
    ],
    learning:
      "응답이 오지 않았다고 실제 동작이 실패한 것은 아니었습니다. 결과만 유실된 급수를 무조건 재시도하면 중복 동작이 생길 수 있어, 실패를 기록하고 사용자가 확인할 수 있게 만드는 것이 중요한 설계 판단이었습니다.",
    scopeNote:
      "본인 담당은 Flutter 앱, 서버와 배포 흐름입니다. 자율 주행·도킹과 하드웨어 제어 자체는 전체 시스템 구성으로 구분합니다.",
  },
  saybridge: {
    audience: "온라인 외국어 수업을 진행하는 학생과 강사",
    background:
      "강의를 찾는 화면과 실제 화상 수업, 수업 중 채팅, 과제 제출이 이어지는 학습 서비스를 1인 개발로 구성했습니다.",
    goal: "수업 탐색부터 수강·통화·과제까지 하나의 서비스에서 연결하고, 초기 영상 연결의 비동기 순서를 통제합니다.",
    choices: [
      {
        technology: "WebRTC",
        purpose: "브라우저 간 1:1 영상·음성 연결",
        reason:
          "영상은 P2P로 전달하고 서버는 연결을 위한 시그널링을 담당하도록 역할을 나눴습니다.",
      },
      {
        technology: "WebSocket · STOMP",
        purpose: "시그널링과 수업 중 채팅 중계",
        reason:
          "미디어 준비, 서버 연결, 상대 입장과 Offer 생성의 순서를 함께 관리해 연결 시점에 따른 차이를 줄였습니다.",
      },
      {
        technology: "QueryDSL · Spring Security",
        purpose: "복합 조건 검색과 역할별 접근 제어",
        reason:
          "검색 조건이 있을 때만 쿼리에 반영하고 학생·강사·관리자의 기능 접근을 서버에서 구분했습니다.",
      },
    ],
    learning:
      "시그널링 메시지가 전달돼도 영상 연결까지 성공했다고 볼 수 없었습니다. 미디어 트랙 준비와 PeerConnection 상태를 함께 추적하면서, 비동기 문제를 이벤트의 실행 순서로 좁히는 방법을 익혔습니다.",
  },
  neoulteo: {
    audience: "지역별 관광지를 탐색하고 일차별 여행 코스를 만드는 사용자",
    background:
      "관광지 데이터는 계속 갱신되지만 일반 지식에만 의존하는 AI 답변에는 서비스가 가진 실제 장소 정보가 반영되지 않을 수 있습니다.",
    goal: "공공 데이터를 미리 동기화하고, 관광지 DB를 검색과 AI 답변의 공통 근거로 사용합니다.",
    choices: [
      {
        technology: "Spring AI · DB 기반 RAG",
        purpose: "실제 관광지 정보를 근거로 답변 생성",
        reason:
          "애플리케이션이 질문 키워드에 따라 필요한 도구를 조합해, 어떤 조회 결과가 답변에 전달되는지 통제했습니다.",
      },
      {
        technology: "Spring Batch · MySQL",
        purpose: "TourAPI 수집·비교·갱신",
        reason:
          "매 검색 요청에서 외부 API를 호출하지 않도록 수집 경로를 분리하고, 전체 수집 항목을 upsert해 기존 데이터를 유지하며 갱신했습니다.",
      },
    ],
    learning:
      "AI 답변의 근거를 개선하려면 모델 호출뿐 아니라 데이터 갱신 과정도 함께 설계해야 했습니다. 수집·검색·답변을 분리해 각 단계의 역할과 실패 지점을 설명할 수 있도록 구성했습니다.",
    scopeNote:
      "FastAPI·ChromaDB는 별도 실험이며, 서비스의 Spring AI·DB 기반 RAG와 구분합니다.",
  },
  glople: {
    audience: "취향에 맞는 여행지와 다른 사용자의 여행 경로를 찾는 사용자",
    background:
      "성향과 선택 키워드로 추천을 제공했지만 상위 결과만 필요한 요청에서도 전체 데이터를 읽고 전체 정렬을 수행했습니다.",
    goal: "추천 결과에 필요한 후보와 연산 범위를 줄이고 같은 요청 조건에서 응답 시간을 비교합니다.",
    choices: [
      {
        technology: "MySQL 비트마스크 · BIT_COUNT",
        purpose: "키워드 후보 필터와 공통 키워드 점수 계산",
        reason:
          "전체 데이터를 Java에서 문자열로 반복 탐색하는 대신 후보 필터링과 점수 계산을 DB로 옮겼습니다.",
      },
      {
        technology: "PriorityQueue Top-K",
        purpose: "유사 사용자 상위 12건 유지",
        reason:
          "성별·연령으로 후보를 먼저 좁히고 크기 12의 힙을 유지해 전체 결과를 정렬하는 비용을 줄였습니다.",
      },
    ],
    learning:
      "자료구조를 바꾸기 전에 어떤 데이터가 실제 결과에 필요한지부터 확인했습니다. 후보군 축소와 정렬 범위 제한을 따로 설명하고 동일한 조건의 측정값을 함께 제시하는 것이 개선을 검증하는 기준이 됐습니다.",
    scopeNote:
      "본인 기여는 추천 로직과 일부 프론트엔드입니다. 실시간 매칭·채팅과 외부 API 연동은 팀 서비스의 전체 구성으로 구분합니다. 수치는 로컬 JMeter 비교 결과이며 운영 환경의 성능을 의미하지 않습니다.",
  },
  bluememories: {
    audience: "일상의 감정을 기록하고 다른 사람과 일기를 나누는 사용자",
    background:
      "AI 감정 분석과 콘텐츠 추천을 일기 작성 흐름에 연결했습니다. 초기 추천 파서는 응답의 문구와 순서에 의존해 형식이 달라지면 키워드를 놓쳤습니다.",
    goal: "일기와 공유 일기장 기능을 제공하고, 외부 AI 응답의 형식 변화와 실패가 사용자 흐름을 끊지 않도록 개선합니다.",
    choices: [
      {
        technology: "JSON 응답 계약 · DTO 검증",
        purpose: "추천 응답의 필드와 개수 확인",
        reason:
          "번호와 문구에 의존하는 정규식 대신 구조화된 응답을 검증하고 파싱 실패 시 기본 추천값을 제공합니다.",
      },
      {
        technology: "MySQL · DTO Projection",
        purpose: "공유 관계 확장과 목록에 필요한 데이터 조회",
        reason:
          "1:1 교환일기를 N:M 공유 일기장으로 확장하고, 작성자 정보와 집계값은 목록 응답에 바로 반환하도록 개선했습니다.",
      },
    ],
    learning:
      "외부 AI 응답은 언제든 형식이 달라질 수 있는 입력으로 다뤄야 했습니다. 정상 응답의 계약을 정의하는 것과 실패 시에도 일기 작성 흐름을 유지하는 기본값 설계를 함께 적용했습니다.",
    scopeNote:
      "기획과 개발을 담당하고 디자이너 1인과 협업했습니다. AI 응답 계약·기본값 처리와 목록 조회 개선은 프로젝트 종료 후 진행한 사후 개선입니다.",
  },
  mofy: {
    audience: "패션 콘텐츠를 공유하고 사용자 간 메시지를 주고받는 사용자",
    background:
      "색상 팔레트와 패션 게시글을 제공하는 팀 서비스에서 사용자끼리 메시지를 작성하고 확인하는 기능을 공동 구현했습니다.",
    goal: "메시지 작성·조회 API와 React 화면을 연결해 사용자 간 대화를 지원합니다.",
    choices: [
      {
        technology: "Django REST Framework",
        purpose: "사용자 메시지 작성·조회 API",
        reason:
          "React 화면에서 메시지를 작성하고 내용을 확인할 수 있도록 API 요청과 응답을 연결했습니다.",
      },
      {
        technology: "React · Axios",
        purpose: "메시지 작성·조회 화면",
        reason:
          "메시지 API를 호출하고 응답을 화면에 렌더링하는 프론트엔드 흐름을 팀원과 공동으로 구현했습니다.",
      },
    ],
    learning:
      "공동 구현한 기능에서도 본인이 담당한 API와 화면의 범위를 구체적으로 설명하는 것이 중요했습니다. 메시지 작성과 조회에서 API 요청과 화면 상태를 이어 설명할 수 있도록 정리했습니다.",
    scopeNote:
      "메시지 기능은 팀원과 공동 구현했습니다. 색상 추출·검색 추천은 서비스의 전체 기능이며 본인 단독 기여로 표시하지 않습니다.",
  },
  "aws-deploy": {
    audience: "정적 웹 화면과 API를 AWS에 배포하는 개발 환경",
    background:
      "로컬에서 동작하던 화면과 서버를 클라우드에 올리면서 HTTPS 통신, DB 연결과 자동 배포 경로를 각각 구성해야 했습니다.",
    goal: "정적 리소스·API·데이터의 배포 경로를 분리하고 GitHub Actions로 빌드와 배포를 자동화합니다.",
    choices: [
      {
        technology: "S3 · CloudFront",
        purpose: "정적 화면 배포",
        reason: "정적 빌드 산출물을 API 서버와 분리해 CDN을 통해 제공합니다.",
      },
      {
        technology: "ALB · ACM · EC2",
        purpose: "HTTPS API와 컨테이너 실행",
        reason:
          "HTTPS 화면의 HTTP API 요청이 차단되는 문제를 API 경로의 인증서와 프로토콜 구성으로 해결했습니다.",
      },
      {
        technology: "GitHub Actions · Docker",
        purpose: "프론트·서버 배포 자동화",
        reason:
          "프론트는 S3, 서버는 컨테이너 이미지와 EC2로 나눠 각각의 배포 단계를 구성했습니다.",
      },
    ],
    learning:
      "배포 장애를 애플리케이션 코드와 인프라 설정으로 나눠 확인했습니다. 로그와 설정으로 확인한 사실과 당시 기록이 남지 않은 추정을 구분하는 것이 장애 설명의 기준이 됐습니다.",
    scopeNote:
      "별도 AWS 배포 실습입니다. self-hosted Runner·SSM 전환은 검토한 대안이며 현재 적용한 방식은 GitHub-hosted Runner의 SSH 배포입니다.",
  },
};
