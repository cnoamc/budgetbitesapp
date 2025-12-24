import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { GradientBackground } from '@/components/ui/GradientBackground';

interface ScreenLayoutProps {
  children: React.ReactNode;
  /** Show header with back button and optional title */
  header?: {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightElement?: React.ReactNode;
  };
  /** Show gradient background */
  gradient?: boolean;
  /** Show bottom navigation spacing */
  hasBottomNav?: boolean;
  /** Additional class for the scrollable content area */
  contentClassName?: string;
  /** Additional class for the outer container */
  className?: string;
  /** Disable scrolling (for fixed layouts like Welcome) */
  scrollable?: boolean;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  header,
  gradient = false,
  hasBottomNav = false,
  contentClassName,
  className,
  scrollable = true,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (header?.onBack) {
      header.onBack();
    } else {
      navigate(-1);
    }
  };

  const content = (
    <div className={cn('h-full min-h-0 flex flex-col overflow-hidden', className)}>
      {/* Header */}
      {header && (
        <header className="flex-shrink-0 pt-safe px-4 pb-3">
          <div className="flex items-center justify-between h-12">
            {header.showBack !== false ? (
              <button
                onClick={handleBack}
                className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="חזור"
              >
                <ArrowRight className="w-5 h-5 text-foreground/70" />
              </button>
            ) : (
              <div className="w-9" />
            )}
            
            {header.title && (
              <h1 className="text-lg font-semibold text-foreground flex-1 text-center">
                {header.title}
              </h1>
            )}
            
            {header.rightElement || <div className="w-9" />}
          </div>
        </header>
      )}

      {/* Scrollable Content Area */}
      <div
        className={cn(
          'flex-1 min-h-0',
          scrollable && 'overflow-y-auto overscroll-none scroll-touch',
          !scrollable && 'overflow-hidden',
          !header && 'pt-safe',
          hasBottomNav ? 'pb-safe-offset-20' : 'pb-safe',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );

  if (gradient) {
    return <GradientBackground>{content}</GradientBackground>;
  }

  return content;
};

export default ScreenLayout;
