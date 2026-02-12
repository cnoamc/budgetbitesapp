import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import chefiIcon from '@/assets/shefi-icon.png';

interface TutorialStep {
  emoji?: string;
  image?: string;
  title: string;
  description: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    emoji: '👋',
    title: 'ברוכים הבאים לשפי!',
    description: 'העוזר האישי שלך לבישול חכם, חסכון בכסף ופחות בלגן.',
  },
  {
    emoji: '🍳',
    title: 'מתכונים פשוטים ומהירים',
    description: 'מעל 100 מתכונים מותאמים למתחילים, עם הסברים צעד אחר צעד וזמני הכנה קצרים.',
  },
  {
    emoji: '💰',
    title: 'חוסכים בכל ארוחה',
    description: 'תראה בדיוק כמה אתה חוסך לעומת הזמנת משלוח. החיסכון מצטבר!',
  },
  {
    emoji: '🔍',
    title: 'חיפוש חכם',
    description: 'כתוב מה יש לך במקרר ושפי ימצא לך מתכון מושלם.',
  },
  {
    image: 'chefi',
    title: 'שפי כאן בשבילך! 👨‍🍳',
    description: 'אני שפי, השף האישי שלך. תמיד אפשר לשאול אותי שאלות, לבקש טיפים או עזרה בבישול. יאללה, בוא נתחיל!',
  },
];

const TUTORIAL_STORAGE_KEY = 'bb_tutorial_completed';

export const TutorialOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!hasCompletedTutorial) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-sm p-0 overflow-hidden border-0 rounded-3xl bg-card shadow-elevated [&>button]:hidden">
        {/* Skip button */}
        {!isLastStep && (
          <button
            onClick={handleComplete}
            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="דלג"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Content */}
        <div className="p-6 pt-10 text-center">
          {/* Icon area */}
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-muted/20 rounded-full blur-2xl scale-150" />
            {step.image === 'chefi' ? (
              <div className="relative w-28 h-28 mx-auto animate-scale-in">
                <img
                  src={chefiIcon}
                  alt="שפי"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            ) : (
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-secondary to-muted rounded-3xl flex items-center justify-center shadow-soft animate-scale-in">
                <span className="text-4xl">{step.emoji}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold mb-2 animate-fade-in">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 animate-fade-in" style={{ animationDelay: '50ms' }}>
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-4">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-primary w-6'
                    : index < currentStep
                    ? 'bg-primary/40 w-2'
                    : 'bg-secondary w-2'
                }`}
                aria-label={`שלב ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1 h-12 rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
                הקודם
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 h-12 rounded-xl btn-press"
            >
              {isLastStep ? 'יאללה, בוא נבשל! 🚀' : 'הבא'}
              {!isLastStep && <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialOverlay;
