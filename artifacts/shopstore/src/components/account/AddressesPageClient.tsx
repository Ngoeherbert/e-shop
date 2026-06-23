"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface Address {
  id: number;
  label: string;
  fullName: string;
  phone?: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
}

export function AddressesPageClient() {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, label: "Home", fullName: "Jane Doe", phone: "+1 555 123 4567", street: "123 Main Street", city: "New York", country: "United States", isDefault: true },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [form, setForm] = useState({ label: "Home", fullName: "", phone: "", street: "", city: "", country: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses((prev) => [...prev, { id: Date.now(), ...form, isDefault: prev.length === 0 }]);
    setForm({ label: "Home", fullName: "", phone: "", street: "", city: "", country: "" });
    setShowForm(false);
    toast.success("Address added!");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setAddresses((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Address removed");
  };

  const handleSetDefault = (id: number) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Addresses</h1>
          <p className="text-gray-500 text-sm">Manage your saved delivery addresses.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
          <Plus size={16} /> Add Address
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {addresses.map((addr) => (
            <motion.div key={addr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className={`bg-white border rounded-2xl p-5 ${addr.isDefault ? "border-gray-900" : "border-gray-100"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl mt-0.5">
                    <MapPin size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{addr.label}</span>
                      {addr.isDefault && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Default</span>}
                    </div>
                    <p className="text-sm text-gray-700">{addr.fullName}</p>
                    {addr.phone && <p className="text-sm text-gray-500">{addr.phone}</p>}
                    <p className="text-sm text-gray-600 mt-1">{addr.street}, {addr.city}, {addr.country}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)} className="p-2 text-gray-400 hover:text-yellow-500 transition-colors" title="Set as default">
                      <Star size={16} />
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(addr)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-gray-900 mb-5">Add Address</h2>
              <form onSubmit={handleAdd} className="space-y-3">
                {[
                  { label: "Label", key: "label", placeholder: "Home, Work..." },
                  { label: "Full Name", key: "fullName", placeholder: "Jane Doe" },
                  { label: "Phone", key: "phone", placeholder: "+1 (555) 123-4567" },
                  { label: "Street", key: "street", placeholder: "123 Main St" },
                  { label: "City", key: "city", placeholder: "New York" },
                  { label: "Country", key: "country", placeholder: "United States" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input
                      type="text"
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required={key !== "phone"}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">Save Address</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Remove address?"
        description={`This will remove ${deleteTarget?.label ?? "this address"} from your saved delivery addresses.`}
        confirmLabel="Remove Address"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
