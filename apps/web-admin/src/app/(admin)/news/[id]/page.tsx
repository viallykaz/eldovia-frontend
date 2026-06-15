'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Globe, Upload, CheckCircle2 } from 'lucide-react';
import { getNewsAdmin, updateNewsArticle, publishNewsArticle, uploadProjectImage, NewsArticle } from '@/lib/api';

const CATEGORIES = ['agriculture', 'investment', 'technology', 'sustainability', 'company', 'general'];

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '',
    category: '', tags: '', coverImageUrl: '', isFeatured: false,
  });

  useEffect(() => {
    if (!id) return;
    // Fetch all articles and find by id (admin endpoint returns all)
    getNewsAdmin({ limit: 200 })
      .then((res) => {
        const found = res.data?.find((a) => a.id === id);
        if (found) {
          setArticle(found);
          setForm({
            title: found.title,
            excerpt: found.excerpt,
            content: found.content,
            category: found.category ?? '',
            tags: (found.tags ?? []).join(', '),
            coverImageUrl: found.coverImageUrl ?? '',
            isFeatured: found.isFeatured,
          });
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 4000);
    return () => clearTimeout(t);
  }, [saved]);

  function set(key: string, value: string | boolean) {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setError(null);
    try {
      const url = await uploadProjectImage(file);
      set('coverImageUrl', url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setImageUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateNewsArticle(id, {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        coverImageUrl: form.coverImageUrl || undefined,
        isFeatured: form.isFeatured,
      });
      setArticle(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const updated = await publishNewsArticle(id);
      setArticle(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-gray-400" /></div>;
  if (!article) return <div className="text-center py-20 text-gray-400">Article not found. <Link href="/news" className="text-orange-500">Back</Link></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/news" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{article.title}</h2>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${article.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {article.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        {!article.isPublished && (
          <button onClick={handlePublish} disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-60">
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
            Publish
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
        {saved && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            <span>Article saved successfully.</span>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea required rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea required rows={12} value={form.content} onChange={(e) => set('content', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y font-mono" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Meta</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input value={form.tags} onChange={(e) => set('tags', e.target.value)}
                placeholder="comma-separated"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            {form.coverImageUrl && (
              <div className="flex items-center gap-2 mb-2">
                <img src={form.coverImageUrl} alt="Cover preview" className="h-20 w-36 rounded-lg object-cover border border-gray-200" />
                <button type="button" onClick={() => set('coverImageUrl', '')} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            )}
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={imageUploading}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors w-full justify-center mb-2"
            >
              {imageUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {imageUploading ? 'Uploading…' : 'Upload cover image'}
            </button>
            <input type="url" value={form.coverImageUrl} onChange={(e) => set('coverImageUrl', e.target.value)}
              placeholder="Or paste URL: https://…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-orange-500" />
            <span className="text-sm text-gray-700">Featured article</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pb-6">
          <Link href="/news" className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Back</Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
