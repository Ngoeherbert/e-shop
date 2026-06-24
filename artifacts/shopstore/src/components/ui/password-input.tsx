"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
  name?: string;
}

export function PasswordInput({ value, onChange, placeholder = "••••••••", required, minLength, className, name }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-600" />
      <input
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className={cn("w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-12 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-colors focus:border-red-300 focus:ring-2 focus:ring-red-500/30 dark:border-gray-600 dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-500", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-900"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
