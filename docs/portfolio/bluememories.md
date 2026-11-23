# BlueMemories · AI 추천이 흔들려도 일기를 남길 수 있게 한 설계

## 기여와 기존 소개

개발자 1명과 디자이너 1명으로 구성된 팀에서 기획·프론트엔드·백엔드 개발을 총괄했다. 공개 소개에는 AI 응답 검증과 커뮤니티 목록 쿼리 개선이 실려 있다. 보강할 부분은 원래 서비스의 감정 분석, 사후 교체한 AI 공급자, 추천과 감정 분석 각각의 실패 처리를 시간순으로 풀어주는 것이다. [기존 소개](../../src/content/projects/bluememories.ts)

## 외부 응답 두 종류에 서로 다른 계약 적용

초기에는 Naver Clova를 사용했다. 사후 개선에서는 공통 `AiChatClient`를 통해 설정으로 OpenAI 또는 Ollama를 고르고, 추천 흐름은 Mono 체인으로 조합했다. 추천 응답에서는 노래 2개와 검색어 2개를 각각 요구한다. JSON 역직렬화 뒤 크기·빈 문자열을 검사하고, 실패하면 교정 프롬프트로 한 번 더 요청한다. 두 번째도 실패하면 기본 추천값으로 YouTube 검색을 이어간다.

감정 응답에는 긍정·중립·부정 세 점수가 각각 0–100 범위인지, 합이 100인지, 대표 감정이 가장 높은 점수와 일치하는지 확인하는 검사가 있다. 최대 두 번 시도한 뒤에는 중립 기본값을 사용한다. 추천의 대체값과 감정 저장의 대체값은 사용 목적이 다르다. 이 구현의 성과는 잘못된 응답이 들어와도 후속 기능을 이어갈 수 있는 경로를 만든 점이다. [추천 검증](https://github.com/yss9/BlueMemories/blob/main/backend/src/main/java/com/backend/service/RecommendService.java) · [감정 점수 검증](https://github.com/yss9/BlueMemories/blob/main/backend/src/main/java/com/backend/service/SentimentAnalysisService.java)

## 공유 일기장과 커뮤니티 목록이 요구하는 데이터

초대 메시지·송수신자를 담는 신청 엔티티와 실제 일기장 참여 관계를 분리해, 한 사용자가 여러 일기장에 참여하고 한 일기장에 여러 사용자가 참여하는 구조를 표현했다. 공개 목록에서는 일기 본문 외에도 작성자 닉네임, 댓글·좋아요 수가 필요하다. DTO Projection에서 함께 집계하고 페이지 단위로 조회한다. 페이지 수 계산에는 별도 count 쿼리를 쓴다. 로컬 동일 조건 JMeter에서 목록 평균은 147.85→3.63ms였다. 이 값은 커뮤니티 목록의 측정치로, AI 추천 시간에는 적용하지 않는다. [초대 모델](https://github.com/yss9/BlueMemories/blob/main/backend/src/main/java/com/backend/domain/SharedDiaryApplication.java) · [조회와 count 쿼리](https://github.com/yss9/BlueMemories/blob/main/backend/src/main/java/com/backend/repository/DiaryRepository.java)

> AI 응답을 받은 뒤 감정 점수와 추천 목록의 계약을 각각 검증하고, 재시도가 끝나면 중립 감정 또는 기본 콘텐츠로 이어지도록 처리했습니다.
