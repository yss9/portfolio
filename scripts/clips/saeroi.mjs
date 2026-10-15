/**
 * 새로이(SAEROI) demo clips: the original React frontend (frontend/develop),
 * built with `vite build` and served by `vite preview`, driven with demo
 * fixtures. Wallet signing, KakaoPay and the LLM are not running, so every
 * `/api` call is answered here with plausible demo data.
 *
 * Build and serve the frontend first (outside this repo):
 *   npx vite build && npx vite preview --port 4310 --strictPort
 * SAEROI_URL overrides the served address.
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP_URL = process.env.SAEROI_URL ?? "http://localhost:4310";
const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR =
  process.env.SAEROI_FRONTEND_DIR ?? join(HERE, "../../../.capture/saeroi-frontend");

const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms) => new Date(NOW - ms).toISOString();
const later = (ms) => new Date(NOW + ms).toISOString();

const BRAND_USER = {
  id: 7,
  email: "rebirth@saeroi.demo",
  name: "박서연",
  role: "BRAND",
  walletAddress: "0x8f3a5c1e2b7d4f9a6c0e1d2b3a4f5e6d7c8b9a01",
};

function envelope(data) {
  return JSON.stringify({ success: true, code: "OK", message: "", data, timestamp: new Date().toISOString() });
}

function ok(route, data, delay = 0) {
  const send = () =>
    route.fulfill({ status: 200, contentType: "application/json", body: envelope(data) });
  return delay ? new Promise((r) => setTimeout(r, delay)).then(send) : send();
}

function page(content, size = 12) {
  return { content, page: 0, size, totalElements: content.length, totalPages: 1, hasNext: false };
}

/* ---------------------------------------------------------------- */
/* Shop                                                              */
/* ---------------------------------------------------------------- */

const IMG = "/images/landing";
const products = [
  { id: 101, name: "리워크 데님 워크 재킷", category: "CLOTHING", subcategory: "OUTER", brand: [3, "RE:BIRTH"], price: 189000, img: "product-work-jacket" },
  { id: 102, name: "폐가죽 새들백", category: "BAG", subcategory: "CROSSBODY", brand: [4, "RECODE"], price: 142000, img: "product-saddle-bag" },
  { id: 103, name: "데님 서클 크로스백", category: "BAG", subcategory: "CROSSBODY", brand: [3, "RE:BIRTH"], price: 76000, img: "product-denim-circle" },
  { id: 104, name: "업사이클 버킷햇", category: "ACCESSORY", subcategory: null, brand: [5, "REWEAVE"], price: 39000, img: "product-bucket-hat" },
  { id: 105, name: "마켓 토트백", category: "BAG", subcategory: "TOTE", brand: [6, "OCEAN LOOP"], price: 68000, img: "product-market-tote" },
  { id: 106, name: "패치워크 데님 숄더백", category: "BAG", subcategory: "SHOULDER", brand: [3, "RE:BIRTH"], price: 98000, img: "hero-upcycled-denim" },
].map((p, i) => ({
  productModelId: p.id,
  name: p.name,
  category: p.category,
  subcategory: p.subcategory,
  brandId: p.brand[0],
  brandName: p.brand[1],
  price: p.price,
  description:
    "버려진 데님과 가죽을 세척·재단해 다시 만든 제품입니다. 소재의 출처와 가공 이력은 QR 패스포트로 확인할 수 있습니다.",
  thumbnailUrl: `${IMG}/${p.img}.webp`,
  status: "ON_SALE",
  stockQuantity: 12 - i,
  createdAt: ago((i + 1) * DAY),
  journeyUrl: null,
}));

function productDetail(id) {
  const base = products.find((p) => p.productModelId === id) ?? products[0];
  const others = products.filter((p) => p !== base).slice(0, 3);
  return {
    ...base,
    journeyUrl: "/qr/demo-passport",
    images: [base, ...others].map((p, index) => ({
      productImageId: index + 1,
      url: p.thumbnailUrl,
      type: index === 0 ? "MAIN" : "ANGLE",
      sortOrder: index,
    })),
  };
}

/* ---------------------------------------------------------------- */
/* Business account                                                  */
/* ---------------------------------------------------------------- */

const company = {
  userId: BRAND_USER.id,
  companyName: "RE:BIRTH",
  businessNumber: "265-48-66252",
  representativeName: "박서연",
  companyPhone: "02-8962-1474",
  zipCode: "46729",
  address: "부산 강서구 가달1로 33",
  addressDetail: null,
  introduction: "버려진 데님에 두 번째 쓰임을 입히는 업사이클 브랜드",
  logoUrl: null,
  role: "BRAND",
  status: "ACTIVE",
  roleApprovalStatus: "APPROVED",
};

const wallets = [
  {
    id: 1,
    walletAddress: BRAND_USER.walletAddress,
    chainId: 1337,
    active: true,
    verified: true,
    verifiedAt: ago(20 * DAY),
    createdAt: ago(20 * DAY),
    deactivatedAt: null,
  },
];


/* ---------------------------------------------------------------- */
/* Marketplace (소재 검색)                                           */
/* ---------------------------------------------------------------- */

const listings = [
  ["데님 헌 옷 모음", "DENIM", "WASTE", "A", "한지호의헌옷수거소", 30000, 1230, "청바지·데님 재킷을 세척 후 분류한 원단용 데님"],
  ["워싱 데님 자투리", "DENIM", "WASTE", "B", "그린리턴", 42000, 980, "봉제 공장에서 나온 워싱 데님 재단 자투리"],
  ["가죽 소파 커버 원단", "ETC", "WASTE", "A", "리레더랩", 18000, 3400, "폐소파에서 분리한 천연 가죽, 두께 1.2mm"],
  ["면 셔츠 원단 묶음", "COTTON", "WASTE", "B", "부산섬유순환", 25000, 760, "회수된 면 셔츠를 색상별로 분류"],
  ["폴리에스터 텐트 원단", "POLYESTER", "WASTE", "A", "캠프어게인", 12000, 1450, "방수 코팅 텐트 플라이, 가방 안감용"],
  ["울 니트 리사이클 원사", "WOOL", "WASTE", "B", "울앤루프", 9000, 2100, "니트를 풀어 다시 감은 재생 원사"],
].map(([materialName, materialType, rootOrigin, grade, sellerName, grams, pricePerKg, desc], index) => ({
  listingId: 201 + index,
  chainListingId: 9001 + index,
  materialId: 501 + index,
  materialCode: `MAT-2026-${String(501 + index).padStart(5, "0")}`,
  materialName,
  materialDescription: desc,
  materialType,
  rootOrigin,
  generationType: "INITIAL",
  grade,
  sellerId: 30 + index,
  sellerName,
  totalQuantity: grams,
  availableQuantity: grams - (index % 3) * 2000,
  pricePerKg,
  status: "ON_SALE",
  createdAt: ago((index + 1) * 5 * HOUR),
  completedProcessTypes: index === 0 ? ["WASHING"] : [],
}));

/**
 * Listing photos: crops of the frontend's own landing image of baled textile
 * waste, so each card looks different without inventing new assets.
 */
const CROPS = [
  "crop=760:570:0:120",
  "crop=520:390:680:260",
  "crop=600:450:200:300",
  "crop=900:675:150:60",
  "crop=480:360:20:500",
  "crop=640:480:520:120",
];
let mediaDir;
function prepareMedia() {
  mediaDir = mkdtempSync(join(tmpdir(), "saeroi-media-"));
  const source = join(FRONTEND_DIR, "public/images/landing/journey/trace-material.webp");
  CROPS.forEach((crop, index) => {
    spawnSync(process.env.FFMPEG_PATH ?? "ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", source,
      "-vf", `${crop},scale=480:-2`, "-q:v", "3", join(mediaDir, `${index}.jpg`),
    ]);
  });
}
const thumbnails = () =>
  Object.fromEntries(
    listings.map((listing, index) => [
      listing.materialId,
      { referenceId: listing.materialId, evidenceFileId: 601 + index, contentPath: `/api/evidence/files/${601 + index}/content` },
    ]),
  );

/* ---------------------------------------------------------------- */
/* AI assistant                                                      */
/* ---------------------------------------------------------------- */

const ASK = "데님 재킷 30벌을 만들고 싶어요. 원단으로 쓸 데님을 찾아 주세요.";
const FOUND = [
  "데님 재킷 30벌이면 원단이 약 **15kg** 필요해요. 지금 구매할 수 있는 데님 소재를 찾았어요.",
  "",
  "| 소재 | 판매처 | 등급 | kg당 가격 | 남은 양 |",
  "|---|---|---|---|---|",
  "| 데님 헌 옷 모음 | 한지호의헌옷수거소 | A | 1,230원 | 30kg |",
  "| 워싱 데님 자투리 | 그린리턴 | B | 980원 | 38kg |",
  "",
  "A등급인 **데님 헌 옷 모음**은 세척까지 끝난 상태라 바로 재단할 수 있어요. 어느 소재로 진행할까요?",
].join("\n");
const BUY = "데님 헌 옷 모음으로 15kg 살게요.";
const CARD = "확인했습니다. 한지호의헌옷수거소에서 A등급 데님 15kg을 **18,450원**에 구매합니다. 배송지는 등록된 사업장 주소로 할게요. 오른쪽 결제 카드에서 확인해 주세요.";

const msg = (id, role, content, toolName = null) => ({
  id,
  role,
  content,
  toolName,
  createdAt: ago((20 - id) * MIN),
});

function conversation({ id, title, phase, messages, actions = [], projectTradeIds = [] }) {
  return { id, title, phase, status: "ACTIVE", messages, actions, projectTradeIds };
}

const marks = (labels, current) =>
  labels.map((label, index) => ({ label, done: index < current, current: index === current }));
const JOURNEY = ["소재", "가공", "생산", "판매"];

const sourcingProgress = {
  phase: "MATERIAL_SOURCING",
  journey: marks(JOURNEY, 0),
  subject: "데님 재킷 30벌",
  subjectDetail: "필요 소재 · 데님 15kg",
  steps: [],
  nextTodo: "구매할 소재 고르기",
  tasks: [],
  conversationChanged: false,
  spending: [],
};

const purchasePayload = {
  tradeId: 15,
  totalPrice: 18450,
  quantityGram: 15000,
  redirectUrl: "/agent/payment/callback",
  materialName: "데님 헌 옷 모음",
  sellerName: "한지호의헌옷수거소",
  grade: "A",
  originText: "폐의류 · 부산 강서구",
  pricePerKg: 1230,
  receiverName: "박서연",
  receiverPhone: "02-8962-1474",
  zipCode: "46729",
  address: "부산 강서구 가달1로 33",
  addressDetail: "RE:BIRTH 작업실",
};

const paymentProgress = {
  ...sourcingProgress,
  subject: "데님 헌 옷 모음 15kg",
  subjectDetail: "한지호의헌옷수거소 · A등급",
  steps: marks(["주문", "결제", "온체인", "발송", "수령"], 1),
  nextTodo: "결제 카드 확인하기",
  tasks: [{ domain: "TRADE", referenceId: 15, subject: "데님 헌 옷 모음 15kg", label: "결제 대기", actionable: true }],
};

const productionConfirm = {
  id: 77,
  messageId: 9,
  actionType: "CONFIRM",
  toolName: "confirm_production",
  summary: "생산 배치 #12 확정 — 리워크 데님 워크 재킷 30벌",
  payloadJson: JSON.stringify({ batchId: 12 }),
  resultJson: null,
  status: "PENDING",
  stepTotal: 1,
  stepDone: 0,
  expiresAt: later(2 * HOUR),
};

const productionMessages = [
  msg(1, "USER", ASK),
  msg(2, "ASSISTANT", "데님 헌 옷 모음 15kg 구매와 세척·재단 가공까지 마쳤어요. 이제 생산 단계예요."),
  msg(3, "USER", "가공된 원단으로 재킷 30벌 생산 들어갈게요."),
  msg(9, "ASSISTANT", "생산 배치 #12에 가공 원단 14.2kg을 투입했어요. 수량 **30벌**로 생산을 확정하면 각 제품의 소재 이력이 블록체인 기록과 연결됩니다. 오른쪽 확인 카드를 눌러 주세요."),
];

const productionProgress = (done) => ({
  phase: done ? "PRODUCT" : "PRODUCTION",
  journey: marks(JOURNEY, done ? 3 : 2),
  subject: "리워크 데님 워크 재킷",
  subjectDetail: "생산 배치 #12 · 30벌",
  steps: marks(["투입", "확정", "온체인 기록", "제품 등록"], done ? 2 : 1),
  nextTodo: done ? "완성 제품 등록하기" : "생산 확정하기",
  tasks: [],
  conversationChanged: false,
  spending: [
    { kind: "MATERIAL", label: "데님 헌 옷 모음 15kg", detail: "한지호의헌옷수거소", amount: 18450 },
    { kind: "PROCESSING", label: "세척·재단 가공", detail: "부산섬유순환", amount: 42000 },
  ],
});

const delayed = (data, ms = 1100) => (route) => ok(route, data, ms);
let confirmed = false;
let ordered = false;

/* ---------------------------------------------------------------- */
/* Request handling                                                  */
/* ---------------------------------------------------------------- */

/** Per-clip overrides: { "GET /v1/...": (route, url, body) => ... } */
async function handle(route, unmatched, overrides) {
  const request = route.request();
  const url = new URL(request.url());
  if (!url.pathname.startsWith("/api/")) return route.continue();
  const path = url.pathname.slice("/api".length);
  const key = `${request.method()} ${path}`;

  for (const [pattern, reply] of Object.entries(overrides ?? {})) {
    const [method, rest] = pattern.split(" ");
    if (method === request.method() && new RegExp(`^${rest}$`).test(path)) {
      return reply(route, url, request.postDataJSON?.() ?? null);
    }
  }

  if (key === "GET /v1/public/product-models") {
    const size = Number(url.searchParams.get("size") ?? 12);
    return ok(route, page(products.slice(0, size), size));
  }
  const productMatch = path.match(/^\/v1\/public\/product-models\/(\d+)$/);
  if (request.method() === "GET" && productMatch) return ok(route, productDetail(Number(productMatch[1])));
  if (key === "GET /v1/listings") return ok(route, page(listings, 20));
  if (key === "GET /evidence/thumbnails") return ok(route, thumbnails());
  const media = path.match(/^\/evidence\/files\/(\d+)\/content$/);
  if (media) {
    const body = readFileSync(join(mediaDir, `${(Number(media[1]) - 601) % CROPS.length}.jpg`));
    return route.fulfill({ status: 200, contentType: "image/jpeg", body });
  }
  if (key === "GET /v1/notifications") {
    return ok(route, { items: [], page: 0, size: 20, totalElements: 0, totalPages: 0, unreadCount: 0 });
  }
  if (key === "GET /v1/agent/conversations/active") return ok(route, null);
  if (key === "GET /v1/trades") return ok(route, page([], 100));
  if (key === "GET /v1/companies/me") return ok(route, company);
  if (key === "GET /v1/wallets/me") return ok(route, wallets);

  unmatched.add(`${key}${url.search}`);
  return ok(route, null);
}

const scenario = {
  viewport: { width: 1280, height: 800 },
  scale: 2,
  outWidth: 1600,
  appUrl: APP_URL,
  start: prepareMedia,
  user: BRAND_USER,
  handle,
  async setup(context, { clip, unmatched }) {
    if (clip.signedIn !== false) {
      await context.addInitScript((user) => {
        localStorage.setItem(
          "saeroi.auth",
          JSON.stringify({ state: { user, accessToken: "demo-access-token" }, version: 1 }),
        );
      }, BRAND_USER);
    }
    await context.route("**/api/**", (route) => handle(route, unmatched, clip.api));
  },
  clips: [
    {
      id: "saeroi-landing",
      title: "서비스 첫 화면",
      caption: "버려진 소재의 다음 쓰임을 연결하는 업사이클링 플랫폼의 첫인상",
      signedIn: false,
      async prepare(page) {
        await page.goto(`${APP_URL}/`, { waitUntil: "networkidle" });
        await page.waitForTimeout(1200);
        await page.mouse.move(1180, 700);
      },
      async run(page) {
        await page.waitForTimeout(500);
        // The landing drives its own scroll with GSAP, so scroll with the wheel.
        for (let i = 0; i < 36; i++) {
          await page.mouse.wheel(0, 45);
          await page.waitForTimeout(70);
        }
        await page.waitForTimeout(600);
      },
    },
    {
      id: "saeroi-shop",
      title: "쇼핑몰 · 상품 상세",
      caption: "순환 소재로 만든 상품을 고르고 소재 이력이 담긴 상세로 이동",
      signedIn: false,
      async prepare(page, h) {
        await page.goto(`${APP_URL}/shop`, { waitUntil: "networkidle" });
        await page.waitForTimeout(800);
        await h.smoothScroll(page, 360, 10);
        await page.mouse.move(1100, 160);
      },
      async run(page, h) {
        const card = page.locator("a[href='/products/101']").first();
        await h.moveTo(page, card, 22);
        await page.waitForTimeout(500);
        await h.clickOn(page, card, 4);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(1600);
      },
    },
    {
      id: "saeroi-marketplace",
      title: "소재 검색",
      caption: "브랜드 담당자가 공급업체의 폐소재를 등급·가격·남은 양으로 비교",
      async prepare(page) {
        await page.goto(`${APP_URL}/marketplace`, { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.mouse.move(1150, 240);
      },
      async run(page, h) {
        await page.waitForTimeout(400);
        await h.smoothScroll(page, 420, 1500);
        await page.waitForTimeout(400);
        await h.moveTo(page, page.getByText("데님 헌 옷 모음").first(), 20);
        await page.waitForTimeout(900);
      },
    },
    {
      id: "saeroi-agent-chat",
      title: "AI 어시스턴트 · 소재 찾기",
      caption: "만들고 싶은 제품을 말하면 필요한 양을 계산하고 구매할 수 있는 소재를 찾아 줌",
      api: {
        "POST /v1/agent/conversations": delayed(
          conversation({
            id: 41,
            title: "데님 재킷 30벌 만들기",
            phase: "MATERIAL_SOURCING",
            messages: [msg(1, "USER", ASK), msg(2, "ASSISTANT", FOUND)],
          }),
        ),
        "GET /v1/agent/conversations/41/progress": (route) => ok(route, sourcingProgress),
        "GET /v1/agent/conversations/41": (route) =>
          ok(route, conversation({ id: 41, title: "데님 재킷 30벌 만들기", phase: "MATERIAL_SOURCING", messages: [msg(1, "USER", ASK), msg(2, "ASSISTANT", FOUND)] })),
      },
      async prepare(page) {
        await page.goto(`${APP_URL}/agent`, { waitUntil: "networkidle" });
        await page.waitForTimeout(800);
        await page.mouse.move(700, 420);
      },
      async run(page, h) {
        const input = page.getByPlaceholder("무엇을 만들고 싶으신가요?");
        await h.clickOn(page, input, 16);
        await page.keyboard.type(ASK, { delay: 22 });
        await h.clickOn(page, page.getByRole("button", { name: "보내기" }), 10);
        await page.waitForTimeout(2600);
      },
    },
    {
      id: "saeroi-agent-card",
      title: "AI 어시스턴트 · 결제 카드",
      caption: "구매를 요청하면 모델이 직접 결제하지 않고 사람이 확인할 결제 카드를 띄움",
      api: {
        "GET /v1/agent/conversations/active": (route) =>
          ok(route, conversation({ id: 42, title: "데님 재킷 30벌 만들기", phase: "MATERIAL_SOURCING", messages: [msg(1, "USER", ASK), msg(2, "ASSISTANT", FOUND)] })),
        "GET /v1/agent/conversations/42/progress": (route) => ok(route, ordered ? paymentProgress : sourcingProgress),
        "POST /v1/agent/conversations/42/messages": (route) => {
          ordered = true;
          return delayed(
          conversation({
            id: 42,
            title: "데님 재킷 30벌 만들기",
            phase: "MATERIAL_SOURCING",
            messages: [msg(1, "USER", ASK), msg(2, "ASSISTANT", FOUND), msg(3, "USER", BUY), msg(5, "ASSISTANT", CARD)],
            actions: [
              {
                id: 61,
                messageId: 5,
                actionType: "PAYMENT",
                toolName: "purchase_material",
                summary: "데님 헌 옷 모음 15kg 구매 · 18,450원",
                payloadJson: JSON.stringify(purchasePayload),
                resultJson: null,
                status: "PENDING",
                stepTotal: 1,
                stepDone: 0,
                expiresAt: later(30 * MIN),
              },
            ],
            projectTradeIds: [15],
          }),
          )(route);
        },
      },
      async prepare(page) {
        ordered = false;
        await page.goto(`${APP_URL}/agent`, { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.mouse.move(700, 420);
      },
      async run(page, h) {
        const input = page.getByPlaceholder("무엇을 만들고 싶으신가요?");
        await h.clickOn(page, input, 14);
        await page.keyboard.type(BUY, { delay: 28 });
        await h.clickOn(page, page.getByRole("button", { name: "보내기" }), 10);
        await page.waitForTimeout(2600);
      },
    },
    {
      id: "saeroi-agent-confirm",
      title: "AI 어시스턴트 · 승인",
      caption: "생산 확정처럼 되돌리기 어려운 작업은 사람이 카드를 눌러야 실행",
      api: {
        "GET /v1/agent/conversations/active": (route) =>
          ok(route, conversation({ id: 43, title: "데님 재킷 30벌 만들기", phase: "PRODUCTION", messages: productionMessages, actions: [productionConfirm] })),
        "GET /v1/agent/conversations/43/progress": (route) => ok(route, productionProgress(confirmed)),
        "POST /v1/agent/actions/77/complete": (route) => {
          confirmed = true;
          return ok(
            route,
            conversation({
              id: 43,
              title: "데님 재킷 30벌 만들기",
              phase: "PRODUCT",
              messages: [
                ...productionMessages,
                msg(11, "ASSISTANT", "생산을 확정했어요. 재킷 **30벌**의 소재 이력이 생산 배치 #12에 묶였습니다. 다음은 완성 제품을 쇼핑몰에 등록하는 단계예요."),
              ],
              actions: [{ ...productionConfirm, status: "COMPLETED" }],
            }),
            1100,
          );
        },
      },
      async prepare(page) {
        confirmed = false;
        await page.goto(`${APP_URL}/agent`, { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.mouse.move(640, 460);
      },
      async run(page, h) {
        await page.waitForTimeout(400);
        const button = page.locator(".agent-card--confirm .agent-card__actions button").first();
        await h.clickOn(page, button, 24);
        await page.waitForTimeout(2600);
      },
    },
  ],
};

export default scenario;
