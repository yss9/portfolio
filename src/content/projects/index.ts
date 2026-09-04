import type { Project } from "../types";
import { saybridge } from "./saybridge";
import { glople } from "./glople";
import { bluememories } from "./bluememories";
import { neoulteo } from "./neoulteo";
import { mofy } from "./mofy";
import { awsDeploy } from "./aws-deploy";

export const projects: Project[] = [
  saybridge,
  glople,
  bluememories,
  neoulteo,
  mofy,
  awsDeploy,
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/** Previous/next for the pager at the bottom of a project page. */
export function projectNeighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? projects[i - 1] : null,
    next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : null,
  };
}
