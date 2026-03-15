"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PollsPage() {
  const { user } = useAuthStore();
  const [polls, setPolls] = useState<any[]>([]);
  
  // Create Poll state
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const fetchPolls = async () => {
    try {
      const { data } = await api.get('/polls');
      setPolls(data);
    } catch (e) { console.error(e) }
  };

  useEffect(() => {
    if (user) fetchPolls();
  }, [user]);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validOptions = options.filter(o => o.trim() !== "");
      await api.post('/polls', { question, options: validOptions });
      setShowCreateDialog(false);
      setQuestion("");
      setOptions(["", ""]);
      fetchPolls();
    } catch (error:any) {
      alert("Failed to create poll: " + error.message);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { optionId });
      fetchPolls();
    } catch (error:any) {
      alert(error.response?.data?.message || "Failed to vote");
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Company Polls</h1>
          <p className="text-sm text-slate-500 mt-1">Vote on decisions shaping our workplace</p>
        </div>
        
        {(user.role === 'Secretariat' || user.role === 'Admin') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">Create New Poll</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a Poll</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePoll} className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Question</label>
                  <Input required placeholder="What should be the theme for Friday?" value={question} onChange={e => setQuestion(e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold block">Options</label>
                  {options.map((opt, i) => (
                    <Input key={i} required={i < 2} placeholder={`Option ${i+1}`} value={opt} onChange={e => updateOption(i, e.target.value)} />
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setOptions([...options, ""])} className="mt-2 text-xs">
                    + Add Option
                  </Button>
                </div>
                <Button type="submit" className="w-full">Publish Poll</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.length === 0 && (
           <p className="text-slate-500 text-sm">No active polls right now.</p>
        )}
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);
          const hasVoted = poll.voters.includes(user._id);

          return (
            <Card key={poll._id} className="border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                <CardTitle className="text-lg leading-tight text-slate-800">{poll.question}</CardTitle>
                <CardDescription className="text-xs font-medium">
                  {totalVotes} total votes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-3">
                {poll.options.map((opt: any) => {
                  const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                  return (
                    <div key={opt._id} className="space-y-1 relative">
                      <div className="flex justify-between text-sm items-center relative z-10">
                        <span className="font-medium text-slate-700">{opt.text}</span>
                        {hasVoted ? (
                          <span className="text-slate-500 font-semibold">{percentage}% ({opt.votes})</span>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                            onClick={() => handleVote(poll._id, opt._id)}
                          >
                            Vote
                          </Button>
                        )}
                      </div>
                      
                      {/* Background Bar */}
                      {hasVoted && (
                        <div className="w-full h-8 bg-slate-100 rounded flex overflow-hidden absolute top-0 -z-0 opacity-40">
                          <div 
                            className="h-full bg-blue-400 transition-all duration-1000 ease-out" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                {hasVoted && (
                  <p className="text-xs text-green-600 font-medium text-center mt-4 bg-green-50 p-2 rounded-lg">
                    You have voted on this poll.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
