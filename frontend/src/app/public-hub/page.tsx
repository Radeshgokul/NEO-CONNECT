"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PublicHubPage() {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [minutes, setMinutes] = useState<any[]>([]);

  // Create Announcement State
  const [aTitle, setATitle] = useState("");
  const [aIssue, setAIssue] = useState("");
  const [aAction, setAAction] = useState("");
  const [aResult, setAResult] = useState("");
  const [showADialog, setShowADialog] = useState(false);

  // Upload Minute State
  const [mTitle, setMTitle] = useState("");
  const [mFile, setMFile] = useState<File | null>(null);
  const [showMDialog, setShowMDialog] = useState(false);

  const fetchData = async () => {
    try {
      const [annRes, minRes] = await Promise.all([
        api.get('/content/announcements'),
        api.get('/content/minutes')
      ]);
      setAnnouncements(annRes.data);
      setMinutes(minRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/content/announcements', {
        title: aTitle, issueRaised: aIssue, actionTaken: aAction, result: aResult
      });
      setShowADialog(false);
      fetchData();
    } catch (e:any) { alert(e.message) }
  };

  const handleUploadMinute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mFile) return;
    try {
      const data = new FormData();
      data.append('title', mTitle);
      data.append('file', mFile);
      await api.post('/content/minutes', data, { headers: { "Content-Type": "multipart/form-data" } });
      setShowMDialog(false);
      fetchData();
    } catch (e:any) { alert(e.message) }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Company Public Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Updates, Impact Tracking, and Meeting Minutes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quarterly Digest & Impact Tracking (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Quarterly Digest & Impact</h2>
            {(user.role === 'Secretariat' || user.role === 'Admin') && (
               <Dialog open={showADialog} onOpenChange={setShowADialog}>
                <DialogTrigger asChild><Button size="sm">Post Update</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Post Digest Update</DialogTitle></DialogHeader>
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4 pt-4">
                    <div className="space-y-1">
                      <Label>Title</Label><Input required value={aTitle} onChange={e => setATitle(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Issue Raised (Optional)</Label><Input value={aIssue} onChange={e => setAIssue(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Action Taken (Optional)</Label><Input value={aAction} onChange={e => setAAction(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Result / Outcome (Optional)</Label><Input value={aResult} onChange={e => setAResult(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">Publish</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-6">
            {announcements.length === 0 && <p className="text-slate-500 text-sm">No recent digests.</p>}
            {announcements.map(ann => (
              <Card key={ann._id} className="border-l-4 border-blue-500 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-slate-800">{ann.title}</CardTitle>
                    <span className="text-xs text-slate-400 font-medium">{format(new Date(ann.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(ann.issueRaised || ann.actionTaken || ann.result) ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Issue</p>
                        <p className="text-sm font-medium text-slate-700">{ann.issueRaised || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Action</p>
                        <p className="text-sm font-medium text-slate-700">{ann.actionTaken || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">Result</p>
                        <p className="text-sm font-medium text-slate-700">{ann.result || '-'}</p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Meeting Minutes Sandbox (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Minutes Archive</h2>
             {(user.role === 'Secretariat' || user.role === 'Admin') && (
               <Dialog open={showMDialog} onOpenChange={setShowMDialog}>
                <DialogTrigger asChild><Button size="sm" variant="outline">Upload</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Upload Minutes PDF</DialogTitle></DialogHeader>
                  <form onSubmit={handleUploadMinute} className="space-y-4 pt-4">
                    <div className="space-y-1">
                      <Label>Meeting Title / Date</Label><Input required value={mTitle} onChange={e => setMTitle(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>PDF File</Label><Input type="file" accept=".pdf" required onChange={e => setMFile(e.target.files?.[0] || null)} />
                    </div>
                    <Button type="submit" className="w-full">Upload</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <Card className="shadow-sm border-slate-200 bg-white min-h-[400px]">
             <CardContent className="p-0 divide-y divide-slate-100">
                {minutes.length === 0 && <div className="p-6 text-center text-sm text-slate-500">No minutes uploaded yet.</div>}
                {minutes.map(min => (
                  <div key={min._id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col items-start gap-2 group cursor-pointer" onClick={() => window.open(`http://localhost:5000${min.fileUrl}`, '_blank')}>
                    <div className="flex items-start justify-between w-full">
                      <span className="font-semibold text-sm text-slate-700 group-hover:text-blue-600 transition-colors">{min.title}</span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{format(new Date(min.uploadDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <span className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100">📄 PDF Document</span>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
