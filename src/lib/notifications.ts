export type NotificationCategory = 
  | 'delivery_vs_cooking'
  | 'savings_progress'
  | 'smart_reminder'
  | 'weekly_summary'
  | 'motivational';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  emoji?: string;
  createdAt: Date;
  read: boolean;
}

export interface NotificationSettings {
  delivery_vs_cooking: boolean;
  savings_progress: boolean;
  smart_reminder: boolean;
  weekly_summary: boolean;
  motivational: boolean;
  quietHoursStart: number; // 0-23
  quietHoursEnd: number; // 0-23
  frequency: 'daily' | 'smart' | 'minimal';
}

export const defaultNotificationSettings: NotificationSettings = {
  delivery_vs_cooking: true,
  savings_progress: true,
  smart_reminder: true,
  weekly_summary: true,
  motivational: false, // LOW by default
  quietHoursStart: 22,
  quietHoursEnd: 8,
  frequency: 'smart',
};

// Smart savings text based on yearly savings
export const getSmartSavingsText = (yearlySavings: number): string => {
  if (yearlySavings < 2000) {
    return 'כסף לבילויים בלי רגשות אשם 🎉';
  } else if (yearlySavings < 5000) {
    return 'מספיק לחופשה קצרה בארץ 🇮🇱';
  } else if (yearlySavings < 10000) {
    return 'טיסה לחו״ל או שדרוג משמעותי ✈️';
  } else {
    return 'שדרוג חיים אמיתי! 🚀';
  }
};

// Get inactivity message based on days and potential savings lost
export const getInactivityMessage = (days: number, dailySavingsLost: number): string => {
  const totalLost = days * dailySavingsLost;
  return `${days} ימים בלי בישול = ₪${totalLost} יצא החוצה`;
};

// Get action prompt based on recipe
export const getActionPrompt = (minutes: number, savings: number): string => {
  return `יש לך ${minutes} דקות? המתכון הזה חוסך ₪${savings}`;
};

// Notification templates
export const notificationTemplates = {
  delivery_vs_cooking: [
    { title: 'חיסכון על המבורגר', message: 'המבורגר משלוח: ₪65 | בבית: ₪12 → חסכת ₪53 🍔', emoji: '🍔' },
    { title: 'פסטה במקום פיצה?', message: 'פיצה היום או פסטה ב-8₪? 👀', emoji: '🍝' },
    { title: 'שקשוקה חוסכת', message: 'שקשוקה בבית: ₪10 | משלוח: ₪45 → חיסכון ₪35 🍳', emoji: '🍳' },
  ],
  savings_progress: [
    { title: 'יעד חדש!', message: 'חצית ₪500 חיסכון החודש 🎯', emoji: '🎯' },
    { title: 'כמעט שם!', message: 'עוד ארוחה אחת ואתה ב-₪600 💪', emoji: '💪' },
    { title: 'שיא חדש!', message: 'זה החודש הכי חסכוני שלך! 🏆', emoji: '🏆' },
  ],
  smart_reminder: [
    { title: 'בא לך לבשל?', message: 'לא בישלת יומיים — בא לך מתכון של 15 דק? 🍳', emoji: '🍳' },
    { title: 'מתכונים מתאימים', message: 'יש לך מצרכים שמתאימים ל-3 מתכונים 👌', emoji: '👌' },
    { title: 'זמן ארוחת ערב', message: 'מה נבשל הערב? יש מתכון מושלם בשבילך 🌙', emoji: '🌙' },
  ],
  weekly_summary: [
    { title: 'סיכום שבועי', message: 'השבוע חסכת ₪132 ב-4 ארוחות', emoji: '📊' },
    { title: 'סיכום חודשי', message: 'החודש: ₪550 | שנתי: ₪6,600 🔥', emoji: '🔥' },
  ],
  motivational: [
    { title: 'כל הכבוד!', message: 'הארנק שלך מודה לך 😄', emoji: '😄' },
    { title: 'המשלוח מודאג', message: 'משלוח ראה אותך… ונעלב 💔', emoji: '💔' },
    { title: 'מתקדם!', message: 'אתה כבר שף בדרך להצלחה 👨‍🍳', emoji: '👨‍🍳' },
  ],
};

export const categoryLabels: Record<NotificationCategory, string> = {
  delivery_vs_cooking: 'השוואת מחירים',
  savings_progress: 'התקדמות בחיסכון',
  smart_reminder: 'תזכורות חכמות',
  weekly_summary: 'סיכומים',
  motivational: 'עידוד ומוטיבציה',
};

export const frequencyLabels: Record<NotificationSettings['frequency'], string> = {
  daily: 'יומי',
  smart: 'חכם',
  minimal: 'מינימלי',
};
