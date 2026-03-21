'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  Search,
  Send,
  MessageSquare,
  Filter,
} from 'lucide-react';

// TODO: Replace with actual API route

interface Conversation {
  id: string;
  athlete_name?: string;
  sport?: string;
  position?: string;
  last_message?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  sender_type?: string;
  content?: string;
  created_date?: string;
}

export function RecruiterMessagesPage(): React.ReactElement {
  const userId = 'current-user';
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading: loadingConversations } = useQuery<Conversation[]>({
    queryKey: ['recruiter', 'conversations'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/recruiting/conversations')
      return [];
    },
    enabled: !!userId,
  });

  const { data: messages = [], isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ['recruiter', 'messages', selectedConversation],
    queryFn: async () => {
      // TODO: Replace with fetch(`/api/recruiting/messages?conversationId=${selectedConversation}`)
      return [];
    },
    enabled: !!selectedConversation,
  });

  const sendMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: Replace with fetch('/api/recruiting/messages', { method: 'POST', body: JSON.stringify(data) })
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'messages', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'conversations'] });
      setMessageText('');
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = useMemo(() => {
    let result = [...conversations];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => (c.athlete_name || '').toLowerCase().includes(q));
    }
    if (sportFilter !== 'all') {
      result = result.filter((c) => c.sport === sportFilter);
    }
    return result;
  }, [conversations, search, sportFilter]);

  const selectedConvo = conversations.find((c) => c.id === selectedConversation);

  const handleSend = (): void => {
    if (!messageText.trim() || !selectedConversation) return;
    sendMutation.mutate({
      conversation_id: selectedConversation,
      sender_type: 'recruiter',
      content: messageText.trim(),
      created_date: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">Communicate with athletes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Conversation List */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col">
          <div className="p-4 pb-2 flex-shrink-0 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="all">All Sports</option>
              {['Basketball', 'Soccer', 'Football', 'Baseball', 'Hockey'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pt-2 space-y-1">
            {loadingConversations ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No conversations</p>
              </div>
            ) : (
              filteredConversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConversation(convo.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                    selectedConversation === convo.id
                      ? 'bg-red-600/20 border border-red-600'
                      : 'hover:bg-slate-800/50'
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-red-400">
                      {(convo.athlete_name || 'A').charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white truncate">{convo.athlete_name || 'Athlete'}</p>
                      {(convo.unread_count || 0) > 0 && (
                        <span className="bg-red-600 text-white text-[9px] h-5 min-w-[20px] flex items-center justify-center rounded-full px-1">
                          {convo.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{convo.last_message || 'No messages yet'}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 pb-2 flex-shrink-0 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-600/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-400">
                      {(selectedConvo?.athlete_name || 'A').charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedConvo?.athlete_name || 'Athlete'}</p>
                    <p className="text-xs text-slate-400">
                      {selectedConvo?.sport || ''} {selectedConvo?.position && `| ${selectedConvo.position}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-slate-800 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500">No messages yet. Start the conversation.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender_type === 'recruiter';
                    return (
                      <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                        <div className={cn(
                          'max-w-[70%] px-3 py-2 rounded-lg',
                          isMe ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200'
                        )}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={cn('text-[10px] mt-1', isMe ? 'text-red-200' : 'text-slate-500')}>
                            {msg.created_date
                              ? new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
                  />
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                    onClick={handleSend}
                    disabled={!messageText.trim() || sendMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
