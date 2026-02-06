import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Send, ArrowLeft, CheckCircle2, Sparkles, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * FormChat - A conversational chat interface for form filling
 *
 * Provides an AI-chat-like experience for filling out forms conversationally.
 * Users can respond via text input or quick reply buttons.
 */

// Generate unique IDs for messages
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Sample greeting messages
const GREETING_MESSAGES = [
  "Hi there! I'm here to help you fill out this form. Let's get started!",
  "Welcome! I'll guide you through each field step by step.",
  "Hello! Let's make filling out this form easy and conversational.",
  "Hey! Ready to help you complete this form. Just answer the questions as we go!",
];

// Field type to question mapping
const getFieldQuestion = (field) => {
  const { name, label, type, placeholder, required } = field;
  const fieldLabel = label || name;
  const requiredText = required ? '' : ' (optional)';

  const questionTemplates = {
    text: [
      `What's your ${fieldLabel.toLowerCase()}${requiredText}?`,
      `Please enter your ${fieldLabel.toLowerCase()}${requiredText}.`,
      `I'll need your ${fieldLabel.toLowerCase()}${requiredText}.`,
    ],
    email: [
      `What's your email address${requiredText}?`,
      `Could you provide your email${requiredText}?`,
      `What email should we use to contact you${requiredText}?`,
    ],
    phone: [
      `What's your phone number${requiredText}?`,
      `Could you share your phone number${requiredText}?`,
      `What's the best number to reach you at${requiredText}?`,
    ],
    tel: [
      `What's your phone number${requiredText}?`,
      `Could you share your phone number${requiredText}?`,
    ],
    number: [
      `What value would you like for ${fieldLabel.toLowerCase()}${requiredText}?`,
      `Please enter the ${fieldLabel.toLowerCase()}${requiredText}.`,
    ],
    date: [
      `When is the ${fieldLabel.toLowerCase()}${requiredText}?`,
      `What date should we use for ${fieldLabel.toLowerCase()}${requiredText}?`,
      `Please select a date for ${fieldLabel.toLowerCase()}${requiredText}.`,
    ],
    select: [
      `Which ${fieldLabel.toLowerCase()} would you prefer${requiredText}?`,
      `Please choose a ${fieldLabel.toLowerCase()}${requiredText}.`,
      `What ${fieldLabel.toLowerCase()} works best for you${requiredText}?`,
    ],
    radio: [
      `Which option would you like for ${fieldLabel.toLowerCase()}${requiredText}?`,
      `Please select your ${fieldLabel.toLowerCase()}${requiredText}.`,
    ],
    checkbox: [
      `Would you like to enable ${fieldLabel.toLowerCase()}${requiredText}?`,
      `Should we include ${fieldLabel.toLowerCase()}${requiredText}?`,
    ],
    textarea: [
      `Please describe ${fieldLabel.toLowerCase()}${requiredText}.`,
      `Tell me more about ${fieldLabel.toLowerCase()}${requiredText}.`,
      `What would you like to say for ${fieldLabel.toLowerCase()}${requiredText}?`,
    ],
  };

  const templates = questionTemplates[type] || questionTemplates.text;
  return templates[Math.floor(Math.random() * templates.length)];
};

// Get acknowledgment message for user response
const getAcknowledgment = (fieldName, value) => {
  const acknowledgments = [
    `Got it! ${value ? `I've noted "${value}" for ${fieldName}.` : `${fieldName} has been recorded.`}`,
    `Perfect, thanks for that!`,
    `Great, moving on!`,
    `Noted! Let's continue.`,
    `Excellent choice!`,
  ];
  return acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '600ms' }}
        />
      ))}
    </div>
  </div>
);

// Message Bubble Component
const MessageBubble = ({ message, isLast }) => {
  const isAI = message.type === 'ai';

  return (
    <div
      className={cn(
        'flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isAI ? 'items-start' : 'items-end'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] px-4 py-3 rounded-2xl',
          isAI
            ? 'bg-white/[0.07] border border-white/[0.06] text-white/90 rounded-tl-sm'
            : 'bg-[#c9a962] text-[#0f0f0f] rounded-tr-sm'
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={cn(
            'text-[10px] mt-1.5 opacity-60',
            isAI ? 'text-white/60' : 'text-[#0f0f0f]/60'
          )}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// Quick Reply Button Component
const QuickReplyButton = ({ option, onClick, disabled }) => (
  <button
    type="button"
    onClick={() => onClick(option)}
    disabled={disabled}
    className={cn(
      'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
      'bg-white/[0.05] border border-white/[0.1] text-white/80',
      'hover:bg-[#c9a962]/20 hover:border-[#c9a962]/40 hover:text-[#c9a962]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95'
    )}
  >
    {option}
  </button>
);

// Progress Bar Component
const ChatProgress = ({ current, total }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/50">Progress</span>
        <span className="text-xs text-[#c9a962] font-medium">
          {current} of {total} fields completed
        </span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#c9a962] to-[#e0c078] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ formData, sections, onComplete }) => {
  // Flatten all fields from sections
  const allFields = useMemo(() => {
    return sections.flatMap((section) => section.fields || []);
  }, [sections]);

  return (
    <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4 mx-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <h3 className="text-white font-semibold">All Done! Here's your summary:</h3>
      </div>

      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
        {allFields.map((field) => {
          const value = formData[field.name];
          if (!value && value !== 0 && value !== false) return null;

          return (
            <div
              key={field.name}
              className="flex justify-between items-start py-2 border-b border-white/[0.04] last:border-0"
            >
              <span className="text-white/50 text-sm">{field.label || field.name}</span>
              <span className="text-white/90 text-sm font-medium text-right max-w-[60%] truncate">
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
              </span>
            </div>
          );
        })}
      </div>

      <Button
        onClick={onComplete}
        className="w-full bg-gradient-to-r from-[#c9a962] to-[#b8954f] hover:from-[#d4b06f] hover:to-[#c9a962] text-[#0f0f0f] font-semibold rounded-xl py-3"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Build
      </Button>
    </div>
  );
};

// Main FormChat Component
export default function FormChat({
  sections = [],
  formData = {},
  onUpdate,
  onComplete,
  onSwitchMode,
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Flatten all fields from sections
  const allFields = useMemo(() => {
    return sections.flatMap((section) => section.fields || []);
  }, [sections]);

  const totalFields = allFields.length;
  const completedFields = Object.keys(formData).filter(
    (key) => formData[key] !== undefined && formData[key] !== '' && formData[key] !== null
  ).length;

  // Add a message to the chat
  const addMessage = useCallback((type, content, field = null, options = []) => {
    const newMessage = {
      id: generateId(),
      type,
      content,
      field,
      options,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setQuickReplies(options);
    return newMessage;
  }, []);

  // Simulate AI typing delay
  const simulateTyping = useCallback(async (duration = 800) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, duration));
    setIsTyping(false);
  }, []);

  // Get quick reply options for a field
  const getQuickRepliesForField = useCallback((field) => {
    if (!field) return [];

    const { type, options } = field;

    // For select/radio fields, use their options
    if ((type === 'select' || type === 'radio') && options) {
      return options.map((opt) => (typeof opt === 'string' ? opt : opt.label || opt.value));
    }

    // For checkbox fields
    if (type === 'checkbox') {
      return ['Yes', 'No'];
    }

    // For common field types, provide helpful suggestions
    if (type === 'email') {
      return [];
    }

    return [];
  }, []);

  // Ask the next question
  const askNextQuestion = useCallback(async () => {
    if (currentFieldIndex >= allFields.length) {
      // All fields completed
      await simulateTyping(600);
      addMessage(
        'ai',
        "That's everything! I've collected all the information. Please review the summary below and click 'Build' when you're ready.",
        null,
        []
      );
      setIsComplete(true);
      return;
    }

    const currentField = allFields[currentFieldIndex];
    const question = getFieldQuestion(currentField);
    const options = getQuickRepliesForField(currentField);

    await simulateTyping(Math.random() * 400 + 600);
    addMessage('ai', question, currentField.name, options);
  }, [currentFieldIndex, allFields, addMessage, simulateTyping, getQuickRepliesForField]);

  // Handle user response
  const handleUserResponse = useCallback(
    async (response) => {
      if (!response.trim() || isComplete) return;

      const currentField = allFields[currentFieldIndex];

      // Add user message
      addMessage('user', response, currentField?.name);
      setInputText('');
      setQuickReplies([]);

      // Update form data
      if (currentField && onUpdate) {
        let value = response;

        // Handle boolean conversion for checkbox fields
        if (currentField.type === 'checkbox') {
          value = response.toLowerCase() === 'yes' || response.toLowerCase() === 'true';
        }

        onUpdate({ ...formData, [currentField.name]: value });
      }

      // Show acknowledgment and ask next question
      await simulateTyping(Math.random() * 300 + 400);
      addMessage('ai', getAcknowledgment(currentField?.label || currentField?.name, response));

      setCurrentFieldIndex((prev) => prev + 1);
    },
    [allFields, currentFieldIndex, formData, onUpdate, addMessage, simulateTyping, isComplete]
  );

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserResponse(inputText);
    }
  };

  // Handle quick reply click
  const handleQuickReply = (option) => {
    handleUserResponse(option);
  };

  // Initialize chat with greeting
  useEffect(() => {
    if (messages.length === 0 && allFields.length > 0) {
      const greeting = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
      addMessage('ai', greeting);

      // Start asking the first question after greeting
      const timer = setTimeout(() => {
        askNextQuestion();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [messages.length, allFields.length, addMessage, askNextQuestion]);

  // Ask next question when field index changes
  useEffect(() => {
    if (currentFieldIndex > 0 && currentFieldIndex <= allFields.length && messages.length > 0) {
      const timer = setTimeout(() => {
        askNextQuestion();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentFieldIndex, askNextQuestion, allFields.length, messages.length]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when quick replies are cleared
  useEffect(() => {
    if (quickReplies.length === 0 && !isComplete) {
      inputRef.current?.focus();
    }
  }, [quickReplies, isComplete]);

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/[0.06]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a962] to-[#8b6914] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Form Assistant</h3>
            <p className="text-white/40 text-xs">Conversational Mode</p>
          </div>
        </div>

        {onSwitchMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwitchMode}
            className="text-white/50 hover:text-white hover:bg-white/[0.08] rounded-lg"
          >
            <LayoutList className="w-4 h-4 mr-2" />
            Form View
          </Button>
        )}
      </div>

      {/* Progress */}
      <ChatProgress current={completedFields} total={totalFields} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-start">
            <div className="bg-white/[0.07] border border-white/[0.06] rounded-2xl rounded-tl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        {isComplete && (
          <SummaryCard
            formData={formData}
            sections={sections}
            onComplete={onComplete}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && !isTyping && !isComplete && (
        <div className="px-4 py-3 border-t border-white/[0.04] bg-white/[0.02]">
          <p className="text-white/30 text-xs mb-2">Quick replies:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((option, index) => (
              <QuickReplyButton
                key={`${option}-${index}`}
                option={option}
                onClick={handleQuickReply}
                disabled={isTyping}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      {!isComplete && (
        <div className="p-4 bg-white/[0.02] border-t border-white/[0.06]">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your response..."
                disabled={isTyping}
                className={cn(
                  'w-full bg-white/[0.05] text-white rounded-xl px-4 py-3',
                  'border border-white/[0.08] placeholder:text-white/30',
                  'focus:outline-none focus:border-[#c9a962]/50 focus:ring-1 focus:ring-[#c9a962]/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-200'
                )}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!inputText.trim() || isTyping}
              className={cn(
                'rounded-xl w-12 h-12 transition-all duration-200',
                'bg-[#c9a962] hover:bg-[#d4b06f] text-[#0f0f0f]',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                'shadow-lg shadow-[#c9a962]/20'
              )}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      )}

      {/* Completed State - Back to Form Button */}
      {isComplete && (
        <div className="p-4 bg-white/[0.02] border-t border-white/[0.06]">
          <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Form completed! Review your answers above.</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Named exports for individual components
export { TypingIndicator, MessageBubble, QuickReplyButton, ChatProgress, SummaryCard };
