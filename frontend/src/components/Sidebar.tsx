"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { 
  Home, FileText, BarChart2, Users, Bell, LogOut, FileBadge, CheckSquare
} from "lucide-react";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getLinks = () => {
    const role = user.role;
    let links = [{ href: "/dashboard", label: "Dashboard", icon: Home }];

    if (role === "Staff") {
      links.push(
        { href: "/submit-case", label: "Submit Case", icon: FileText },
        { href: "/public-hub", label: "Public Hub", icon: Users },
        { href: "/polls", label: "Polls", icon: CheckSquare }
      );
    } else if (role === "Secretariat" || role === "Admin") {
      links.push(
        { href: "/cases", label: "All Cases (Inbox)", icon: FileBadge },
        { href: "/polls", label: "Manage Polls", icon: CheckSquare },
        { href: "/public-hub", label: "Public Hub", icon: Users },
        { href: "/analytics", label: "Analytics", icon: BarChart2 }
      );
      if (role === "Admin") {
        links.push({ href: "/admin", label: "Manage Users", icon: Users });
      }
    } else if (role === "Case Manager") {
      links.push(
        { href: "/cases", label: "Assigned Cases", icon: FileBadge },
        { href: "/public-hub", label: "Public Hub", icon: Users }
      );
    }
    return links;
  };

  return (
    <div className="w-64 h-screen bg-white/50 backdrop-blur-md border-r border-slate-200/50 flex flex-col shadow-xl fixed left-0 top-0 z-50 transition-all">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
          NeoConnect
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Staff Feedback Platform</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {getLinks().map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-slate-600 hover:bg-blue-50/80 hover:text-blue-700"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/50">
        <div className="flex items-center px-4 py-3 mb-2 rounded-xl bg-slate-50/50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mr-3">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-700 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 text-sm text-red-600 hover:bg-red-50 p-3 rounded-xl transition-colors font-medium"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
