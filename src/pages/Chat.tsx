import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/components/ChatMessage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { soundManager } from '@/lib/sounds';
import appLogo from '@/assets/app-logo.png';
import { FixedScreenLayout } from '@/components/layouts';

type Message = { role: 'user' | 'assistant'; content: string };

const CHAT_STORAGE_KEY = 'bb_chat_history';

const suggestedTopics = [
  { emoji: '🍳', text: 'מה לבשל היום?' },
  { emoji: '💰', text: 'איך לחסוך בקניות?' },
  { emoji: '🥗', text: 'טיפים לאכילה בריאה' },
  { emoji: '⏱️', text: 'מתכונים מהירים' },
];

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMessages(parsed.messages || []);
        setChatHistory(parsed.chatHistory || []);
      } catch {
        // Show welcome if no history
        showWelcome();
      }
    } else {
      showWelcome();
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ messages, chatHistory }));
    }
  }, [messages, chatHistory]);

  const showWelcome = () => {
    const welcomeMessage = `היי! 👋 אני שפי, העוזר האישי שלך במטבח!\n\nאני כאן לעזור לך עם כל שאלה על בישול, מתכונים, חיסכון באוכל ועוד.\n\nמה תרצה לדעת?`;
    setMessages([{ text: welcomeMessage, isBot: true }]);
    setChatHistory([{ role: 'assistant', content: welcomeMessage }]);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToAI = async (userMessage: string) => {
    setIsLoading(true);
    
    const newChatHistory: Message[] = [...chatHistory, { role: 'user', content: userMessage }];
    
    try {
      const { data, error } = await supabase.functions.invoke('cooking-assistant', {
        body: {
          messages: newChatHistory,
          recipeName: null,
          currentStep: 0,
          totalSteps: 0,
          ingredients: [],
        },
      });

      if (error) throw error;
      
      const aiResponse = data.message;
      
      setChatHistory([...newChatHistory, { role: 'assistant', content: aiResponse }]);
      setMessages(prev => [...prev, { text: aiResponse, isBot: true }]);
      
      soundManager.playMessageSound();
      
    } catch (error: any) {
      console.error('AI error:', error);
      
      if (error.status === 429) {
        toast.error('יותר מדי בקשות, נסה שוב בעוד כמה שניות');
      } else if (error.status === 402) {
        toast.error('נגמרו הקרדיטים');
      } else {
        toast.error('שגיאה בתקשורת עם שפי');
      }
      
      const fallbackResponses = [
        'סליחה, יש לי בעיה טכנית קטנה. נסה שוב בעוד רגע! 🙏',
        'אופס! משהו השתבש. בוא ננסה שוב? 😅',
      ];
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      setMessages(prev => [...prev, { text: fallback, isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    
    await sendToAI(userMessage);
  };

  const handleSuggestedTopic = async (topic: string) => {
    if (isLoading) return;
    setMessages(prev => [...prev, { text: topic, isBot: false }]);
    await sendToAI(topic);
  };

  const handleClearChat = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    showWelcome();
    toast.success('הצ׳אט נוקה');
  };

  return (
    <FixedScreenLayout className="bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-card">
            <img src={appLogo} alt="שפי" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg">שפי</h1>
            <p className="text-sm text-muted-foreground">העוזר האישי שלך במטבח</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat}
            className="text-xs text-muted-foreground"
          >
            נקה צ׳אט
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4"
        data-scrollable="true"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            isBot={msg.isBot}
          />
        ))}
        
        {/* Suggested Topics - only show after welcome */}
        {messages.length === 1 && (
          <div className="space-y-2 animate-fade-in">
            <p className="text-sm text-muted-foreground text-center mb-3">או בחר נושא:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedTopics.map((topic) => (
                <button
                  key={topic.text}
                  onClick={() => handleSuggestedTopic(topic.text)}
                  className="p-3 bg-secondary/60 hover:bg-secondary rounded-xl text-sm font-medium transition-colors flex items-center gap-2 justify-center"
                >
                  <span>{topic.emoji}</span>
                  <span>{topic.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-card shrink-0">
              <img src={appLogo} alt="שפי" className="w-full h-full object-cover" />
            </div>
            <div className="bg-card shadow-card border border-border/50 rounded-2xl rounded-tr-none px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }} />
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-card pb-24">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="שאל אותי משהו..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputText.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </FixedScreenLayout>
  );
};

export default Chat;
