"use client";

import { useEffect, useState } from "react";
import { getPostBySlug } from "@/utils/blog";
import RelatedPosts from "@/components/related-posts";
import Comments from "@/components/comment";

export default function BlogDetailClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getPostBySlug(slug)
      .then((p) => {
        if (!mounted) return;
        if (!p) setError("Post not found");
        else setPost(p);
      })
      .catch((e) => mounted && setError(String(e)))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return <div className="container mx-auto py-12">Loading…</div>;
  if (error || !post)
    return <div className="container mx-auto py-12 text-red-600">{error}</div>;

  // --- xử lý nội dung YouTube ---
  const content = post.content || "";
  const youtubeRegex =
    /(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+)/;
  const match = content.match(youtubeRegex);
  const youtubeLink = match ? match[0] : null;
  const youtubeEmbed = youtubeLink
    ? youtubeLink.replace("watch?v=", "embed/")
    : null;
  const filteredContent = youtubeLink ? content.replace(youtubeLink, "") : content;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-sm text-gray-600 mb-2">
        {post.category?.name
          ? `${post.category.name} / ${post.title}`
          : `Thế giới / ${post.title}`}
      </div>

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-sm text-gray-600 mb-6">
        {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
      </div>

      {/* ✅ Chỉ chỉnh phần này */}
      <article className="prose prose-lg max-w-none overflow-x-auto">
        {youtubeEmbed && (
          <div className="my-4 aspect-video">
            <iframe
              src={youtubeEmbed}
              title="YouTube video"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full rounded-2xl shadow"
            />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: filteredContent }} />
      </article>
      {/* ✅ hết phần chỉnh */}

      <div className="mt-6 flex gap-2 flex-wrap">
        {post.tags?.map((t: any, idx: number) => (
          <span key={t.id ?? idx} className="text-xs px-2 py-1 bg-gray-100 rounded">
            #{t.name}
          </span>
        ))}
      </div>

      {post.category?.id && (
        <RelatedPosts categoryId={post.category.id} excludeId={post.id} />
      )}

      {post.id && <Comments postId={post.id} initialComments={post.comments ?? []} />}
    </main>
  );
}
