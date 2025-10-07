"use client";
import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  Category,
} from "@/utils/category";
import ConfirmModal from "@/components/confirm-modal";

export default function AdminCategoryPage() {
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingCategoryDescription, setEditingCategoryDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // thêm state cho confirm modal
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    getCategories().then((c) => setCategories(c || []));
  }, []);

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      const created = await createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || null,
      });
      setCategories((c) => [...c, created as any]);
      setNewCategoryName("");
      setNewCategoryDescription("");
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleRenameCategory(e?: React.FormEvent) {
    e?.preventDefault();
    if (editingCategoryId == null) return;
    if (!editingCategoryName.trim()) return;
    setLoading(true);
    try {
      const updated = await updateCategory(editingCategoryId, {
        name: editingCategoryName.trim(),
        description: editingCategoryDescription.trim() || null,
      });
      setCategories((c) =>
        c.map((x) => (x.id === editingCategoryId ? (updated as any) : x))
      );
      setEditingCategoryId(null);
      setEditingCategoryName("");
      setEditingCategoryDescription("");
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCategory(id: number) {
    setLoading(true);
    try {
      await deleteCategory(id);
      setCategories((c) => c.filter((x) => x.id !== id));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid gap-4">
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Create Category</h2>
          <form onSubmit={handleCreateCategory} className="flex gap-2 mb-4">
            <input
              className="rounded border px-3 py-2"
              placeholder="Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input
              className="rounded border px-3 py-2"
              placeholder="Description"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-green-600 px-3 py-2 text-white"
            >
              Add
            </button>
          </form>

          <h2 className="font-semibold mb-2">Categories</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 border px-3 py-1 rounded"
              >
                {editingCategoryId === c.id ? (
                  <form
                    onSubmit={handleRenameCategory}
                    className="flex gap-2 items-center"
                  >
                    <input
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="rounded border px-2 py-1"
                    />
                    <input
                      value={editingCategoryDescription}
                      onChange={(e) =>
                        setEditingCategoryDescription(e.target.value)
                      }
                      className="rounded border px-2 py-1"
                    />
                    <button className="rounded bg-blue-600 px-2 py-1 text-white">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategoryId(null);
                        setEditingCategoryName("");
                        setEditingCategoryDescription("");
                      }}
                      className="rounded border px-2 py-1"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">
                        {c.description}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (c.id !== undefined) {
                          setEditingCategoryId(c.id);
                        } else {
                          setEditingCategoryId(null);
                        }
                        setEditingCategoryName(c.name);
                        setEditingCategoryDescription(c.description || "");
                      }}
                      className="text-blue-600"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id ?? null)}
                      className="text-red-600"
                    >
                      x
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ConfirmModal dùng chung */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) {
            handleDeleteCategory(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
