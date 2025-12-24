import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full min-h-0 bg-background p-4 pt-safe-offset-4 pb-safe-offset-6 overflow-y-auto scroll-touch overscroll-none" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowRight className="w-4 h-4 ml-2" />
          חזרה
        </Button>

        <h1 className="text-2xl font-bold mb-6">מדיניות פרטיות</h1>
        <p className="text-sm text-muted-foreground mb-6">עודכן לאחרונה: דצמבר 2024</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. מידע שאנו אוספים</h2>
            <p className="text-muted-foreground">
              אנו אוספים את המידע הבא כדי לספק לך את השירות:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>פרטי חשבון (אימייל, מספר טלפון)</li>
              <li>שם תצוגה ותמונת פרופיל (אופציונלי)</li>
              <li>העדפות אוכל ורמת מיומנות בבישול</li>
              <li>היסטוריית ארוחות ודירוגים</li>
              <li>נתוני הוצאות על אוכל (לחישוב חיסכון)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. כיצד אנו משתמשים במידע</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>התאמה אישית של המלצות מתכונים</li>
              <li>חישוב החיסכון הפוטנציאלי שלך</li>
              <li>מעקב אחר התקדמות והישגים</li>
              <li>שליחת התראות והודעות (אם אישרת)</li>
              <li>שיפור השירות והחוויה</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. אבטחת מידע</h2>
            <p className="text-muted-foreground">
              המידע שלך מאוחסן באופן מאובטח בשרתים מוגנים. אנו משתמשים בהצפנה ואמצעי אבטחה מתקדמים להגנה על הנתונים שלך.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. שיתוף מידע</h2>
            <p className="text-muted-foreground">
              אנו לא מוכרים או משתפים את המידע האישי שלך עם צדדים שלישיים למטרות שיווק. המידע עשוי להיות משותף רק עם ספקי שירות הנדרשים להפעלת האפליקציה.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. הזכויות שלך</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>גישה למידע האישי שלך</li>
              <li>תיקון מידע לא מדויק</li>
              <li>מחיקת החשבון והמידע שלך</li>
              <li>ביטול הרשמה להתראות</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. יצירת קשר</h2>
            <p className="text-muted-foreground">
              לשאלות בנוגע לפרטיות, ניתן ליצור קשר בכתובת:{' '}
              <a href="mailto:privacy@budgetbites.app" className="text-primary underline">
                privacy@budgetbites.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
