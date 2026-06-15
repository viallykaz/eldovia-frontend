'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, X, ImagePlus, Search, UserPlus, Users, CheckCircle2 } from 'lucide-react';
import { createProject, uploadProjectImage, PROJECT_CATEGORIES, getUsers, type AdminUser, type TeamInfo } from '@/lib/api';
import Image from 'next/image';

const BASE_CURRENCIES = ['USD', 'GHS', 'CDF', 'KRW'];
const CUSTOM_CURRENCIES_KEY = 'eldovia_custom_currencies';

function loadCustomCurrencies(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(CUSTOM_CURRENCIES_KEY) ?? '[]') as string[]; }
  catch { return []; }
}

function saveCustomCurrencies(codes: string[]) {
  localStorage.setItem(CUSTOM_CURRENCIES_KEY, JSON.stringify(codes));
}

// Category-specific detail fields
const CATEGORY_DETAILS: Record<string, { label: string; key: string; type?: string; placeholder?: string }[]> = {
  farming: [
    { label: 'Hectares of Land', key: 'hectares', type: 'number', placeholder: 'e.g. 500' },
    { label: 'Number of Farmers', key: 'numberOfFarmers', type: 'number', placeholder: 'e.g. 200' },
    { label: 'Crop Types', key: 'cropTypes', placeholder: 'e.g. Maize, Cassava, Sorghum' },
    { label: 'Farming Method', key: 'farmingMethod', placeholder: 'e.g. Organic, Conventional, Integrated' },
    { label: 'Harvest Cycles per Year', key: 'harvestCycles', type: 'number', placeholder: 'e.g. 2' },
    { label: 'Expected Yield (tons)', key: 'expectedYieldTons', type: 'number', placeholder: 'e.g. 1500' },
  ],
  smart_farming: [
    { label: 'Hectares of Land', key: 'hectares', type: 'number', placeholder: 'e.g. 500' },
    { label: 'Number of Farmers', key: 'numberOfFarmers', type: 'number', placeholder: 'e.g. 200' },
    { label: 'Technology Used', key: 'technology', placeholder: 'e.g. Drones, IoT sensors, Precision irrigation' },
    { label: 'Crop Types', key: 'cropTypes', placeholder: 'e.g. Maize, Wheat' },
  ],
  livestock: [
    { label: 'Animal Type', key: 'animalType', placeholder: 'e.g. Cattle, Goats, Poultry' },
    { label: 'Head Count', key: 'headCount', type: 'number', placeholder: 'e.g. 500' },
    { label: 'Breed Type', key: 'breedType', placeholder: 'e.g. Holstein, Brahman' },
    { label: 'Land Area (ha)', key: 'hectares', type: 'number', placeholder: 'e.g. 200' },
    { label: 'Expected Offtake (kg/yr)', key: 'expectedOfftake', type: 'number', placeholder: 'e.g. 50000' },
  ],
  crop_production: [
    { label: 'Hectares', key: 'hectares', type: 'number', placeholder: 'e.g. 300' },
    { label: 'Number of Farmers', key: 'numberOfFarmers', type: 'number', placeholder: 'e.g. 150' },
    { label: 'Crop Types', key: 'cropTypes', placeholder: 'e.g. Rice, Soybeans' },
    { label: 'Expected Yield (tons)', key: 'expectedYieldTons', type: 'number', placeholder: 'e.g. 900' },
  ],
  irrigation: [
    { label: 'Hectares Irrigated', key: 'hectares', type: 'number', placeholder: 'e.g. 800' },
    { label: 'Irrigation Type', key: 'irrigationType', placeholder: 'e.g. Drip, Sprinkler, Flood' },
    { label: 'Water Source', key: 'waterSource', placeholder: 'e.g. River, Borehole, Reservoir' },
    { label: 'Communities Served', key: 'communitiesServed', type: 'number', placeholder: 'e.g. 5' },
  ],
  aquaculture: [
    { label: 'Fish Species', key: 'fishSpecies', placeholder: 'e.g. Tilapia, Catfish, Salmon' },
    { label: 'Number of Ponds / Cages', key: 'pondCount', type: 'number', placeholder: 'e.g. 20' },
    { label: 'Total Water Area (ha)', key: 'waterAreaHectares', type: 'number', placeholder: 'e.g. 10' },
    { label: 'Annual Capacity (tons)', key: 'annualCapacityTons', type: 'number', placeholder: 'e.g. 200' },
  ],
  forestry: [
    { label: 'Forest Area (ha)', key: 'hectares', type: 'number', placeholder: 'e.g. 2000' },
    { label: 'Tree Species', key: 'treeSpecies', placeholder: 'e.g. Eucalyptus, Teak' },
    { label: 'Rotation Period (years)', key: 'rotationYears', type: 'number', placeholder: 'e.g. 7' },
    { label: 'Certification', key: 'certification', placeholder: 'e.g. FSC, PEFC' },
  ],
  food_processing: [
    { label: 'Processing Capacity (tons/day)', key: 'processingCapacity', type: 'number', placeholder: 'e.g. 50' },
    { label: 'Products', key: 'products', placeholder: 'e.g. Flour, Palm Oil, Cassava Starch' },
    { label: 'Number of Employees', key: 'employees', type: 'number', placeholder: 'e.g. 100' },
  ],
  agri_tech: [
    { label: 'Technology Description', key: 'technology', placeholder: 'e.g. AI crop monitoring platform' },
    { label: 'Target Users', key: 'targetUsers', placeholder: 'e.g. Smallholder farmers, Cooperatives' },
    { label: 'Coverage Area (ha)', key: 'hectares', type: 'number', placeholder: 'e.g. 5000' },
  ],
  other: [
    { label: 'Category Name', key: 'customCategory', placeholder: 'e.g. Mushroom Farming, Beekeeping' },
    { label: 'Project Type Details', key: 'details', placeholder: 'Describe the project type in detail' },
    { label: 'Land / Area (if applicable)', key: 'hectares', type: 'number', placeholder: 'e.g. 100' },
    { label: 'Participants / Beneficiaries', key: 'participants', type: 'number', placeholder: 'e.g. 50' },
  ],
};

const TEAM_ELIGIBLE_ROLES = ['super_admin', 'group_admin', 'branch_admin', 'manager', 'staff'];

interface SelectedTeamMember {
  id: string;
  name: string;
  role?: string;
}

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [allCurrencies, setAllCurrencies] = useState<string[]>(BASE_CURRENCIES);

  // Team
  const [eligibleUsers, setEligibleUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [projectManager, setProjectManager] = useState<SelectedTeamMember | null>(null);
  const [investmentManager, setInvestmentManager] = useState<SelectedTeamMember | null>(null);
  const [otherMembers, setOtherMembers] = useState<SelectedTeamMember[]>([]);
  const [memberRole, setMemberRole] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [addingFor, setAddingFor] = useState<'pm' | 'im' | 'other' | null>(null);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'farming',
    projectType: 'profit_making',
    location: '',
    country: '',
    budget: '',
    fundingGoal: '',
    currency: 'USD',
    customCurrency: '',
    startDate: '',
    endDate: '',
    expectedReturnRate: '',
    minimumInvestment: '',
    isFeatured: false,
  });

  useEffect(() => {
    const custom = loadCustomCurrencies();
    if (custom.length) {
      setAllCurrencies([...BASE_CURRENCIES, ...custom.filter((c) => !BASE_CURRENCIES.includes(c))]);
    }
  }, []);

  // Category-specific detail fields
  const [projectDetails, setProjectDetails] = useState<Record<string, string>>({});

  useEffect(() => {
    setProjectDetails({});
  }, [form.category]);

  useEffect(() => {
    setUsersLoading(true);
    getUsers({ limit: 200 })
      .then((res) => {
        const admins = res.data.filter((u) =>
          u.roles?.some((r: string) => TEAM_ELIGIBLE_ROLES.includes(r)),
        );
        setEligibleUsers(admins);
      })
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 4000);
    return () => clearTimeout(t);
  }, [saved]);

  function set(key: string, value: string | boolean) {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setDetail(key: string, value: string) {
    setProjectDetails((d) => ({ ...d, [key]: value }));
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      const urls = await Promise.all(files.map((f) => uploadProjectImage(f)));
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  const filteredUsers = eligibleUsers.filter((u) => {
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    const email = u.email.toLowerCase();
    const q = userSearch.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  function selectUser(user: AdminUser) {
    const member: SelectedTeamMember = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
    };
    if (addingFor === 'pm') setProjectManager(member);
    else if (addingFor === 'im') setInvestmentManager(member);
    else if (addingFor === 'other') {
      if (!otherMembers.find((m) => m.id === user.id)) {
        setOtherMembers((prev) => [...prev, { ...member, role: memberRole || undefined }]);
      }
    }
    setAddingFor(null);
    setUserSearch('');
    setMemberRole('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let currency = form.currency === 'OTHER' ? form.customCurrency.trim().toUpperCase() || 'USD' : form.currency;

      // Persist any new custom currency for future use
      if (form.currency === 'OTHER' && currency !== 'USD' && !allCurrencies.includes(currency)) {
        const updated = [...allCurrencies, currency];
        setAllCurrencies(updated);
        saveCustomCurrencies(updated.filter((c) => !BASE_CURRENCIES.includes(c)));
      }

      // Build teamInfo for display on public pages
      const teamInfo: TeamInfo = {};
      if (projectManager) teamInfo.manager = { id: projectManager.id, name: projectManager.name };
      if (investmentManager) teamInfo.investmentManager = { id: investmentManager.id, name: investmentManager.name };
      if (otherMembers.length) teamInfo.members = otherMembers;

      const project = await createProject({
        title: form.title,
        summary: form.summary,
        description: form.description,
        category: form.category,
        projectType: form.projectType as 'profit_making' | 'sustainability',
        location: form.location,
        country: form.country,
        budget: parseFloat(form.budget),
        fundingGoal: parseFloat(form.fundingGoal),
        currency,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        expectedReturnRate: form.expectedReturnRate ? parseFloat(form.expectedReturnRate) : undefined,
        minimumInvestment: form.minimumInvestment ? parseFloat(form.minimumInvestment) : undefined,
        isFeatured: form.isFeatured,
        images: images.length > 0 ? images : undefined,
        investmentManagerId: investmentManager?.id,
        teamMembers: otherMembers.map((m) => m.id),
        teamInfo: Object.keys(teamInfo).length > 0 ? teamInfo : undefined,
        projectDetails: Object.keys(projectDetails).length > 0
          ? Object.fromEntries(Object.entries(projectDetails).filter(([, v]) => v !== ''))
          : undefined,
      });
      setSavedId(project.id);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  }

  const categoryFields = CATEGORY_DETAILS[form.category] ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/projects" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">New Project</h2>
          <p className="text-sm text-gray-500">Create an agricultural investment project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
        {saved && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            <span>Project created successfully.</span>
            {savedId && (
              <Link href={`/projects/${savedId}`} className="ml-auto text-green-700 hover:underline font-medium">
                Edit project →
              </Link>
            )}
          </div>
        )}

        {/* Basic info */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary <span className="text-red-500">*</span></label>
            <textarea required rows={2} value={form.summary} onChange={(e) => set('summary', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea required rows={5} value={form.description} onChange={(e) => set('description', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select required value={form.category} onChange={(e) => set('category', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === 'other' ? 'Other (specify below)' : c.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type <span className="text-red-500">*</span></label>
              <select required value={form.projectType} onChange={(e) => set('projectType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="profit_making">Profit Making</option>
                <option value="sustainability">Sustainability (Non-Profit)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <div className="flex gap-2">
              <select value={form.currency} onChange={(e) => set('currency', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                {allCurrencies.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="OTHER">Other…</option>
              </select>
              {form.currency === 'OTHER' && (
                <input value={form.customCurrency} onChange={(e) => set('customCurrency', e.target.value)}
                  placeholder="e.g. EUR"
                  className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  maxLength={6} />
              )}
            </div>
            {form.currency === 'OTHER' && form.customCurrency && (
              <p className="mt-1 text-xs text-gray-400">This currency will be saved for future use.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
              <input required value={form.location} onChange={(e) => set('location', e.target.value)}
                placeholder="e.g. Kinshasa"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
              <input required value={form.country} onChange={(e) => set('country', e.target.value)}
                placeholder="e.g. DR Congo"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
        </div>

        {/* Category-specific details */}
        {categoryFields.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {form.category === 'other' ? 'Project Type Details' : `${form.category.replace(/_/g, ' ')} Details`}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {categoryFields.map((field) => (
                <div key={field.key} className={field.key === 'details' ? 'col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.key === 'details' ? (
                    <textarea rows={3} value={projectDetails[field.key] ?? ''} onChange={(e) => setDetail(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                  ) : (
                    <input type={field.type ?? 'text'} value={projectDetails[field.key] ?? ''} onChange={(e) => setDetail(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Team */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-gray-900">Project Team</h3>
          </div>

          {/* User picker dropdown */}
          {addingFor && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-gray-400" />
                  <input
                    autoFocus
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email…"
                    className="flex-1 text-sm bg-transparent outline-none" />
                  <button type="button" onClick={() => { setAddingFor(null); setUserSearch(''); }} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
                {addingFor === 'other' && (
                  <input value={memberRole} onChange={(e) => setMemberRole(e.target.value)}
                    placeholder="Role (e.g. Agronomist, Field Manager)"
                    className="mt-2 w-full text-sm px-2 py-1 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-orange-400" />
                )}
              </div>
              <div className="max-h-48 overflow-y-auto">
                {usersLoading ? (
                  <div className="p-4 text-center text-sm text-gray-400">Loading users…</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-400">No eligible users found</div>
                ) : (
                  filteredUsers.slice(0, 10).map((u) => (
                    <button key={u.id} type="button" onClick={() => selectUser(u)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 text-left transition-colors">
                      <div className="h-7 w-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{u.firstName} {u.lastName}</div>
                        <div className="text-xs text-gray-400">{u.email} · {u.roles?.join(', ')}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Project Manager */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Project Manager</label>
            {projectManager ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="h-8 w-8 rounded-full bg-orange-200 text-orange-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {projectManager.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <span className="flex-1 text-sm font-medium text-gray-800">{projectManager.name}</span>
                <button type="button" onClick={() => setProjectManager(null)} className="text-gray-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setAddingFor('pm')}
                className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-700 border border-dashed border-orange-300 rounded-lg px-4 py-2 transition-colors hover:border-orange-500">
                <UserPlus size={14} /> Assign Project Manager
              </button>
            )}
          </div>

          {/* Investment Manager */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Investment Manager</label>
            {investmentManager ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="h-8 w-8 rounded-full bg-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {investmentManager.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <span className="flex-1 text-sm font-medium text-gray-800">{investmentManager.name}</span>
                <button type="button" onClick={() => setInvestmentManager(null)} className="text-gray-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setAddingFor('im')}
                className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 border border-dashed border-blue-300 rounded-lg px-4 py-2 transition-colors hover:border-blue-500">
                <UserPlus size={14} /> Assign Investment Manager
              </button>
            )}
          </div>

          {/* Other team members */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Other Team Members</label>
            {otherMembers.length > 0 && (
              <div className="space-y-2 mb-3">
                {otherMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="h-7 w-7 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{m.name}</div>
                      {m.role && <div className="text-xs text-gray-400">{m.role}</div>}
                    </div>
                    <button type="button" onClick={() => setOtherMembers((prev) => prev.filter((x) => x.id !== m.id))} className="text-gray-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => setAddingFor('other')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-lg px-4 py-2 transition-colors hover:border-gray-400">
              <UserPlus size={14} /> Add Team Member
            </button>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Project Images</h3>
          <p className="text-xs text-gray-500">First image is the cover. Multiple images create a carousel on the project page.</p>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {images.map((url, idx) => (
                <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                  <Image src={url} alt={`Project image ${idx + 1}`} fill className="object-cover" unoptimized />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-medium">Cover</span>
                  )}
                  <button type="button" onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-orange-400 transition-colors disabled:opacity-60">
              {uploading ? <><Loader2 size={15} className="animate-spin" /> Uploading…</> : <><ImagePlus size={15} /> Add Images</>}
            </button>
          </div>
        </div>

        {/* Financials */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Financial Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget <span className="text-red-500">*</span></label>
              <input required type="number" min="0" step="0.01" value={form.budget} onChange={(e) => set('budget', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal <span className="text-red-500">*</span></label>
              <input required type="number" min="0" step="0.01" value={form.fundingGoal} onChange={(e) => set('fundingGoal', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return Rate (%)</label>
              <input type="number" min="0" step="0.1" value={form.expectedReturnRate} onChange={(e) => set('expectedReturnRate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Investment</label>
              <input type="number" min="0" step="0.01" value={form.minimumInvestment} onChange={(e) => set('minimumInvestment', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Timeline</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
              <input required type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)}
              className="w-4 h-4 accent-orange-500 rounded" />
            <div>
              <span className="text-sm font-medium text-gray-800">Featured project</span>
              <p className="text-xs text-gray-500">Show on the home page featured section</p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-6">
          <Link href="/projects" className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading || uploading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {loading ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
