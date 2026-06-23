"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  showState?: boolean;
  className?: string;
}

export function ToggleSwitch({ checked, onChange, label, description, disabled, showState = false, className }: ToggleSwitchProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "group relative inline-flex h-8 w-16 shrink-0 items-center rounded-full border p-1 shadow-inner transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-red-300/25",
          checked
            ? "border-red-700 bg-gradient-to-r from-red-700 to-orange-500"
            : "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-800"
        )}
      >
        <span className={cn("absolute text-[10px] font-black uppercase tracking-wide transition-opacity", checked ? "left-2.5 text-white/90 opacity-100" : "left-2.5 text-slate-500 opacity-0")}>On</span>
        <span className={cn("absolute right-2 text-[10px] font-black uppercase tracking-wide transition-opacity", checked ? "text-white/50 opacity-0" : "text-slate-500 opacity-100 dark:text-slate-300")}>Off</span>
        <span
          className={cn(
            "relative z-10 grid h-6 w-6 place-items-center rounded-full bg-white text-slate-500 shadow-lg ring-1 ring-black/5 transition-transform duration-300 dark:bg-slate-950 dark:text-slate-300",
            checked ? "translate-x-8 text-red-600 dark:bg-white" : "translate-x-0"
          )}
        >
          {checked ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
        </span>
      </button>
      {(label || description || showState) && (
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {label && <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{label}</span>}
            {showState && (
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", checked ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200")}>{checked ? "On" : "Off"}</span>
            )}
          </div>
          {description && <p className="text-xs text-gray-600 dark:text-gray-300">{description}</p>}
        </div>
      )}
    </div>
  );
}
