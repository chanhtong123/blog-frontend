import type { PostDto, CategoryDto, TagDto, PagedResultDto } from "@/models/dtos";

export type Post = PostDto;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api/v1";

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

function normalizeBackendList(body: any): Post[] {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (body?.data && Array.isArray(body.data.content)) return body.data.content;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.posts)) return body.posts;
  for (const k of Object.keys(body)) {
    if (Array.isArray(body[k])) return body[k];
  }
  return [];
}

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};

export type Category = CategoryDto;
export type Tag = TagDto;
export type PagedResultType<T> = PagedResultDto<T>;

export async function getPosts(
  page = 0,
  size = 10,
  categoryId?: number,
  tag?: string,
  keyword?: string,
  status: string = "POSTED"
): Promise<PagedResult<Post>> {
  if (!API_BASE) {
    console.warn("getPosts: API_BASE not configured - returning empty list");
    return { items: [], total: 0, page, size };
  }

  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    if (categoryId != null) params.set("categoryId", String(categoryId));
    if (tag) params.set("tag", String(tag));
    if (keyword) params.set("keyword", String(keyword));
    if (status && status !== "ALL") params.set("status", status); // 👈 chỉ thêm khi không phải ALL

    const url = `${API_BASE}/post?${params.toString()}`;
    const body = await fetchJson<any>(url);
    const list = normalizeBackendList(body);
    const total = body?.data?.page?.totalElements ?? body?.total ?? list.length;

    return { items: list, total: Number(total || list.length), page, size };
  } catch (e) {
    console.warn("getPosts: request failed", e);
    return { items: [], total: 0, page, size };
  }
}


export async function getPostsAdmin(
  page = 0,
  size = 10,
  categoryId?: number,
  tag?: string,
  keyword?: string,
  status: string = ""
): Promise<PagedResult<Post>> {
  if (!API_BASE) {
    console.warn("getPosts: API_BASE not configured - returning empty list");
    return { items: [], total: 0, page, size };
  }

  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    if (categoryId != null) params.set("categoryId", String(categoryId));
    if (tag) params.set("tag", String(tag));
    if (keyword) params.set("keyword", String(keyword));
    if (status && status !== "ALL") params.set("status", status); // 👈 chỉ thêm khi không phải ALL

    const url = `${API_BASE}/post?${params.toString()}`;
    const body = await fetchJson<any>(url);
    const list = normalizeBackendList(body);
    const total = body?.data?.page?.totalElements ?? body?.total ?? list.length;

    return { items: list, total: Number(total || list.length), page, size };
  } catch (e) {
    console.warn("getPosts: request failed", e);
    return { items: [], total: 0, page, size };
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!API_BASE) {
    console.warn("getPostById: API_BASE not configured");
    return null;
  }
  try {
    const url = `${API_BASE}/post/${id}`;
    const body = await fetchJson<any>(url);
    return body?.data || body || null;
  } catch (e) {
    console.warn("getPostById: request failed", e);
    return null;
  }
}

export async function createPost(input: Partial<Post>): Promise<Post | null> {
  if (!API_BASE) {
    console.warn("createPost: API_BASE not configured");
    return null;
  }
  try {
    const url = `${API_BASE}/post`;
    const body = await fetchJson<any>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return body?.data || body || null;
  } catch (e) {
    console.warn("createPost: request failed", e);
    return null;
  }
}

export async function updatePost(id: number, patch: Partial<Post>): Promise<Post | null> {
  if (!API_BASE) {
    console.warn("updatePost: API_BASE not configured");
    return null;
  }
  try {
    const url = `${API_BASE}/post/${id}`;
    const body = await fetchJson<any>(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    return body?.data || body || null;
  } catch (e) {
    console.warn("updatePost: request failed", e);
    return null;
  }
}

export async function deletePost(id: number): Promise<boolean> {
  if (!API_BASE) {
    console.warn("deletePost: API_BASE not configured");
    return false;
  }
  try {
    const url = `${API_BASE}/post/${id}`;
    const res = await fetch(url, { method: "DELETE" });
    return res.ok;
  } catch (e) {
    console.warn("deletePost: request failed", e);
    return false;
  }
}
