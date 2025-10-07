"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProjectCard from "@/components/project-card";
import { getPosts, Post } from "@/utils/blog";

const FALLBACK_IMAGE = "/image/blog-1.svg";
export function Projects() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let mounted = true;
    getPosts(0, 8)
      .then((res) => {
        if (!mounted) return;
        setPosts(res.items || []);
      })
      .catch((e) => console.error(e));
    return () => {
      mounted = false;
    };
  }, []);

  return (
      <section className="py-28 px-8">
      <div className="container mx-auto mb-20 text-center"></div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-4">
          {posts.map((p) => (
            <div key={p.id} className="block">
              <Link href={`/blog/${p.slug || p.id}`} className="block">
                <ProjectCard
                  img={p.thumbnailUrl || FALLBACK_IMAGE}
                  date={p.date}
                  excerpt={p.excerpt}           
                  title={p.title}
                />
              </Link>          
            </div>
          ))}
      </div>
    </section>
  );
}

export default Projects;
