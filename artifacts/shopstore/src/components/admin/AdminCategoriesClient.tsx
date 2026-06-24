"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Upload, X, Store, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useSiteStore } from "@/store/site";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  bannerImage: string | null;
}

interface FormData {
  name: string;
  description: string;
  image: string;
  bannerImage: string;
}

const defaultForm: FormData = {
  name: "",
  description: "",
  image: "",
  bannerImage: "",
};

export function AdminCategoriesClient({ categories: serverCategories }: { categories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(serverCategories);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { settings } = useSiteStore();

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditCategory(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditCategory(c);
    setForm({
      name: c.name,
      description: c.description ?? "",
      image: c.image ?? "",
      bannerImage: c.bannerImage ?? "",
    });
    setModalOpen(true);
  };

  const onDropImage = useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm((f) => ({ ...f, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onDropBanner = useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm((f) => ({ ...f, bannerImage: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps: getImageProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: onDropImage, accept: { "image/*": [] }, multiple: false,
  });

  const { getRootProps: getBannerProps, getInputProps: getBannerInputProps } = useDropzone({
    onDrop: onDropBanner, accept: { "image/*": [] }, multiple: false,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editCategory ? "PATCH" : "POST";
      const url = editCategory ? `/api/admin/categories/${editCategory.id}` : "/api/admin/categories";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      if (editCategory) {
        setCategories((prev) => prev.map((c) => (c.id === editCategory.id ? saved : c)));
        toast.success("Category updated!");
      } else {
        setCategories((prev) => [...prev, saved]);
        toast.success("Category added!");
      }
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to save category");
    }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Category deleted");
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Failed to delete category");
    }
    setDeleting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} total categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white font-medium rounded-xl text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Store size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                            <Store size={16} />
                          </div>
                        )}
                        <span className="font-medium text-gray-900 text-sm">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                      {category.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(category)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(category)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">{editCategory ? "Edit Category" : "Add New Category"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                    placeholder="e.g. Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                    placeholder="Describe this category..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
                    <div
                      {...getImageProps()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                        form.image ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input {...getImageInputProps()} />
                      {form.image ? (
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden group">
                          <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload size={20} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="py-4">
                          <ImageIcon size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Drop image or click</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                    <div
                      {...getBannerProps()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                        form.bannerImage ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input {...getBannerInputProps()} />
                      {form.bannerImage ? (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden group">
                          <img src={form.bannerImage} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload size={20} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="py-4">
                          <ImageIcon size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Drop banner or click</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 text-white font-medium rounded-xl text-sm transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {editCategory ? "Update Category" : "Add Category"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
