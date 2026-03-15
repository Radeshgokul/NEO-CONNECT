"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  
  // Registration State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Staff");
  const [department, setDepartment] = useState("General");
  const [showDialog, setShowDialog] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user && user.role === 'Admin') {
      fetchUsers();
    }
  }, [user]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', { name, email, password, role, department });
      setShowDialog(false);
      fetchUsers();
      setName(""); setEmail(""); setPassword(""); setRole("Staff"); setDepartment("General");
      alert("User provisioned successfully");
    } catch (e:any) { alert(e.response?.data?.message || e.message) }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (e:any) { alert(e.response?.data?.message || e.message) }
  };

  if (!user || user.role !== 'Admin') return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Provision and manage internal accounts</p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild><Button>Provision New User</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Internal Account</DialogTitle></DialogHeader>
            <form onSubmit={handleRegister} className="space-y-4 pt-4">
              <div className="space-y-1">
                <Label>Full Name</Label><Input required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Email</Label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Password</Label><Input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Secretariat">Secretariat</SelectItem>
                      <SelectItem value="Case Manager">Case Manager</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Department</Label><Input required value={department} onChange={e => setDepartment(e.target.value)} />
                </div>
              </div>
              <Button type="submit" className="w-full">Create User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Account ID</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Role & Dept</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{u.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{u._id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold mr-2">{u.role}</span>
                  <span className="text-xs text-slate-500">{u.department}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(u._id)} disabled={u.role === 'Admin'}>
                    Revoke
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
