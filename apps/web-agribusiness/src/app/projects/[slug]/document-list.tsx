'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, FileText, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/session-provider';
import { getMyInvestments, type ProjectDocument } from '@/lib/api';

const typeColors: Record<string, string> = {
  prospectus: '#3b82f6',
  report: '#22c55e',
  agreement: '#8b5cf6',
  presentation: '#f59e0b',
  financial: '#ef4444',
  other: '#6b7280',
};

interface DocumentListProps {
  documents: ProjectDocument[];
  projectId: string;
}

export function DocumentList({ documents, projectId }: DocumentListProps) {
  const { user } = useAuth();
  const [isApprovedInvestor, setIsApprovedInvestor] = useState<boolean | null>(null);

  const isAdmin = user?.roles?.some((r) => ['super_admin', 'group_admin', 'manager'].includes(r));

  useEffect(() => {
    if (isAdmin) { setIsApprovedInvestor(true); return; }
    if (!user) { setIsApprovedInvestor(false); return; }
    getMyInvestments()
      .then((invs) => {
        setIsApprovedInvestor(invs.some((i) => i.projectId === projectId && i.status === 'approved'));
      })
      .catch(() => setIsApprovedInvestor(false));
  }, [user, projectId, isAdmin]);

  if (isApprovedInvestor === null) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={22} className="animate-spin text-green-500" />
      </div>
    );
  }

  if (!isApprovedInvestor && documents.some((d) => !d.isPublic)) {
    const publicDocs = documents.filter((d) => d.isPublic);
    return (
      <div className="space-y-4">
        {publicDocs.length > 0 && (
          <div className="space-y-3">
            {publicDocs.map((doc) => {
              const color = typeColors[doc.type?.toLowerCase()] ?? typeColors.other;
              return (
                <div key={doc.id} className="flex items-start gap-4 rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: color + '20', border: `1px solid ${color}40` }}>
                    <FileText size={15} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{doc.title}</span>
                    {doc.description && <p className="text-xs text-gray-500 dark:text-white/40">{doc.description}</p>}
                  </div>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white"
                    style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}>
                    <Download size={12} /> Download
                  </a>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-col items-center py-12 text-center rounded-2xl border border-dashed border-black/10 dark:border-white/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-3" style={{ background: 'rgba(239,68,68,0.08)' }}>
            <Lock size={24} className="text-red-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Investor-only reports</h3>
          <p className="text-xs text-gray-500 dark:text-white/40 max-w-xs">
            {user
              ? 'Private reports are available exclusively to investors with an approved investment in this project.'
              : 'Sign in and invest in this project to access private reports and documents.'}
          </p>
          {!user && (
            <Link href="/signin" className="mt-4 text-sm font-medium hover:underline" style={{ color: '#22c55e' }}>
              Sign in →
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const color = typeColors[doc.type?.toLowerCase()] ?? typeColors.other;
        const canAccess = doc.isPublic || !!isApprovedInvestor;

        return (
          <div
            key={doc.id}
            className="flex items-start gap-4 rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-4"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: color + '20', border: `1px solid ${color}40` }}
            >
              <FileText size={15} style={{ color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{doc.title}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                  style={{ background: color + '15', color }}
                >
                  {doc.type}
                </span>
                {doc.isPublic && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40">
                    Public
                  </span>
                )}
              </div>
              {doc.description && (
                <p className="text-xs text-gray-500 dark:text-white/40">{doc.description}</p>
              )}
            </div>

            {canAccess ? (
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
              >
                <Download size={12} />
                Download
              </a>
            ) : (
              <Link
                href="/signin"
                className="shrink-0 flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 text-xs text-gray-500 dark:text-white/50 hover:border-black/20 dark:hover:border-white/20 transition-all"
              >
                <Lock size={11} />
                Sign in
              </Link>
            )}
          </div>
        );
      })}

      {!user && documents.some((d) => !d.isPublic) && (
        <p className="text-xs text-gray-400 dark:text-white/30 text-center pt-1">
          <Link href="/signin" className="underline hover:text-green-600">
            Sign in to access
          </Link>{' '}
          restricted documents
        </p>
      )}
    </div>
  );
}
