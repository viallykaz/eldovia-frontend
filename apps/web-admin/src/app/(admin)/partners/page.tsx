'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Loader2, Handshake, X, ExternalLink, Power, Upload, CheckCircle2 } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getPartnersAdmin, createPartner, updatePartner, deactivatePartner, uploadProjectImage, Partner, PARTNER_TYPES } from '@/lib/api';

// ─── Create / Edit Modal ──────────────────────────────────────────────────────

function PartnerModal({
  partner,
  onClose,
  onSuccess,
}: {
  partner?: Partner;
  onClose: () => void;
  onSuccess: (p: Partner) => void;
}) {
  const isEdit = !!partner;
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: partner?.name ?? '',
    type: partner?.type ?? 'corporate',
    description: partner?.description ?? '',
    logoUrl: partner?.logoUrl ?? '',
    websiteUrl: partner?.websiteUrl ?? '',
    country: partner?.country ?? '',
    isFeatured: partner?.isFeatured ?? false,
    isActive: partner?.isActive ?? true,
  });

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setError(null);
    try {
      const url = await uploadProjectImage(file);
      set('logoUrl', url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logo upload failed');
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      let result: Partner;
      if (isEdit && partner) {
        result = await updatePartner(partner.id, form);
      } else {
        result = await createPartner({
          name: form.name,
          type: form.type,
          description: form.description || undefined,
          logoUrl: form.logoUrl || undefined,
          websiteUrl: form.websiteUrl || undefined,
          country: form.country || undefined,
        });
      }
      onSuccess(result);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save partner');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{isEdit ? 'Edit Partner' : 'Add Partner'}</h3>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          {saved && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              <span>Partner {isEdit ? 'updated' : 'created'} successfully.</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
              <input required value={form.name} onChange={(e) => set('name', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
              <select required value={form.type} onChange={(e) => set('type', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                {PARTNER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input value={form.country} onChange={(e) => set('country', e.target.value)}
                placeholder="e.g. DR Congo"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              {form.logoUrl && (
                <div className="flex items-center gap-2 mb-2">
                  <img src={form.logoUrl} alt="Logo preview" className="w-12 h-12 rounded-lg object-contain border border-gray-200 bg-gray-50" />
                  <button type="button" onClick={() => set('logoUrl', '')} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors w-full justify-center mb-2"
              >
                {logoUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {logoUploading ? 'Uploading…' : 'Upload logo image'}
              </button>
              <input type="url" value={form.logoUrl} onChange={(e) => set('logoUrl', e.target.value)}
                placeholder="Or paste URL: https://…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" value={form.websiteUrl} onChange={(e) => set('websiteUrl', e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            {isEdit && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            )}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Add Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PartnersPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | undefined>();

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPartnersAdmin();
      setPartners(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) fetchPartners();
  }, [ready, fetchPartners]);

  async function handleDeactivate(partner: Partner) {
    if (!confirm(`Deactivate "${partner.name}"?`)) return;
    setActionLoading(`deactivate-${partner.id}`);
    try {
      await deactivatePartner(partner.id);
      setPartners((prev) => prev.map((p) => p.id === partner.id ? { ...p, isActive: false } : p));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to deactivate');
    } finally {
      setActionLoading(null);
    }
  }

  function handleModalSuccess(p: Partner) {
    setPartners((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = p;
        return next;
      }
      return [p, ...prev];
    });
  }

  if (!ready) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;

  return (
    <>
      {showModal && (
        <PartnerModal
          partner={editPartner}
          onClose={() => { setShowModal(false); setEditPartner(undefined); }}
          onSuccess={handleModalSuccess}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Partners</h2>
            <p className="text-sm text-gray-500 mt-0.5">{partners.length} partner{partners.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => { setEditPartner(undefined); setShowModal(true); }}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Partner
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error} <button onClick={fetchPartners} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading partners…
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-20">
            <Handshake size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No partners yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Partner', 'Type', 'Country', 'Status', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className={`px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {partner.logoUrl ? (
                          <img src={partner.logoUrl} alt={partner.name} className="w-8 h-8 rounded-lg object-contain border border-gray-100" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">
                            {partner.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{partner.name}</p>
                          {partner.websiteUrl && (
                            <a href={partner.websiteUrl} target="_blank" rel="noreferrer"
                              className="text-xs text-blue-500 hover:underline flex items-center gap-0.5">
                              <ExternalLink size={10} /> website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 capitalize text-xs">{partner.type}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{partner.country ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${partner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {partner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {partner.isFeatured ? <span className="text-yellow-500 font-medium">Featured</span> : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setEditPartner(partner); setShowModal(true); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        {partner.isActive && (
                          <button
                            onClick={() => handleDeactivate(partner)}
                            disabled={actionLoading === `deactivate-${partner.id}`}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-60"
                          >
                            {actionLoading === `deactivate-${partner.id}` ? <Loader2 size={11} className="animate-spin" /> : <Power size={11} />}
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
