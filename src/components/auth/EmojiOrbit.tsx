import React from 'react';

const emojis = ['🍳', '🍔', '🍝', '🛒', '📈', '🔔'];

export const EmojiOrbit: React.FC = () => {
  return (
    <div className="relative w-72 h-72 mx-auto">
      {/* Center glow */}
      <div 
        className="absolute inset-0 m-auto w-28 h-28 rounded-full blur-3xl opacity-40"
        style={{ background: 'linear-gradient(135deg, #FFB088 0%, #88CCFF 50%, #88DDAA 100%)' }}
      />
      
      {/* Emoji chips in orbit - NO white backgrounds */}
      {emojis.map((emoji, index) => {
        const angle = (index * 60 - 90) * (Math.PI / 180); // 60 degrees apart (6 items)
        const radius = 110;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <div
            key={index}
            className="absolute flex items-center justify-center text-4xl"
            style={{
              left: `calc(50% + ${x}px - 24px)`,
              top: `calc(50% + ${y}px - 24px)`,
              width: '48px',
              height: '48px',
              // Subtle glass chip - very low opacity, NOT white
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '16px',
              boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.05)',
              animation: `float ${3 + index * 0.4}s ease-in-out infinite`,
              animationDelay: `${index * 0.15}s`,
            }}
          >
            {emoji}
          </div>
        );
      })}
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};
