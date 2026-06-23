"use client";

import Link from "next/link";
import { useState } from "react";
import { Shield, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useThemeStore } from "@/store/theme";

export function AccountSettingsClient() {
  const { data: session } = useSession();
  const { theme, setTheme } = useThemeStore();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error("Passwords don't match"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Password updated!");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h1>
      <p className="text-gray-500 text-sm mb-8">Manage your security and password preferences.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gray-50 rounded-xl">
            <Shield size={20} className="text-gray-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Security</h2>
            <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Current Password", value: currentPw, onChange: setCurrentPw },
            { label: "New Password", value: newPw, onChange: setNewPw },
            { label: "Confirm New Password", value: confirmPw, onChange: setConfirmPw },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <PasswordInput value={value} onChange={onChange} required />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
