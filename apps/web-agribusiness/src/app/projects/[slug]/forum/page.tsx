import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProject } from '@/lib/api';
import { ProjectTabs } from '../project-tabs';
import { ForumClient } from './forum-client';

export default async function ForumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project;
  try {
    project = await getProject(slug);
  } catch {
    notFound();
  }

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pb-20">
      {/* Hero header */}
      <div
        className="relative pt-24 pb-6"
        style={
          project.images?.[0]
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(7,26,14,0.88), rgba(7,26,14,0.95)), url(${project.images[0]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: 'linear-gradient(135deg, #071A0E 0%, #0a2318 50%, #0d5730 100%)' }
        }
      >
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/projects"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition"
          >
            <ArrowLeft size={14} />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-white mb-1">{project.title}</h1>
          <p className="text-white/50 text-sm mb-4">{project.location}, {project.country}</p>
          <ProjectTabs slug={slug} />
        </div>
      </div>

      {/* Forum */}
      <div className="mx-auto max-w-3xl px-6 pt-10">
        <ForumClient projectId={project.id} />
      </div>
    </main>
  );
}
