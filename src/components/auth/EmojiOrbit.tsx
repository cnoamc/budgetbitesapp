import React from 'react';

const emojis = ['🍔', '🍝', '🛒', '🔔', '📈'];

export const EmojiOrbit: React.FC = () => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Center glow */}
      <div 
        className="absolute inset-0 m-auto w-24 h-24 rounded-full blur-2xl opacity-30"
        style={{ background: 'linear-gradient(135deg, #FFB088 0%, #88CCFF 100%)' }}
      />
      
      {/* Emoji chips in orbit */}
      {emojis.map((emoji, index) => {
        const angle = (index * 72 - 90) * (Math.PI / 180); // 72 degrees apart, start from top
        const radius = 100;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <div
            key={index}
            className="absolute w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{
              left: `calc(50% + ${x}px - 28px)`,
              top: `calc(50% + ${y}px - 28px)`,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
              animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`,
            }}
          >
            {emoji}
          </div>
        );
      })}
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};
