import React from 'react';
import { ArrowRight, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const Support: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: 'איך מבטלים את המנוי?',
      answer: 'ניתן לבטל את המנוי בכל עת דרך הגדרות הפרופיל. הביטול ייכנס לתוקף בסוף תקופת החיוב הנוכחית.'
    },
    {
      question: 'איך החיסכון מחושב?',
      answer: 'החיסכון מחושב על סמך ההפרש בין עלות הזמנת אוכל לעלות הכנת הארוחה בבית, כפול מספר הארוחות השבועיות שלך.'
    },
    {
      question: 'האם המתכונים מתאימים לאלרגיות?',
      answer: 'כל מתכון כולל רשימת רכיבים מלאה. אנא בדוק את הרכיבים בקפידה לפני הכנה אם יש לך אלרגיות.'
    },
    {
      question: 'איך משנים את רמת הקושי?',
      answer: 'ניתן לעדכן את רמת המיומנות בבישול דרך מילוי השאלון מחדש בהגדרות הפרופיל.'
    },
    {
      question: 'האם ניתן להשתמש באפליקציה אופליין?',
      answer: 'כרגע האפליקציה דורשת חיבור לאינטרנט. אנו עובדים על תמיכה אופליין בעדכונים עתידיים.'
    }
  ];

  return (
    <div className="h-full min-h-0 bg-background flex flex-col overflow-hidden" dir="rtl">
      <div className="flex-1 min-h-0 overflow-y-auto scroll-touch overscroll-none p-4 pt-safe-offset-4 pb-safe-offset-6">
        <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowRight className="w-4 h-4 ml-2" />
          חזרה
        </Button>

        <h1 className="text-2xl font-bold mb-6">תמיכה ועזרה</h1>

        {/* Contact Options */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            צור קשר
          </h2>
          
          <div className="space-y-3">
            <a 
              href="mailto:support@budgetbites.app"
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">אימייל</p>
                <p className="text-sm text-muted-foreground">support@budgetbites.app</p>
              </div>
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            זמן תגובה ממוצע: עד 24 שעות בימי עסקים
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            שאלות נפוצות
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>BudgetBites גרסה 1.0.0</p>
          <p className="mt-1">© 2024 BudgetBites. כל הזכויות שמורות.</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
