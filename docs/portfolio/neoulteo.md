# 너울터 · 공공 데이터의 갱신과 답변 근거를 연결한 여행 서비스

## 기존 소개와 기여

2인 팀에서 백엔드를 중심으로 AI 연동과 일부 프론트엔드를 담당했다. 공개 소개에는 공공 관광 데이터 배치, 지도와 코스 계획, Spring AI의 도구 호출이 있다. 여기에 **검색 후보를 어떤 순서로 뽑는지, 외부 호출 하나가 실패하면 사용자에게 무엇을 돌려주는지**를 덧붙일 수 있다. [기존 소개](../../src/content/projects/neoulteo.ts)

## 질문에서 검색 결과와 근거 문서까지

여행 질문이 들어오면 애플리케이션이 관광지 검색을 기본으로 실행하고, 질문에 따라 날씨·축제 등 추가 도구를 고른다. 관광지 DB 문서는 첫 검색에서 인덱스로 구성한다. 검색어와 연관어로 후보 점수를 계산한 뒤, 임베딩을 사용할 수 있을 때 코사인 유사도로 재정렬한다. 임베딩 호출 실패 시 키워드 후보를 사용한다. 답변에는 실행된 도구, 성공 여부·소요 시간과 근거 문서가 따라가므로 추천 장소의 출처를 추적할 수 있다.

LLM 호출까지 실패하면 조회한 관광지 정보로 대체 응답을 만든다. 날씨·외부 웹 검색은 연동 확장 지점이므로 실제 제공 데이터는 도구별 구현을 기준으로 설명한다. FastAPI·ChromaDB 문서 검색은 별도 실험 경로다. Glople에서 여행 데이터로 임베딩 모델을 파인튜닝한 사례와도 구분한다. [후보 검색과 재정렬](https://github.com/yss9/neoulteo/blob/main/backend/src/main/java/com/neoulteo/ai/service/RagSearchService.java) · [대화와 실패 처리](https://github.com/yss9/neoulteo/blob/main/backend/src/main/java/com/neoulteo/ai/service/AiTravelChatService.java)

## TourAPI 동기화에서 집계와 저장을 나눈 이유

조회할 때마다 TourAPI를 호출하면 응답 시간과 호출 한도가 사용자 화면에 영향을 준다. 월별 배치가 콘텐츠 유형 8종을 수집하고 `contentId`를 기준으로 DB와 대조한다. 신규·변경·유지·누락은 그 실행에서 관찰한 차이를 보고하기 위한 집계다. 저장 단계는 수집한 행 전체를 upsert한다. 따라서 ‘변경된 행만 저장’, ‘누락 곧바로 삭제’라는 설명은 실제 처리 범위를 벗어난다. 대량의 관광지 목록은 런타임 컨텍스트로 Step 사이에서 전달하고, 비교 결과를 요약해 PDF를 만든다. AI 요약이 어려우면 집계 수치로 보고서를 구성한다. [저장 Step](https://github.com/yss9/neoulteo/blob/main/backend/src/main/java/com/neoulteo/batch/tasklet/TourSaveTasklet.java) · [런타임 컨텍스트](https://github.com/yss9/neoulteo/blob/main/backend/src/main/java/com/neoulteo/batch/shared/TourBatchRuntimeContext.java) · [실제 upsert SQL](https://github.com/yss9/neoulteo/blob/main/backend/src/main/resources/mappers/TourBatchMapper.xml)

> 공공 관광 데이터를 배치로 동기화하고, 대화 요청에서는 자체 DB의 검색 결과를 답변 근거로 사용했습니다. 임베딩과 LLM 호출 각각에 대체 경로를 두어 어느 단계까지 성공했는지에 따라 관광지 정보를 제공했습니다.
