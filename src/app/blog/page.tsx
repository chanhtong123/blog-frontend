// app/blog/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, Post, PagedResult } from "@/utils/blog";
import { getCategories } from "@/utils/category";
import { getTags } from "@/utils/tag";
import ProjectCard from "@/components/project-card";

const FALLBACK_IMAGE = "/image/blog-1.svg";

export default function BlogPageClient() {
  const [result, setResult] = useState<PagedResult<Post> | null>(null);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<number | undefined>();
  const [tag, setTag] = useState<string | undefined>();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const size = 6;

  const router = useRouter();

  // Fetch posts
  useEffect(() => {
    let mounted = true;
    getPosts(page, size, category, tag, q)
      .then((res) => {
        if (mounted) setResult(res);
      })
      .catch(() => mounted && setResult({ items: [], total: 0, page, size }));
    return () => {
      mounted = false;
    };
  }, [page, q, category, tag]);

  // Fetch categories & tags
  useEffect(() => {
    let mounted = true;
    getCategories()
      .then((c) => {
        if (c) {
          const validCategories = c.filter((x): x is { id: number; name: string } => x.id !== undefined);
          setCategories(validCategories);
        } else {
          setCategories([]);
        }
      })
  .catch(() => setCategories([]));
    getTags()
      .then((t) => {
        if (t) {
          const validTags = t.filter((x): x is { id: number; name: string } => x.id !== undefined);
          setTags(validTags);
        } else {
          setTags([]);
        }
      })
      .catch(() => setTags([]));

    return () => {
      mounted = false;
    };
  }, []);


  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Blog</h1>
        <div className="text-sm text-gray-600">
          {result ? `${result.total} posts` : ""}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Category */}
        <select
          value={category ?? ""}
          onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-1 border rounded"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => setTag(tag === t.name ? undefined : t.name)}
              className={`text-xs px-2 py-1 rounded ${
                tag === t.name ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>


        {/* Clear filters */}
        <button
          onClick={() => {
            setCategory(undefined);
            setTag(undefined);
            setQ("");
            setPage(0);
          }}
          className="text-sm text-gray-500"
        >
          Clear filters
        </button>
      </div>

      {/* Post list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(result?.items || []).map((p) => (
          <Link key={p.id} href={`/blog/${p.id}`} className="block">
            <ProjectCard
              img={p.thumbnailUrl || FALLBACK_IMAGE}
              title={p.title}
              excerpt={p.excerpt}
              date={p.createdAt}
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {result && result.total > result.size && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={result.page <= 0}
            className="rounded border px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="text-sm text-gray-600">
            Page {result.page + 1} of {Math.ceil(result.total / result.size)}
          </div>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={(result.page + 1) * result.size >= result.total}
            className="rounded border px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
