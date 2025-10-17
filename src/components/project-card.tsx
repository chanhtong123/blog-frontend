import Image from "next/image";
import { Card, CardHeader, CardBody, Button } from "@material-tailwind/react";

interface ProjectCardProps {
  title: string;
  img: string;
  excerpt?: string;
  date?: string;
}

export function ProjectCard({ img, title, excerpt, date }: ProjectCardProps) {
  const stripHtml = (s: string) =>
    s ? s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : "";
  const truncate = (s: string, n = 140) =>
    s.length > n ? s.slice(0, n).trimEnd() + "…" : s;
  const clean = truncate(stripHtml(excerpt || ""), 140);

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  return (
    <Card className="max-w-sm overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      {/* Header Image */}
      <CardHeader
        floated={false}
        shadow={false}
        className="relative h-52 overflow-hidden rounded-none"
      >
        <Image
          src={img || "/placeholder.jpg"}
          alt={title}
          fill
          sizes="100vw"
          unoptimized
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </CardHeader>

      {/* Content */}
      <CardBody className="px-5 py-6">
        {/* Date */}
        {formattedDate && (
          <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {formattedDate}
          </p>
        )}

        {/* Title */}
        <h5 className="mb-3 text-xl font-semibold leading-snug text-gray-900 dark:text-white">
          {title}
        </h5>

        {/* Description */}
        <p className="mb-5 text-gray-600 dark:text-gray-300">{clean}</p>

        {/* Button */}
        <Button
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          ripple={false}
        >
          Read More
        </Button>
      </CardBody>
    </Card>
  );
}

export default ProjectCard;
