'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/auth-store';
import { Search, Send, MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  contact_name?: string;
  organization?: string;
  last_message?: string;
  unread?: number;
}

interface Message {
  id: string;
  conversation_id?: string;
  sender_type?: string;
  sender_name?: string;
  content?: string;
  created_date?: string;
}

export function ParentMessagesPage(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  // TODO: Replace with fetch('/api/parent-hub/conversations')
  const { data: convos = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ['parent', 'conversations'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/conversations'); return r.ok ? r.json() : []; },
    enabled: !!user?.id,
  });

  // TODO: Replace with fetch('/api/parent-hub/messages?conversation_id=...')
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['parent', 'messages', selected],
    queryFn: async () => { const r = await fetch(`/api/parent-hub/messages?conversation_id=${selected}`); return r.ok ? r.json() : []; },
    enabled: !!selected,
  });

  const sendMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: Replace with fetch('/api/parent-hub/messages', { method: 'POST', body: JSON.stringify(data) })
      const r = await fetch('/api/parent-hub/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', 'messages', selected] });
      setText('');
    },
  });

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const filtered = convos.filter((c) => !search.trim() || (c.contact_name || '').toLowerCase().includes(search.toLowerCase()));
  const activeConvo = convos.find((c) => c.id === selected);

  const handleSend = (): void => {
    if (!text.trim() || !selected) return;
    sendMutation.mutate({
      conversation_id: selected,
      sender_type: 'parent',
      sender_name: user?.fullName || user?.email,
      content: text.trim(),
      created_date: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">Communicate with coaches and organizations.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader className="pb-2 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-800 border-slate-700 text-white pl-9 text-sm" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-1">
            {isLoading ? (
              <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 bg-slate-800 rounded-lg" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No conversations</p>
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                    selected === c.id ? 'bg-red-600/20 border border-red-600' : 'hover:bg-slate-800/50'
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-red-400">{(c.contact_name || 'C').charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white truncate">{c.contact_name || 'Contact'}</p>
                      {(c.unread || 0) > 0 && <Badge className="bg-red-600 text-white text-[9px] h-5">{c.unread}</Badge>}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{c.last_message || ''}</p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2 flex flex-col">
          {selected ? (
            <>
              <CardHeader className="pb-2 flex-shrink-0 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-600/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-400">{(activeConvo?.contact_name || 'C').charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{activeConvo?.contact_name || 'Contact'}</p>
                    <p className="text-xs text-slate-400">{activeConvo?.organization || ''}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.sender_type === 'parent';
                  return (
                    <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-[70%] px-3 py-2 rounded-lg', isMe ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200')}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={cn('text-[10px] mt-1', isMe ? 'text-red-200' : 'text-slate-500')}>
                          {msg.created_date ? new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </CardContent>
              <div className="p-4 border-t border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="bg-slate-800 border-slate-700 text-white" />
                  <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleSend} disabled={!text.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Select a conversation</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
