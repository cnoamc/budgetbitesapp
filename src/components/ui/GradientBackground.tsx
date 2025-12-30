import React from 'react';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'warm' | 'fresh' | 'minimal';
  className?: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  variant = 'warm',
  className = ''
}) => {
  return (
    <div className={`screen-container relative overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className={`absolute inset-0 ${variant === 'minimal' ? 'bg-background' : variant === 'fresh' ? 'gradient-bg-fresh' : 'gradient-bg-warm'}`} />
      
      {/* Decorative blurred bubbles - simplified for performance */}
      {variant !== 'minimal' && (
        <>
          <div className="bubble bubble-primary w-72 h-72 -top-20 -right-20" />
          <div className="bubble bubble-accent w-56 h-56 top-40 -left-16" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};