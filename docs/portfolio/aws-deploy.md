# AWS Deploy · 정적 화면과 API가 서로 다른 방식으로 배포되는 과정

## 담당과 기존 소개

1인 인프라 실습으로 React 화면, Express API, PostgreSQL을 두 저장소에 나누어 배포했다. 기존 아키텍처에는 Route 53, CloudFront·S3, ALB·EC2, RDS와 HTTPS 문제가 들어 있다. 추가할 설명은 ‘같은 main 푸시라도 각각 무엇을 만들어 어디까지 교체하는가’다. [기존 소개](../../src/content/projects/aws-deploy.ts)

| 경로 | 커밋에서 실행되는 일 | 서비스 요청이 도달하는 곳 |
| --- | --- | --- |
| 프론트엔드 | 클라이언트 저장소의 main 푸시 → Node 환경에서 빌드 → dist를 S3에 동기화 → CloudFront 경로 무효화 | 브라우저가 프론트 도메인으로 접근하면 CloudFront가 정적 파일 제공 |
| 백엔드 | 서버 저장소의 main 푸시 → Docker 이미지 빌드·레지스트리에 푸시 → GitHub-hosted Runner에서 EC2로 SSH → 기존 컨테이너 중지·제거 → 이미지 pull·새 컨테이너 실행 | API 도메인의 ALB가 HTTPS를 종료하고 EC2의 Express로 전달. API가 RDS에 접근 |

프론트 빌드는 성공했어도 CDN에 이전 파일이 남을 수 있어 S3 동기화 뒤 무효화를 요청한다. 백엔드는 실행 시점에 DB 환경값을 주입한다. 현재 스크립트는 기존 컨테이너를 먼저 중단하므로 무중단 전환·자동 롤백을 구현 성과로 기재하면 안 된다. PotneR의 상태 검사 후 롤백과 다른 배포 사례다. [프론트 배포 워크플로](https://github.com/yss9/todo-list-client/blob/main/.github/workflows/main.yml) · [백엔드 배포 워크플로](https://github.com/yss9/todo-list-server/blob/main/.github/workflows/main.yml)

## 사용자 요청으로 배포 경로 검증하기

HTTPS로 연 화면에서 HTTP API를 부르면 브라우저가 Mixed Content로 요청을 막는다. API 도메인에 ALB와 인증서를 연결해 브라우저에서 API까지 HTTPS로 접근하도록 구성했다. RDS 연결 문제는 컨테이너 로그에서 접속 환경값과 PostgreSQL SSL 설정을 분리해 확인했다. SSH 타임아웃에 대해 self-hosted Runner와 SSM을 검토한 기록이 있지만 확인한 워크플로의 배포 방식은 SSH다. AWS 콘솔에서 만든 리소스의 구성 근거는 구축 기록이며, 현재 가동 상태나 가용률을 뜻하지 않는다. [구축·문제 해결 기록](https://github.com/yss9/todo-list-server/blob/main/README.md)

배포한 API 자체도 설명할 수 있다. 부분 수정에서는 text와 completed 중 전달된 필드만 파라미터 바인딩 SQL에 넣어 나머지 값을 보존한다. 수정할 필드가 없으면 400, 대상 행이 없으면 404로 돌려주므로 화면에서 입력 문제와 없는 데이터를 구분할 수 있다. [API 구현](https://github.com/yss9/todo-list-server/blob/main/server.js)

> 화면과 API의 빌드 산출물을 분리해 각각 S3·CloudFront와 EC2 컨테이너에 배포했습니다. 배포 후에는 브라우저의 HTTPS 요청부터 컨테이너의 RDS 연결까지 구간을 나누어 장애 원인을 확인했습니다.
