import type { CategoryDto, PagedResultDto } from "@/models/dtos";

const fallbackCategories: Category[] = [
  { id: 1, name: "General", description: "General posts" },
  { id: 2, name: "Tutorial", description: "Tutorial posts" },
];

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};

// Re-export DTO shapes for consumers
export type Category = CategoryDto;
export type PagedResultType<T> = PagedResultDto<T>;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api/v1";

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export async function getCategories(page = 0, size = 20): Promise<Category[]> {
  if (!API_BASE) return fallbackCategories;
  try {
    const url = `${API_BASE}/category?page=${page}&size=${size}`;
    const body = await fetchJson<any>(url);
    return body?.data?.content || fallbackCategories;
  } catch (e) {
    console.warn("getCategories failed", e);
    return fallbackCategories;
  }
}

export async function getCategoryById(id?: number): Promise<Category | null> {
  if (!API_BASE) return fallbackCategories.find((c) => c.id === id) || null;
  try {
    const url = `${API_BASE}/category/${id}`;
    const body = await fetchJson<any>(url);
    return body?.data || null;
  } catch (e) {
    console.warn("getCategoryById failed", e);
    return null;
  }
}

export async function createCategory(data: { name: string; description?: string | null }): Promise<Category | null> {
  if (!API_BASE) return fallbackCreateCategory(data);
  try {
    const url = `${API_BASE}/category`;
    const body = await fetchJson<any>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return body?.data || body || null;
  } catch (e) {
    console.warn("createCategory: fallback", e);
    return fallbackCreateCategory(data);
  }
}

function fallbackCreateCategory(data: { name: string; description?: string | null }) {
  const id = fallbackCategories.length ? Math.max(...fallbackCategories.map((c) => c.id ?? 0)) + 1 : 1;
  const c = { id, name: data.name, description: data.description || "" } as Category;
  fallbackCategories.push(c);
  return c;
}

export async function deleteCategory(id: number): Promise<boolean> {
  if (!API_BASE) return fallbackDeleteCategory(id);
  try {
    const url = `${API_BASE}/category/${id}`;
    const res = await fetch(url, { method: "DELETE" });
    return res.ok;
  } catch (e) {
    console.warn("deleteCategory: fallback", e);
    return fallbackDeleteCategory(id);
  }
}

function fallbackDeleteCategory(id: number) {
  const idx = fallbackCategories.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  fallbackCategories.splice(idx, 1);
  return true;
}

export async function updateCategory(id: number, data: { name: string; description?: string | null }): Promise<Category | null> {
  if (!API_BASE) return fallbackUpdateCategory(id, data);
  try {
    const url = `${API_BASE}/category/${id}`;
    const body = await fetchJson<any>(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return body?.data || body || null;
  } catch (e) {
    console.warn("updateCategory: fallback", e);
    return fallbackUpdateCategory(id, data);
  }
}

function fallbackUpdateCategory(id: number, data: { name: string; description?: string | null }) {
  const idx = fallbackCategories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  fallbackCategories[idx].name = data.name;
  fallbackCategories[idx].description = data.description || "";
  return fallbackCategories[idx];
}
