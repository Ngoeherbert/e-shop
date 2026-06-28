"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

export function AccountProfileClient() {
  const { data: session, isPending } = useSession();
  const [name, setName] = useState(session?.user.name ?? "");
  const [email] = useState(session?.user.email ?? "");
  const [phone, setPhone] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!session) return;
      setName(session.user.name ?? "");
      const response = await fetch("/api/account/profile", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setName(data.user?.name ?? session.user.name ?? "");
      setPhone(data.user?.phoneNumber ?? "");
      setNewsletter(Boolean(data.user?.newsletterSubscribed));
    }

    loadProfile();
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNumber: phone, newsletterSubscribed: newsletter }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? "Failed to update profile");
      setName(data.user?.name ?? name);
      setPhone(data.user?.phoneNumber ?? "");
      setNewsletter(Boolean(data.user?.newsletterSubscribed));
      toast.success("Profile synced to the database!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
      <p className="text-gray-500 text-sm mb-8">Manage your personal information and preferences.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Newsletter Preferences</p>
                <p className="text-xs text-gray-500">Receive updates on new arrivals and offers.</p>
              </div>
            </div>
            <ToggleSwitch checked={newsletter} onChange={setNewsletter} showState />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
