import { projects } from "@/content/projects";

export const tabs = ["note", "demo", "performance", "features", "troubleshooting"] as const;
export type ProjectTab = (typeof tabs)[number];
export function parseTab(value: string | null): ProjectTab {
  return tabs.find((tab) => tab === value) ?? "note";
}
export type AppDefinition = {
  id: string;
  title: string;
  shortRole: string;
  icon: string;
  canonicalHref: string;
  kind: "project" | "utility";
  componentKey: "project" | "library";
  initialSize: [number, number];
  minSize: [number, number];
  tech: string[];
};
const featuredRoles: Record<string, string> = {
  saeroi: "거래 · AI 에이전트",
  potner: "앱 · 백엔드 · 인프라",
  neoulteo: "BE · AI · FE",
};
export const projectApps: AppDefinition[] = projects.map((project) => ({
  id: "project:" + project.slug,
  title: project.name,
  shortRole: featuredRoles[project.slug] ?? project.teamShort,
  icon: project.slug,
  canonicalHref: `/projects/${project.slug}/`,
  kind: "project",
  componentKey: "project",
  initialSize: [1080, 720],
  minSize: [380, 300],
  tech: project.stackFlat,
}));
export const utilities: AppDefinition[] = [
  ["works", "전체 작업", "프로젝트 목록"],
  ["records", "개발 기록", "프로젝트 기술 기록"],
  ["profile", "프로필", "경험과 기술"],
  ["contact", "연락처", "이메일과 GitHub"],
].map(([id, title, shortRole]) => ({
  id,
  title,
  shortRole,
  icon: id,
  canonicalHref: id === "records" ? "/records/" : "/desktop/?app=" + id,
  kind: "utility",
  componentKey: "library",
  initialSize: [820, 590],
  minSize: [360, 260],
  tech: [],
}));
export const apps = [...projectApps, ...utilities];
export const findApp = (id: string | null) => apps.find((app) => app.id === id);
export function desktopHref(id?: string, tab?: ProjectTab) {
  if (!id) return "/desktop/";
  const params = new URLSearchParams({ app: id });
  if (id.startsWith("project:") && tab) params.set("tab", tab);
  return "/desktop/?" + params;
}
