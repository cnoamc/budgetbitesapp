import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sparkles, ArrowLeft, Flame, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

export const Savings: React.FC = () => {
  const navigate = useNavigate();
  const { profile, progress, calculatePotentialSavings, calculateMonthlySavings } = useApp();
  
  const potentialMonthlySavings = calculatePotentialSavings();
  const potentialYearlySavings = potentialMonthlySavings * 12;
  const actualMonthlySavings = calculateMonthlySavings();
  const hasCooked = progress.totalMealsCooked > 0;

  // Calculate based on popular items
  const examples = [
    { name: 'המבורגר', home: 12, delivery: 65, emoji: '🍔' },
    { name: 'פסטה', home: 8, delivery: 55, emoji: '🍝' },
    { name: 'שקשוקה', home: 10, delivery: 45, emoji: '🍳' },
  ];

  return (
    <div className="min-h-screen bg-background p-6 pb-32">
      <div className="max-w-lg mx-auto">
        {/* Hero Section - Potential Savings */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-savings-light text-savings px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">פוטנציאל החיסכון שלך ✨</span>
          </div>
          
          <div className="relative">
            <h1 className="text-5xl font-bold text-savings mb-2">
              ₪{potentialMonthlySavings.toLocaleString()}
            </h1>
            <p className="text-muted-foreground">בחודש</p>
          </div>

          {/* Estimation Badge */}
          <div className="inline-flex items-center gap-1 mt-3 bg-secondary px-3 py-1.5 rounded-full">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">הערכה בהתבסס על ההרגלים שלך</span>
          </div>
        </div>

        {/* Explanation Text */}
        <div className="text-center mb-6 px-4">
          <p className="text-sm text-muted-foreground">
            בהתבסס על ההרגלים שלך – זה מה שאתה יכול לחסוך אם תתחיל לבשל בבית
          </p>
        </div>

        {/* Yearly Savings */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">חיסכון שנתי פוטנציאלי</p>
              <p className="text-3xl font-bold text-savings">₪{potentialYearlySavings.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-savings-light rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-savings" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            זה מספיק לחופשה! ✈️
          </p>
        </div>

        {/* Actual Savings - Only show if user has cooked */}
        {hasCooked && (
          <div className="bg-primary/10 rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">חסכת בפועל החודש 🎉</p>
                <p className="text-2xl font-bold text-primary">₪{actualMonthlySavings.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{progress.totalMealsCooked}</p>
                <p className="text-xs text-muted-foreground">ארוחות</p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-secondary/50 rounded-xl p-3 mb-6 text-center">
          <p className="text-xs text-muted-foreground">
            💡 החיסכון בפועל ייספר לאחר הכנת ארוחות
          </p>
        </div>

        {/* Examples */}
        <h2 className="font-semibold text-lg mb-4">דוגמאות לחיסכון</h2>
        <div className="space-y-3">
          {examples.map((item, index) => (
            <div 
              key={item.name}
              className="bg-card rounded-xl p-4 shadow-card border border-border/50 animate-slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex gap-3 text-sm mt-1">
                    <span className="text-muted-foreground">
                      ביתי: <span className="font-medium text-foreground">₪{item.home}</span>
                    </span>
                    <span className="text-muted-foreground">
                      משלוח: <span className="line-through">₪{item.delivery}</span>
                    </span>
                  </div>
                </div>
                <div className="bg-savings-light text-savings px-3 py-1 rounded-full font-medium">
                  -₪{item.delivery - item.home}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivation */}
        <div className="bg-primary/10 rounded-2xl p-5 mt-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex gap-3">
            <Flame className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">מוכן להתחיל לחסוך?</p>
              <p className="text-sm text-muted-foreground">
                יש לנו מתכונים פשוטים שכל אחד יכול להכין. 
                בוא נתחיל מהמתכון הראשון שלך!
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-lg mx-auto">
            <Button
              onClick={() => navigate('/recipes')}
              size="xl"
              className="w-full"
            >
              יאללה, מתחילים לבשל ולחסוך!
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Savings;
