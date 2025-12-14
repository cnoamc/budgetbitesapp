import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
  variant?: 'pill' | 'minimal';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  className,
  variant = 'pill' 
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
        className={cn(
          "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
          className
        )}
      >
        {language === 'en' ? 'עב' : 'EN'}
      </button>
    );
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-0.5 p-1 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/30",
      className
    )}>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
          language === 'en'
            ? "bg-foreground text-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('he')}
        className={cn(
          "px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
          language === 'he'
            ? "bg-foreground text-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        עב
      </button>
    </div>
  );
};