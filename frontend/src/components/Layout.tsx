"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <main className="min-h-screen bg-slate-50 relative">{children}</main>;
  }

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen relative overflow-hidden font-sans">
      {/* Decorative background blobs for glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none" />

      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="max-w-6xl mx-auto drop-shadow-sm h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
