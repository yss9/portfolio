/**
 * SayBridge demo clips: the original React frontend (frontend/, Create React App)
 * built for production and driven with demo fixtures. The Spring Boot backend,
 * its STOMP broker and the second WebRTC peer are not running, so:
 *   - every `/api` call is answered here with plausible demo data,
 *   - `/ws-chat` (SockJS + STOMP) is answered by a tiny in-test broker that speaks
 *     the SockJS websocket framing and STOMP 1.2, echoes chat messages like the real
 *     server, and plays the teacher's side of the signaling (join → offer),
 *   - camera streams are canvas placeholders (getUserMedia stub) and
 *     RTCPeerConnection is a local stand-in, so no STUN server is contacted.
 *
 * Build and serve the frontend first (outside this repo):
 *   cd ../.capture/saybridge-frontend/frontend
 *   REACT_APP_API_URL=http://localhost:4322 GENERATE_SOURCEMAP=false npx react-scripts build
 *   node ../serve.mjs        # SPA fallback on port 4322
 * SAYBRIDGE_URL overrides the served address.
 */

const APP_URL = process.env.SAYBRIDGE_URL ?? "http://localhost:4322";
const APP_ORIGIN = new URL(APP_URL).origin;

const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const KST = 9 * HOUR;
/** Midnight (KST) of the recording day, as epoch ms. */
const TODAY = Math.floor((NOW + KST) / DAY) * DAY - KST;
/** A KST wall-clock time n days before the recording day, e.g. kst(1, "10:30"). */
const kstMs = (daysAgo, hms) => {
  const [h, m, s = 0] = hms.split(":").map(Number);
  return TODAY - daysAgo * DAY + ((h * 60 + m) * 60 + s) * 1000;
};
const kst = (daysAgo, hms) => new Date(kstMs(daysAgo, hms)).toISOString();

/* ---------------------------------------------------------------- */
/* People                                                            */
/* ---------------------------------------------------------------- */

const STUDENT = {
  id: 42,
  email: "minseo@saybridge.demo",
  username: "minseo@saybridge.demo",
  name: "김민서",
  nickname: "김민서",
  role: "STUDENT",
  profileImageUrl: null,
};

const TEACHER_USER = {
  id: 21,
  email: "hayun@saybridge.demo",
  username: "hayun@saybridge.demo",
  name: "정하윤",
  nickname: "정하윤",
  role: "TEACHER",
  teacherId: 5,
  profileImageUrl: null,
};

const teachers = {
  5: { userId: 21, name: "정하윤" },
  6: { userId: 22, name: "김나연" },
  7: { userId: 23, name: "박도윤" },
  8: { userId: 24, name: "이서진" },
  9: { userId: 25, name: "최유나" },
  10: { userId: 26, name: "한지우" },
};

/* ---------------------------------------------------------------- */
/* Courses                                                           */
/* ---------------------------------------------------------------- */

const courses = [
  [101, "뉴스로 배우는 영어 회화", "매주 영문 기사 한 편을 읽고 내 생각을 말해 보는 실전 회화 수업", 5, 8, "ENGLISH", "INTERMEDIATE"],
  [102, "여행지에서 바로 쓰는 일본어", "공항·호텔·식당 상황별 표현을 롤플레이로 익히는 입문 수업", 6, 6, "JAPANESE", "BEGINNER"],
  [103, "스페인어 문화 회화 클럽", "영화와 음식 이야기로 대화를 이어 가는 소규모 스페인어 회화", 7, 10, "SPANISH", "BEGINNER"],
  [104, "비즈니스 영어 미팅·이메일", "회의 진행, 일정 조율, 메일 작성까지 업무 영어를 실습", 10, 6, "ENGLISH", "INTERMEDIATE"],
  [105, "1:1 영어 프리토킹", "일상 주제로 대화하며 자연스러운 표현과 발음을 바로 교정", 5, 4, "ENGLISH", "INTERMEDIATE"],
  [106, "중국어 HSK 4급 회화", "시험 빈출 주제로 말하기와 듣기를 함께 다지는 수업", 8, 8, "CHINESE", "INTERMEDIATE"],
  [107, "프랑스어 첫걸음", "발음과 인사부터 카페 주문까지 차근차근 시작", 9, 10, "FRENCH", "BEGINNER"],
  [108, "영어 토론 심화반", "사회 이슈를 두고 근거를 들어 반론하는 토론 연습", 5, 6, "ENGLISH", "ADVANCED"],
].map(([id, title, description, teacherId, maxStudents, language, level]) => ({
  id,
  title,
  description,
  teacherId,
  teacherName: teachers[teacherId].name,
  maxStudents,
  language,
  level,
}));
const course = (id) => courses.find((c) => c.id === id) ?? courses[0];

/** Posts (공지·과제) of 뉴스로 배우는 영어 회화. */
const posts = [
  {
    postId: 31,
    title: "4주차 과제 · 뉴스 요약 말하기",
    content:
      "관심 있는 영문 기사 한 편을 골라 핵심 내용을 2분 안에 요약해 녹음해 주세요.\n제출 기한은 이번 주 금요일 자정까지입니다.",
    attachmentUrl: "/files/course/101/4주차_가이드.pdf",
    created: kst(1, "10:30"),
  },
  {
    postId: 30,
    title: "발음 클리닉 · 연음 연습",
    content: "수업에서 연습한 문장 다섯 개를 녹음해 올려 주세요. 강세와 연음을 중심으로 피드백 드릴게요.",
    attachmentUrl: null,
    created: kst(4, "16:00"),
  },
  {
    postId: 29,
    title: "다음 화상 수업 안내",
    content: "다음 수업 주제는 '지속 가능한 여행'입니다. 찬성과 반대 의견을 한 가지씩 준비해 주세요.",
    attachmentUrl: null,
    created: kst(6, "09:00"),
  },
  {
    postId: 28,
    title: "3주차 과제 · 자기소개 영상",
    content: "1분 이내로 영어 자기소개 영상을 찍어 제출해 주세요.",
    attachmentUrl: null,
    created: kst(9, "18:20"),
  },
];

const fileUrl = (postId, name) => `/files/homework/${postId}/${name}`;

/** What the teacher sees for 4주차 과제. */
const postSubmissions = [
  ["김민서", [0, "09:14:52"], "4주차_뉴스요약_김민서.m4a"],
  ["이준호", [1, "23:40:18"], "뉴스요약_이준호.m4a"],
  ["박서아", [1, "21:05:33"], "4주차_박서아.mp3"],
  ["최지우", [1, "17:48:09"], "4주차_뉴스요약_최지우.m4a"],
  ["한도윤", [1, "13:22:47"], "4주차과제_한도윤.m4a"],
].map(([studentName, [daysAgo, at], name], index) => ({
  submissionId: 900 + index,
  studentName,
  submittedAt: kst(daysAgo, at),
  fileUrl: fileUrl(31, name),
}));

/* ---------------------------------------------------------------- */
/* HTTP fixtures                                                     */
/* ---------------------------------------------------------------- */

function json(route, data, delay = 0) {
  const send = () =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(data) });
  return delay ? new Promise((r) => setTimeout(r, delay)).then(send) : send();
}

function text(route, body, delay = 0) {
  const send = () => route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body });
  return delay ? new Promise((r) => setTimeout(r, delay)).then(send) : send();
}

/** Per-clip backend state (enrolments, applications, submissions). */
function freshState(clip) {
  return {
    user: clip.user ?? STUDENT,
    enrolled: new Set([101, 103]),
    applied: new Set(),
    submitted: { 30: fileUrl(30, "연음연습_김민서.m4a") },
  };
}

async function handle(route, unmatched, state) {
  const request = route.request();
  const url = new URL(request.url());
  const method = request.method();

  if (url.origin !== APP_ORIGIN) {
    // Nothing leaves the machine: no STUN, OAuth, placeholder images, …
    unmatched.add(`EXTERNAL ${method} ${url.origin}${url.pathname}`);
    return route.abort();
  }
  if (url.pathname.startsWith("/ws-chat/") && url.pathname.endsWith("/info")) {
    return json(route, { websocket: true, origins: ["*:*"], cookie_needed: false, entropy: 1938471 });
  }
  if (!url.pathname.startsWith("/api/")) return route.continue();

  const path = url.pathname.slice("/api".length);
  const key = `${method} ${path}`;
  const id = (re) => Number(path.match(re)?.[1]);

  if (key === "GET /user/me") return json(route, state.user);

  if (key === "GET /course") {
    const size = Number(url.searchParams.get("size") ?? 9);
    return json(route, { content: courses.slice(0, size), totalElements: courses.length });
  }
  if (key === "GET /course/search") {
    const language = url.searchParams.get("language");
    const level = url.searchParams.get("level");
    const pageNo = Number(url.searchParams.get("page") ?? 0);
    const found = courses.filter(
      (c) => (!language || c.language === language) && (!level || c.level === level),
    );
    return json(route, { content: pageNo === 0 ? found : [] }, 250);
  }
  if (method === "GET" && /^\/course\/\d+$/.test(path)) return json(route, course(id(/(\d+)$/)));
  if (key === "GET /course/student/list") return json(route, courses.filter((c) => state.enrolled.has(c.id)));

  if (method === "GET" && /^\/teacher\/\d+$/.test(path)) {
    const teacherId = id(/(\d+)$/);
    const teacher = teachers[teacherId] ?? teachers[5];
    return json(route, { teacherId, userId: teacher.userId, name: teacher.name, nickname: teacher.name });
  }

  if (method === "GET" && /^\/application\/check\/\d+$/.test(path)) return json(route, state.applied.has(id(/(\d+)$/)));
  if (method === "GET" && /^\/enrollment\/check\/\d+$/.test(path)) return json(route, state.enrolled.has(id(/(\d+)$/)));
  if (method === "POST" && /^\/application\/apply\/\d+$/.test(path)) {
    state.applied.add(id(/(\d+)$/));
    return json(route, { message: "수강신청이 완료되었습니다." }, 300);
  }
  if (method === "DELETE" && /^\/application\/delete\/\d+$/.test(path)) {
    state.applied.delete(id(/(\d+)$/));
    return json(route, {});
  }

  if (method === "GET" && /^\/post\/\d+$/.test(path)) return json(route, id(/(\d+)$/) === 101 ? posts : []);

  if (key === "GET /homework/submissions") {
    const ids = (url.searchParams.get("postIds") ?? "").split(",").filter(Boolean);
    return json(route, Object.fromEntries(ids.filter((p) => state.submitted[p]).map((p) => [p, state.submitted[p]])));
  }
  if (method === "POST" && /^\/files\/homework\/\d+$/.test(path)) {
    const postId = id(/(\d+)$/);
    return text(route, fileUrl(postId, "4주차_뉴스요약_김민서.m4a"), 450);
  }
  if (method === "POST" && /^\/homework\/submit\/\d+$/.test(path)) {
    const postId = id(/(\d+)$/);
    const body = request.postDataJSON() ?? {};
    state.submitted[postId] = body.fileUrl;
    return json(route, { submissionId: 951, coursePostId: postId, attachmentUrl: body.fileUrl }, 200);
  }
  if (method === "DELETE" && /^\/homework\/\d+$/.test(path)) {
    delete state.submitted[id(/(\d+)$/)];
    return json(route, {});
  }
  if (method === "GET" && /^\/homework\/post\/\d+\/submissions$/.test(path)) {
    return json(route, id(/post\/(\d+)/) === 31 ? postSubmissions : postSubmissions.slice(1, 4), 150);
  }

  unmatched.add(`${key}${url.search}`);
  return json(route, null);
}

/* ---------------------------------------------------------------- */
/* SockJS + STOMP broker stand-in                                    */
/* ---------------------------------------------------------------- */

const ROOM = "b7e2c4a1-3f9";
const CHAT_TOPIC = `/topic/chatroom/${ROOM}`;
const VIDEO_TOPIC = `/topic/video/${ROOM}`;

function stompFrame(command, headers, body = "") {
  const head = Object.entries(headers).map(([k, v]) => `${k}:${v}`).join("\n");
  return `${command}\n${head}\n\n${body}\0`;
}

function parseStomp(raw) {
  const textFrame = raw.replace(/^\n+/, "");
  if (!textFrame.trim()) return null; // heart-beat
  const split = textFrame.indexOf("\n\n");
  const lines = (split === -1 ? textFrame : textFrame.slice(0, split)).split("\n");
  const body = split === -1 ? "" : textFrame.slice(split + 2);
  const command = lines.shift();
  const headers = Object.fromEntries(
    lines.map((line) => [line.slice(0, line.indexOf(":")), line.slice(line.indexOf(":") + 1)]),
  );
  return { command, headers, body };
}

function createBroker({ teacherOffers = true } = {}) {
  const sessions = new Set();
  let messageId = 0;
  const sockSend = (ws, frames) => ws.send(`a${JSON.stringify(frames)}`);

  function publish(destination, payload) {
    const body = JSON.stringify(payload);
    for (const session of sessions) {
      for (const [subscription, dest] of session.subs) {
        if (dest !== destination) continue;
        sockSend(session.ws, [
          stompFrame(
            "MESSAGE",
            { destination, subscription, "message-id": `m-${++messageId}`, "content-type": "application/json" },
            body,
          ),
        ]);
      }
    }
  }

  function onSend(destination, payload) {
    if (destination === "/app/chat.sendMessage") {
      publish(`/topic/chatroom/${payload.chatCode}`, payload);
    } else if (destination === "/app/video.signal") {
      publish(`/topic/video/${payload.chatCode}`, payload);
      // The teacher's browser is the initiator: on the student's join it sends an offer.
      if (payload.type === "join" && teacherOffers) {
        setTimeout(
          () =>
            publish(`/topic/video/${payload.chatCode}`, {
              type: "offer",
              sdp: { type: "offer", sdp: "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n" },
              chatCode: payload.chatCode,
            }),
          250,
        );
      }
    }
  }

  function onFrame(session, frame) {
    switch (frame.command) {
      case "CONNECT":
      case "STOMP":
        sockSend(session.ws, [stompFrame("CONNECTED", { version: "1.2", "heart-beat": "0,0", server: "demo-broker" })]);
        break;
      case "SUBSCRIBE":
        session.subs.set(frame.headers.id, frame.headers.destination);
        break;
      case "UNSUBSCRIBE":
        session.subs.delete(frame.headers.id);
        break;
      case "SEND":
        try {
          onSend(frame.headers.destination, JSON.parse(frame.body));
        } catch {
          /* not JSON */
        }
        break;
      case "DISCONNECT":
        if (frame.headers.receipt) {
          sockSend(session.ws, [stompFrame("RECEIPT", { "receipt-id": frame.headers.receipt })]);
        }
        break;
      default:
    }
  }

  return {
    publish,
    attach(ws) {
      const session = { ws, subs: new Map() };
      sessions.add(session);
      ws.onMessage((data) => {
        let frames;
        try {
          frames = JSON.parse(String(data));
        } catch {
          return;
        }
        for (const raw of [].concat(frames)) {
          for (const part of String(raw).split("\0")) {
            const frame = parseStomp(part);
            if (frame) onFrame(session, frame);
          }
        }
      });
      ws.onClose(() => sessions.delete(session));
      ws.send("o"); // SockJS open frame
    },
    hasSubscriber(destination) {
      return [...sessions].some((s) => [...s.subs.values()].includes(destination));
    },
  };
}

/* ---------------------------------------------------------------- */
/* Camera placeholders + local RTCPeerConnection stand-in            */
/* ---------------------------------------------------------------- */

function installMedia(tiles) {
  const W = 1200;
  const H = 532;
  const FONT = '"Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';

  function makeTile({ name, initial, from, to, ink, pulse }) {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const start = performance.now();
    const draw = (now) => {
      const t = (now - start) / 1000;
      const drift = Math.sin(t * 0.5) * 140;
      const bg = ctx.createLinearGradient(drift, 0, W + drift, H);
      bg.addColorStop(0, from);
      bg.addColorStop(1, to);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // soft light
      const glow = ctx.createRadialGradient(W * 0.72, H * 0.18, 10, W * 0.72, H * 0.18, W * 0.55);
      glow.addColorStop(0, "rgba(255,255,255,0.42)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2 - 18;
      const r = 104;
      if (pulse) {
        const level = (Math.sin(t * 5.2) * 0.5 + 0.5) * (Math.sin(t * 1.3) * 0.35 + 0.65);
        ctx.beginPath();
        ctx.arc(cx, cy, r + 10 + level * 16, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.18 + level * 0.2})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();
      ctx.fillStyle = ink;
      ctx.font = `700 92px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initial, cx, cy + 6);

      // name tag
      ctx.font = `600 30px ${FONT}`;
      ctx.textAlign = "left";
      const label = ctx.measureText(name).width;
      const x = 30;
      const y = H - 30 - 56;
      ctx.fillStyle = "rgba(20,22,28,0.55)";
      ctx.beginPath();
      ctx.roundRect(x, y, label + 74, 56, 28);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 30, y + 28, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#4ade80";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText(name, x + 50, y + 29);
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    return canvas.captureStream(30);
  }

  let local;
  let remote;
  const localStream = () => (local ??= makeTile(tiles.local));
  const remoteStream = () => (remote ??= makeTile(tiles.remote));

  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia = async () => localStream();
  }

  class DemoPeerConnection extends EventTarget {
    constructor() {
      super();
      this.signalingState = "stable";
      this.connectionState = "new";
      this.localDescription = null;
      this.remoteDescription = null;
      this.onicecandidate = null;
      this.ontrack = null;
      this._transceivers = [];
    }
    addTrack(track) {
      const sender = { track };
      this._transceivers.push({ sender, stop() {} });
      return sender;
    }
    async createOffer() {
      return { type: "offer", sdp: "v=0\r\n" };
    }
    async createAnswer() {
      return { type: "answer", sdp: "v=0\r\n" };
    }
    async setLocalDescription(description) {
      this.localDescription = { type: description.type, sdp: description.sdp };
      this.signalingState = description.type === "offer" ? "have-local-offer" : "stable";
    }
    async setRemoteDescription(description) {
      this.remoteDescription = { type: description.type, sdp: description.sdp };
      this.signalingState = description.type === "offer" ? "have-remote-offer" : "stable";
      setTimeout(() => {
        const stream = remoteStream();
        this.connectionState = "connected";
        this.ontrack?.({ track: stream.getVideoTracks()[0], streams: [stream] });
      }, 120);
    }
    async addIceCandidate() {}
    getTransceivers() {
      return this._transceivers;
    }
    getSenders() {
      return this._transceivers.map((t) => t.sender);
    }
    close() {
      this.signalingState = "closed";
    }
  }
  window.RTCPeerConnection = DemoPeerConnection;
}

/**
 * Recording environment for the lesson room:
 *  - the page clock reads the demo lesson time (7:35 pm KST), so chat timestamps
 *    written by the app itself (`new Date()`) line up with the fixture messages;
 *  - at the 800px recording height the vh-based room is ~30px taller than the window,
 *    so the chat's `endRef.scrollIntoView()` would also nudge the whole page. Here it
 *    scrolls only the chat list, which is what a ≥900px-tall screen shows.
 */
function installRoomEnv({ clock }) {
  const RealDate = Date;
  const offset = clock - RealDate.now();
  function DemoDate(...args) {
    if (!new.target) return new RealDate(RealDate.now() + offset).toString();
    return args.length ? new RealDate(...args) : new RealDate(RealDate.now() + offset);
  }
  DemoDate.prototype = RealDate.prototype;
  DemoDate.now = () => RealDate.now() + offset;
  DemoDate.parse = RealDate.parse;
  DemoDate.UTC = RealDate.UTC;
  window.Date = DemoDate;

  const scrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (options) {
    for (let el = this.parentElement; el && el !== document.body; el = el.parentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(el).overflowY)) {
        el.scrollTo({ top: el.scrollHeight, behavior: options?.behavior ?? "auto" });
        return;
      }
    }
    scrollIntoView.call(this, options);
  };
}

const TILES = {
  remote: { name: "정하윤 선생님", initial: "하", from: "#f7d9c9", to: "#d8cbf2", ink: "#6d5a9c", pulse: true },
  local: { name: "김민서 (나)", initial: "민", from: "#cdeee3", to: "#c9dcf6", ink: "#3f7f86", pulse: false },
};

const CHAT = [
  { senderName: "정하윤", senderEmail: TEACHER_USER.email, at: "19:31:08", message: "민서 씨 안녕하세요! 오늘은 공항 체크인 상황을 연습해 볼게요." },
  { senderName: "김민서", senderEmail: STUDENT.email, at: "19:32:15", message: "네, 좋아요. 자리 요청하는 표현이 늘 헷갈렸어요." },
  { senderName: "정하윤", senderEmail: TEACHER_USER.email, at: "19:34:02", message: "먼저 여권과 항공권을 건네면서 인사하는 것부터 해 볼까요?" },
];
const TEACHER_LIVE = "좋아요! 이번엔 창가 자리를 부탁하는 문장을 영어로 써 보세요.";
const STUDENT_REPLY = "Could I get a window seat, please? 맞나요?";
/** The lesson is recorded as if it were 7:35 pm (KST) on the recording day. */
const LESSON_CLOCK = kstMs(0, "19:35:20");

/* ---------------------------------------------------------------- */
/* Helpers                                                           */
/* ---------------------------------------------------------------- */

async function settle(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}

async function scrollToHeading(page, heading, offset) {
  return page.evaluate(
    ([label, off]) => {
      const el = [...document.querySelectorAll("h2")].find((h) => h.textContent.trim() === label);
      return el ? el.getBoundingClientRect().top + window.scrollY - off : 0;
    },
    [heading, offset],
  );
}

/** Rests the cursor just beside an element so it does not cover the text. */
async function rest(page, locator, dx, dy, steps = 8) {
  const box = await locator.boundingBox();
  await page.mouse.move(box.x + box.width + dx, box.y + box.height / 2 + dy, { steps });
}

let broker;

const scenario = {
  viewport: { width: 1280, height: 800 },
  scale: 2,
  outWidth: 1600,
  contextOptions: { colorScheme: "light" },
  appUrl: APP_URL,
  async setup(context, { clip, unmatched }) {
    const state = freshState(clip);
    broker = createBroker();
    await context.routeWebSocket(/\/ws-chat\//, (ws) => broker.attach(ws));
    await context.route("**/*", (route) => handle(route, unmatched, state));
    if (clip.media) {
      await context.addInitScript(installRoomEnv, { clock: LESSON_CLOCK });
      await context.addInitScript(installMedia, TILES);
    }
  },
  clips: [
    {
      id: "saybridge-courses",
      title: "강의 탐색",
      caption: "언어와 레벨을 골라 조건에 맞는 강의만 검색",
      async prepare(page) {
        await page.goto(`${APP_URL}/courselist`, { waitUntil: "networkidle" });
        await settle(page, "뉴스로 배우는 영어 회화");
        await page.mouse.move(560, 330);
      },
      async run(page, h) {
        await page.waitForTimeout(150);
        await h.clickOn(page, page.getByRole("button", { name: "ENGLISH", exact: true }), 10);
        await page.waitForTimeout(120);
        await h.clickOn(page, page.getByRole("button", { name: "INTERMEDIATE", exact: true }), 10);
        await page.waitForTimeout(120);
        await h.clickOn(page, page.getByRole("button", { name: "Submit", exact: true }), 10);
        await page.getByText("비즈니스 영어 미팅·이메일").first().waitFor();
        await h.smoothScroll(page, await scrollToHeading(page, "Search Results", 90), 700);
        const card = await page.getByText("비즈니스 영어 미팅·이메일").last().locator("xpath=ancestor::div[1]").boundingBox();
        await page.mouse.move(card.x + card.width - 48, card.y + card.height - 34, { steps: 8 });
        await page.waitForTimeout(300);
      },
      hold: 400,
    },
    {
      id: "saybridge-video",
      title: "1:1 화상 수업 · 채팅",
      caption: "WebRTC 영상 연결 위에서 STOMP 채팅을 실시간으로 주고받음",
      media: true,
      async prepare(page) {
        await page.goto(`${APP_URL}/chatroom/${ROOM}`, { waitUntil: "networkidle" });
        await page.waitForFunction(() => {
          const videos = [...document.querySelectorAll("video")];
          return videos.length === 2 && videos.every((v) => v.videoWidth > 0 && !v.paused);
        });
        for (let i = 0; i < 50 && !broker.hasSubscriber(CHAT_TOPIC); i++) await page.waitForTimeout(100);
        for (const m of CHAT) {
          broker.publish(CHAT_TOPIC, {
            chatCode: ROOM,
            senderEmail: m.senderEmail,
            senderName: m.senderName,
            message: m.message,
            createdAt: kst(0, m.at),
          });
        }
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1200);
        await page.mouse.move(700, 560);
      },
      async run(page, h) {
        await page.waitForTimeout(250);
        broker.publish(CHAT_TOPIC, {
          chatCode: ROOM,
          senderEmail: TEACHER_USER.email,
          senderName: "정하윤",
          message: TEACHER_LIVE,
          createdAt: await page.evaluate(() => new Date().toISOString()),
        });
        await page.waitForTimeout(650);
        await h.clickOn(page, page.getByPlaceholder("Enter Message"), 8);
        await page.keyboard.type(STUDENT_REPLY, { delay: 16 });
        await page.waitForTimeout(100);
        await h.clickOn(page, page.getByRole("button", { name: "Send" }), 8);
        await page.waitForTimeout(250);
        await page.mouse.move(1130, 726, { steps: 5 });
        await page.waitForTimeout(350);
      },
      hold: 500,
    },
    {
      id: "saybridge-homework",
      title: "과제 제출",
      caption: "과제 공지에 녹음 파일을 올리면 바로 제출 상태로 바뀜",
      async prepare(page) {
        await page.goto(`${APP_URL}/course/101`, { waitUntil: "networkidle" });
        await settle(page, "4주차 과제 · 뉴스 요약 말하기");
        await page.getByText("제출 취소").first().waitFor();
        await page.mouse.move(560, 470);
      },
      async run(page, h) {
        page.once("filechooser", (chooser) =>
          chooser.setFiles({
            name: "4주차_뉴스요약_김민서.m4a",
            mimeType: "audio/mp4",
            buffer: Buffer.from("demo audio"),
          }),
        );
        await page.waitForTimeout(250);
        await h.clickOn(page, page.getByText("제출하기", { exact: true }).first(), 12);
        await page.waitForFunction(
          () => [...document.querySelectorAll("button")].filter((b) => b.textContent === "제출 취소").length >= 2,
        );
        await page.waitForTimeout(150);
        await rest(page, page.getByRole("button", { name: "제출 취소" }).first(), 40, 8, 8);
        await page.waitForTimeout(400);
      },
      hold: 1300,
    },
    {
      id: "saybridge-submissions",
      title: "과제 제출 현황 · 강사",
      caption: "강사는 과제별로 학생 제출 파일과 시각을 한 번에 확인",
      user: TEACHER_USER,
      async prepare(page) {
        await page.goto(`${APP_URL}/course/101`, { waitUntil: "networkidle" });
        await settle(page, "4주차 과제 · 뉴스 요약 말하기");
        await page.getByRole("button", { name: "게시글 생성" }).waitFor();
        await page.mouse.move(560, 520);
      },
      async run(page, h) {
        await page.waitForTimeout(250);
        await h.clickOn(page, page.getByRole("button", { name: "제출 확인" }).first(), 12);
        await page.getByText("한도윤").waitFor();
        await page.waitForTimeout(250);
        await rest(page, page.getByText("파일 다운로드").first(), 18, 10, 10);
        await page.waitForTimeout(600);
      },
      hold: 1400,
    },
  ],
};

export default scenario;
