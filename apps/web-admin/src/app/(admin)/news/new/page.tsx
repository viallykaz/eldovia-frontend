'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Upload, CheckCircle2 } from 'lucide-react';
import { createNewsArticle, publishNewsArticle, uploadProjectImage } from '@/lib/api';

const CATEGORIES = ['agriculture', 'investment', 'technology', 'sustainability', 'company', 'general'];

export default function NewArticlePage() {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    coverImageUrl: '',
    isFeatured: false,
    publishNow: true,
  });

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      let article = await createNewsArticle({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        coverImageUrl: form.coverImageUrl || undefined,
        isFeatured: form.isFeatured,
      });
      if (form.publishNow) {
        article = await publishNewsArticle(article.id);
      }
      setSavedId(article.id);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/news" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">New Article</h2>
          <p className="text-sm text-gray-500">Write a news article for Eldovia Agribusiness</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
        {saved && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            <span>Article {form.publishNow ? 'published' : 'saved as draft'} successfully.</span>
            {savedId && (
              <Link href={`/news/${savedId}`} className="ml-auto text-green-700 hover:underline font-medium">
                Edit article →
              </Link>
            )}
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt <span className="text-red-500">*</span></label>
            <textarea required rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)}
              placeholder="Short description shown in article previews"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 text-xs">(comma-separated)</span></label>
              <input value={form.tags} onChange={(e) => set('tags', e.target.value)}
                placeholder="agriculture, investment, tech"
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
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-gray-700">Featured article</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.publishNow} onChange={(e) => set('publishNow', e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <div>
                <span className="text-sm text-gray-700">Publish immediately</span>
                <p className="text-xs text-gray-400">If unchecked, the article will be saved as a draft and won&apos;t appear on the public news page.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-6">
          <Link href="/news" className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {loading ? 'Creating…' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
