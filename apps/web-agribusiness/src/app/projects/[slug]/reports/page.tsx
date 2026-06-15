import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProject } from '@/lib/api';
import { ProjectTabs } from '../project-tabs';
import { DocumentList } from '../document-list';
import { UploadReportButton } from '../upload-report-button';

export default async function ReportsPage({
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

  const documents = project.documents ?? [];

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
          <div className="flex items-center justify-between">
            <ProjectTabs slug={slug} />
            <UploadReportButton
              projectId={project.id}
              teamMembers={project.teamMembers}
              managerId={project.managerId}
            />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="mx-auto max-w-3xl px-6 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Reports &amp; Documents
          </h2>
          <span className="text-xs text-gray-400 dark:text-white/30">
            {documents.length} {documents.length === 1 ? 'file' : 'files'}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-sm text-gray-500 dark:text-white/40 mb-4">
              No documents uploaded yet.
            </p>
            <UploadReportButton
              projectId={project.id}
              teamMembers={project.teamMembers}
              managerId={project.managerId}
            />
          </div>
        ) : (
          <DocumentList documents={documents} projectId={project.id} />
        )}
      </div>
    </main>
  );
}
