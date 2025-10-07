"use client";

import ProjectCard from "./project-card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, Post } from "@/utils/blog";
const FALLBACK_IMAGE = "/image/blog-1.svg";

export default function RelatedPosts({ categoryId, excludeId, limit = 3 }: { categoryId?: number; excludeId?: number; limit?: number }) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let mounted = true;
    if (!categoryId) return;
    getPosts(0, Math.max(4, limit + 1), categoryId)
      .then((res) => {
        if (!mounted) return;
        const items = (res.items || []).filter((p) => String(p.id) !== String(excludeId)).slice(0, limit);
        setPosts(items);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [categoryId, excludeId, limit]);

  if (!categoryId || !posts.length) return null;

  return (
    <div className="mt-3 border-t pt-3">
      <div className="text-sm text-gray-600 mb-2">Related posts</div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
            <div key={p.id} className="block">
              <Link href={`/blog/${p.id}`} className="block">
                <ProjectCard
                  img={p.thumbnailUrl || FALLBACK_IMAGE}
                  date={p.createdAt}
                  excerpt={p.excerpt}           
                  title={p.title}
                />
              </Link>          
            </div>
        ))}
      </div>
      <div className="mt-2">
        <Link href={`/blog?category=${categoryId}`} className="text-sm text-gray-500 hover:underline">View more</Link>
      </div>
    </div>
  );
}
