// src/components/map/TopSummary.tsx
import type { ReactNode } from "react";

export default function TopSummary({ children }: { children: ReactNode }) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] rounded-2xl bg-white/90 backdrop-blur px-4 py-2 border border-slate-200 shadow">
      {children}
    </div>
  );
}
