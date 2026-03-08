export type Locale = 'he' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // Splash & Welcome
  'splash.tagline': { he: 'שפי – Chefi', en: 'Chefi – שפי' },
  'welcome.headline': { he: 'שפי עושה סדר במטבח', en: 'Chefi brings order to your kitchen' },
  'welcome.subtitle': { he: 'העוזר האישי שלך לבישול חכם, חסכון בכסף ופחות בלגן', en: 'Your personal assistant for smart cooking, saving money and less mess' },
  'welcome.byline': { he: 'מבית BudgetBites', en: 'by BudgetBites' },
  'welcome.cta': { he: 'התחל עכשיו 🚀', en: "Let's go 🚀" },
  'welcome.noSignup': { he: 'ללא הרשמה, ללא כרטיס אשראי', en: 'No signup, no credit card' },

  // Language select
  'lang.title': { he: 'בחר שפה', en: 'Choose Language' },
  'lang.subtitle': { he: 'תוכל לשנות בהגדרות', en: 'You can change this later in settings' },

  // Auth
  'auth.title': { he: 'ברוך הבא! 👋', en: 'Welcome! 👋' },
  'auth.subtitle': { he: 'התחבר כדי לשמור את ההתקדמות שלך', en: 'Sign in to save your progress' },
  'auth.google': { he: 'המשך עם Google', en: 'Continue with Google' },
  'auth.apple': { he: 'המשך עם Apple', en: 'Continue with Apple' },
  'auth.guest': { he: 'המשך כאורח', en: 'Continue as guest' },
  'auth.terms': { he: 'בהמשך, אני מסכים/ה ל', en: 'By continuing, I agree to the' },
  'auth.termsLink': { he: 'תנאי השימוש', en: 'Terms of Service' },
  'auth.and': { he: 'ו', en: 'and' },
  'auth.privacyLink': { he: 'מדיניות הפרטיות', en: 'Privacy Policy' },

  // Onboarding
  'onboarding.letsKnow': { he: 'בוא נכיר! 👋', en: "Let's get to know you! 👋" },
  'onboarding.fewDetails': { he: 'רק כמה פרטים ונתחיל לבשל', en: 'Just a few details and we start cooking' },
  'onboarding.nameLabel': { he: 'איך קוראים לך?', en: "What's your name?" },
  'onboarding.namePlaceholder': { he: 'השם שלך', en: 'Your name' },
  'onboarding.ageLabel': { he: 'בן/בת כמה את/ה?', en: 'How old are you?' },
  'onboarding.cookingLabel': { he: 'רמת הבישול שלך (אופציונלי)', en: 'Your cooking level (optional)' },
  'onboarding.dietLabel': { he: 'העדפת תזונה (אופציונלי)', en: 'Dietary preference (optional)' },
  'onboarding.foodLabel': { he: 'מה אתה אוהב לאכול? (בחר כמה שתרצה)', en: 'What do you like to eat? (pick as many as you want)' },
  'onboarding.start': { he: 'התחל 🚀', en: 'Start 🚀' },
  'onboarding.next': { he: 'הבא', en: 'Next' },
  'onboarding.skip': { he: 'דלג', en: 'Skip' },
  'onboarding.back': { he: 'חזרה', en: 'Back' },

  // Age ranges
  'age.under18': { he: 'מתחת ל-18', en: 'Under 18' },
  'age.18-25': { he: '18-25', en: '18-25' },
  'age.26-35': { he: '26-35', en: '26-35' },
  'age.36-45': { he: '36-45', en: '36-45' },
  'age.46-55': { he: '46-55', en: '46-55' },
  'age.55+': { he: '55+', en: '55+' },

  // Cooking levels
  'cooking.beginner': { he: 'מתחיל', en: 'Beginner' },
  'cooking.basic': { he: 'בסיסי', en: 'Basic' },
  'cooking.advanced': { he: 'מתקדם', en: 'Advanced' },
  'cooking.expert': { he: 'מומחה', en: 'Expert' },
  'cooking.chef': { he: 'שף!', en: 'Chef!' },

  // Dietary
  'diet.all': { he: 'הכל', en: 'All' },
  'diet.vegetarian': { he: 'צמחוני', en: 'Vegetarian' },
  'diet.vegan': { he: 'טבעוני', en: 'Vegan' },
  'diet.kosher': { he: 'כשר', en: 'Kosher' },

  // Food preferences
  'food.burgers': { he: 'המבורגרים', en: 'Burgers' },
  'food.pasta': { he: 'פסטות', en: 'Pasta' },
  'food.pizza': { he: 'פיצה', en: 'Pizza' },
  'food.asian': { he: 'אסייתי', en: 'Asian' },
  'food.home': { he: 'אוכל ביתי', en: 'Home Food' },
  'food.sushi': { he: 'סושי', en: 'Sushi' },
  'food.salads': { he: 'סלטים', en: 'Salads' },
  'food.desserts': { he: 'קינוחים', en: 'Desserts' },
  'food.meat': { he: 'בשרים', en: 'Meat' },
  'food.seafood': { he: 'פירות ים', en: 'Seafood' },

  // Celebration
  'done.welcome': { he: 'ברוך הבא', en: 'Welcome' },
  'done.ready': { he: 'הכל מוכן, בוא נתחיל לבשל! 🎉', en: "All set, let's start cooking! 🎉" },
  'done.tapToStart': { he: 'לחץ להמשך', en: 'Tap to continue' },

  // Bottom nav
  'nav.home': { he: 'בית', en: 'Home' },
  'nav.recipes': { he: 'מתכונים', en: 'Recipes' },
  'nav.chefi': { he: 'שפי', en: 'Chefi' },
  'nav.progress': { he: 'התקדמות', en: 'Progress' },
  'nav.profile': { he: 'פרופיל', en: 'Profile' },
};

export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? key;
}

export default translations;
