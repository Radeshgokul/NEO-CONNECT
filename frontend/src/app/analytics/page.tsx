"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (user && (user.role === 'Secretariat' || user.role === 'Admin')) {
      api.get('/analytics').then(res => setData(res.data)).catch(console.error);
    }
  }, [user]);

  if (!user || !data) return null;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Platform Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">High-level view of cases and system engagement.</p>
      </div>

      {/* Hotspots Alert Bar */}
      {data.hotspots.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500 text-xl font-bold">!</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider">Action Required: Hotspots Detected</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {data.hotspots.map((h:any, i:number) => (
                    <li key={i}>
                      <span className="font-semibold">{h.department}</span> department has <span className="font-semibold">{h.count}</span> recurrent cases under <span className="font-semibold">{h.category}</span>.
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cases By Department Bar Chart */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">Cases by Department</CardTitle>
            <CardDescription>Volume of reports originating from departments</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.casesByDept} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distributed Charts ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
          
          <Card className="shadow-sm border-slate-100 h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-center text-slate-600">Cases By Status</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex justify-center items-center">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.casesByStatus}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    paddingAngle={2} dataKey="value"
                  >
                    {data.casesByStatus.map((entry:any, index:number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100 h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-center text-slate-600">Cases By Category</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex justify-center items-center">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.casesByCategory}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    paddingAngle={2} dataKey="value"
                  >
                    {data.casesByCategory.map((entry:any, index:number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
