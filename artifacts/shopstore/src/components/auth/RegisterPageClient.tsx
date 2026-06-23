"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { useSiteStore } from "@/store/site";
import { PasswordInput } from "@/components/ui/password-input";

function getPasswordStrength(password: string) {
  if (password.length === 0) return { score: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-green-500"];
  return { score, label: labels[score], color: colors[score] };
}

export function RegisterPageClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { settings } = useSiteStore();
  const router = useRouter();
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await signUp.email({ name, email, password });
    setLoading(false);
    if (res.error) {
      toast.error(res.error.message ?? "Registration failed");
    } else {
      toast.success("Account created! Welcome!");
      router.push("/");
    }
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/" });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-gray-50 p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex justify-center gap-3 mb-10">
            {[
              { color: "bg-red-400", delay: 0 },
              { color: "bg-blue-300", delay: 0.1 },
              { color: "bg-white border", delay: 0.2 },
              { color: "bg-gray-800", delay: 0.3 },
            ].map((c, i) => (
              <motion.div key={i} className={`w-24 h-24 rounded-2xl ${c.color} shadow-lg`} initial={{ opacity: 0, rotate: -10 }} animate={{ opacity: 1, rotate: i % 2 === 0 ? 6 : -6 }} transition={{ delay: c.delay, duration: 0.5 }} />
            ))}
          </div>
          <blockquote className="text-xl font-medium text-gray-800 max-w-sm">
            "Premium quality, unbeatable prices – everything you love, all in one place."
          </blockquote>
          <div className="mt-6 flex items-center gap-3 justify-center">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: settings.primaryColor }}>
              {settings.siteName.slice(0, 2).toLowerCase()}
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">{settings.siteName} Team</p>
              <p className="text-xs text-gray-500">contact@{settings.siteName.toLowerCase().replace(/\s+/g, "")}.com</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: settings.primaryColor }}>
              {settings.siteName.slice(0, 2).toLowerCase()}
            </div>
            <span className="font-semibold text-lg">{settings.siteName.split(" ")[0].toLowerCase()}</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 mb-8">Start shopping in seconds — it's free</p>

          <div className="flex gap-3 mb-6">
            <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400 uppercase">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <PasswordInput value={password} onChange={setPassword} required minLength={8} />
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map((s) => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-all ${strength.score >= s ? (strength.score === 1 ? "bg-red-400" : strength.score === 2 ? "bg-yellow-400" : strength.score === 3 ? "bg-blue-400" : "bg-green-400") : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${strength.color}`}>{strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
              <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 text-white font-semibold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-70" style={{ backgroundColor: settings.secondaryColor ?? "#111827" }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-gray-900 hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
