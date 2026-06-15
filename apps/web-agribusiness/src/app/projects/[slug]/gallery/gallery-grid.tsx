'use client';

import { ZoomableImage } from '@/components/zoomable-image';

interface GalleryGridProps {
  images: string[];
  projectTitle: string;
}

export function GalleryGrid({ images, projectTitle }: GalleryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {images.map((url, i) => (
        <div
          key={i}
          className="break-inside-avoid rounded-2xl overflow-hidden border border-black/8 dark:border-white/8 hover:shadow-lg transition-shadow"
        >
          <ZoomableImage
            src={url}
            alt={`${projectTitle} — image ${i + 1}`}
            className="w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
