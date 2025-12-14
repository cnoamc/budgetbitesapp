import React from 'react';

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50" />
      
      {/* Decorative blurred bubbles */}
      <div className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute top-40 -left-20 w-48 h-48 rounded-full bg-rose-300/30 blur-3xl" />
      <div className="absolute bottom-60 right-10 w-56 h-56 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute bottom-40 left-20 w-40 h-40 rounded-full bg-primary/15 blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
