import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projectSlugs } from "@/content/projects";
import { Standalone } from "@/features/project-app/ProjectApp";
type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () =>
  projectSlugs().map((slug) => ({ slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params,
    project = getProject(slug);
  return project
    ? {
        title: project.name,
        description: project.summary,
        alternates: { canonical: `/projects/${slug}/` },
      }
    : {};
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return <Standalone slug={slug} />;
}
