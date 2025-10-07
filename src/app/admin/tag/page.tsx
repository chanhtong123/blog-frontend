"use client";

import { useEffect, useState } from "react";
import { Tag, getTags, createTag, updateTag, deleteTag } from "@/utils/tag";

export default function AdminTagPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState<number | null>(null);
  const [editingTagNewName, setEditingTagNewName] = useState("");
  useEffect(() => {
    getTags().then((t) => setTags(t || []));
  }, []);

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setLoading(true);
    try {
      const created = await createTag(newTagName.trim());
    if (created) setTags((t) => Array.from(new Set([...t, created as any])) as any);
      setNewTagName("");
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleRenameTag(e?: React.FormEvent) {
    e?.preventDefault();
    if (!editingTag) return;
    if (!editingTagNewName.trim()) return;
    setLoading(true);
    try {
      const updated = await updateTag(String(editingTag), { name: editingTagNewName.trim() });
      setTags((t) => t.map((x) => (x.id === editingTag ? (updated as any) : x)));
      setEditingTag(null);
      setEditingTagNewName("");
      
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTag(id: number) {
    if (!confirm("Delete this tag?")) return;
    setLoading(true);
    try {
      await deleteTag(String(id));
      setTags((t) => t.filter((x) => x.id !== id));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Tags</h1>
      </div>
      <div className="grid gap-4">
              <section className="mb-6">
        <h2 className="font-semibold mb-2">Tags</h2>
        <div className="flex gap-2 mb-4">
          <input className="rounded border px-3 py-2" placeholder="New tag" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
          <button onClick={handleCreateTag} className="rounded bg-green-600 px-3 py-2 text-white">Add</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 border px-3 py-1 rounded">
              {editingTag === tag.id ? (
                <form onSubmit={handleRenameTag} className="flex gap-2 items-center">
                  <input value={editingTagNewName} onChange={(e) => setEditingTagNewName(e.target.value)} className="rounded border px-2 py-1" />
                  <button className="rounded bg-blue-600 px-2 py-1 text-white">Save</button>
                  <button type="button" onClick={() => { setEditingTag(null); setEditingTagNewName(""); }} className="rounded border px-2 py-1">Cancel</button>
                </form>
              ) : (
                <>
                  <div className="flex flex-col">
                    <div className="font-medium">{tag.name}</div>
                  </div>
                  <button onClick={() => { setEditingTag(tag.id ?? null); setEditingTagNewName(tag.name); }} className="text-blue-600">edit</button>
                  <button onClick={() => handleDeleteTag(tag.id ?? 0)} className="text-red-600">x</button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
