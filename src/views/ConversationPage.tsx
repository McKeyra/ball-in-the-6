'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Send,
  Camera,
  Paperclip,
  Phone,
  Video,
  Check,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

interface MessageGroup {
  label: string;
  messages: ChatMessage[];
}

const CONTACT = {
  name: 'Caleb Smith',
  handle: '@caleb_buckets',
  avatar: 'CS',
  avatarColor: 'from-orange-500 to-red-500',
  online: true,
  verified: true,
};

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm-01', text: 'Yo what up bro, you coming out tonight?', sent: false, time: '6:12 PM', status: 'read' },
  { id: 'm-02', text: "Pan Am is open till 10. We're running 5s", sent: false, time: '6:12 PM', status: 'read' },
  { id: 'm-03', text: "Say less, I'm there. What time you pulling up?", sent: true, time: '6:15 PM', status: 'read' },
  { id: 'm-04', text: 'Probably around 7. Need to warm up first, my shot was off yesterday', sent: false, time: '6:16 PM', status: 'read' },
  { id: 'm-05', text: "Bro your shot is never off lol you dropped 28 last game", sent: true, time: '6:17 PM', status: 'read' },
  { id: 'm-06', text: "Haha facts. But DunkCity is pulling up too so it's gonna be competitive", sent: false, time: '6:18 PM', status: 'read' },
  { id: 'm-07', text: 'Oh word? Good. I need that energy', sent: true, time: '6:20 PM', status: 'read' },
  { id: 'm-08', text: "Marcus said he's coming with the Northside crew", sent: false, time: '6:22 PM', status: 'read' },
  { id: 'm-09', text: "That's a squad right there. We need CourtKing too", sent: true, time: '6:23 PM', status: 'read' },
  { id: 'm-10', text: "Already texted him. He said he's locked in", sent: false, time: '6:24 PM', status: 'read' },
  { id: 'm-11', text: 'Perfect. We got winners all night', sent: true, time: '6:25 PM', status: 'read' },
  { id: 'm-12', text: 'Btw did you see the summer league bracket dropped?', sent: false, time: '7:01 PM', status: 'read' },
  { id: 'm-13', text: "Nah not yet, what's it looking like?", sent: true, time: '7:03 PM', status: 'read' },
  { id: 'm-14', text: 'We got East York first round. Then probably B.M.T. Titans in semis', sent: false, time: '7:04 PM', status: 'read' },
  { id: 'm-15', text: "East York is light. B.M.T. is tough tho, they've been running", sent: true, time: '7:05 PM', status: 'delivered' },
  { id: 'm-16', text: "Facts. But we're built different this year", sent: false, time: '7:06 PM', status: 'read' },
  { id: 'm-17', text: 'Yo pull up to Pan Am tonight, we got a 5v5 going', sent: false, time: '7:30 PM', status: 'read' },
];

const groupMessages = (messages: ChatMessage[]): MessageGroup[] => {
  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup | null = null;

  for (const msg of messages) {
    const hour = parseInt(msg.time.split(':')[0], 10);
    const label = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
    const groupLabel = `Today, ${label}`;

    if (!currentGroup || currentGroup.label !== groupLabel) {
      currentGroup = { label: groupLabel, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(msg);
  }

  return groups;
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 px-4 py-2">
    <div className="flex items-center gap-1 rounded-[18px] rounded-bl-[4px] bg-surface px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-neutral-400"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  </div>
);

export const ConversationPage: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback((): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback((): void => {
    const text = input.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      text,
      sent: true,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    inputRef.current?.focus();

    // Simulate typing + auto-reply
    setIsTyping(true);
    const replyTimer = setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Facts bro, let's run it",
        'Say less',
        "We're locked in tonight",
        'Pull up, no excuses',
        "That's tuff, I'm with it",
      ];
      const reply: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        text: replies[Math.floor(Math.random() * replies.length)],
        sent: false,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        status: 'read',
      };
      setMessages((prev) => [...prev, reply]);
    }, 1800);

  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const grouped = groupMessages(messages);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="sticky top-0 z-40 bg-void/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.push('/messages')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              aria-label="Back to messages"
            >
              <ArrowLeft className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
            </button>
            <div className="relative shrink-0">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-black text-white',
                  CONTACT.avatarColor
                )}
              >
                {CONTACT.avatar}
              </div>
              {CONTACT.online && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-neutral-900 truncate">{CONTACT.name}</span>
                {CONTACT.verified && (
                  <span className="shrink-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-lime">
                    <Check className="h-2 w-2 text-black" strokeWidth={3} />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-emerald-500 font-medium">Active now</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              aria-label="Voice call"
            >
              <Phone className="h-[17px] w-[17px] text-neutral-500" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              aria-label="Video call"
            >
              <Video className="h-[17px] w-[17px] text-neutral-500" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              aria-label="More options"
            >
              <MoreVertical className="h-[17px] w-[17px] text-neutral-500" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {grouped.map((group) => (
          <div key={group.label}>
            {/* Time Separator */}
            <div className="flex items-center justify-center my-4">
              <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {group.label}
              </span>
            </div>

            {/* Messages */}
            {group.messages.map((msg, idx) => {
              const isFirst =
                idx === 0 || group.messages[idx - 1].sent !== msg.sent;
              const isLast =
                idx === group.messages.length - 1 ||
                group.messages[idx + 1].sent !== msg.sent;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex',
                    msg.sent ? 'justify-end' : 'justify-start',
                    isFirst ? 'mt-3' : 'mt-0.5'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[78%] px-4 py-2.5 text-[14.5px] leading-relaxed',
                      msg.sent
                        ? cn(
                            'bg-[#c8ff00]/20 text-neutral-900',
                            isFirst && isLast
                              ? 'rounded-[20px]'
                              : isFirst
                                ? 'rounded-[20px] rounded-br-[6px]'
                                : isLast
                                  ? 'rounded-[20px] rounded-tr-[6px]'
                                  : 'rounded-[20px] rounded-r-[6px]'
                          )
                        : cn(
                            'bg-surface text-neutral-800',
                            isFirst && isLast
                              ? 'rounded-[20px]'
                              : isFirst
                                ? 'rounded-[20px] rounded-bl-[6px]'
                                : isLast
                                  ? 'rounded-[20px] rounded-tl-[6px]'
                                  : 'rounded-[20px] rounded-l-[6px]'
                          )
                    )}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              );
            })}

            {/* Timestamp + Read Status for last in group */}
            {group.messages.length > 0 && (
              <div
                className={cn(
                  'flex items-center gap-1 mt-1 mb-1 px-1',
                  group.messages[group.messages.length - 1].sent
                    ? 'justify-end'
                    : 'justify-start'
                )}
              >
                <span className="text-[10px] text-neutral-400">
                  {group.messages[group.messages.length - 1].time}
                </span>
                {group.messages[group.messages.length - 1].sent && (
                  <Check
                    className={cn(
                      'h-3 w-3',
                      group.messages[group.messages.length - 1].status === 'read'
                        ? 'text-lime-dark'
                        : 'text-neutral-400'
                    )}
                    strokeWidth={2.5}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message Input Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky bottom-0 z-40 bg-void/80 backdrop-blur-2xl border-t border-neutral-200/60 px-3 py-3 pb-safe"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
            aria-label="Take photo"
          >
            <Camera className="h-5 w-5 text-neutral-500" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5 text-neutral-500" strokeWidth={1.8} />
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              className="w-full rounded-full bg-surface border border-neutral-200/60 py-2.5 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-lime/40 focus:ring-1 focus:ring-lime/20 transition-colors"
            />
          </div>
          <motion.button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all',
              input.trim()
                ? 'bg-lime text-black shadow-[0_0_12px_rgba(200,255,0,0.3)]'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            <Send className="h-[18px] w-[18px]" strokeWidth={2} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
