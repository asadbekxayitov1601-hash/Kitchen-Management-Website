import { config } from '../config';

const API_BASE_URL = config.apiBaseUrl;

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(init && init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Convert relative paths to absolute URLs
  const url = typeof input === 'string' && input.startsWith('/')
    ? `${API_BASE_URL}${input}`
    : input;

  const res = await fetch(url, { ...init, headers });
  return res;
}
