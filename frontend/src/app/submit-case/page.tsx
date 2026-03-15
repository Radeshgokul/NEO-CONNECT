"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";

export default function SubmitCasePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: "",
    department: "",
    location: "",
    severity: "",
    description: "",
    anonymous: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });
      if (file) {
        data.append("attachment", file);
      }

      await api.post("/cases", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      alert("Case submitted successfully.");
      router.push("/dashboard");
    } catch (error: any) {
      alert("Submission failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
          <CardTitle className="text-2xl text-slate-800">Submit a Case or Feedback</CardTitle>
          <CardDescription>
            Report an issue, file a complaint, or provide general feedback. If you choose to submit anonymously, your identity will not be linked to this case.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={(val) => setFormData({...formData, category: val})} required>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Input required placeholder="E.g. Engineering" onChange={(e) => setFormData({...formData, department: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input required placeholder="E.g. Floor 3, North Wing" onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>Severity</Label>
                <Select onValueChange={(val) => setFormData({...formData, severity: val})} required>
                  <SelectTrigger><SelectValue placeholder="Select Severity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                required 
                placeholder="Please describe the issue in detail..." 
                className="min-h-[120px]"
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <Label>Attachment (Optional)</Label>
                <Input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <p className="text-xs text-slate-500">Allowed: JPG, PNG, PDF</p>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <input 
                  type="checkbox" 
                  id="anonymous" 
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
                />
                <div className="space-y-1">
                  <Label htmlFor="anonymous" className="font-semibold cursor-pointer">Submit Anonymously</Label>
                  <p className="text-xs text-slate-500">Your identity will be hidden from Secretariat and Management.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={loading}>
                {loading ? "Submitting..." : "Submit Case"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
