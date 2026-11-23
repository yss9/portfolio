# PotneR · 장치 명령, 센서 저장, 귀가 이벤트

## 기존 소개와 담당 범위

6인 팀에서 Flutter 앱·Spring Boot 백엔드·배포 인프라를 맡았다. 기존 소개는 자동 급수 체인과 재전송 처리를 중심으로 한다. 로봇의 주행·도킹, 스테이션의 펌프 제어, 사진 기반 생장 단계 추론은 팀 기능이며 개인 기여는 앱의 조작과 피드백, 서버의 명령·결과 계약, 배포 경로에서 설명한다. [기존 소개](../../src/content/projects/potner.ts)

## 회신이 빠를 때와 늦을 때를 모두 고려한 명령 기록

명령을 MQTT로 먼저 보내면 장치의 BUSY 회신이 DB 커밋보다 먼저 도착할 수 있다. 서버가 명령 이력을 커밋한 뒤 이벤트 리스너에서 발행하도록 순서를 정했다. 회신 처리에서는 messageId로 재전송을 식별하고 requestId·장치·명령 종류가 맞는지 대조한다. 서버가 타임아웃으로 추정한 뒤 실제 성공 결과가 도착하면 이력을 갱신해 실제 급수량을 기록할 수 있다. 급수 실패 뒤 자동 재시도는 물리적으로 물을 한 번 더 줄 수 있어 체인을 중단한다. [커밋 후 발행](https://github.com/yss9/potner/blob/main/server/backend/src/main/java/com/potner/command/application/DeviceCommandPublishListener.java) · [명령과 테스트 개요](https://github.com/yss9/potner/blob/main/README.md)

## 한 센서 메시지가 몇 번의 쓰기를 만드는가

초기 규격의 한 메시지에는 온도·습도·토양 수분·조도 네 값이 들어왔다. 개별 저장하던 네 행을 다중 행 INSERT 한 번으로 묶었다. **4회 → 1회는 초기 묶음 메시지 한 건의 쓰기 호출 수**다. 이후 단일 측정값 규격에서는 메시지 식별자의 고유 제약과 `INSERT IGNORE`로 동시에 같은 메시지가 들어와도 한 행만 저장되도록 했다. 초기 묶음 변경은 서버 개발 이력 `5da60c6`에서, 단건의 동시 저장은 공개본의 `concurrentDuplicateMessageStoresOnlyOneReading`에서 확인할 수 있다. 현재 단건 구현과 초기 묶음 최적화를 시점별로 설명하면 서로 다른 개선을 한 수치로 섞지 않게 된다. [현재 저장소 구현](https://github.com/yss9/potner/blob/main/server/backend/src/main/java/com/potner/sensor/domain/SensorReadingRepository.java)

## 앱에서 같은 귀가를 두 번 알리지 않는 방법

Android 지오펜스 진입을 한 번의 방문으로 기록하고 접근 알림을 보류 상태로 둔다. 사용자가 외곽을 벗어났을 때 서버가 접근을 수락하기 전이면 보류 요청을 폐기한다. 이미 수락했다면 같은 방문 ID로 취소를 보낸다. 외곽 이탈 이벤트가 중복돼도 보류 중인 취소가 추가로 생기지 않는지, 취소 가능 시간이 지났을 때 다음 방문을 다시 받을 수 있는지 상태 전이 테스트에 담았다. 앱·장치 통합 기능의 구체적인 구현 예로 쓸 수 있다. [상태 전이 구현](https://github.com/yss9/potner/blob/main/app/android/app/src/main/kotlin/com/potner/app/GeofenceStateReducer.kt) · [귀가 시나리오 테스트](https://github.com/yss9/potner/blob/main/app/android/app/src/test/kotlin/com/potner/app/GeofenceStateReducerTest.kt)

## 배포에서 검증한 범위

서버 파이프라인에서 테스트와 추론 가중치 확인, 이미지 빌드, 브랜치별 임시 환경 기동 검사를 수행한다. 배포 대상 브랜치에서는 이전 이미지를 보관하고 새 서버의 상태 확인이 실패하면 복구한다. 하드웨어의 성공률과 CI에서 검사한 서버 기동 결과를 따로 설명한다. [Jenkinsfile](https://github.com/yss9/potner/blob/main/server/Jenkinsfile) · [복구 스크립트](https://github.com/yss9/potner/blob/main/server/infra/scripts/deploy-backend.sh)

> 명령의 DB 커밋과 MQTT 발행 순서를 고치고, 타임아웃 이후의 실제 장치 회신까지 명령 이력과 대조해 급수 결과에 반영했습니다.
