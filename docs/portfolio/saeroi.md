# 새로이 · 구매 수량과 지갑 서명 대기를 다룬 거래 설계

## 기존 소개와 담당 범위

6인 팀에서 Material–Brand 소재 거래를 공동 구현하고 브랜드 AI 여정 어시스턴트의 백엔드·프론트엔드를 담당했다. 기존 상세 페이지는 읽기 14종과 쓰기 17종, 승인 카드의 소유자·유효기간·업무 상태 검사를 보여준다. 소재 등록, 가공, 제품 판매와 QR 이력은 팀 서비스의 전체 흐름이다. 이 페이지에 보강할 경험은 **두 사용자가 같은 재고를 볼 때의 처리**와 **지갑을 열기 전에 이미 소비되고 있던 시간**이다. [기존 소개](../../src/content/projects/saeroi.ts)

## 두 구매자가 잔여 12kg에서 각각 10kg을 주문할 때

두 요청이 동시에 12kg을 읽으면 둘 다 수량 검사를 통과할 수 있다. 동일 판매글을 구매·취소할 때 트랜잭션 안에서 `PESSIMISTIC_WRITE`로 해당 행을 먼저 읽는다. 먼저 끝난 구매가 잔여를 2kg으로 바꾸면 뒤 요청은 갱신된 값을 보고 초과 구매로 거절된다. 서로 다른 판매글까지 한꺼번에 잠글 필요가 없고, 외부 결제나 사용자 서명을 기다리는 시간과 재고 갱신을 분리할 수 있다.

통합 테스트는 서로 다른 구매자 두 명을 같은 시점에 출발시킨다. 성공 하나, 수량 초과 거절 하나뿐 아니라 최종 잔여 2kg과 거래 레코드 한 건까지 검사한다. 이 결과는 재고 불변식에 대한 검증으로 제시할 수 있다. [잠금 조회](https://github.com/yss9/saeroi/blob/main/backend/src/main/java/com/ssafy/upcycle/trade/repository/ListingLockRepository.java) · [동시 구매 테스트](https://github.com/yss9/saeroi/blob/main/backend/src/test/java/com/ssafy/upcycle/trade/service/ConcurrentPurchaseTests.java)

## 서명하기 전 33초가 어디에서 생겼는지 확인한 과정

중복 발행을 막기 위해 `findMintedMaterial`은 MetaMask 서명 요청 전에 과거 발행 이벤트를 조회한다. 기존 조회의 시작점은 블록 0이었다. 대상 컨트랙트가 배포되기 전에는 일치하는 이벤트가 생길 수 없으므로 조회 시작점을 배포 블록 11,221,171로 옮겼다. 배포 블록 설정을 읽을 수 없을 때는 기존 시작점으로 돌아간다. 서명·발행 절차와 중복 확인을 유지하면서 RPC가 탐색할 블록 범위를 줄였다.

기존 측정 기록은 같은 이벤트 질의에 약 33.6초, 변경 후 기록은 347ms와 455ms다. 포트폴리오에는 **동일 로그 조회 약 33.6초 → 0.5초 미만**으로 표기한다. 거래 전체 시간이나 블록 확정 시간에는 이 수치를 적용하지 않는다. 테스트는 조회 시작·종료 블록과 기존 발행 결과를 찾는 동작을 확인한다. [조회 구현](https://github.com/yss9/saeroi/blob/main/frontend/src/features/material/services/materialContractService.ts) · [조회 범위 회귀 테스트](https://github.com/yss9/saeroi/blob/main/frontend/src/features/material/services/materialContractService.test.ts)

## 대화에서 작업을 제안하고 실행하는 기준

카드를 만든 뒤 사용자가 다른 화면에서 먼저 결제할 수 있다. 승인 시점에 실제 업무 상태를 다시 읽어 완료된 카드를 닫고, 방금 서명한 작업은 전달된 트랜잭션 결과와 연결해 정상 완료 처리한다. 대화별 메모리 잠금은 단일 인스턴스 범위이고, 서로 다른 사용자가 동일한 판매글에 접근하는 경합은 DB 행 잠금이 담당한다. [오래된 카드 사례](https://github.com/yss9/saeroi/blob/main/backend/src/test/java/com/ssafy/upcycle/agent/AgentStaleActionTests.java)

> 소재 구매의 재고 검증 시점을 행 잠금 안으로 옮기고, 두 구매자가 동시에 주문해도 남은 수량과 거래 건수가 맞는지 통합 테스트로 확인했습니다.
