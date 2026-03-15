"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  // Simple title mapping
  const getTitle = () => {
    switch (pathname) {
      case "/dashboard": return "Dashboard";
      case "/submit-case": return "Submit Feedback";
      case "/cases": return "Case Inbox";
      case "/polls": return "Polls";
      case "/public-hub": return "Public Hub";
      case "/analytics": return "Analytics";
      case "/admin": return "User Management";
      default: return "NeoConnect";
    }
  };

  return (
    <header className="h-16 bg-white/40 backdrop-blur-xl border-b border-white/40 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 tracking-tight">{getTitle()}</h2>
      <div className="flex items-center space-x-4">
        {/* We can add a simple Date or notification bell here */}
        <div className="text-sm font-medium text-slate-500 bg-white/60 px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
