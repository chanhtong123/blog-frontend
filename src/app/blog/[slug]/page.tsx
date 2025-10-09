import BlogDetailClient from "@/components/blog-detail-client";

// ✅ Buộc Next.js render động, không build sẵn từng slug
export const dynamic = "force-dynamic"; 
export const revalidate = 0; // (optional) tắt cache hoàn toàn

export default function BlogPage({ params }: { params: { slug: string } }) {
  return <BlogDetailClient id={params.slug} />;
}
