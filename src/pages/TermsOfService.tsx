import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full min-h-0 bg-background flex flex-col overflow-hidden" dir="rtl">
      <div className="flex-1 min-h-0 overflow-y-auto scroll-touch overscroll-none p-4 pt-safe-offset-4 pb-safe-offset-6">
        <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowRight className="w-4 h-4 ml-2" />
          חזרה
        </Button>

        <h1 className="text-2xl font-bold mb-6">תנאי שימוש</h1>
        <p className="text-sm text-muted-foreground mb-6">עודכן לאחרונה: דצמבר 2024</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. הסכמה לתנאים</h2>
            <p className="text-muted-foreground">
              בשימוש באפליקציית BudgetBites, אתה מסכים לתנאי שימוש אלה. אם אינך מסכים לתנאים, אנא הימנע משימוש באפליקציה.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. תיאור השירות</h2>
            <p className="text-muted-foreground">
              BudgetBites היא אפליקציה ללימוד בישול וחיסכון כספי. האפליקציה מספקת מתכונים, עוזר בישול מבוסס AI, ומעקב אחר חיסכון.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. חשבון משתמש</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>אתה אחראי לשמירה על סודיות פרטי החשבון שלך</li>
              <li>עליך לספק מידע מדויק ועדכני</li>
              <li>אסור להעביר את החשבון לאדם אחר</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. מנוי ותשלומים</h2>
            <p className="text-muted-foreground">
              האפליקציה מציעה תקופת ניסיון חינם של 30 יום. לאחר מכן, המנוי הוא בתשלום חודשי. ניתן לבטל בכל עת דרך הגדרות החשבון.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. שימוש אסור</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>שימוש לא חוקי או מזיק</li>
              <li>ניסיון לפרוץ או לשבש את השירות</li>
              <li>שימוש מסחרי ללא אישור</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. תוכן המתכונים</h2>
            <p className="text-muted-foreground">
              המתכונים מסופקים כמידע כללי בלבד. אנו לא אחראים לתגובות אלרגיות או בעיות בריאותיות. בדוק רכיבים לפני הכנה.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. הגבלת אחריות</h2>
            <p className="text-muted-foreground">
              השירות מסופק "כמות שהוא". אנו לא אחראים לנזקים ישירים או עקיפים הנובעים משימוש באפליקציה.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. שינויים בתנאים</h2>
            <p className="text-muted-foreground">
              אנו שומרים את הזכות לעדכן תנאים אלה. שינויים מהותיים יודיעו למשתמשים מראש.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. יצירת קשר</h2>
            <p className="text-muted-foreground">
              לשאלות בנוגע לתנאי השימוש:{' '}
              <a href="mailto:support@budgetbites.app" className="text-primary underline">
                support@budgetbites.app
              </a>
            </p>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
