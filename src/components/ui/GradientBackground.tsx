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
    <div className={`h-full relative overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className={`absolute inset-0 ${variant === 'minimal' ? 'bg-background' : variant === 'fresh' ? 'gradient-bg-fresh' : 'gradient-bg-warm'}`} />
      
      {/* Decorative blurred bubbles */}
      {variant !== 'minimal' && (
        <>
          <div className="bubble bubble-primary w-72 h-72 -top-20 -right-20" />
          <div className="bubble bubble-accent w-56 h-56 top-40 -left-16" />
          <div className="bubble bubble-savings w-64 h-64 bottom-40 right-8" />
          <div className="bubble bubble-primary w-40 h-40 bottom-20 left-20 opacity-30" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};