"use client";

import { useState } from "react";
import type { CommentDto } from "@/models/dtos";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ||
  "http://localhost:8080/api/v1";

export default function Comments({
  postId,
  initialComments = [],
}: {
  postId: number;
  initialComments?: CommentDto[];
}) {
  const [comments, setComments] = useState<CommentDto[]>(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /** 🔹 Xử lý gửi comment */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: authorName || "Ẩn danh", content }),
      });

      if (!res.ok) throw new Error(`❌ ${res.status} ${res.statusText}`);

      const body = await res.json();
      const newComment: CommentDto =
        body?.data || body || { id: Date.now(), content, authorName, createdAt: new Date().toISOString() };

      // ✅ Cập nhật danh sách bình luận
      setComments((prev) => [newComment, ...prev]);
      setContent("");
      setAuthorName("");
    } catch (err) {
      console.error("Create comment failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-4">Bình luận</h2>

      {/* 🔹 Form nhập bình luận */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Write your comment here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded px-3 py-2 h-24"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Pending" : "Comment"}
        </button>
      </form>

      {/* 🔹 Danh sách bình luận */}
      {comments.length === 0 ? (
        <p className="text-gray-500"></p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="border rounded p-4 bg-gray-50">
              <div className="font-semibold">{c.authorName || "Ẩn danh"}</div>
              <div className="text-sm text-gray-600">
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString("vi-VN")
                  : ""}
              </div>
              <p className="mt-2 whitespace-pre-wrap">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
