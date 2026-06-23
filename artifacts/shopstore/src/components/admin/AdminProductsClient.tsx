"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Upload, Loader2, Sparkles, X, Package } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { formatPrice } from "@/lib/utils";
import { useSiteStore } from "@/store/site";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { CustomSelect } from "@/components/ui/custom-select";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface Category { id: number; name: string; slug: string }
interface Product {
  id: number; name: string; slug: string; price: string; originalPrice?: string | null;
  images: string[] | null; stock: number | null; featured: boolean | null;
  trending: boolean | null; categoryId?: number | null; category?: Category | null;
  description?: string | null;
}

interface FormData {
  name: string; price: string; originalPrice: string; stock: string;
  categoryId: string; description: string; featured: boolean; trending: boolean;
  images: string[];
}

const defaultForm: FormData = {
  name: "", price: "", originalPrice: "", stock: "1",
  categoryId: "", description: "", featured: false, trending: false, images: [],
};

export function AdminProductsClient({ products: serverProducts, categories: serverCategories }: { products: Product[]; categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(serverProducts);
  const categories = serverCategories;
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { settings } = useSiteStore();

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const categoryOptions = [{ value: "", label: "Select category", description: "Choose where this product belongs" }, ...categories.map((category) => ({ value: String(category.id), label: category.name }))];

  const openAdd = () => { setEditProduct(null); setForm(defaultForm); setUploadedImages([]); setModalOpen(true); };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name, price: p.price, originalPrice: p.originalPrice ?? "",
      stock: String(p.stock ?? 1), categoryId: String(p.categoryId ?? ""),
      description: p.description ?? "", featured: p.featured ?? false,
      trending: p.trending ?? false, images: (p.images as string[]) ?? [],
    });
    setUploadedImages((p.images as string[]) ?? []);
    setModalOpen(true);
  };

  const onDrop = useCallback((accepted: File[]) => {
    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedImages((prev) => [...prev, dataUrl]);
        setForm((f) => ({ ...f, images: [...f.images, dataUrl] }));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [] }, multiple: true,
  });

  const generateDescription = async () => {
    if (uploadedImages.length === 0) {
      toast.error("Select an image so AI can scan it first");
      return;
    }
    setGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: form.name, imageUrl: uploadedImages[0], categories }),
      });
      const data = await res.json();
      if (data.product) {
        setForm((f) => ({
          ...f,
          name: data.product.name ?? f.name,
          description: data.product.description ?? f.description,
          price: data.product.price ? String(data.product.price) : f.price,
          originalPrice: data.product.originalPrice ? String(data.product.originalPrice) : f.originalPrice,
          stock: data.product.stock ? String(data.product.stock) : f.stock,
          categoryId: data.product.categoryId ? String(data.product.categoryId) : f.categoryId,
          featured: typeof data.product.featured === "boolean" ? data.product.featured : f.featured,
          trending: typeof data.product.trending === "boolean" ? data.product.trending : f.trending,
        }));
        toast.success("AI scanned the image and filled product details!");
      } else if (data.description) {
        setForm((f) => ({ ...f, description: data.description }));
        toast.success("AI description generated!");
      }
    } catch {
      toast.error("Failed to generate product details");
    }
    setGeneratingAI(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editProduct ? "PATCH" : "POST";
      const url = editProduct ? `/api/admin/products/${editProduct.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images: uploadedImages }),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      const savedWithCategory = { ...saved, category: categories.find((c) => c.id === Number(form.categoryId)) ?? null };
      if (editProduct) {
        setProducts((p) => p.map((prod) => prod.id === editProduct.id ? savedWithCategory : prod));
        toast.success("Product updated!");
      } else {
        setProducts((p) => [...p, savedWithCategory]);
        toast.success("Product added!");
      }
      setModalOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const previousProducts = products;
    setProducts((p) => p.filter((prod) => prod.id !== deleteTarget.id));
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch {
      setProducts(previousProducts);
      toast.error("Failed to delete product");
    }
    setDeleting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-white font-medium rounded-xl text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: settings.primaryColor }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={(product.images as string[])?.[0] ?? ""} alt={product.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100"  />
                        <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{product.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900 text-sm">{formatPrice(parseFloat(product.price))}</span>
                      {product.originalPrice && <span className="text-gray-400 text-xs line-through ml-1">{formatPrice(parseFloat(product.originalPrice))}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${(product.stock ?? 0) > 5 ? "text-green-700" : (product.stock ?? 0) > 0 ? "text-yellow-700" : "text-red-700"}`}>
                        {product.stock ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {product.featured && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Featured</span>}
                        {product.trending && <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">Trending</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(product)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-2xl my-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">{editProduct ? "Edit Product" : "Add New Product"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={18} /></button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20" placeholder="e.g. Product name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price *</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price</label>
                    <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock *</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
<CustomSelect value={form.categoryId} options={categoryOptions} onChange={(value) => setForm((f) => ({ ...f, categoryId: value }))} placeholder="Select category" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <button type="button" onClick={generateDescription} disabled={generatingAI} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors" style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}>
                      {generatingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      {generatingAI ? "Generating..." : "AI Generate"}
                    </button>
                  </div>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" placeholder="Describe your product..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Images</label>
                  <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input {...getInputProps()} />
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{isDragActive ? "Drop images here" : "Drag & drop or click to upload"}</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative shrink-0">
                          <img src={img} className="w-16 h-16 object-cover rounded-xl border" alt="" />
                          <button type="button" onClick={() => { setUploadedImages((prev) => prev.filter((_, idx) => idx !== i)); setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) })); }} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  {[
                    { key: "featured", label: "Featured" },
                    { key: "trending", label: "Trending" },
                  ].map(({ key, label }) => (
                    <ToggleSwitch
                      key={key}
                      checked={Boolean(form[key as keyof FormData])}
                      onChange={(checked) => setForm((f) => ({ ...f, [key]: checked }))}
                      label={label}
                    />
                  ))}
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-70" style={{ backgroundColor: settings.primaryColor }}>
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    {saving ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete product?"
        description={`This will permanently remove ${deleteTarget?.name ?? "this product"} from your catalog.`}
        confirmLabel="Delete Product"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
