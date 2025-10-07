"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, Post, PagedResult } from "@/utils/blog";
import { getCategories } from "@/utils/category";
import { getTags } from "@/utils/tag";
import ProjectCard from "@/components/project-card";

const FALLBACK_IMAGE = "/image/blog-1.svg";

export default function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [result, setResult] = useState<PagedResult<Post> | null>(null);
  const [page, setPage] = useState(0);
  const router = useRouter();

  // lấy query params từ Next.js
  const q = typeof searchParams.search === "string" ? searchParams.search : "";
  const tag = typeof searchParams.tag === "string" ? searchParams.tag : undefined;
  const category =
    typeof searchParams.category === "string"
      ? Number(searchParams.category)
      : undefined;

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const size = 6;

  useEffect(() => {
    let mounted = true;
    getPosts(page, size, category, tag, q)
      .then((res) => {
        if (!mounted) return;
        setResult(res);
      })
      .catch((e) => {
        console.error(e);
        if (mounted) setResult({ items: [], total: 0, page, size });
      });
    return () => {
      mounted = false;
    };
  }, [page, q, tag, category]);

  useEffect(() => {
    let mounted = true;
    getCategories()
      .then((c) => mounted && setCategories(c || []))
      .catch(() => mounted && setCategories([]));
    getTags()
      .then((t) => mounted && setTags(t || []))
      .catch(() => mounted && setTags([]));
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

      {/* Bộ lọc */}
      <div className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={category ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              const params = new URLSearchParams(searchParams as any);
              if (v) params.set("category", v);
              else params.delete("category");
              router.push(`/blog?${params.toString()}`);
            }}
            className="px-3 py-1 border rounded"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2 items-center flex-wrap">
            {tags.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  const params = new URLSearchParams(searchParams as any);
                  params.set("tag", t.name);
                  router.push(`/blog?${params.toString()}`);
                }}
                className={`text-xs px-2 py-1 rounded ${
                  tag === t.name ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {t.name}
                {tag === t.name && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      const params = new URLSearchParams(searchParams as any);
                      params.delete("tag");
                      router.push(`/blog?${params.toString()}`);
                    }}
                    className="ms-2 text-xs"
                  >
                    ×
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <button
              onClick={() => {
                router.push(`/blog`);
              }}
              className="text-sm text-gray-500"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách blog */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(result?.items || []).map((p) => {
          const cat = categories.find((c) => c.id === p.categoryId);
          return (
            <div key={p.id} className="block">
              <Link href={`/blog/${p.slug || p.id}`} className="block">
                <ProjectCard
                  img={p.thumbnailUrl || FALLBACK_IMAGE}
                  date={p.createdAt}
                  excerpt={p.excerpt}
                  title={p.title}
                />
              </Link>
            </div>
          );
        })}
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
            Page {result.page + 1} of{" "}
            {Math.max(1, Math.ceil(result.total / result.size))}
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
