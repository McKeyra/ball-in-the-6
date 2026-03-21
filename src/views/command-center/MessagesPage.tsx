'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/auth-store';
import { Search, MessageSquare, Send, Plus, User, Users, Filter, ArrowLeft } from 'lucide-react';

interface Conversation { id: string; subject?: string; participant_names?: string[]; team_name?: string; program_name?: string; last_message?: string; updated_at?: string; unread_count?: number; }
interface Message { id: string; conversation_id: string; sender_name: string; sender_id?: string; body: string; created_at?: string; }

export function MessagesPage(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeForm, setComposeForm] = useState({ recipient: '', subject: '', body: '' });
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const { data: conversations = [], isLoading: loadingConversations } = useQuery<Conversation[]>({
    queryKey: ['command-center', 'conversations'],
    queryFn: async () => { const r = await fetch('/api/command-center/conversations'); return r.ok ? r.json() : []; },
  });

  const { data: messages = [], isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ['command-center', 'messages', selectedConversation?.id],
    queryFn: async () => { if (!selectedConversation) return []; const r = await fetch(`/api/command-center/messages?conversation_id=${selectedConversation.id}`); return r.ok ? r.json() : []; },
    enabled: !!selectedConversation,
  });

  const sendMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => { const r = await fetch('/api/command-center/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return r.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['command-center', 'messages', selectedConversation?.id] }); queryClient.invalidateQueries({ queryKey: ['command-center', 'conversations'] }); setNewMessage(''); },
  });

  const createConversationMutation = useMutation({
    mutationFn: async (data: { recipient: string; subject: string; body: string }) => {
      // TODO: Replace with proper API call
      const r = await fetch('/api/command-center/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      return r.json();
    },
    onSuccess: (convo: Conversation) => { queryClient.invalidateQueries({ queryKey: ['command-center', 'conversations'] }); setSelectedConversation(convo); setComposeOpen(false); setComposeForm({ recipient: '', subject: '', body: '' }); },
  });

  useEffect(() => { if (scrollRef.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; } }, [messages]);

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = !searchQuery || (c.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.participant_names || []).some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'team') return matchesSearch && c.team_name;
    if (filterType === 'program') return matchesSearch && c.program_name;
    return matchesSearch;
  });

  const handleSend = (): void => {
    if (!newMessage.trim() || !selectedConversation) return;
    sendMutation.mutate({ conversation_id: selectedConversation.id, sender_name: user?.fullName || 'Admin', body: newMessage.trim(), created_at: new Date().toISOString() });
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const handleCompose = (e: React.FormEvent): void => { e.preventDefault(); createConversationMutation.mutate(composeForm); };

  const selectConversation = (convo: Conversation): void => { setSelectedConversation(convo); setMobileShowThread(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Messages</h1><p className="text-slate-400 text-sm mt-1">Communicate with parents, coaches, and staff</p></div>
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild><Button className="bg-red-600 hover:bg-red-700 text-white"><Plus className="w-4 h-4 mr-2" /> Compose</Button></DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
            <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
            <form onSubmit={handleCompose} className="space-y-4 mt-4">
              <div className="space-y-2"><Label className="text-slate-300">To</Label><Input className="bg-slate-800 border-slate-700 text-white" value={composeForm.recipient} onChange={(e) => setComposeForm((p) => ({ ...p, recipient: e.target.value }))} placeholder="Recipient name or email" required /></div>
              <div className="space-y-2"><Label className="text-slate-300">Subject</Label><Input className="bg-slate-800 border-slate-700 text-white" value={composeForm.subject} onChange={(e) => setComposeForm((p) => ({ ...p, subject: e.target.value }))} placeholder="Message subject" required /></div>
              <div className="space-y-2"><Label className="text-slate-300">Message</Label><Textarea className="bg-slate-800 border-slate-700 text-white min-h-[120px]" value={composeForm.body} onChange={(e) => setComposeForm((p) => ({ ...p, body: e.target.value }))} placeholder="Type your message..." required /></div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setComposeOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={createConversationMutation.isPending}><Send className="w-4 h-4 mr-2" />{createConversationMutation.isPending ? 'Sending...' : 'Send'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-0 h-[calc(100vh-260px)] min-h-[500px]">
        <Card className={cn('bg-slate-900 border-slate-800 rounded-r-none lg:col-span-1 flex flex-col', mobileShowThread && 'hidden lg:flex')}>
          <CardHeader className="pb-2 shrink-0">
            <div className="space-y-3">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input className="bg-slate-800 border-slate-700 text-white pl-9 h-9" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
              <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs"><Filter className="w-3 h-3 mr-1.5 text-slate-500" /><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all" className="text-white hover:bg-slate-700 text-xs">All</SelectItem><SelectItem value="team" className="text-white hover:bg-slate-700 text-xs">By Team</SelectItem><SelectItem value="program" className="text-white hover:bg-slate-700 text-xs">By Program</SelectItem></SelectContent></Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {loadingConversations ? (<div className="space-y-0">{[1,2,3,4,5].map((i) => (<div key={i} className="p-3 border-b border-slate-800"><Skeleton className="h-4 w-28 mb-2 bg-slate-800" /><Skeleton className="h-3 w-full bg-slate-800" /></div>))}</div>) : filteredConversations.length === 0 ? (<div className="text-center py-12 px-4"><MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-sm text-slate-500">No conversations</p></div>) : (
                <div>{filteredConversations.map((convo) => {
                  const isSelected = selectedConversation?.id === convo.id;
                  const participants = (convo.participant_names || []).filter((n) => n !== (user?.fullName || 'Admin')).join(', ') || 'Unknown';
                  return (
                    <button key={convo.id} className={cn('w-full text-left p-3 border-b border-slate-800 transition-colors', isSelected ? 'bg-slate-800 border-l-2 border-l-red-600' : 'hover:bg-slate-800/50')} onClick={() => selectConversation(convo)}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0">{(convo.participant_names || []).length > 2 ? (<Users className="w-3.5 h-3.5 text-slate-400" />) : (<User className="w-3.5 h-3.5 text-slate-400" />)}</div>
                        <span className="text-sm font-medium text-white truncate flex-1">{participants}</span>
                        {(convo.unread_count ?? 0) > 0 && (<span className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0">{convo.unread_count}</span>)}
                      </div>
                      <p className="text-xs text-slate-400 font-medium truncate">{convo.subject || 'No subject'}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{convo.last_message || ''}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{convo.updated_at ? new Date(convo.updated_at).toLocaleDateString() : ''}</p>
                    </button>
                  );
                })}</div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className={cn('bg-slate-900 border-slate-800 rounded-l-none lg:col-span-2 flex flex-col', !mobileShowThread && !selectedConversation && 'hidden lg:flex')}>
          {!selectedConversation ? (
            <CardContent className="flex-1 flex items-center justify-center"><div className="text-center"><MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 font-medium">Select a conversation</p><p className="text-slate-600 text-sm mt-1">Choose from the list or compose a new message</p></div></CardContent>
          ) : (
            <>
              <CardHeader className="pb-2 shrink-0 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800 -ml-2" onClick={() => { setMobileShowThread(false); setSelectedConversation(null); }}><ArrowLeft className="w-4 h-4" /></Button>
                  <div className="flex-1 min-w-0"><h3 className="text-sm font-semibold text-white truncate">{selectedConversation.subject || 'Conversation'}</h3><p className="text-xs text-slate-400 truncate">{(selectedConversation.participant_names || []).join(', ')}</p></div>
                </div>
              </CardHeader>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  {loadingMessages ? (<div className="space-y-4">{[1,2,3].map((i) => (<div key={i} className={cn('flex', i % 2 === 0 ? 'justify-end' : 'justify-start')}><Skeleton className="h-16 w-64 bg-slate-800 rounded-xl" /></div>))}</div>) : messages.length === 0 ? (<div className="text-center py-12"><p className="text-sm text-slate-500">No messages yet. Start the conversation.</p></div>) : (
                    <div className="space-y-3">{messages.map((msg) => {
                      const isMe = msg.sender_name === (user?.fullName || 'Admin') || msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                          <div className={cn('max-w-[75%] rounded-2xl px-4 py-2.5', isMe ? 'bg-red-600 text-white rounded-br-md' : 'bg-slate-800 text-white rounded-bl-md')}>
                            {!isMe && (<p className="text-[10px] text-slate-400 font-medium mb-1">{msg.sender_name}</p>)}
                            <p className="text-sm leading-relaxed">{msg.body}</p>
                            <p className={cn('text-[10px] mt-1', isMe ? 'text-red-200' : 'text-slate-500')}>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                          </div>
                        </div>
                      );
                    })}</div>
                  )}
                </ScrollArea>
              </div>
              <div className="p-3 border-t border-slate-800 shrink-0">
                <div className="flex items-end gap-2">
                  <Textarea className="bg-slate-800 border-slate-700 text-white min-h-[40px] max-h-[120px] resize-none" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} rows={1} />
                  <Button className="bg-red-600 hover:bg-red-700 text-white shrink-0" size="sm" onClick={handleSend} disabled={!newMessage.trim() || sendMutation.isPending}><Send className="w-4 h-4" /></Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
