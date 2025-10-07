export type PostStatus = "ALL" | "DRAFT" | "POSTED" | "DELETED";

export const POST_STATUSES: { value: PostStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "POSTED", label: "Posted" },
  { value: "DELETED", label: "Deleted" },
];

export type PostDto = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt?: string;
  author: string;
  category?: CategoryDto;
  tags?: TagDto[];
  comments?: CommentDto[];
};

export type PostRequest = {
  title: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  thumbnailUrl?: string;
  author: string;
  categoryId?: number;
  tagIds?: number[];
  createdAt?: string;
  updatedAt?: string;
};


export type CategoryDto = {
  id?: number;
  name: string;
  description?: string;
};

export type TagDto = {
  id?: number;
  name: string;
};

export type CommentDto = {
  id: number;
  content: string;
  authorName?: string;
  createdAt?: string;
};

export type PagedResultDto<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};
