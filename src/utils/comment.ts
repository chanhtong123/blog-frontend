import type { CommentDto } from "@/models/dtos";

export type Comment = CommentDto;

// ✅ Luôn có giá trị mặc định hợp lệ
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ||
  "http://localhost:8080/api/v1";

// ✅ Hàm fetch có log debug để dễ trace
async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const url = input.startsWith("http") ? input : `${API_BASE}${input}`;
  console.log("🔹 Fetching:", url, init?.method ?? "GET");

  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

/** 🔹 Lấy danh sách comment theo postId */
export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  if (!postId) {
    console.warn("⚠️ getCommentsByPostId: postId is invalid:", postId);
    return [];
  }

  try {
    const url = `${API_BASE}/posts/${postId}/comments`;
    const body = await fetchJson<any>(url);

    if (Array.isArray(body)) return body;
    if (Array.isArray(body?.data)) return body.data;
    if (Array.isArray(body?.data?.comments)) return body.data.comments;
    return [];
  } catch (e) {
    console.warn("getCommentsByPostId failed:", e);
    return [];
  }
}

/** 🔹 Tạo mới comment */
export async function createComment(
  postId: number,
  input: { content: string; authorName?: string }
): Promise<Comment | null> {
  if (!postId) {
    console.warn("⚠️ createComment: postId is invalid:", postId);
    return null;
  }

  try {
    const url = `${API_BASE}/posts/${postId}/comments`;
    const body = await fetchJson<any>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return body?.data || body || null;
  } catch (e) {
    console.warn("createComment failed:", e);
    return null;
  }
}

/** 🔹 Xóa comment */
export async function deleteComment(postId: number, commentId: number): Promise<boolean> {
  if (!postId || !commentId) {
    console.warn("⚠️ deleteComment: invalid params", { postId, commentId });
    return false;
  }

  try {
    const url = `${API_BASE}/posts/${postId}/comments/${commentId}`;
    const res = await fetch(url, { method: "DELETE" });
    return res.ok;
  } catch (e) {
    console.warn("deleteComment failed:", e);
    return false;
  }
}
