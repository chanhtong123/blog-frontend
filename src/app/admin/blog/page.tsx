"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  createPost,
  deletePost,
  getPostsAdmin,
  updatePost,
} from "@/utils/blog";
import { getCategories } from "@/utils/category";
import { getTags } from "@/utils/tag";
import PostItem from "@/components/post-item";
import ConfirmModal from "@/components/confirm-modal";
import type { PostStatus, PostDto, CategoryDto, TagDto, PostRequest } from "@/models/dtos";

let ReactQuill: any = null;
try {
  ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
  require("react-quill/dist/quill.snow.css");
} catch {
  ReactQuill = null;
}

export default function AdminBlogPage() {
  const [result, setResult] = useState<{
    items: PostDto[];
    total: number;
    page: number;
    size: number;
  } | null>(null);

  const [page, setPage] = useState(0);
  const size = 10;

  const [editing, setEditing] = useState<PostDto | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("");
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<PostStatus | "ALL">("ALL");
  const [status, setStatus] = useState<PostStatus>("DRAFT");


  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const effectiveStatus = filterStatus === "ALL" ? undefined : filterStatus;
      const res = await getPostsAdmin(page, size, undefined, undefined, undefined, effectiveStatus);
      setResult(res as any);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    refresh();
    getCategories().then((c) => setCategories(c || []));
    getTags().then((t) => setTags(t || []));
  }, [refresh]);

  async function startEdit(p?: PostDto) {
    if (p) {
      setEditing(p);
      setTitle(p.title || "");
      setExcerpt(p.excerpt || "");
      setContent(p.content || "");
      setCategoryId(p.category?.id);
      setThumbnailUrl(p.thumbnailUrl || "");
      setDate(p.createdAt ? p.createdAt.substring(0, 16) : "");
      setAuthor(p.author || "");
      setStatus(p.status ?? "DRAFT");
      const postTagIds = (p.tags || []).map((t) => String(t.id));
      setSelectedTags(postTagIds);
    } else {
      setEditing(null);
      setTitle("");
      setExcerpt("");
      setContent("");
      setCategoryId(undefined);
      setSelectedTags([]);
      setThumbnailUrl("");
      setDate("");
      setAuthor("");
      setStatus("DRAFT");
    }
    setModalOpen(true);
  }

  async function handleSave(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: Partial<PostRequest> = {
        title,
        excerpt,
        content,
        thumbnailUrl,
        createdAt: date || new Date().toISOString(),
        status,
        author,
        tagIds: selectedTags.map((id) => Number(id)),
        categoryId,
      };

      if (editing) await updatePost(editing.id, payload);
      else await createPost(payload);


      setModalOpen(false);
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(id: number) {
    setLoading(true);
    try {
      await deletePost(id);
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-3 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">Manage Post</h1>
        <button
          onClick={() => startEdit()}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Create New Post
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <label className="text-sm font-medium">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as PostStatus | "ALL")}
          className="border rounded px-3 py-1"
        >
          <option value="ALL">All</option>
          <option value="DRAFT">Draft</option>
          <option value="POSTED">Posted</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full sm:w-[95%] max-w-4xl bg-white rounded-lg shadow p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">
              {editing ? "Edit Post" : "Create Post"}
            </h3>

            <form onSubmit={handleSave} className="grid gap-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="rounded border px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input className="rounded border px-3 py-2" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>

              <input className="rounded border px-3 py-2" placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

              <div className="grid sm:grid-cols-2 gap-3">
                <input className="rounded border px-3 py-2" placeholder="Thumbnail URL" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
                <input type="datetime-local" className="rounded border px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="border rounded overflow-hidden h-56">
                <ReactQuill value={content} onChange={setContent} style={{ height: "100%" }} />
              </div>



              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1">Category</label>
                  <select
                    value={categoryId || ""}
                    onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                    className="rounded border px-3 py-2 w-full"
                  >
                    <option value="">-- No category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 border rounded px-2 py-2 min-h-[44px]">
                    {selectedTags.map((tid) => {
                      const tag = tags.find((t) => String(t.id) === tid);
                      return (
                        <div key={tid} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {tag?.name}
                          <button
                            type="button"
                            onClick={() => setSelectedTags((s) => s.filter((x) => x !== tid))}
                            className="ml-2 text-blue-600 hover:text-red-600"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                    <div className="relative">
                      <button
                        type="button"
                        className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                        onClick={() => setTagDropdownOpen((o) => !o)}
                      >
                        + Add
                      </button>
                      {tagDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-40 bg-white border rounded shadow-lg z-10 max-h-40 overflow-auto">
                          {tags.map((tg) => {
                            const tid = String(tg.id);
                            const selected = selectedTags.includes(tid);
                            return (
                              <button
                                key={tg.id}
                                type="button"
                                disabled={selected}
                                onClick={() => {
                                  if (!selected) setSelectedTags((s) => [...s, tid]);
                                  setTagDropdownOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-1 text-sm ${selected
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "hover:bg-blue-100"
                                  }`}
                              >
                                {tg.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className="rounded border px-3 py-2 w-full"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="POSTED">Posted</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded border px-4 py-2"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="mt-6">
        <h2 className="font-semibold mb-4">Posts</h2>
        {loading && <div className="text-gray-600">Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result?.items?.length ? (
            result.items.map((p) => (
              <PostItem
                key={p.id}
                post={p}
                onEdit={startEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))
          ) : (
            <div className="text-gray-600 col-span-full text-center">No posts</div>
          )}
        </div>
      </section>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Post"
        description="Are you sure you want to delete this post?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) {
            handleDeletePost(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </main>
  );
}
