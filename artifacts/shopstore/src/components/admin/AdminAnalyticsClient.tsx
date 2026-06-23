"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";
import { useSiteStore } from "@/store/site";
import { formatPrice } from "@/lib/utils";

interface AnalyticsProps {
  monthly: { month: string; revenue: number; orders: number; visitors: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  channels: { name: string; value: number; color: string }[];
  kpis: { revenue: number; orders: number; visitors: number; averageOrderValue: number };
}

export function AdminAnalyticsClient({ monthly, topProducts, channels, kpis }: AnalyticsProps) {
  const { settings } = useSiteStore();

  const cards = [
    { label: "Total Revenue", value: formatPrice(kpis.revenue), icon: DollarSign, color: "bg-red-50 text-red-600" },
    { label: "Total Orders", value: kpis.orders.toLocaleString(), icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Unique Visitors", value: kpis.visitors.toLocaleString(), icon: Users, color: "bg-green-50 text-green-600" },
    { label: "Avg. Order Value", value: formatPrice(kpis.averageOrderValue), icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
  ];

  const chartData = monthly.length > 0 ? monthly : [{ month: "No data", revenue: 0, orders: 0, visitors: 0 }];
  const maxProductRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Store performance from live database records.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`p-2.5 rounded-xl w-fit mb-3 ${kpi.color}`}><kpi.icon size={18} /></div>
            <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Revenue & Orders</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={settings.primaryColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={settings.primaryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
              <Tooltip formatter={(v, name) => [name === "revenue" ? formatPrice(Number(v)) : v, name === "revenue" ? "Revenue" : "Orders"]} contentStyle={{ borderRadius: 12, border: "1px solid #f1f5f9" }} />
              <Area type="monotone" dataKey="revenue" stroke={settings.primaryColor} strokeWidth={2.5} fill="url(#grad1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Monthly Orders</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f1f5f9" }} />
              <Bar dataKey="orders" fill={settings.primaryColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Top Products by Revenue</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No order items have been recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{p.name}</span>
                      <span className="text-sm font-bold text-gray-900">{formatPrice(p.revenue)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(p.revenue / maxProductRevenue) * 100}%`, backgroundColor: settings.primaryColor }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{p.sales} units sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Order Channels</h2>
          {channels.length === 0 ? (
            <p className="text-sm text-gray-500">No channel data yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={channels} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value">
                    {channels.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}`, "Orders"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {channels.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-gray-600">{c.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{c.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
