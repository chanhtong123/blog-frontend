"use client";

import { useParams } from "next/navigation";
import BlogDetailClient from "@/components/blog-detail-client";

export default function BlogSlugPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  return <BlogDetailClient slug={slug} />;
}
