import React from "react";
import type { Post } from "@/utils/blog";

export function PostItem({
  post,
  onEdit,
  onDelete,
}: {
  post: Post;
  onEdit: (p: Post) => void;
  onDelete: (id: number) => void;
}) {
  // Đổi màu card theo status
  const status =
    post.status === "DELETED"
      ? "order-red-500"
      : post.status === "DRAFT"
      ? "border-yellow-500"
      : post.status === "POSTED"
      ? "border-blue-500"
      : "border-gray-500";

  return (
    <div 
      className={`border rounded p-3 flex flex-col justify-between min-h-[180px] ${status}`}
    >
      <div className="flex flex-col flex-1">
        <div className="font-medium line-clamp-2">{post.title || "No title"}</div>

        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
          {post.excerpt || "No description available"}
        </div>

        <div className="text-xs text-gray-400 mt-2">
          {post.createdAt ? new Date(post.createdAt).toLocaleString() : "No date"}
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={() => onEdit(post)} className="text-blue-600">
          Edit
        </button>
        {post.status !== "DELETED" && (
          <button onClick={() => onDelete(post.id)} className="text-red-600">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default PostItem;
