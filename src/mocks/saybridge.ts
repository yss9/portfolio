/** Mock data shaped after the real SayBridge JPA entities
 *  (Course, CoursePost, Homework, TeacherProfile, Role). */

export type Language = "ENGLISH" | "JAPANESE" | "CHINESE" | "SPANISH" | "KOREAN";
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export const LANGUAGE_LABEL: Record<Language, string> = {
  ENGLISH: "영어",
  JAPANESE: "일본어",
  CHINESE: "중국어",
  SPANISH: "스페인어",
  KOREAN: "한국어",
};

export const LEVEL_LABEL: Record<CourseLevel, string> = {
  BEGINNER: "입문",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
};

export type Course = {
  id: number;
  title: string;
  language: Language;
  level: CourseLevel;
  description: string;
  maxStudents: number;
  currentStudents: number;
  teacher: { name: string; country: string; rating: number; reviews: number };
};

export const courses: Course[] = [
  {
    id: 1,
    title: "일상 회화로 시작하는 영어 스피킹",
    language: "ENGLISH",
    level: "BEGINNER",
    description:
      "장면별 표현을 반복해서 말해보며 입이 트이는 것을 목표로 합니다. 매 수업 과제로 짧은 녹음을 제출합니다.",
    maxStudents: 6,
    currentStudents: 4,
    teacher: { name: "Emma Clarke", country: "영국", rating: 4.9, reviews: 128 },
  },
  {
    id: 2,
    title: "비즈니스 이메일과 미팅 영어",
    language: "ENGLISH",
    level: "INTERMEDIATE",
    description:
      "실제 업무 상황을 가정한 롤플레이 중심 수업입니다. 이메일 첨삭 과제를 매주 제출합니다.",
    maxStudents: 4,
    currentStudents: 4,
    teacher: { name: "Daniel Reyes", country: "미국", rating: 4.8, reviews: 74 },
  },
  {
    id: 3,
    title: "JLPT N3 문법 집중",
    language: "JAPANESE",
    level: "INTERMEDIATE",
    description:
      "N3 핵심 문법을 예문으로 정리하고 즉석에서 작문해봅니다. 주 2회 작문 과제가 있습니다.",
    maxStudents: 8,
    currentStudents: 5,
    teacher: { name: "佐藤 美咲", country: "일본", rating: 4.9, reviews: 96 },
  },
  {
    id: 4,
    title: "여행 일본어 첫걸음",
    language: "JAPANESE",
    level: "BEGINNER",
    description:
      "히라가나부터 여행 상황 표현까지. 부담 없이 따라올 수 있도록 천천히 진행합니다.",
    maxStudents: 10,
    currentStudents: 3,
    teacher: { name: "田中 健", country: "일본", rating: 4.7, reviews: 41 },
  },
  {
    id: 5,
    title: "HSK 5급 독해 전략",
    language: "CHINESE",
    level: "ADVANCED",
    description:
      "장문 독해를 시간 안에 푸는 전략을 다룹니다. 매 회차 기출 지문 분석 과제를 제출합니다.",
    maxStudents: 6,
    currentStudents: 6,
    teacher: { name: "李 婷", country: "중국", rating: 4.9, reviews: 152 },
  },
  {
    id: 6,
    title: "중국어 발음 교정 클래스",
    language: "CHINESE",
    level: "BEGINNER",
    description: "성조와 권설음을 집중적으로 교정합니다. 녹음 과제로 변화를 확인합니다.",
    maxStudents: 5,
    currentStudents: 2,
    teacher: { name: "王 磊", country: "중국", rating: 4.6, reviews: 33 },
  },
  {
    id: 7,
    title: "스페인어 회화 A2 → B1",
    language: "SPANISH",
    level: "INTERMEDIATE",
    description:
      "일상 주제로 5분 이상 말하기를 목표로 합니다. 주제별 스크립트 과제가 있습니다.",
    maxStudents: 6,
    currentStudents: 3,
    teacher: { name: "Lucía Fernández", country: "스페인", rating: 4.8, reviews: 67 },
  },
  {
    id: 8,
    title: "외국인을 위한 한국어 중급",
    language: "KOREAN",
    level: "INTERMEDIATE",
    description: "TOPIK 중급 대비와 실생활 회화를 병행합니다.",
    maxStudents: 8,
    currentStudents: 7,
    teacher: { name: "박지훈", country: "한국", rating: 4.9, reviews: 110 },
  },
];

/** CoursePost + the current student's Homework submission for it. */
export type CoursePostRow = {
  id: number;
  title: string;
  createdAt: string;
  dueAt: string;
  submission: { attachmentUrl: string; submittedAt: string } | null;
};

export const coursePosts: CoursePostRow[] = [
  {
    id: 101,
    title: "1주차 · 자기소개 스크립트 작성",
    createdAt: "2025.03.04",
    dueAt: "2025.03.10",
    submission: { attachmentUrl: "s3://saybridge/hw/101-u42.pdf", submittedAt: "2025.03.09" },
  },
  {
    id: 102,
    title: "2주차 · 카페에서 주문하기 롤플레이 녹음",
    createdAt: "2025.03.11",
    dueAt: "2025.03.17",
    submission: { attachmentUrl: "s3://saybridge/hw/102-u42.m4a", submittedAt: "2025.03.16" },
  },
  {
    id: 103,
    title: "3주차 · 길 묻고 답하기 표현 정리",
    createdAt: "2025.03.18",
    dueAt: "2025.03.24",
    submission: null,
  },
  {
    id: 104,
    title: "4주차 · 좋아하는 영화 소개 스피치",
    createdAt: "2025.03.25",
    dueAt: "2025.03.31",
    submission: { attachmentUrl: "s3://saybridge/hw/104-u42.mp4", submittedAt: "2025.03.30" },
  },
  {
    id: 105,
    title: "5주차 · 전화 통화 상황극 대본",
    createdAt: "2025.04.01",
    dueAt: "2025.04.07",
    submission: null,
  },
  {
    id: 106,
    title: "6주차 · 여행 계획 발표 준비",
    createdAt: "2025.04.08",
    dueAt: "2025.04.14",
    submission: { attachmentUrl: "s3://saybridge/hw/106-u42.pdf", submittedAt: "2025.04.13" },
  },
];

export type ChatMsg = { id: number; from: "me" | "peer"; name: string; text: string; at: string };

export const lessonChat: ChatMsg[] = [
  { id: 1, from: "peer", name: "Emma", text: "Hi! Can you hear me okay?", at: "19:00" },
  { id: 2, from: "me", name: "나", text: "Yes, loud and clear!", at: "19:00" },
  { id: 3, from: "peer", name: "Emma", text: "Great. Let's start with last week's homework.", at: "19:01" },
  { id: 4, from: "me", name: "나", text: "Sure, I uploaded the recording yesterday.", at: "19:01" },
];

/** Menu items gated by role — mirrors the SecurityFilterChain rules. */
export const roleMenus = [
  { key: "profile", label: "내 프로필", roles: ["USER", "TEACHER", "ADMIN"], rule: "authenticated()" },
  { key: "enrollments", label: "내 수강 목록", roles: ["USER", "TEACHER", "ADMIN"], rule: "authenticated()" },
  { key: "submit", label: "과제 제출", roles: ["USER"], rule: "hasRole('USER')" },
  { key: "create-course", label: "강의 개설", roles: ["TEACHER"], rule: "hasRole('TEACHER')" },
  { key: "applications", label: "수강 신청 승인", roles: ["TEACHER"], rule: "hasRole('TEACHER')" },
  { key: "grade", label: "과제 확인 및 피드백", roles: ["TEACHER"], rule: "hasRole('TEACHER')" },
  { key: "users", label: "회원 관리", roles: ["ADMIN"], rule: "hasRole('ADMIN')" },
  { key: "reports", label: "신고 처리", roles: ["ADMIN"], rule: "hasRole('ADMIN')" },
] as const;
