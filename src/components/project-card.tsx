import Image from "next/image";
import { Card, CardHeader, CardBody, Button } from "@material-tailwind/react";

interface ProjectCardProps {
  title: string;
  img: string;
  excerpt?: string;
  date?: string;
}

export function ProjectCard({ img, title, excerpt }: ProjectCardProps) {
  const stripHtml = (s: string) =>
    s ? s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : "";
  const truncate = (s: string, n = 140) =>
    s.length > n ? s.slice(0, n).trimEnd() + "…" : s;
  const clean = truncate(stripHtml(excerpt || ""), 140);

  return (
    <Card color="white" shadow={false} className="max-w-sm bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader floated={false} className="relative mx-0 mt-0 mb-6 h-48 overflow-hidden">
        <Image
          src={img || "/placeholder.jpg"}
          alt={title}
          fill
          sizes="100vw"
          unoptimized
          className="object-cover"
        />
      </CardHeader>
      <CardBody className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{clean}</p>
        <Button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Read more
        </Button>
      </CardBody>
    </Card>
  );
}

export default ProjectCard;
