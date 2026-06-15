'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save, Loader2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/session-provider';
import { getMyProfile, updateMyProfile, uploadFile, type UserProfile } from '@/lib/api';

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  group_admin: 'Group Admin',
  branch_admin: 'Branch Admin',
  manager: 'Manager',
  staff: 'Staff',
  investor: 'Investor',
  partner: 'Partner',
  user: 'User',
  customer: 'Customer',
  auction_buyer: 'Auction Buyer',
  auction_seller: 'Auction Seller',
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-white/60 capitalize">
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

function Avatar({ src, name, size = 80 }: { src?: string; name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #0d5730, #22c55e)', fontSize: size * 0.3 }}
    >
      {initials || '?'}
    </div>
  );
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fetching, setFetching] = useState(true);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');
  const [region, setRegion] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) router.replace('/signin');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    getMyProfile()
      .then((p) => {
        setProfile(p);
        setFirstName(p.firstName ?? '');
        setLastName(p.lastName ?? '');
        setPhone(p.phone ?? '');
        setBio(p.bio ?? '');
        setDepartment(p.department ?? '');
        setRegion(p.region ?? '');
        setAvatarUrl(p.avatarUrl ?? '');
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const result = await uploadFile(file);
      setAvatarUrl(result.url);
    } catch {
      setError('Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateMyProfile({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
        department: department.trim() || undefined,
        region: region.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !user || fetching) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0C0C0C] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || profile?.email || '';

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <User size={18} style={{ color: '#22c55e' }} />
            <p className="text-xs uppercase tracking-widest" style={{ color: '#22c55e' }}>Profile</p>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-white/40">
            Manage your personal information and account details.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar section */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar src={avatarUrl || undefined} name={displayName} size={80} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white dark:border-[#0C0C0C] bg-green-500 text-white hover:bg-green-600 transition"
              >
                {uploadingAvatar ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-white">{displayName}</p>
              <p className="text-sm text-gray-500 dark:text-white/40">{profile?.email}</p>
              {profile?.roles && profile.roles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profile.roles.map((r) => <RoleBadge key={r} role={r} />)}
                </div>
              )}
            </div>
          </div>

          {/* Personal info */}
          <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.01] dark:bg-white/[0.01] p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Personal Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-white/40 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-white/40 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-white/40 mb-1.5">
                <span className="flex items-center gap-1.5"><Mail size={11} /> Email Address</span>
              </label>
              <input
                type="email"
                value={profile?.email ?? ''}
                disabled
                className="w-full rounded-lg border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] px-3 py-2.5 text-sm text-gray-500 dark:text-white/40 cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-gray-400 dark:text-white/25">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-white/40 mb-1.5">
                <span className="flex items-center gap-1.5"><Phone size={11} /> Phone Number</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-white/40 mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="A short bio about yourself…"
              />
            </div>
          </div>

          {/* Optional details */}
          <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.01] dark:bg-white/[0.01] p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Additional Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-white/40 mb-1.5">
                  <span className="flex items-center gap-1.5"><Briefcase size={11} /> Department</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Investment"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-white/40 mb-1.5">
                  <span className="flex items-center gap-1.5"><MapPin size={11} /> Region</span>
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. East Africa"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-white/40 mb-1.5">Profile Picture URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://…"
              />
              <p className="mt-1 text-[11px] text-gray-400 dark:text-white/25">Or use the camera icon above to upload a photo.</p>
            </div>
          </div>

          {/* Account info (read-only) */}
          <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.01] dark:bg-white/[0.01] p-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Account Info</h2>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-white/40">Account status</span>
              <span className={`font-medium capitalize ${profile?.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {profile?.status?.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-white/40">Member since</span>
              <span className="text-gray-700 dark:text-white/60">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition"
              style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg, #0d5730, #158040)' }}
            >
              {saving ? (
                <><Loader2 size={14} className="animate-spin" /> Saving…</>
              ) : saved ? (
                <><Check size={14} /> Saved</>
              ) : (
                <><Save size={14} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
