"use client";

import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user && (user.role === 'Secretariat' || user.role === 'Admin')) {
      // Fetch some generic stats or analytics overview
      api.get('/analytics').then(res => setStats(res.data)).catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="opacity-90 max-w-lg text-sm">
          You are logged in as <span className="font-semibold">{user.role}</span> in the {user.department} department.
          Use the navigation menu to access your tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.role === 'Staff' && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Submit a new Case/Feedback</li>
                <li>• View Public Hub Updates</li>
                <li>• Vote on Active Polls</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {(user.role === 'Secretariat' || user.role === 'Admin') && (
          <>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Inbox Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-4">View and assign incoming cases to Case Managers.</p>
                {stats && (
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.casesByStatus.find((s:any) => s.name === "New")?.value || 0} New Cases
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Hotspots</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.hotspots?.length > 0 ? (
                  <ul className="space-y-2">
                    {stats.hotspots.map((h: any, i: number) => (
                      <li key={i} className="text-sm bg-red-50 text-red-700 px-3 py-2 rounded-lg font-medium flex justify-between">
                        <span>{h.department} - {h.category}</span>
                        <span>{h.count} cases</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No active hotspots detected.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {user.role === 'Case Manager' && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Navigate to your Assigned Cases tab to review, update statuses, and add notes to cases escalated to you.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
