"use client";

import Link from "next/link";
import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getPosts, Post } from "@/utils/blog";
import { SkillCard } from "@/components/skill-card";
import { Squares2X2Icon } from "@heroicons/react/24/solid";

const FALLBACK_IMAGE = "/image/blog-1.svg";

export function Skills() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPosts(0, 6)
      .then((res) => {
        if (!mounted) return;
        setPosts(res.items || []);
      })
      .catch((e) => {
        console.error(e);
        if (!mounted) return;
        setError(String(e));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="px-8">
      <div className="container mx-auto mb-20 text-center">
        <Typography color="blue-gray" className="mb-2 font-bold uppercase">
          blog
        </Typography>
        <Typography variant="h1" color="blue-gray" className="mb-4">
          Latest posts
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full !text-gray-500 lg:w-10/12"
        >
          Read the latest articles, tutorials and updates. Click a card to
          view the full post.
        </Typography>
      </div>

      {loading && <div className="text-center text-gray-600">Loading posts…</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      <div className="container mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${ p.id}`} className="block">
            <SkillCard title={p.title} icon={Squares2X2Icon}>
              <div className="text-sm text-gray-600 mb-2">{p.createdAt ? new Date(p.createdAt).toDateString() : ""}</div>
              <div className="text-sm text-gray-700">{p.excerpt}</div>
            </SkillCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Skills;
