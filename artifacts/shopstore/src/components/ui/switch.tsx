import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border p-1 shadow-inner transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-red-700 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-700 data-[state=checked]:to-orange-500 data-[state=unchecked]:border-slate-300 data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:border-slate-600 dark:data-[state=unchecked]:bg-slate-800",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none grid h-6 w-6 place-items-center rounded-full bg-white text-slate-500 shadow-lg ring-1 ring-black/5 transition-transform duration-300 data-[state=checked]:translate-x-8 data-[state=checked]:text-red-600 data-[state=unchecked]:translate-x-0 dark:bg-slate-950 dark:text-slate-300 dark:data-[state=checked]:bg-white"
      )}
    >
      <Check size={13} strokeWidth={3} className="hidden [[data-state=checked]_&]:block" />
      <X size={13} strokeWidth={3} className="block [[data-state=checked]_&]:hidden" />
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
