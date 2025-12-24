import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/components/ChatMessage';
import ScreenLayout from '@/components/layout/ScreenLayout';
import { getRecipeById } from '@/lib/recipes';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { soundManager } from '@/lib/sounds';
import appLogo from '@/assets/app-logo.png';

type Message = { role: 'user' | 'assistant'; content: string };

export const CookingAssistant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addCookedMeal } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const recipe = getRecipeById(id || '');

  useEffect(() => {
    if (recipe) {
      const welcomeMessage = `היי! בוא נכין ${recipe.name} יחד! 🍳\n\nאני שפי, העוזר האישי שלך במטבח. אני אלווה אותך צעד אחרי צעד.\n\nאם יש לך שאלות בדרך - פשוט שאל אותי!\nמוכן להתחיל?`;
      setMessages([{ text: welcomeMessage, isBot: true }]);
      setChatHistory([{ role: 'assistant', content: welcomeMessage }]);
    }
  }, [recipe]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!recipe) {
    return (
      <ScreenLayout>
        <div className="h-full flex items-center justify-center">
          <p>המתכון לא נמצא</p>
        </div>
      </ScreenLayout>
    );
  }

  const sendToAI = async (userMessage: string, isStepAction = false) => {
    setIsLoading(true);
    
    const newChatHistory: Message[] = [...chatHistory, { role: 'user', content: userMessage }];
    
    try {
      const { data, error } = await supabase.functions.invoke('cooking-assistant', {
        body: {
          messages: newChatHistory,
          recipeName: recipe.name,
          currentStep: currentStep,
          totalSteps: recipe.steps.length,
          ingredients: recipe.ingredients.map(i => i.name),
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
        toast.error('שגיאה בתקשורת עם העוזר');
      }
      
      const fallbackResponses = [
        'מעולה! ממשיכים 💪',
        'נהדר! אתה מתקדם יפה! 🌟',
        'כל הכבוד! עוד צעד אחד 🎯',
      ];
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      setMessages(prev => [...prev, { text: fallback, isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const userText = currentStep === 0 ? 'מוכן להתחיל!' : 'סיימתי את השלב! ✅';
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setChatHistory(prev => [...prev, { role: 'user', content: userText }]);
    
    if (currentStep < recipe.steps.length) {
      const stepInstruction = recipe.steps[currentStep];
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      const isLastStep = newStep >= recipe.steps.length;
      
      const prompt = currentStep === 0 
        ? `המשתמש מוכן להתחיל. הנה השלב הראשון: "${stepInstruction}". תן הסבר קצר ועידוד.`
        : isLastStep
        ? `המשתמש סיים את כל השלבים! הנה השלב האחרון שהוא סיים: "${stepInstruction}". בשר אותו שהוא סיים וזה נראה טעים!`
        : `המשתמש סיים שלב ${currentStep}. הנה השלב הבא: "${stepInstruction}". תן הסבר קצר ועידוד.`;
      
      setIsLoading(true);
      
      try {
        const newChatHistory: Message[] = [...chatHistory, { role: 'user', content: userText }];
        
        const { data, error } = await supabase.functions.invoke('cooking-assistant', {
          body: {
            messages: newChatHistory,
            recipeName: recipe.name,
            currentStep: newStep,
            totalSteps: recipe.steps.length,
            ingredients: recipe.ingredients.map(i => i.name),
            stepInstruction: stepInstruction,
            isLastStep: isLastStep,
          },
        });

        if (error) throw error;
        
        const aiResponse = data.message;
        setChatHistory([...newChatHistory, { role: 'assistant', content: aiResponse }]);
        setMessages(prev => [...prev, { text: aiResponse, isBot: true }]);
        
        if (isLastStep) {
          soundManager.playSuccessSound();
        } else {
          soundManager.playStepSound();
        }
        
      } catch (error: any) {
        console.error('AI error:', error);
        setMessages(prev => [...prev, { text: stepInstruction, isBot: true }]);
      } finally {
        setIsLoading(false);
      }
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

  const handleComplete = () => {
    navigate(`/rate/${recipe.id}`);
  };

  const isComplete = currentStep >= recipe.steps.length;
  const progress = (currentStep / recipe.steps.length) * 100;

  return (
    <ScreenLayout scrollable={false} contentClassName="flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border/50 px-4 pb-4 pt-safe-offset-4 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold">{recipe.name}</h1>
            <p className="text-sm text-muted-foreground">
              שלב {Math.min(currentStep, recipe.steps.length)} מתוך {recipe.steps.length}
            </p>
          </div>
          <span className="text-3xl">{recipe.emoji}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto scroll-touch overscroll-none p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            isBot={msg.isBot}
          />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-card shrink-0">
              <img src={appLogo} alt="שפי" className="w-full h-full object-cover" />
            </div>
            <div className="bg-secondary rounded-2xl rounded-tr-md px-4 py-3">
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
      <div className="p-4 pb-safe-offset-4 border-t border-border/50 bg-card space-y-3 shrink-0">
        {/* Question Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="יש לך שאלה? שאל אותי..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputText.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Step Action Button */}
        {!isComplete ? (
          <Button onClick={handleNext} size="xl" className="w-full" disabled={isLoading}>
            {currentStep === 0 ? 'בואו נתחיל!' : 'הבא'}
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button onClick={handleComplete} size="xl" variant="default" className="w-full">
            <Check className="w-5 h-5" />
            סיימתי לבשל!
          </Button>
        )}
      </div>
    </ScreenLayout>
  );
};

export default CookingAssistant;
