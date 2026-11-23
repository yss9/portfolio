# SayBridge · 수업 연결의 순서와 과제 목록 조회

## 담당과 기존 소개

1인 개발한 외국어 수업 플랫폼이다. 강의 조회·신청, 1:1 화상 수업, 실시간 채팅과 과제 제출을 연결했다. 기존 포트폴리오에는 WebRTC 협상 문제 해결이 상세하고 과제 조회 최적화는 요약되어 있다. 백엔드 상세에서는 조회 입력과 반환 필드, 데이터가 비었을 때의 동작까지 보여줄 수 있다. [기존 소개](../../src/content/projects/saybridge.ts)

## 게시글별 과제 제출 여부를 한 번에 조회하기

강의 상세 화면이 필요로 하는 것은 각 게시글에서 로그인한 학생이 제출한 첨부 파일의 주소다. 화면은 게시글 ID 목록을 한 번에 보냈지만 서버는 목록을 돌며 학생·게시글 조합마다 저장소를 호출했다. 강의 게시글이 늘면 이 부분의 호출 수도 함께 늘었다.

사후 개선으로 학생 ID와 `coursePostId IN :coursePostIds` 조건을 한 JPQL에 넣었다. 인터페이스 Projection이 게시글 ID와 첨부 URL만 읽고, 서비스가 ID를 키로 하는 Map을 만들어 화면에 돌려준다. 게시글이 N개인 비어 있지 않은 요청에서는 제출 확인 경로가 **개별 N회에서 일괄 1회**가 되고, 빈 목록에서는 저장소 호출이 0회다. Mockito 테스트가 실제 DB 소요시간을 재는 것은 아니다. 일괄 메서드 호출과 빈 입력 시 생략을 확인하는 근거로 쓴다. [JPQL](https://github.com/yss9/SayBridge/blob/main/backend/src/main/java/com/backend/repository/HomeworkRepository.java) · [서비스](https://github.com/yss9/SayBridge/blob/main/backend/src/main/java/com/backend/service/HomeworkService.java) · [검증 테스트](https://github.com/yss9/SayBridge/blob/main/backend/src/test/java/com/backend/service/HomeworkServiceTest.java)

## 실시간 연결에서 순서를 확인한 지점

카메라·마이크 트랙 준비와 STOMP 연결 완료는 서로 다른 시점에 일어난다. 참가자는 방 토픽을 구독한 뒤 join을 보내고, 방 생성자는 수신 후 협상 상태가 stable일 때 Offer를 만든다. Answer를 적용할 때도 로컬 Offer가 있는지 검사한다. 서버는 방 코드에 맞춰 시그널링을 중계하고 영상·음성 트랙은 브라우저 간 WebRTC로 전송한다. 연결 성공률 수치 대신 두 브라우저가 어떤 순서로 메시지를 주고받는지 보여주는 사례다. [시그널링 및 역할별 순서](https://github.com/yss9/SayBridge/blob/main/README.md)

> 수업 화면이 게시글마다 확인하던 과제 제출 여부를 학생·게시글 ID 목록 기반으로 일괄 조회하도록 바꿨습니다. 필요한 두 필드만 읽고 빈 목록에서는 조회를 생략하는 동작까지 테스트로 고정했습니다.
