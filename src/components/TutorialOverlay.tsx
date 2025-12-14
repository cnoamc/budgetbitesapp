import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface TutorialStep {
  emoji: string;
  title: string;
  description: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    emoji: '👋',
    title: 'ברוכים הבאים ל-BudgetBites!',
    description: 'האפליקציה שתעזור לך לחסוך כסף ולהתחיל לבשל בקלות. בוא נעשה סיור קצר.',
  },
  {
    emoji: '💰',
    title: 'גלה את החיסכון שלך',
    description: 'בכל מתכון תראה כמה תחסוך לעומת משלוח. החיסכון מצטבר ומתעדכן בזמן אמת.',
  },
  {
    emoji: '🍳',
    title: 'מתכונים פשוטים ומהירים',
    description: 'כל המתכונים מותאמים למתחילים עם הסברים פשוטים וזמני הכנה קצרים.',
  },
  {
    emoji: '🤖',
    title: 'עוזר בישול חכם',
    description: 'שפי, העוזר החכם שלנו, ילווה אותך צעד אחר צעד בכל מתכון כמו חבר במטבח.',
  },
  {
    emoji: '📈',
    title: 'עקוב אחרי ההתקדמות',
    description: 'צפה בחיסכון המצטבר, דרג מתכונים ושפר את יכולות הבישול שלך.',
  },
];

const TUTORIAL_STORAGE_KEY = 'bb_tutorial_completed';

export const TutorialOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!hasCompletedTutorial) {
      // Small delay for smoother UX after page load
      const timer = setTimeout(() => setIsOpen(true), 500);
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

  const handleSkip = () => {
    handleComplete();
  };

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm mx-4 p-0 overflow-hidden border-0 rounded-3xl bg-card shadow-elevated">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
          aria-label="דלג"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-8 pt-12 text-center">
          {/* Emoji with animated background */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl scale-150 animate-pulse" />
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-secondary to-muted rounded-3xl flex items-center justify-center shadow-soft animate-scale-in">
              <span className="text-5xl">{step.emoji}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold mb-3 animate-fade-in">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-base leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: '50ms' }}>
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-primary w-6'
                    : index < currentStep
                    ? 'bg-primary/50'
                    : 'bg-secondary'
                }`}
                aria-label={`שלב ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
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
              {isLastStep ? 'יאללה, מתחילים! 🚀' : 'הבא'}
              {!isLastStep && <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialOverlay;
