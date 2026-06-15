const TOKEN_KEY   = 'eldovia_token';
const REFRESH_KEY = 'eldovia_refresh_token';
const USER_KEY    = 'eldovia_user';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  firebaseUid: string;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

const ADMIN_ROLES = new Set(['super_admin', 'group_admin', 'branch_admin', 'manager']);

export interface TokenPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  exp: number;
}

export function decodeToken(): TokenPayload | null {
  const token = getToken();
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export function isAdminUser(): boolean {
  const payload = decodeToken();
  if (!payload) return false;
  return payload.roles.some((r) => ADMIN_ROLES.has(r));
}
