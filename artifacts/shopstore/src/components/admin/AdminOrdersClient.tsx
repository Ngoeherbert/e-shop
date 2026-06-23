"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { useSiteStore } from "@/store/site";
import { CustomSelect } from "@/components/ui/custom-select";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const statusSelectOptions = [
  { value: "all", label: "All Status" },
  ...STATUS_OPTIONS.map((status) => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) })),
];
const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export function AdminOrdersClient({ orders: serverOrders }: { orders: any[] }) {
  const [orders, setOrders] = useState(serverOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { settings } = useSiteStore();

  const filtered = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: number, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    try { await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); } catch {}
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
          </div>
          <CustomSelect value={statusFilter} options={statusSelectOptions} onChange={setStatusFilter} className="w-48" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Order</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.items?.length ?? 0} item(s)</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{order.user?.name ?? "Guest"}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 font-bold text-sm text-gray-900">{formatPrice(parseFloat(order.total))}</td>
                    <td className="px-4 py-3">
                      <CustomSelect
                        value={order.status}
                        options={statusSelectOptions.filter((option) => option.value !== "all")}
                        onChange={(value) => updateStatus(order.id, value)}
                        className="w-40"
                        buttonClassName={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold shadow-none ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] ?? "bg-gray-100 text-gray-700"}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
