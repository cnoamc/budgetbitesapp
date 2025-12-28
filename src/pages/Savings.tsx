import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sparkles, ArrowLeft, Flame, Info, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { useApp } from '@/contexts/AppContext';
import { getSmartSavingsText } from '@/lib/notifications';

export const Savings: React.FC = () => {
  const navigate = useNavigate();
  const { profile, progress, potentialMonthlySavings, monthlySavings, yearlySavings } = useApp();
  
  const potentialYearlySavings = yearlySavings;
  const actualMonthlySavings = monthlySavings;
  const hasCooked = progress.totalMealsCooked > 0;

  const examples = [
    { name: 'המבורגר', home: 12, delivery: 65, emoji: '🍔' },
    { name: 'פסטה', home: 8, delivery: 55, emoji: '🍝' },
    { name: 'שקשוקה', home: 10, delivery: 45, emoji: '🍳' },
  ];

  return (
    <GradientBackground variant="fresh">
      <div className="min-h-screen p-6 pb-40">
        <div className="max-w-lg mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 pt-4 animate-scale-in">
            <div className="inline-flex items-center gap-2 bg-savings-light text-savings px-4 py-2 rounded-full mb-6 shadow-soft">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">פוטנציאל החיסכון שלך ✨</span>
            </div>
            
            <div className="relative mb-4">
              <h1 className="text-6xl font-bold text-savings mb-2">
                ₪{potentialMonthlySavings.toLocaleString()}
              </h1>
              <p className="text-lg text-muted-foreground">בחודש</p>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-secondary/60 px-4 py-2 rounded-full">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">הערכה בהתבסס על ההרגלים שלך</span>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-center text-sm text-muted-foreground mb-8 px-4">
            בהתבסס על ההרגלים שלך – זה מה שאתה יכול לחסוך אם תתחיל לבשל בבית
          </p>

          {/* Yearly Savings Card */}
          <PremiumCard variant="elevated" className="p-6 mb-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">חיסכון שנתי פוטנציאלי</p>
                <p className="text-4xl font-bold text-savings">₪{potentialYearlySavings.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 bg-savings-light rounded-2xl flex items-center justify-center shadow-soft">
                <TrendingUp className="w-8 h-8 text-savings" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                {getSmartSavingsText(potentialYearlySavings)}
              </p>
            </div>
          </PremiumCard>

          {/* Actual Savings */}
          {hasCooked && (
            <PremiumCard variant="glow" className="p-5 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🎉</span>
                    <p className="text-sm text-muted-foreground">חסכת בפועל החודש</p>
                  </div>
                  <p className="text-3xl font-bold text-black">₪{actualMonthlySavings.toLocaleString()}</p>
                </div>
                <div className="text-center bg-black/5 rounded-2xl px-4 py-2">
                  <p className="text-2xl font-bold">{progress.totalMealsCooked}</p>
                  <p className="text-xs text-muted-foreground">ארוחות</p>
                </div>
              </div>
            </PremiumCard>
          )}

          {/* Disclaimer */}
          <div className="bg-secondary/40 rounded-2xl p-4 mb-8 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Wallet className="w-4 h-4" />
              החיסכון בפועל ייספר לאחר הכנת ארוחות
            </p>
          </div>

          {/* Examples */}
          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span>
              דוגמאות לחיסכון
            </h2>
            <div className="space-y-3">
              {examples.map((item, index) => (
                <PremiumCard 
                  key={item.name}
                  className="p-4 animate-slide-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-secondary to-muted rounded-2xl flex items-center justify-center text-3xl shadow-soft">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-lg">{item.name}</p>
                      <div className="flex gap-4 text-sm mt-1">
                        <span className="text-muted-foreground">
                          ביתי: <span className="font-semibold text-foreground">₪{item.home}</span>
                        </span>
                        <span className="text-muted-foreground">
                          משלוח: <span className="line-through">₪{item.delivery}</span>
                        </span>
                      </div>
                    </div>
                    <div className="bg-savings-light text-savings px-3 py-2 rounded-xl font-bold">
                      -₪{item.delivery - item.home}
                    </div>
                  </div>
                </PremiumCard>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <PremiumCard variant="glass" className="p-5 animate-fade-in">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">מוכן להתחיל לחסוך?</p>
                <p className="text-sm text-muted-foreground">
                  יש לנו מתכונים פשוטים שכל אחד יכול להכין. 
                  בוא נתחיל מהמתכון הראשון שלך!
                </p>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent">
          <div className="max-w-lg mx-auto">
            <Button
              onClick={() => navigate('/recipes')}
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-medium shadow-elevated btn-press"
            >
              יאללה, מתחילים לבשל ולחסוך! 🍳
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Savings;