import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Users, Target, Sparkles, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import appIcon from '@/assets/app-icon.png';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="screen-container bg-background" dir="rtl">
      <div 
        className="scroll-container scrollbar-hide"
        style={{ paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-3 pt-safe">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/profile')}
              className="shrink-0"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold">אודות שפי</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Hero Section */}
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-glow">
              <img src={appIcon} alt="שפי – Chefi" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold mb-2">שפי – Chefi</h2>
            <p className="text-muted-foreground text-sm">העוזר האישי שלך לבישול חכם</p>
            <p className="text-xs text-muted-foreground/70 mt-1">מבית BudgetBites</p>
          </div>

          {/* Our Story */}
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">הסיפור שלנו</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                שפי נולד מתוך תסכול אמיתי – ראינו חברים, משפחה ואנשים צעירים מבזבזים 
                אלפי שקלים בחודש על משלוחים, רק כי הם חשבו שהם "לא יודעים לבשל".
              </p>
              <p>
                אבל האמת? כולם יכולים לבשל. צריך רק מישהו שילווה אותך צעד אחרי צעד, 
                בלי לשפוט, עם הרבה סבלנות ואהבה.
              </p>
              <p>
                ככה נולד שפי – השף האישי שלך. הוא לא מצפה שתהיה מושלם, הוא פשוט רוצה 
                לעזור לך להכין אוכל טעים, לחסוך כסף, ולהרגיש גאווה בכל ארוחה.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">המשימה שלנו</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              להפוך בישול ביתי לנגיש, פשוט ומהנה לכל אחד. אנחנו מאמינים שכל אחד יכול לבשל, 
              ושבישול בבית הוא לא רק דרך לחסוך כסף – אלא גם מתנה לעצמך ולאנשים שאתה אוהב.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">מה אנחנו מציעים</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ChefHat className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">מאות מתכונים בעברית</p>
                  <p className="text-xs">מותאמים לחומרים שיש לך בבית, עם הסברים פשוטים</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">שף AI אישי</p>
                  <p className="text-xs">עוזר לך בזמן אמת, עונה על שאלות ומלווה אותך צעד אחרי צעד</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-lg">💰</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">מעקב חסכונות</p>
                  <p className="text-xs">רואה בדיוק כמה כסף חסכת בהשוואה למשלוחים</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">הצוות</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              אנחנו צוות קטן של אנשים שמאמינים שטכנולוגיה יכולה לעזור לאנשים לחיות טוב יותר. 
              כל אחד מאיתנו עבר את המסע מ"לא יודע לבשל" ל"מכין ארוחות טעימות" – 
              ואנחנו כאן לעזור לכם לעשות את אותו המסע.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span>נבנה באהבה בישראל</span>
              <span>🇮🇱</span>
              <span>❤️</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 pb-2 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 rounded overflow-hidden">
                <img src={appIcon} alt="שפי" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold">שפי – Chefi</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by BudgetBites
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              © {new Date().getFullYear()} BudgetBites. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
