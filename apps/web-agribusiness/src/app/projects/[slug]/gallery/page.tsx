import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ImageOff } from 'lucide-react';
import { getProject } from '@/lib/api';
import { ProjectTabs } from '../project-tabs';
import { UploadGalleryButton } from '../upload-gallery-button';
import { GalleryGrid } from './gallery-grid';

export default async function GalleryPage({
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

  const images = project.images ?? [];

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pb-20">
      {/* Hero header */}
      <div
        className="relative pt-24 pb-6"
        style={
          images[0]
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(7,26,14,0.88), rgba(7,26,14,0.95)), url(${images[0]})`,
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
            <UploadGalleryButton
              projectId={project.id}
              teamMembers={project.teamMembers}
              managerId={project.managerId}
            />
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="mx-auto max-w-7xl px-6 pt-10">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
              style={{ background: 'rgba(13,87,48,0.1)' }}
            >
              <ImageOff size={28} style={{ color: '#22c55e' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No images yet</h3>
            <p className="text-sm text-gray-500 dark:text-white/40 mb-5">
              Images will appear here as the project progresses.
            </p>
            <UploadGalleryButton
              projectId={project.id}
              teamMembers={project.teamMembers}
              managerId={project.managerId}
            />
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-white/40 mb-6">
              {images.length} {images.length === 1 ? 'image' : 'images'}
            </p>
            <GalleryGrid images={images} projectTitle={project.title} />
          </>
        )}
      </div>
    </main>
  );
}
