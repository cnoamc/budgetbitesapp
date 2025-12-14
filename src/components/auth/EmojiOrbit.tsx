import React from 'react';
import { cn } from '@/lib/utils';

const emojis = ['🛒', '🍔', '🍝', '🔔', '📈'];

export const EmojiOrbit: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("relative w-56 h-56 mx-auto", className)}>
      {/* Faint orbit circle */}
      <div className="absolute inset-6 rounded-full border-2 border-dashed border-muted-foreground/10" />
      
      {/* Center glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-16 h-16 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, hsl(16 85% 60% / 0.5) 0%, transparent 70%)',
            filter: 'blur(16px)'
          }}
        />
      </div>
      
      {/* Emoji chips arranged in orbit */}
      {emojis.map((emoji, index) => {
        const angle = (index * 72 - 90) * (Math.PI / 180);
        const radius = 85;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <div
            key={index}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              animation: `float ${3 + index * 0.4}s ease-in-out infinite`,
              animationDelay: `${index * 0.25}s`
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/85 backdrop-blur-md shadow-lg border border-white/60 flex items-center justify-center text-xl hover:scale-110 transition-transform duration-200">
              {emoji}
            </div>
          </div>
        );
      })}
    </div>
  );
};
