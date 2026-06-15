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

export interface PlatformAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Exchange a Firebase ID token for a platform JWT (with roles/permissions)
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

// Fallback email/password register (bypasses Firebase, uses auth service directly)
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
