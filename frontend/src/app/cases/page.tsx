"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function CasesPage() {
  const { user } = useAuthStore();
  const [cases, setCases] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [assignToId, setAssignToId] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [note, setNote] = useState("");

  const fetchCases = async () => {
    try {
      if (user?.role === 'Case Manager') {
        const { data } = await api.get('/cases/assigned');
        setCases(data);
      } else {
        const { data } = await api.get('/cases');
        setCases(data);
      }
    } catch (e) { console.error(e) }
    setLoading(false);
  };

  const fetchStaff = async () => {
    // Basic mock fetch for Case Managers. Real app would have a specific endpoint.
    // For this prototype we'll assume Secretariat types in an ID or we fetch a basic list.
    // Assuming backend /users is protected.
  }

  useEffect(() => {
    if (user) fetchCases();
  }, [user]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !assignToId) return;
    try {
      // Assuming assignToId is a valid User ID in a real app
      await api.put(`/cases/${selectedCase._id}/assign`, { assignedTo: assignToId });
      alert("Case Assigned.");
      fetchCases();
      setSelectedCase(null);
    } catch (error:any) { alert(error.message) }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      await api.put(`/cases/${selectedCase._id}/status`, { status: updateStatus, note });
      alert("Case Updated.");
      fetchCases();
      setSelectedCase(null);
      setNote("");
    } catch (error:any) { alert(error.message) }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            {user.role === 'Case Manager' ? 'My Assigned Cases' : 'Case Inbox'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track feedback reports</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No cases found.</td></tr>
              )}
              {cases.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-slate-700">{c.trackingId}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">{c.category}</span>
                    <span className="block text-xs text-slate-500">{c.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      c.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      c.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                      c.status === 'Escalated' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${
                      c.severity === 'High' ? 'text-red-500' :
                      c.severity === 'Medium' ? 'text-orange-500' : 'text-green-500'
                    }`}>{c.severity}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {format(new Date(c.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    
                    {/* Actions Menu */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCase(c)}>View & Action</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Case Details {c.trackingId}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="p-4 bg-slate-50 rounded-lg text-sm space-y-2 border border-slate-100">
                            <p><strong>Description:</strong> {c.description}</p>
                            <p><strong>Location:</strong> {c.location}</p>
                            <p><strong>Anonymous:</strong> {c.anonymous ? 'Yes' : 'No'}</p>
                            {c.attachments.length > 0 && (
                              <p><strong>Attachment:</strong> <a href={`http://localhost:5000${c.attachments[0]}`} target="_blank" className="text-blue-600 underline">View File</a></p>
                            )}
                          </div>
                          
                          {(user.role === 'Secretariat' || user.role === 'Admin') && (
                            <form onSubmit={handleAssign} className="space-y-3 pt-4 border-t">
                              <h4 className="font-semibold text-sm">Assign Case</h4>
                              <p className="text-xs text-slate-500">Enter the exact User ID of the Case Manager</p>
                              <div className="flex gap-2">
                                <input required placeholder="User ID" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={assignToId} onChange={(e) => setAssignToId(e.target.value)} />
                                <Button type="submit" size="sm">Assign</Button>
                              </div>
                            </form>
                          )}

                          {user.role === 'Case Manager' && (
                            <form onSubmit={handleUpdate} className="space-y-3 pt-4 border-t">
                              <h4 className="font-semibold text-sm">Update Status</h4>
                              <Select onValueChange={setUpdateStatus} defaultValue={c.status}>
                                <SelectTrigger><SelectValue placeholder="New Status" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Resolved">Resolved</SelectItem>
                                  <SelectItem value="Escalated">Escalated</SelectItem>
                                </SelectContent>
                              </Select>
                              <Textarea placeholder="Add a note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
                              <Button type="submit" size="sm" className="w-full">Save Update</Button>
                            </form>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
