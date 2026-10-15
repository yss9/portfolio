/**
 * Code and test evidence shown on the project detail pages.
 *
 * GENERATED from the project repositories by copying exact line ranges, so
 * every excerpt is verbatim. Non-contiguous ranges are joined with `// ...`.
 * Test names were checked against the test sources; the tests were not run
 * as part of generating this file.
 */
import type { ProjectEvidence } from "./types";

export const evidence: Record<string, ProjectEvidence> = {
  "saeroi": {
    "flow": {
      "title": "AI 도구 호출이 실제 작업이 되기까지",
      "steps": [
        {
          "label": "도구 호출",
          "detail": "모델이 업무 도구 31개 중 하나를 선택"
        },
        {
          "label": "읽기·쓰기 분기",
          "detail": "읽기 14개는 바로 실행, 쓰기 17개는 실행하지 않음",
          "guard": true
        },
        {
          "label": "확인 카드",
          "detail": "이미 끝난 일이거나 같은 대상의 카드가 열려 있으면 만들지 않음",
          "guard": true
        },
        {
          "label": "승인 시 재검증",
          "detail": "대화 소유자·유효기간·이미 처리됐는지 다시 확인",
          "guard": true
        },
        {
          "label": "도메인 실행",
          "detail": "기존 도메인 서비스가 업무 규칙을 최종 검사"
        }
      ],
      "guards": [
        "결제(PAYMENT)·확인(CONFIRM)·지갑 서명(WALLET_SIGN) 카드는 사용자가 화면에서 승인해야만 실행됩니다.",
        "방금 끝난 지갑 서명은 승인에 트랜잭션 해시가 함께 와서, 자기 카드를 '이미 처리됨'으로 오판하지 않습니다."
      ]
    },
    "cases": {
      "stale-model-state": {
        "code": [
          {
            "title": "실제 업무 상태를 두 번째 system 메시지로",
            "repo": "S15P21E104 · origin/backend/develop",
            "file": "src/main/java/com/ssafy/upcycle/agent/service/AgentTurnStore.java",
            "lines": "L85–98",
            "language": "java",
            "caption": "턴을 시작할 때 서버가 읽은 거래·가공·생산 상태를 기본 프롬프트와 분리해 넣고, 그 뒤에 대화 이력을 붙입니다.",
            "code": "@Transactional(readOnly = true)\npublic TurnPrompt loadPrompt(Long conversationId, String liveState) {\n    AgentConversation conversation = load(conversationId);\n    List<LlmMessage> messages = new ArrayList<>();\n    messages.add(LlmMessage.system(promptBuilder.build(conversation)));\n    if (StringUtils.hasText(liveState)) {\n        messages.add(LlmMessage.system(liveState));\n    }\n    messages.addAll(store.toLlmMessages(store.history(conversationId)));\n    if (endsWithOwnWords(messages)) {\n        messages.add(LlmMessage.user(SCREEN_EVENT_NOTICE));\n    }\n    return new TurnPrompt(messages, registry.specs());\n}"
          }
        ],
        "tests": [
          {
            "file": "src/test/java/com/ssafy/upcycle/agent/AgentEventStateTests.java",
            "cases": [
              {
                "name": "막힌_단계는_매_턴_시스템_프롬프트로_들어간다",
                "desc": "막힌 단계는 매 턴 시스템 프롬프트로 들어간다"
              }
            ]
          }
        ]
      },
      "approval-staleness": {
        "code": [
          {
            "title": "쓰기 도구는 실행하지 않고 카드로",
            "repo": "S15P21E104 · origin/backend/develop",
            "file": "src/main/java/com/ssafy/upcycle/agent/service/AgentToolExecutor.java",
            "lines": "L76, L90–97, L102–109",
            "language": "java",
            "caption": "쓰기 도구는 실행 대신 확인 카드를 만들고, 같은 대상의 카드가 이미 열려 있으면 새로 만들지 않습니다. 읽기 도구만 바로 실행됩니다.",
            "code": "if (tool.isWrite()) {\n    // ...\n    // **같은 일에 카드를 두 장 만들지 않는다.** 카드를 만드는 문이 둘이라\n    // (모델과 서버) 한쪽만 막으면 다른 쪽으로 중복이 들어온다. 실제로 온체인 기록\n    // 카드가 자동으로 뜬 뒤 모델이 같은 거래에 한 장을 더 만들었고, 담당자가 한쪽만\n    // 누르자 나머지가 영원히 남았다 — 서명은 다 끝났는데 \"지갑 서명이 필요합니다\"\n    // 가 계속 떠 있었다.\n    Optional<AgentPendingAction> already =\n            openCards.sameWork(openCards.of(conversation.getId()), tool.name(), arguments);\n    if (already.isPresent()) {\n        // ...\n        return alreadyProposed(already.get());\n    }\n    return propose(conversation, userId, tool, call, arguments, toolCallMessage, actionTtl);\n}\n\ntry {\n    AgentToolResult result = tool.execute(new AgentToolContext(userId, conversation), arguments);\n    return result.payloadJson();"
          },
          {
            "title": "승인 시점에 다시 확인",
            "repo": "S15P21E104 · origin/backend/develop",
            "file": "src/main/java/com/ssafy/upcycle/agent/service/AgentActionStore.java",
            "lines": "L73–82, L86–97",
            "language": "java",
            "caption": "카드의 소유자는 대화를 통해, 유효기간과 처리 여부는 승인 순간에 다시 확인합니다. 화면에서 먼저 처리된 일은 실패가 아니라 '이미 됨'으로 닫습니다.",
            "code": "// 액션 id 만으로는 소유자를 알 수 없다. 대화를 통해 확인한다 — require() 가\n// 소유자 조건을 쿼리에 박아 두고 있어 남의 액션이면 여기서 not-found 가 난다.\nAgentConversation conversation =\n        conversationService.require(userId, action.getConversationId());\n\nLocalDateTime now = LocalDateTime.now(clock);\nif (!action.isPending() || action.isExpiredAt(now)) {\n    action.expire();\n    throw new BusinessException(AgentErrorCode.AGENT_ACTION_NOT_PENDING);\n}\n// ...\n// 카드를 만든 뒤에 담당자가 화면에서 먼저 처리했을 수 있다. 그대로 실행하면 도메인이\n// 거절하고, 담당자는 자기가 승인한 작업이 오류로 끝나는 것을 본다. 이미 끝난 일이면\n// 실패가 아니라 \"이미 됐다\" 로 닫는다.\nOptional<String> stale = executor.stalenessReason(conversation, userId, action, arguments);\nif (stale.isPresent()) {\n    action.markStale();\n    store.appendAssistant(conversation, stale.get());\n    log.info(\"Agent action stale on approval: id={} tool={}\", actionId, action.getToolName());\n    return new Outcome(conversation.getId(), false, stale.get());\n}\n\nAgentToolResult result = runOrFail(conversation, userId, action, arguments);"
          }
        ],
        "tests": [
          {
            "file": "src/test/java/com/ssafy/upcycle/agent/AgentChatServiceTests.java",
            "cases": [
              {
                "name": "읽기_tool_은_바로_실행되고_결과가_모델에게_돌아간다",
                "desc": "읽기 tool 은 바로 실행되고 결과가 모델에게 돌아간다"
              },
              {
                "name": "쓰기_tool_은_실행되지_않고_확인_카드만_만든다",
                "desc": "쓰기 tool 은 실행되지 않고 확인 카드만 만든다"
              }
            ]
          },
          {
            "file": "src/test/java/com/ssafy/upcycle/agent/AgentStaleActionTests.java",
            "cases": [
              {
                "name": "이미_체인에_기록된_거래에는_카드를_띄우지_않는다",
                "desc": "이미 체인에 기록된 거래에는 카드를 띄우지 않는다"
              },
              {
                "name": "카드를_만든_뒤_화면에서_먼저_처리했으면_승인해도_실행되지_않는다",
                "desc": "카드를 만든 뒤 화면에서 먼저 처리했으면 승인해도 실행되지 않는다"
              },
              {
                "name": "방금_한_서명이_자기_카드를_이미_처리됨으로_닫지_않는다",
                "desc": "방금 한 서명이 자기 카드를 이미 처리됨으로 닫지 않는다"
              },
              {
                "name": "해시가_없는_승인은_이미_처리됨_판정을_그대로_받는다",
                "desc": "해시가 없는 승인은 이미 처리됨 판정을 그대로 받는다"
              }
            ]
          },
          {
            "file": "src/test/java/com/ssafy/upcycle/agent/PendingActionServiceTests.java",
            "cases": [
              {
                "name": "같은_액션을_두_번_승인할_수_없다",
                "desc": "같은 액션을 두 번 승인할 수 없다"
              },
              {
                "name": "남의_액션은_건드릴_수_없다",
                "desc": "남의 액션은 건드릴 수 없다"
              }
            ]
          },
          {
            "file": "src/test/java/com/ssafy/upcycle/agent/BrandStepAutoProposeTests.java",
            "cases": [
              {
                "name": "자동으로_띄운_카드를_모델이_또_띄우지_못한다",
                "desc": "자동으로 띄운 카드를 모델이 또 띄우지 못한다"
              },
              {
                "name": "다른_거래의_카드는_막지_않는다",
                "desc": "다른 거래의 카드는 막지 않는다"
              }
            ]
          }
        ]
      }
    }
  },
  "potner": {
    "flow": {
      "title": "자동 급수 체인",
      "steps": [
        {
          "label": "수분 부족 감지",
          "detail": "토양 수분 LOW 알림이 커밋된 뒤 시작"
        },
        {
          "label": "스테이션 이동",
          "detail": "급수량 미설정·물 부족이면 시작하지 않음"
        },
        {
          "label": "급수",
          "detail": "회신을 대조한 뒤 다음 명령 발행",
          "guard": true
        },
        {
          "label": "송풍",
          "detail": "설정 시, 이동 없이 스테이션에서 환기"
        },
        {
          "label": "대기 장소 복귀",
          "detail": "송풍이 실패해도 복귀는 진행"
        }
      ],
      "guards": [
        "각 명령은 DB 커밋이 끝난 뒤에만 MQTT로 발행합니다.",
        "다음 단계는 완료된 명령의 종류·목적지·발행 주체로 정합니다. 체인 상태를 따로 저장하지 않아 서버가 재시작해도 회신이 오면 이어집니다.",
        "명령이 실패·BUSY·타임아웃으로 끝나면 재시도하지 않고 체인을 멈춥니다. 결과만 유실된 급수를 다시 보내면 물이 두 번 나갈 수 있기 때문입니다."
      ]
    },
    "cases": {
      "implementation": {
        "code": [
          {
            "title": "완료된 명령으로 다음 단계 결정",
            "repo": "potner-server · Server-master",
            "file": "backend/src/main/java/com/potner/command/application/AutoWateringOrchestrator.java",
            "lines": "L37–39, L162–169, L173–182",
            "language": "java",
            "caption": "체인 상태 테이블 없이, 회신된 명령의 종류와 목적지만으로 급수·송풍·복귀를 이어갑니다.",
            "code": " * <p>체인 상태를 따로 저장하지 않는다. 다음 단계는 회신된 명령의 속성(종류·목적지·발행 주체)\n * 만으로 정해지므로, 상태 테이블을 두면 명령 이력과 어긋날 자리만 생긴다. 서버가 재시작해도\n * 회신이 도착하면 체인이 그대로 이어진다.\n// ...\nprivate void continueChain(DeviceCommandCompletedEvent event) {\n    if (event.commandType() == DeviceCommandType.NAVIGATE\n            && event.destination() == RobotLocationType.WATER_STATION) {\n        commandService.issueAuto(event.plantId(), new IssueDeviceCommandRequest(\n                DeviceCommandType.WATER, null, null), CommandPurpose.WATERING);\n        log.info(\"Auto watering run: arrived at station, watering: plantId={}\", event.plantId());\n        return;\n    }\n    // ...\n    if (event.commandType() == DeviceCommandType.WATER) {\n        if (properties.autoDryingEnabled()) {\n            commandService.issueAuto(event.plantId(), new IssueDeviceCommandRequest(\n                    DeviceCommandType.FAN, null, null), CommandPurpose.WATERING);\n            log.info(\"Auto watering run: watered, ventilating: plantId={}\", event.plantId());\n            return;\n        }\n        returnHome(event, \"watered\");\n        return;\n    }"
          },
          {
            "title": "커밋이 끝난 명령만 발행",
            "repo": "potner-server · Server-master",
            "file": "backend/src/main/java/com/potner/command/application/DeviceCommandPublishListener.java",
            "lines": "L9–13, L31–33, L47–52",
            "language": "java",
            "caption": "장치가 몇 ms 만에 회신해도 결과 처리기가 requestId를 찾을 수 있도록, 명령 저장이 커밋된 뒤에 MQTT로 내보냅니다.",
            "code": "/**\n * 저장이 커밋된 명령을 MQTT 로 내보낸다.\n *\n * <p>{@code AFTER_COMMIT} 이 필요한 이유는 순서다. 라즈베리는 BUSY 회신을 몇 ms 만에 보낼 수\n * 있어, 커밋 전에 발행하면 결과 처리기가 아직 없는 requestId 를 찾다 버린다.\n// ...\n@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)\npublic void onCommandIssued(DeviceCommandIssuedEvent event) {\n    Object payload = switch (event.commandType()) {\n    // ...\n    };\n    commandPublisher.publish(\n            event.deviceUid(),\n            new RobotCommand(event.commandType().commandName(), payload)\n    );\n}"
          },
          {
            "title": "회신을 반영하기 전 검증 순서",
            "repo": "potner-server · Server-master",
            "file": "backend/src/main/java/com/potner/command/application/DeviceCommandResultService.java",
            "lines": "L21–25, L50–65",
            "language": "java",
            "caption": "요청·장치·명령 종류를 대조하고, QoS 1 재전송은 상태 검사보다 먼저 messageId로 걸러냅니다.",
            "code": " * <p>검증 순서가 중요하다. 중복(재전송)을 상태 검사보다 먼저 봐야 한다 — QoS 1 재전송이\n * ALREADY_COMPLETED 로 찍히면 \"다른 회신이 두 번 왔다\" 는 가짜 신호가 남는다.\n *\n * <p>{@code TIMED_OUT} 위에는 덮어쓴다. 타임아웃은 서버의 추정이고 회신은 물리적 사실이다.\n * 실제 급수량이 일기에 실리므로 늦은 회신을 버리면 기록이 틀어진다.\n// ...\nDeviceCommand command = commandRepository.findById(message.requestId()).orElse(null);\nif (command == null) {\n    return CommandResultApplyOutcome.UNKNOWN_REQUEST;\n}\nif (!command.getDeviceUid().equals(topicDeviceUid)) {\n    return CommandResultApplyOutcome.DEVICE_MISMATCH;\n}\nif (command.getCommandType() != topicCommandType) {\n    return CommandResultApplyOutcome.TYPE_MISMATCH;\n}\nif (message.messageId().toString().equals(command.getResultMessageId())) {\n    return CommandResultApplyOutcome.DUPLICATE;\n}\nif (command.getStatus().isTerminal()) {\n    return CommandResultApplyOutcome.ALREADY_COMPLETED;\n}"
          }
        ],
        "tests": [
          {
            "file": "backend/src/test/java/com/potner/command/application/AutoWateringOrchestratorTest.java",
            "cases": [
              {
                "name": "skipsTheRunWhenNoWateringAmountIsConfigured",
                "desc": "급수량이 설정되지 않았으면 체인을 시작하지 않음"
              },
              {
                "name": "skipsTheRunWhenTheStationReportsWaterLow",
                "desc": "스테이션 물이 부족하면 시작하지 않음"
              },
              {
                "name": "failureStopsTheRunWithoutRetry",
                "desc": "명령이 실패하면 재시도 없이 체인 중단"
              },
              {
                "name": "ventilationFailureStillSendsTheRobotHome",
                "desc": "송풍이 실패해도 로봇은 대기 장소로 복귀"
              },
              {
                "name": "userIssuedCommandsNeverContinueTheChain",
                "desc": "사용자가 직접 내린 명령은 자동 체인을 잇지 않음"
              }
            ]
          },
          {
            "file": "backend/src/test/java/com/potner/command/application/DeviceCommandResultServiceTest.java",
            "cases": [
              {
                "name": "ignoresADuplicateRedelivery",
                "desc": "같은 messageId의 재전송은 무시"
              },
              {
                "name": "overwritesATimedOutCommandWithTheLateResult",
                "desc": "타임아웃 뒤 늦게 온 회신은 실제 결과로 반영"
              },
              {
                "name": "rejectsAResultFromADifferentDevice",
                "desc": "다른 장치에서 온 회신 거부"
              },
              {
                "name": "rejectsAnUnknownRequestId",
                "desc": "알 수 없는 requestId 거부"
              }
            ]
          },
          {
            "file": "backend/src/test/java/com/potner/PotnerApplicationTests.java",
            "cases": [
              {
                "name": "concurrentDuplicateMessageStoresOnlyOneReading",
                "desc": "같은 센서 메시지가 동시에 두 번 와도 한 건만 저장 (Testcontainers MySQL)"
              }
            ]
          }
        ]
      }
    }
  }
};
