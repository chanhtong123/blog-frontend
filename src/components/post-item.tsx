import React from "react";
import type { Post } from "@/utils/blog";

export default function PostItem({
  post,
  onEdit,
  onDelete,
}: {
  post: Post;
  onEdit: (p: Post) => void;
  onDelete: (id: number) => void;
}) {
  // Màu border theo trạng thái
  const statusBorder =
    post.status === "DELETED"
      ? "border-red-400 bg-red-50 dark:bg-red-900/30"
      : post.status === "DRAFT"
      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
      : post.status === "POSTED"
      ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
      : "border-gray-300 dark:border-gray-700";

  return (
    <div
      className={`border rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200 ${statusBorder}`}
    >
      {/* Ảnh thumbnail */}
      {post.thumbnailUrl && (
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
      )}

      {/* Tiêu đề & trích đoạn */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
          {post.title || "Untitled"}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {post.excerpt || "No description available"}
        </p>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleString()
            : "No date"}
        </div>

        {post.category && (
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mt-2 inline-block px-2 py-1 rounded">
            {post.category.name}
          </span>
        )}
      </div>

      {/* Nút thao tác */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onEdit(post)}
          className="flex-1 py-1.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Edit
        </button>
        {post.status !== "DELETED" && (
          <button
            onClick={() => onDelete(post.id)}
            className="flex-1 py-1.5 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
