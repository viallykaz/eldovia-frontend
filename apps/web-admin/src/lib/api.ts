import { getToken, setToken, getRefreshToken, setRefreshToken, clearToken } from './auth';

const BASE_URL = 'http://localhost:3000';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  site: string;
  seoTitle?: string;
  seoDescription?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  title?: string;
  organization?: string;
  type?: string;
  rating?: number;
  site?: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageBody {
  title: string;
  content: string;
  site?: string;
  seoTitle?: string;
  seoDescription?: string;
  parentId?: string;
}

export interface UpdatePageBody {
  title?: string;
  content?: string;
  site?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CreateTestimonialBody {
  name: string;
  quote: string;
  title?: string;
  organization?: string;
  type?: string;
  rating?: number;
  site?: string;
}

export interface UpdateTestimonialBody {
  name?: string;
  quote?: string;
  title?: string;
  organization?: string;
  type?: string;
  rating?: number;
  site?: string;
  featured?: boolean;
  active?: boolean;
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _isRetry = false,
): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (res.status === 401 && !_isRetry) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json() as { accessToken: string; refreshToken?: string };
          setToken(data.accessToken);
          if (data.refreshToken) setRefreshToken(data.refreshToken);
          return apiFetch<T>(path, options, true);
        }
      } catch {}
    }
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Session expired. Please sign in again.');
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function setupAdmin(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/v1/auth/setup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPages(site?: string): Promise<CmsPage[]> {
  const qs = site ? `?site=${site}` : '';
  return apiFetch<CmsPage[]>(`/api/v1/cms/pages${qs}`);
}

export async function getPage(id: string): Promise<CmsPage> {
  return apiFetch<CmsPage>(`/api/v1/cms/pages/${id}`);
}

export async function createPage(body: CreatePageBody): Promise<CmsPage> {
  return apiFetch<CmsPage>('/api/v1/cms/pages', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updatePage(id: string, body: UpdatePageBody): Promise<CmsPage> {
  return apiFetch<CmsPage>(`/api/v1/cms/pages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function publishPage(id: string): Promise<CmsPage> {
  return apiFetch<CmsPage>(`/api/v1/cms/pages/${id}/publish`, {
    method: 'POST',
  });
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(site?: string): Promise<Testimonial[]> {
  const qs = site ? `?site=${site}` : '';
  return apiFetch<Testimonial[]>(`/api/v1/cms/testimonials${qs}`);
}

export async function createTestimonial(body: CreateTestimonialBody): Promise<Testimonial> {
  return apiFetch<Testimonial>('/api/v1/cms/testimonials', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateTestimonial(id: string, body: UpdateTestimonialBody): Promise<Testimonial> {
  return apiFetch<Testimonial>(`/api/v1/cms/testimonials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// ─── Media ────────────────────────────────────────────────────────────────────

export async function getMedia(): Promise<MediaFile[]> {
  const res = await apiFetch<{ data: MediaFile[] } | MediaFile[]>('/api/v1/cms/media');
  return Array.isArray(res) ? res : (res as { data: MediaFile[] }).data ?? [];
}

export async function uploadMedia(file: File): Promise<{ data: MediaFile }> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/v1/cms/media/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err?.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = await res.json() as MediaFile;
  return { data };
}

export async function deleteMedia(id: string): Promise<void> {
  await apiFetch<unknown>(`/api/v1/cms/media/${id}`, { method: 'DELETE' });
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  status: string;
  createdAt: string;
  organizationId?: string;
}

export type UserRole =
  | 'super_admin'
  | 'group_admin'
  | 'branch_admin'
  | 'manager'
  | 'staff'
  | 'investor'
  | 'partner'
  | 'user'
  | 'customer'
  | 'auction_buyer'
  | 'auction_seller';

export type UserStatus =
  | 'pending_verification'
  | 'pending_approval'
  | 'active'
  | 'suspended'
  | 'deactivated';

export const ALL_ROLES: UserRole[] = [
  'super_admin',
  'group_admin',
  'branch_admin',
  'manager',
  'staff',
  'investor',
  'partner',
  'user',
  'customer',
  'auction_buyer',
  'auction_seller',
];

export const ALL_STATUSES: UserStatus[] = [
  'pending_verification',
  'pending_approval',
  'active',
  'suspended',
  'deactivated',
];

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}): Promise<{ data: AdminUser[]; total: number; page: number; limit: number }> {
  const qs = new URLSearchParams();
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  if (params?.role) qs.set('role', params.role);
  if (params?.status) qs.set('status', params.status);
  if (params?.search) qs.set('search', params.search);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch<{ data: AdminUser[]; total: number; page: number; limit: number }>(
    `/api/v1/users${query}`,
  );
}

export async function getUser(id: string): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/v1/users/${id}`);
}

export async function updateUser(
  id: string,
  body: Partial<{
    status: string;
    roles: string[];
    firstName: string;
    lastName: string;
  }>,
): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/v1/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteUser(id: string): Promise<void> {
  await apiFetch<unknown>(`/api/v1/users/${id}`, { method: 'DELETE' });
}

export async function inviteUser(body: {
  email: string;
  roles: string[];
  firstName?: string;
}): Promise<{ data: { id: string; email: string } }> {
  return apiFetch<{ data: { id: string; email: string } }>(
    '/api/v1/users/invite',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );
}

export async function syncFirebaseUsers(): Promise<{
  synced: number;
  updated: number;
  total: number;
}> {
  return apiFetch('/api/v1/auth/sync-firebase', { method: 'POST' });
}

// ─── Agribusiness – Projects ──────────────────────────────────────────────────

export interface TeamMember { id: string; name: string; role?: string }
export interface TeamInfo {
  manager?: { id: string; name: string };
  investmentManager?: { id: string; name: string };
  members?: TeamMember[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  status: string;
  projectType?: 'profit_making' | 'sustainability';
  operationalStatus?: string;
  location: string;
  country: string;
  budget: number;
  fundingGoal: number;
  fundingRaised: number;
  currency: string;
  completionPercentage: number;
  expectedReturnRate?: number;
  minimumInvestment?: number;
  investorCount: number;
  followersCount?: number;
  likeCount?: number;
  interestingCount?: number;
  isDeleted?: boolean;
  deletedAt?: string;
  isFeatured: boolean;
  startDate: string;
  endDate?: string;
  managerId: string;
  investmentManagerId?: string;
  teamMembers?: string[];
  teamInfo?: TeamInfo;
  projectDetails?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const PROJECT_CATEGORIES = [
  'farming', 'smart_farming', 'livestock', 'crop_production', 'irrigation',
  'agri_tech', 'food_processing', 'aquaculture', 'forestry', 'other',
] as const;

export const PROJECT_STATUSES = [
  'draft', 'open', 'funding', 'funded', 'in_progress', 'completed', 'suspended',
] as const;

export async function getProjects(params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  featured?: boolean;
  includeDeleted?: boolean;
}): Promise<Project[]> {
  const qs = new URLSearchParams();
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  if (params?.status) qs.set('status', params.status);
  if (params?.category) qs.set('category', params.category);
  if (params?.featured !== undefined) qs.set('featured', String(params.featured));
  if (params?.includeDeleted) qs.set('includeDeleted', 'true');
  const query = qs.toString() ? `?${qs.toString()}` : '';
  const result = await apiFetch<{ data: Project[]; total: number; page: number; limit: number; totalPages: number }>(
    `/api/v1/agribusiness/projects${query}`,
  );
  return result.data ?? [];
}

export async function getProject(id: string): Promise<Project> {
  return apiFetch<Project>(`/api/v1/agribusiness/projects/${id}`);
}

export async function createProject(body: {
  title: string;
  summary: string;
  description: string;
  category: string;
  status?: string;
  projectType?: 'profit_making' | 'sustainability';
  operationalStatus?: string;
  location: string;
  country: string;
  budget: number;
  fundingGoal: number;
  currency?: string;
  startDate: string;
  endDate?: string;
  expectedReturnRate?: number;
  minimumInvestment?: number;
  isFeatured?: boolean;
  images?: string[];
  investmentManagerId?: string;
  teamMembers?: string[];
  teamInfo?: TeamInfo;
  projectDetails?: Record<string, unknown>;
}): Promise<Project> {
  return apiFetch<Project>('/api/v1/agribusiness/projects', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function changeOperationalStatus(id: string, operationalStatus: string): Promise<Project> {
  return apiFetch<Project>(`/api/v1/agribusiness/projects/${id}/operational-status`, {
    method: 'PATCH',
    body: JSON.stringify({ operationalStatus }),
  });
}

export async function approveInvestment(id: string): Promise<Investment> {
  return apiFetch<Investment>(`/api/v1/agribusiness/investments/${id}/approve`, { method: 'PATCH' });
}

export async function rejectInvestment(id: string, reason?: string): Promise<Investment> {
  return apiFetch<Investment>(`/api/v1/agribusiness/investments/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

export async function updateProject(id: string, body: Partial<Project>): Promise<Project> {
  return apiFetch<Project>(`/api/v1/agribusiness/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function publishProject(id: string): Promise<Project> {
  return apiFetch<Project>(`/api/v1/agribusiness/projects/${id}/publish`, {
    method: 'PATCH',
  });
}

export async function archiveProject(id: string): Promise<void> {
  await apiFetch<unknown>(`/api/v1/agribusiness/projects/${id}`, { method: 'DELETE' });
}

export async function restoreProject(id: string): Promise<Project> {
  return apiFetch<Project>(`/api/v1/agribusiness/projects/${id}/restore`, { method: 'PATCH' });
}

export async function permanentDeleteProject(id: string): Promise<void> {
  await apiFetch<unknown>(`/api/v1/agribusiness/projects/${id}/permanent`, { method: 'DELETE' });
}

// ─── Agribusiness – News ──────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string;
  category?: string;
  tags?: string[];
  coverImageUrl?: string;
  isPublished: boolean;
  publishedAt?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getNewsAdmin(params?: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<{ data: NewsArticle[]; total: number; page: number; limit: number; totalPages: number }> {
  const qs = new URLSearchParams();
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  if (params?.category) qs.set('category', params.category);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch(`/api/v1/agribusiness/news/all${query}`);
}

export async function createNewsArticle(body: {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  tags?: string[];
  coverImageUrl?: string;
  isFeatured?: boolean;
}): Promise<NewsArticle> {
  return apiFetch<NewsArticle>('/api/v1/agribusiness/news', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateNewsArticle(id: string, body: Partial<NewsArticle>): Promise<NewsArticle> {
  return apiFetch<NewsArticle>(`/api/v1/agribusiness/news/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function publishNewsArticle(id: string): Promise<NewsArticle> {
  return apiFetch<NewsArticle>(`/api/v1/agribusiness/news/${id}/publish`, {
    method: 'PATCH',
  });
}

export async function archiveNewsArticle(id: string): Promise<void> {
  await apiFetch<unknown>(`/api/v1/agribusiness/news/${id}`, { method: 'DELETE' });
}

// ─── Agribusiness – Partners ──────────────────────────────────────────────────

export interface Partner {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  country?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PARTNER_TYPES = [
  'ngo', 'government', 'investor', 'agricultural', 'international', 'corporate',
] as const;

export async function getPartnersAdmin(): Promise<Partner[]> {
  return apiFetch<Partner[]>('/api/v1/agribusiness/partners/all');
}

export async function createPartner(body: {
  name: string;
  type: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  country?: string;
}): Promise<Partner> {
  return apiFetch<Partner>('/api/v1/agribusiness/partners', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updatePartner(id: string, body: Partial<Partner>): Promise<Partner> {
  return apiFetch<Partner>(`/api/v1/agribusiness/partners/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deactivatePartner(id: string): Promise<void> {
  await apiFetch<unknown>(`/api/v1/agribusiness/partners/${id}`, { method: 'DELETE' });
}

// ─── Agribusiness – Investments ───────────────────────────────────────────────

export interface Investment {
  id: string;
  investorId: string;
  projectId: string;
  amount: number;
  currency: string;
  status: string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  investedAt: string;
  project?: { title: string; slug: string };
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  projectId?: string;
  investmentId?: string;
  isRead: boolean;
  createdAt: string;
}

export async function getMyNotifications(limit?: number): Promise<Notification[]> {
  const qs = limit ? `?limit=${limit}` : '';
  return apiFetch<Notification[]>(`/api/v1/agribusiness/notifications${qs}`);
}

export async function getUnreadNotificationCount(): Promise<{ count: number }> {
  return apiFetch<{ count: number }>('/api/v1/agribusiness/notifications/unread-count');
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch(`/api/v1/agribusiness/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch('/api/v1/agribusiness/notifications/read-all', { method: 'PATCH' });
}

export async function getProjectInvestments(projectId: string): Promise<Investment[]> {
  const result = await apiFetch<{ data: Investment[]; total: number } | Investment[]>(
    `/api/v1/agribusiness/investments/project/${projectId}/list`,
  );
  return Array.isArray(result) ? result : (result as { data: Investment[] }).data ?? [];
}

export async function addDirectInvestment(data: {
  projectId: string;
  investorId: string;
  amount: number;
  currency?: string;
}): Promise<Investment> {
  return apiFetch<Investment>('/api/v1/agribusiness/investments/direct', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadProjectImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/v1/agribusiness/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try { const err = await res.json(); message = err?.message ?? message; } catch {}
    throw new Error(message);
  }

  const data = await res.json() as { url: string };
  return data.url;
}

export async function getProjectStats(projectId: string): Promise<{
  total: number;
  count: number;
  currency: string;
}> {
  return apiFetch(`/api/v1/agribusiness/investments/project/${projectId}`);
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  projects: {
    total: number;
    active: number;
    byStatus: Record<string, number>;
  };
  investments: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    thisWeek: number;
    thisMonth: number;
    lastMonth: number;
    totalAmountApproved: number;
    uniqueInvestors: number;
    byMonth: { month: string; count: number; amount: number }[];
  };
  partners: {
    total: number;
    active: number;
  };
  news: {
    total: number;
    published: number;
  };
}

export async function getAnalytics(): Promise<AnalyticsSummary> {
  return apiFetch<AnalyticsSummary>('/api/v1/agribusiness/analytics');
}

// ─── Auth token exchange ──────────────────────────────────────────────────────

export async function exchangeFirebaseToken(firebaseIdToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const res = await fetch(`${BASE_URL}/api/v1/auth/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: firebaseIdToken }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}
