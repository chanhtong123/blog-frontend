import type { PostDto } from "@/models/dtos";
import BlogDetailClient from "@/components/blog-detail-client";

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/post?page=0&size=100`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error("Failed to fetch posts:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    // Backend trả về data.content, không phải items
    const posts: PostDto[] = data?.data?.content ?? [];

    return posts.map((post) => ({
      slug: String(post.id),
    }));
  } catch (err) {
    console.error("Error in generateStaticParams:", err);
    return [];
  }
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  return <BlogDetailClient id={params.slug} />;
}
