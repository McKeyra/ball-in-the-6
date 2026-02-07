import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Calendar, BarChart2, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock Data Components
const PlayerStats = () => (
  <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {['PPG', 'RPG', 'APG', 'FG%'].map((stat, i) => (
        <div key={stat} className="neu-flat p-4 rounded-xl text-center">
           <div className="text-gray-500 text-xs font-bold mb-1">{stat}</div>
           <div className="text-2xl font-black text-blue-500">{[24.5, 6.2, 5.8, '48%'][i]}</div>
        </div>
      ))}
    </div>
    
    <div className="neu-flat p-6 rounded-2xl">
      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
        <BarChart2 size={18} className="text-blue-500"/> Season History
      </h4>
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#151515]">
            <span className="text-gray-400 text-sm">vs. Raptors</span>
            <div className="flex gap-4 text-sm">
              <span className="text-white font-bold">28 PTS</span>
              <span className="text-gray-500">8 REB</span>
              <span className="text-gray-500">4 AST</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PlayerSchedule = () => (
  <div className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
      <Calendar size={18} className="text-green-500"/> Upcoming Games
    </h4>
    {[1,2,3,4].map(i => (
      <div key={i} className="neu-flat p-4 rounded-xl flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="bg-[#252525] px-3 py-1 rounded-lg text-center">
               <div className="text-xs text-red-500 font-bold">OCT</div>
               <div className="text-lg font-black text-white">{12 + i}</div>
            </div>
            <div>
               <div className="text-white font-bold">vs. Warriors</div>
               <div className="text-xs text-gray-500">Home Arena • 7:00 PM</div>
            </div>
         </div>
         <Button size="sm" className="rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white">
            Tickets
         </Button>
      </div>
    ))}
  </div>
);

const PlayerConnections = () => (
  <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <div className="neu-flat p-5 rounded-2xl">
      <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Current Team</h4>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
          L
        </div>
        <div>
           <div className="text-lg font-bold text-white">Lakers</div>
           <div className="text-sm text-blue-400">B6 Premier League</div>
        </div>
      </div>
    </div>

    <div className="neu-flat p-5 rounded-2xl">
      <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Coaching Staff</h4>
      <div className="space-y-4">
        {['Head Coach', 'Assistant Coach'].map((role, i) => (
          <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#252525] rounded-lg transition-colors cursor-pointer">
             <div className="w-10 h-10 rounded-full bg-gray-700" />
             <div>
                <div className="text-white font-medium">Coach Name {i+1}</div>
                <div className="text-xs text-gray-500">{role}</div>
             </div>
             <MessageSquare size={16} className="ml-auto text-gray-600" />
          </div>
        ))}
      </div>
    </div>

    <div className="neu-flat p-5 rounded-2xl">
      <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Parents</h4>
      <div className="space-y-4">
        {['Father', 'Mother'].map((relation, i) => (
          <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#252525] rounded-lg transition-colors cursor-pointer">
             <div className="w-10 h-10 rounded-full bg-gray-700" />
             <div>
                <div className="text-white font-medium">Parent Name {i+1}</div>
                <div className="text-xs text-gray-500">{relation}</div>
             </div>
             <div className="ml-auto flex gap-2">
                <Phone size={16} className="text-gray-600 hover:text-blue-500" />
                <MessageSquare size={16} className="text-gray-600 hover:text-blue-500" />
             </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FanConnections = () => (
  <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
    {/* Family Section */}
    <div className="neu-flat p-5 rounded-2xl">
      <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Family & Relationships</h4>
      <div className="space-y-4">
        {[
            { name: "James Doe", relation: "Husband" },
            { name: "Junior Doe", relation: "Child" },
            { name: "Jane Doe", relation: "Child" }
        ].map((person, i) => (
          <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#252525] rounded-lg transition-colors cursor-pointer">
             <div className="w-10 h-10 rounded-full bg-gray-700" />
             <div>
                <div className="text-white font-medium">{person.name}</div>
                <div className="text-xs text-gray-500">{person.relation}</div>
             </div>
             <MessageSquare size={16} className="ml-auto text-gray-600" />
          </div>
        ))}
      </div>
    </div>

    {/* Associated Coaches & Players */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="neu-flat p-5 rounded-2xl">
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Coaches</h4>
            <div className="space-y-3">
                {['Coach Mike', 'Coach Sarah'].map((name, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#252525] rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-700" />
                    <div className="text-sm text-white">{name}</div>
                </div>
                ))}
            </div>
        </div>
        <div className="neu-flat p-5 rounded-2xl">
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Players</h4>
            <div className="space-y-3">
                {['Junior Doe', 'Jane Doe'].map((name, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#252525] rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-700" />
                    <div className="text-sm text-white">{name}</div>
                </div>
                ))}
            </div>
        </div>
    </div>

    {/* Programs */}
    <div className="neu-flat p-5 rounded-2xl">
      <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Active Programs</h4>
      <div className="space-y-3">
        {[
            { name: 'Summer Youth League 2024', duration: 'Jun 1 - Aug 31', owing: 150.00 },
            { name: 'Winter Skills Camp', duration: 'Dec 15 - Jan 15', owing: 0.00 }
        ].map((program, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#151515] border border-white/5">
                <div>
                    <div className="text-white font-bold text-lg">{program.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} /> {program.duration}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Amount Owing</div>
                    <div className={`text-xl font-mono font-bold ${program.owing > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ${program.owing.toFixed(2)}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  </div>
);

import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Globe, Zap } from 'lucide-react';

export default function ChatWindow({ user, category, currentUser }) {
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState('chat');
  const [suggestions, setSuggestions] = useState([]);
  const [aiCategory, setAiCategory] = useState(null);
  const [translations, setTranslations] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const bottomRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch Messages
  const { data: messages, isLoading } = useQuery({
      queryKey: ['messages', user?.id],
      queryFn: async () => {
          if (!user) return [];
          // Fetch messages where sender or recipient is the current selected user
          // In a real scenario, we'd filter by conversation ID or pair of users
          // For this demo, getting all messages that involve both parties
          const allMsgs = await base44.entities.Message.list({ sort: { created_date: 1 } });
          return allMsgs.filter(m => 
              (m.sender_id === currentUser?.email && m.recipient_id === user.id) || 
              (m.sender_id === user.id && m.recipient_id === currentUser?.email)
          );
      },
      enabled: !!user && !!currentUser,
      refetchInterval: 3000 // Poll every 3s for real-time feel
  });

  // AI Analysis Effect
  useEffect(() => {
    if (messages && messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        // Only analyze if the last message is from 'them' to suggest replies
        if (lastMsg.sender_id === user?.id) {
            setIsAnalyzing(true);
            base44.functions.invoke('messengerAI', {
                action: 'analyze',
                messages: messages.slice(-5),
                userRole: currentUser?.role || 'Fan'
            }).then(res => {
                if (res.data) {
                    setSuggestions(res.data.suggestions || []);
                    setAiCategory(res.data.category);
                }
                setIsAnalyzing(false);
            }).catch(err => {
                console.error("AI Analysis failed", err);
                setIsAnalyzing(false);
            });
        }
    }
  }, [messages, user?.id]);

  const handleTranslate = async (msgId, text) => {
      try {
          const res = await base44.functions.invoke('messengerAI', {
              action: 'translate',
              text: text,
              targetLanguage: 'English' // Could be dynamic based on user pref
          });
          if (res.data?.translated_text) {
              setTranslations(prev => ({ ...prev, [msgId]: res.data.translated_text }));
          }
      } catch (e) {
          console.error("Translation failed", e);
      }
  };

  const sendMessageMutation = useMutation({
      mutationFn: (newMsg) => base44.entities.Message.create(newMsg),
      onSuccess: () => {
          queryClient.invalidateQueries(['messages', user.id]);
          setInputText("");
          setSuggestions([]); // Clear suggestions after sending
      }
  });

  const handleSend = (e, textOverride = null) => {
    if (e) e.preventDefault();
    const textToSend = textOverride || inputText;
    if (!textToSend.trim() || !user || !currentUser) return;

    sendMessageMutation.mutate({
        sender_id: currentUser.email, 
        recipient_id: user.id,
        content: textToSend,
        type: 'text',
        timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    if (activeTab === 'chat' && messages) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Reset tab on user switch
  useEffect(() => {
      if (user) setActiveTab('chat');
  }, [user?.id]);

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1A1A1A] rounded-2xl neu-flat ml-4">
        <div className="text-center text-gray-500">
          <div className="w-20 h-20 bg-[#252525] rounded-full mx-auto mb-4 flex items-center justify-center neu-pressed">
            <span className="text-4xl">💬</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
          <p>Choose a user from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  // Define tabs based on category
  const getTabs = () => {
    const baseTabs = [{ id: 'chat', label: 'Chat', icon: MessageSquare }];
    
    if (category === 'players') {
      return [
        ...baseTabs,
        { id: 'stats', label: 'Stats', icon: BarChart2 },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'connections', label: 'Connections', icon: Users },
      ];
    }
    
    if (category === 'fans') {
        return [
            ...baseTabs,
            { id: 'connections', label: 'Connections', icon: Users },
        ];
    }

    return baseTabs;
  };

  const tabs = getTabs();

  return (
    <div className="flex-1 flex flex-col bg-[#1A1A1A] rounded-2xl neu-flat ml-4 overflow-hidden h-[calc(100vh-100px)]">
      {/* Chat Header & Tabs */}
      <div className="bg-[#202020] border-b border-white/5">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-700" />
              {user.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202020] rounded-full" />}
            </div>
            <div>
              <h3 className="font-bold text-white">{user.name}</h3>
              <span className="text-xs text-blue-400 capitalize">{category?.slice(0, -1) || 'User'}</span>
            </div>
          </div>
          <div className="flex gap-2 text-gray-400">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Phone size={20} /></button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Video size={20} /></button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-4 gap-2 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'}
              `}
            >
              <tab.icon size={16} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#151515]/50 relative">
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {isLoading && <div className="text-center text-gray-500">Loading history...</div>}
              
              {messages?.map((msg) => {
                const isMe = msg.sender_id === currentUser?.email;
                return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                            isMe 
                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                            : 'bg-[#252525] text-gray-200 rounded-tl-sm'
                        } shadow-lg group relative`}>
                            <p>{msg.content}</p>
                            {translations[msg.id] && (
                                <div className="mt-2 pt-2 border-t border-white/10 text-sm text-gray-300 italic flex items-center gap-1">
                                    <Globe size={10} /> {translations[msg.id]}
                                </div>
                            )}
                            <p className={`text-[10px] mt-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                {new Date(msg.created_date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            
                            {!isMe && (
                                <button 
                                    onClick={() => handleTranslate(msg.id, msg.content)}
                                    className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-[#333] text-gray-400 hover:text-white transition-all"
                                    title="Translate"
                                >
                                    <Globe size={14} />
                                </button>
                            )}
                        </div>
                        {/* Category Label if Detected (Simple Mock Visualization for now since backend analysis doesn't save to DB yet in this flow) */}
                    </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* AI Suggestions Area */}
            <div className="px-4 pt-2 bg-[#202020]">
                {isAnalyzing && <div className="text-xs text-blue-400 flex items-center gap-1 mb-2"><Sparkles size={10} className="animate-pulse"/> Analyzing conversation...</div>}
                {aiCategory && <div className="inline-block px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase mb-2 border border-purple-500/30">{aiCategory}</div>}
                <div className="flex flex-wrap gap-2 mb-2">
                    {suggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSend(null, suggestion)}
                            className="text-xs bg-[#1A1A1A] hover:bg-blue-600/20 hover:text-blue-300 border border-gray-700 hover:border-blue-500/50 text-gray-300 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
                        >
                            <Zap size={10} className="text-yellow-500" />
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#202020] border-t border-white/5 pt-2">
              <form onSubmit={(e) => handleSend(e)} className="flex items-center gap-3">
                <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-[#151515] text-white rounded-full px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 neu-pressed"
                  />
                  <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400 transition-colors">
                    <Smile size={20} />
                  </button>
                </div>
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                >
                  <Send size={20} className="ml-0.5" />
                </Button>
              </form>
            </div>
          </>
        )}

        {activeTab === 'stats' && <div className="flex-1 overflow-y-auto custom-scrollbar"><PlayerStats /></div>}
        {activeTab === 'schedule' && <div className="flex-1 overflow-y-auto custom-scrollbar"><PlayerSchedule /></div>}
        {activeTab === 'connections' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {category === 'fans' ? <FanConnections /> : <PlayerConnections />}
            </div>
        )}
      </div>
    </div>
  );
}