// src/components/Layout.tsx
import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
