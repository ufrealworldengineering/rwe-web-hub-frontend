/** API origin without trailing slash (e.g. `http://localhost:8000`). Auth uses `/api/auth/...`; Axios client uses `/api` prefix via `api.ts`. */
export function getApiOrigin(): string {
  const raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return raw.replace(/\/$/, '');
}

export function getApiBasePath(): string {
  return `${getApiOrigin()}/api`;
}
