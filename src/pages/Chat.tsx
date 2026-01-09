import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Timer, Plus, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/components/ChatMessage';
import { CookingTimer } from '@/components/CookingTimer';
import { AddRecipeDialog } from '@/components/AddRecipeDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { soundManager } from '@/lib/sounds';
import appLogo from '@/assets/app-logo.png';
import { cn } from '@/lib/utils';

type Message = { role: 'user' | 'assistant'; content: string };

interface ActiveTimer {
  id: string;
  minutes: number;
  label: string;
}

const CHAT_STORAGE_KEY = 'bb_chat_history';
const SEED_CONSUMED_KEY = 'bb_chat_seed_consumed';

const suggestedTopics = [
  { emoji: '🍳', text: 'מה לבשל היום?' },
  { emoji: '💰', text: 'איך לחסוך בקניות?' },
  { emoji: '🥗', text: 'טיפים לאכילה בריאה' },
  { emoji: '⏱️', text: 'מתכונים מהירים' },
];

const quickActions = [
  { emoji: '⏱️', text: 'הפעל טיימר', action: 'timer' },
  { emoji: '📝', text: 'הוסף מתכון', action: 'recipe' },
];

export const Chat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get seed from query params (preferred) or location state (fallback)
  const seedParam = searchParams.get('seed');
  const initialMessage = seedParam ? decodeURIComponent(seedParam) : (location.state?.initialMessage as string | undefined);
  
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Guard ref to prevent double auto-send
  const didAutoSendRef = useRef(false);

  // Load chat history from localStorage OR handle initial message - runs once on mount
  useEffect(() => {
    // Check if this seed was already consumed (prevents double-send on re-render)
    const consumedSeed = sessionStorage.getItem(SEED_CONSUMED_KEY);
    const currentSeed = seedParam || initialMessage;
    
    // If there's an initial message and we haven't sent it yet
    if (currentSeed && !didAutoSendRef.current && consumedSeed !== currentSeed) {
      didAutoSendRef.current = true;
      
      // Mark as consumed immediately
      sessionStorage.setItem(SEED_CONSUMED_KEY, currentSeed);
      
      // Clear query params from URL without navigation
      if (seedParam) {
        window.history.replaceState({}, '', '/chat');
      }
      
      // Show welcome and immediately add user message + send to AI
      const welcomeMessage = `היי! 👋 אני שפי, העוזר האישי שלך במטבח!\n\nאני כאן לעזור לך עם כל שאלה על בישול, מתכונים, חיסכון באוכל ועוד.\n\n⏱️ אפשר להפעיל טיימר לבישול\n📝 אפשר להוסיף מתכונים משלך\n\nמה תרצה לדעת?`;
      
      setMessages([
        { text: welcomeMessage, isBot: true },
        { text: currentSeed, isBot: false }
      ]);
      setChatHistory([
        { role: 'assistant', content: welcomeMessage },
        { role: 'user', content: currentSeed }
      ]);
      
      // Send to AI
      sendToAIInitial(currentSeed, [
        { role: 'assistant', content: welcomeMessage },
        { role: 'user', content: currentSeed }
      ]);
      return;
    }

    // Normal load from storage (only if no initial message)
    if (!currentSeed) {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setMessages(parsed.messages || []);
          setChatHistory(parsed.chatHistory || []);
        } catch {
          showWelcome();
        }
      } else {
        showWelcome();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ messages, chatHistory }));
    }
  }, [messages, chatHistory]);

  const showWelcome = () => {
    const welcomeMessage = `היי! 👋 אני שפי, העוזר האישי שלך במטבח!\n\nאני כאן לעזור לך עם כל שאלה על בישול, מתכונים, חיסכון באוכל ועוד.\n\n⏱️ אפשר להפעיל טיימר לבישול\n📝 אפשר להוסיף מתכונים משלך\n\nמה תרצה לדעת?`;
    setMessages([{ text: welcomeMessage, isBot: true }]);
    setChatHistory([{ role: 'assistant', content: welcomeMessage }]);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTimers]);

  // Send to AI for initial message (with pre-built history)
  const sendToAIInitial = async (userMessage: string, history: Message[]) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('cooking-assistant', {
        body: {
          messages: history,
          recipeName: null,
          currentStep: 0,
          totalSteps: 0,
          ingredients: [],
        },
      });

      if (error) throw error;
      
      const aiResponse = data.message;
      
      setChatHistory([...history, { role: 'assistant', content: aiResponse }]);
      setMessages(prev => [...prev, { text: aiResponse, isBot: true }]);
      
      soundManager.playMessageSound();
      
    } catch (error: any) {
      console.error('AI error:', error);
      handleAIError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIError = (error: any) => {
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
  };

  const sendToAI = async (userMessage: string) => {
    setIsLoading(true);
    
    // Check for timer commands
    const timerMatch = userMessage.match(/טיימר.*?(\d+)\s*דקות?|(\d+)\s*דקות?\s*טיימר/);
    if (timerMatch) {
      const minutes = parseInt(timerMatch[1] || timerMatch[2]);
      if (minutes > 0 && minutes <= 180) {
        addTimer(minutes, `טיימר ${minutes} דקות`);
        const response = `הפעלתי טיימר ל-${minutes} דקות! ⏱️\nאזכיר לך כשהזמן יגמר.`;
        setMessages(prev => [...prev, { text: response, isBot: true }]);
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }, { role: 'assistant', content: response }]);
        setIsLoading(false);
        return;
      }
    }
    
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
      handleAIError(error);
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

  const handleQuickAction = (action: string) => {
    if (action === 'timer') {
      setShowTimerPicker(true);
    } else if (action === 'recipe') {
      setIsAddRecipeOpen(true);
    }
  };

  const addTimer = (minutes: number, label: string) => {
    const newTimer: ActiveTimer = {
      id: Date.now().toString(),
      minutes,
      label,
    };
    setActiveTimers(prev => [...prev, newTimer]);
    setShowTimerPicker(false);
    toast.success(`טיימר ${minutes} דקות הופעל! ⏱️`);
  };

  const removeTimer = (id: string) => {
    setActiveTimers(prev => prev.filter(t => t.id !== id));
  };

  const handleClearChat = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    showWelcome();
    toast.success('הצ׳אט נוקה');
  };

  const handleRecipeAdded = () => {
    const response = 'מעולה! 🎉 המתכון נוסף בהצלחה לאוסף שלך.\nאתה יכול למצוא אותו בלשונית "המתכונים שלי" בעמוד המתכונים.';
    setMessages(prev => [...prev, { text: response, isBot: true }]);
    setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-background"
      style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-card border-b border-border/50 p-4 shrink-0">
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

      {/* Chat Messages - scrollable area with proper bottom padding */}
      <div 
        className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 'calc(180px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            isBot={msg.isBot}
          />
        ))}
        
        {/* Active Timers */}
        {activeTimers.map((timer) => (
          <div key={timer.id} className="animate-slide-up">
            <CookingTimer
              initialMinutes={timer.minutes}
              label={timer.label}
              onClose={() => removeTimer(timer.id)}
              onComplete={() => {
                const completeMsg = `⏰ ${timer.label} - הזמן נגמר!`;
                setMessages(prev => [...prev, { text: completeMsg, isBot: true }]);
              }}
            />
          </div>
        ))}
        
        {/* Timer Picker */}
        {showTimerPicker && (
          <div className="bg-card rounded-2xl p-4 border border-border/50 animate-slide-up">
            <p className="text-sm font-medium mb-3 text-center">בחר זמן לטיימר:</p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 5, 10, 15, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => addTimer(mins, `טיימר ${mins} דק׳`)}
                  className="py-3 bg-secondary hover:bg-muted rounded-xl text-sm font-medium transition-colors"
                >
                  {mins} דק׳
                </button>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => setShowTimerPicker(false)}
            >
              ביטול
            </Button>
          </div>
        )}
        
        {/* Suggested Topics - only show after welcome */}
        {messages.length === 1 && (
          <div className="space-y-3 animate-fade-in">
            {/* Quick Actions */}
            <div className="flex gap-2 justify-center">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <span>{action.emoji}</span>
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground text-center">או בחר נושא:</p>
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

      {/* Quick Action Buttons */}
      {messages.length > 1 && !showTimerPicker && (
        <div className="px-4 pb-2 flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
            onClick={() => setShowTimerPicker(true)}
          >
            <Timer className="w-3 h-3 ml-1" />
            טיימר
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
            onClick={() => setIsAddRecipeOpen(true)}
          >
            <Plus className="w-3 h-3 ml-1" />
            מתכון חדש
          </Button>
        </div>
      )}

      {/* Input Area - fixed at bottom with proper spacing for navbar */}
      <div 
        className="shrink-0 p-4 border-t border-border/50 bg-card"
        style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}
      >
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

      {/* Add Recipe Dialog */}
      <AddRecipeDialog
        open={isAddRecipeOpen}
        onOpenChange={setIsAddRecipeOpen}
        onRecipeAdded={handleRecipeAdded}
      />
    </div>
  );
};

export default Chat;
