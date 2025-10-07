import type { TagDto, PagedResultDto } from "@/models/dtos";
export type Tag = TagDto;
export type PagedResultType<T> = PagedResultDto<T>;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api/v1";

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};
async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}




function normalizeBackendList(body: any): Tag[] {
  // If backend returns pagination or wrapper, try to extract list
  if (!body) return [];
  if (Array.isArray(body)) return body;
  // Spring service returns ResponseObject with data.content for paged results
  if (body?.data && Array.isArray(body.data.content)) return body.data.content;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.posts)) return body.posts;
  // fallback: try to find first array property
  for (const k of Object.keys(body)) {
    if (Array.isArray(body[k])) return body[k];
  }
  return [];
}

export async function getTags(): Promise<Tag[]> {
  if (!API_BASE) {
    console.warn("getTags: API_BASE not configured - returning empty tag list");
    return [];
  }
  try {
    const url = `${API_BASE}/tag`;
    const body = await fetchJson<any>(url);
    const list = normalizeBackendList(body) as any[];
    if (Array.isArray(list) && list.length)
      return list.map((t, i) =>
        typeof t === "string"
          ? { id: i + 1, name: t }
          : { id: t.id ?? i + 1, name: t.name ?? String(t) }
      );
    if (Array.isArray(body?.data))
      return body.data.map((t: any, i: number) => ({ id: t.id ?? i + 1, name: t.name ?? t }));
    if (Array.isArray(body?.tags))
      return body.tags.map((t: any, i: number) => ({ id: t.id ?? i + 1, name: t.name ?? t }));
    const arr = normalizeBackendList(body);
    if (Array.isArray(arr) && arr.length)
      return arr.map((t: any, i: number) => ({ id: t.id ?? i + 1, name: t.name ?? t }));
    return [];
  } catch (e) {
    console.warn("getTags: request failed", e);
    return [];
  }
}

export async function createTag(input: string | Partial<Tag>): Promise<Tag | null> {
  const payload = typeof input === "string" ? { name: input } : input;
  if (!API_BASE) {
    console.warn("createTag: API_BASE not configured");
    return null;
  }
  try {
    const url = `${API_BASE}/tag`;
    const body = await fetchJson<any>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const t = body?.data || body;
  return t ? { id: t.id ?? Date.now(), name: t.name ?? t } : null;
  } catch (e) {
    console.warn("createTag: request failed", e);
    return null;
  }
}

export async function deleteTag(id: number | string): Promise<boolean> {
  if (!API_BASE) {
    console.warn("deleteTag: API_BASE not configured");
    return false;
  }
  try {
    const url = `${API_BASE}/tag/${encodeURIComponent(String(id))}`;
    const res = await fetch(url, { method: "DELETE" });
    return res.ok;
  } catch (e) {
    console.warn("deleteTag: request failed", e);
    return false;
  }
}

export async function updateTag(id: number | string, data: Partial<Tag>): Promise<Tag | null> {
  if (!API_BASE) {
    console.warn("updateTag: API_BASE not configured");
    return null;
  }
  try {
    const url = `${API_BASE}/tag/${encodeURIComponent(String(id))}`;
    const body = await fetchJson<any>(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const t = body?.data || body;
  return t ? { id: t.id ?? Date.now(), name: t.name ?? t } : null;
  } catch (e) {
    console.warn("updateTag: request failed", e);
    return null;
  }
}



