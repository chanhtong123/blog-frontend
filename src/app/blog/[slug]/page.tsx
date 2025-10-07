"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostById, Post } from "@/utils/blog";
import RelatedPosts from "@/components/related-posts";
import { getCategoryById, Category } from "@/utils/category";
import Comments from "@/components/comment";

export default function BlogDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [post, setPost] = useState<Post | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Post ID not found");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    const fetchPost = async () => {
      try {
        const found = await getPostById(id);
        if (!mounted) return;

        if (!found) {
          setError("Post not found");
          return;
        }

        setPost(found);

        if (found.category?.id) {
          const cat = await getCategoryById(found.category.id);
          if (mounted) setCategory(cat);
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPost();

    return () => {
      mounted = false;
    };
  }, [id]);

  // Loading / Error / No post
  if (loading || (!post && !error)) {
    return <div className="container mx-auto py-12">{loading ? "Loading…" : "No post found."}</div>;
  }

  if (error) {
    return <div className="container mx-auto py-12 text-red-600">{error}</div>;
  }

  // Destructure post with fallback để tránh TS warning
  const {
    title = "",
    createdAt = "",
    thumbnailUrl,
    content = "",
    tags = [],
    category: postCategory,
    comments = [],
    id: postId,
  } = post || {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-sm text-gray-600 mb-2">
        {category?.name ? `${category.name} / ${title}` : `Thế giới / ${title}`}
      </div>

      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="text-sm text-gray-600 mb-6">
        {createdAt ? new Date(createdAt).toLocaleString() : ""}
      </div>

      {thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full max-h-96 object-cover mb-6 rounded"
        />
      )}

      <article
        className="prose prose-lg max-w-none overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="mt-6 flex gap-2 flex-wrap">
        {tags.map((t, index) => (
          <span key={t.id ?? index} className="text-xs px-2 py-1 bg-gray-100 rounded">
            #{t.name}
          </span>
        ))}
      </div>

      {postCategory?.id && (
        <RelatedPosts categoryId={postCategory.id} excludeId={postId} />
      )}

      {postId !== undefined && (
        <Comments postId={postId} initialComments={comments} />
      )}
    </main>
  );
}
