import { getToken } from './auth';

const BASE_URL = 'http://localhost:3000';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> | undefined) },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try { const err = await res.json(); message = err?.message ?? message; } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface PlatformAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** Exchange a Firebase ID token for a platform JWT (with roles/permissions) */
export async function exchangeFirebaseToken(firebaseIdToken: string): Promise<PlatformAuthResponse> {
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

export async function loginUser(email: string, password: string): Promise<PlatformAuthResponse> {
  return apiFetch<PlatformAuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

/** Fallback email/password register (bypasses Firebase, uses auth service directly) */
export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...data, roles: ['customer'] }),
  });
}

// ─── Agribusiness Types ──────────────────────────────────────────────────────

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate: string;
  completedAt?: string;
  order: number;
}

export interface ProjectDocument {
  id: string;
  title: string;
  description?: string;
  type: string;
  fileUrl: string;
  isPublic: boolean;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  images?: string[];
}

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
  likeCount?: number;
  interestingCount?: number;
  followersCount?: number;
  isFeatured: boolean;
  startDate: string;
  endDate?: string;
  images: string[];
  impactMetrics: Record<string, number>;
  milestones?: Milestone[];
  documents?: ProjectDocument[];
  updates?: ProjectUpdate[];
  managerId?: string;
  teamMembers?: string[];
  investmentManagerId?: string;
  teamInfo?: TeamInfo;
  projectDetails?: Record<string, unknown>;
}

export interface Investment {
  id: string;
  projectId: string;
  investorId?: string;
  amount: number;
  currency: string;
  status: string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  rejectionReason?: string;
  investedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  project?: Project;
}

// ─── Agribusiness API ────────────────────────────────────────────────────────

export interface ProjectsParams {
  status?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

interface PaginatedProjects {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getProjects(params?: ProjectsParams): Promise<Project[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.category) qs.set('category', params.category);
  if (params?.featured !== undefined) qs.set('featured', String(params.featured));
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString();
  const result = await apiFetch<PaginatedProjects>(`/api/v1/agribusiness/projects${query ? `?${query}` : ''}`);
  return result.data ?? [];
}

export async function getProject(slug: string): Promise<Project> {
  return apiFetch<Project>(`/api/v1/agribusiness/projects/slug/${slug}`);
}

export async function getProjectById(id: string): Promise<Project> {
  return apiFetch<Project>(`/api/v1/agribusiness/projects/${id}`);
}

export async function getMyInvestments(): Promise<Investment[]> {
  return apiFetch<Investment[]>('/api/v1/agribusiness/investments/my');
}

export async function invest(data: {
  projectId: string;
  amount: number;
  currency?: string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}): Promise<Investment> {
  return apiFetch<Investment>('/api/v1/agribusiness/investments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Project Follow ─────────────────────────────────────────────────────────

const FOLLOWS_KEY = 'eldovia_followed_projects';

function saveLocalFollows(ids: string[]) {
  if (typeof window !== 'undefined') localStorage.setItem(FOLLOWS_KEY, JSON.stringify(ids));
}

export function isFollowedLocally(projectId: string): boolean {
  if (typeof window === 'undefined') return false;
  try { return (JSON.parse(localStorage.getItem(FOLLOWS_KEY) ?? '[]') as string[]).includes(projectId); }
  catch { return false; }
}

export async function getFollowStatus(projectId: string): Promise<boolean> {
  try {
    const res = await apiFetch<{ following: boolean }>(`/api/v1/agribusiness/projects/${projectId}/follow-status`);
    return res.following;
  } catch {
    return isFollowedLocally(projectId);
  }
}

export async function getMyFollowedProjects(): Promise<Project[]> {
  return apiFetch<Project[]>('/api/v1/agribusiness/projects/my/followed');
}

export async function followProject(projectId: string): Promise<void> {
  const local = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem(FOLLOWS_KEY) ?? '[]' : '[]') as string[];
  if (!local.includes(projectId)) saveLocalFollows([...local, projectId]);
  await apiFetch(`/api/v1/agribusiness/projects/${projectId}/follow`, { method: 'POST' });
}

export async function unfollowProject(projectId: string): Promise<void> {
  const local = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem(FOLLOWS_KEY) ?? '[]' : '[]') as string[];
  saveLocalFollows(local.filter((id) => id !== projectId));
  await apiFetch(`/api/v1/agribusiness/projects/${projectId}/unfollow`, { method: 'POST' });
}

// ─── Reactions ───────────────────────────────────────────────────────────────

const REACTIONS_KEY = 'eldovia_reactions';

export function getLocalReactions(): Record<string, { liked?: boolean; interesting?: boolean }> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(REACTIONS_KEY) ?? '{}'); }
  catch { return {}; }
}

function saveLocalReactions(r: Record<string, { liked?: boolean; interesting?: boolean }>) {
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(r));
}

export function hasReacted(projectId: string, type: 'like' | 'interesting'): boolean {
  const reactions = getLocalReactions();
  return type === 'like' ? !!reactions[projectId]?.liked : !!reactions[projectId]?.interesting;
}

export async function reactToProject(
  projectId: string,
  type: 'like' | 'interesting',
): Promise<{ likeCount: number; interestingCount: number }> {
  const reactions = getLocalReactions();
  const key = type === 'like' ? 'liked' : 'interesting';
  saveLocalReactions({ ...reactions, [projectId]: { ...reactions[projectId], [key]: true } });
  return apiFetch<{ likeCount: number; interestingCount: number }>(
    `/api/v1/agribusiness/projects/${projectId}/react`,
    { method: 'POST', body: JSON.stringify({ type }) },
  );
}

// ─── Notifications ──────────────────────────────────────────────────────────

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

export async function getMyNotifications(limit = 30): Promise<Notification[]> {
  return apiFetch<Notification[]>(`/api/v1/agribusiness/notifications?limit=${limit}`);
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

// ─── Discussions ─────────────────────────────────────────────────────────────

export interface Discussion {
  id: string;
  projectId: string;
  content: string;
  authorId: string;
  authorName: string;
  parentId?: string;
  imageUrl?: string;
  createdAt: string;
}

export async function getDiscussions(projectId: string): Promise<Discussion[]> {
  return apiFetch<Discussion[]>(`/api/v1/agribusiness/projects/${projectId}/discussions`);
}

export async function postDiscussion(
  projectId: string,
  content: string,
  parentId?: string,
  imageUrl?: string,
): Promise<Discussion> {
  return apiFetch<Discussion>(`/api/v1/agribusiness/projects/${projectId}/discussions`, {
    method: 'POST',
    body: JSON.stringify({ content, parentId, imageUrl }),
  });
}

export async function addProjectImage(projectId: string, imageUrl: string): Promise<void> {
  await apiFetch(`/api/v1/agribusiness/projects/${projectId}/images`, {
    method: 'POST',
    body: JSON.stringify({ imageUrl }),
  });
}

export async function deleteDiscussion(projectId: string, id: string): Promise<void> {
  await apiFetch(`/api/v1/agribusiness/projects/${projectId}/discussions/${id}`, { method: 'DELETE' });
}

// ─── File Upload ─────────────────────────────────────────────────────────────

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/v1/agribusiness/uploads`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<UploadResponse>;
}

// ─── Document Upload ──────────────────────────────────────────────────────────

export async function addProjectDocument(
  projectId: string,
  data: { title: string; description?: string; type?: string; fileUrl: string; fileSize?: number; mimeType?: string; isPublic?: boolean },
): Promise<ProjectDocument> {
  return apiFetch<ProjectDocument>(`/api/v1/agribusiness/projects/${projectId}/documents`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── News ─────────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  tags?: string[];
  coverImageUrl?: string;
  authorId: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export async function getNewsArticles(params?: { category?: string; limit?: number }): Promise<NewsArticle[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  const result = await apiFetch<{ data: NewsArticle[]; total: number } | NewsArticle[]>(
    `/api/v1/agribusiness/news${query}`,
  );
  return Array.isArray(result) ? result : (result as { data: NewsArticle[] }).data ?? [];
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle> {
  return apiFetch<NewsArticle>(`/api/v1/agribusiness/news/${slug}`);
}

// ─── Partners ─────────────────────────────────────────────────────────────────

export interface Partner {
  id: string;
  name: string;
  type: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
}

export async function getPartners(): Promise<Partner[]> {
  const result = await apiFetch<Partner[] | { data: Partner[] }>('/api/v1/agribusiness/partners');
  return Array.isArray(result) ? result : (result as { data: Partner[] }).data ?? [];
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  department?: string;
  region?: string;
  roles: string[];
  status: string;
  createdAt: string;
}

export async function getMyProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/v1/auth/me');
}

export async function updateMyProfile(data: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'phone' | 'avatarUrl' | 'bio' | 'department' | 'region'>>): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/v1/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
