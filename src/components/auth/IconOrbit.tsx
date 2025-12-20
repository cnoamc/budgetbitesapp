import React from 'react';
import { ShoppingCart, UtensilsCrossed, TrendingUp, Bell, Wallet } from 'lucide-react';
import appLogo from '@/assets/app-logo.png';

const icons = [
  { Icon: ShoppingCart, angle: 0 },
  { Icon: UtensilsCrossed, angle: 72 },
  { Icon: Wallet, angle: 144 },
  { Icon: TrendingUp, angle: 216 },
  { Icon: Bell, angle: 288 },
];

export const IconOrbit: React.FC = () => {
  return (
    <div className="relative w-52 h-52 mx-auto">
      {/* Orbit ring */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{ 
          border: '2px solid rgba(0, 0, 0, 0.05)'
        }}
      />
      
      {/* Center glow */}
      <div 
        className="absolute inset-12 rounded-full blur-2xl opacity-40"
        style={{ 
          background: 'linear-gradient(135deg, #4A90D9 0%, #88CCFF 100%)'
        }}
      />
      
      {/* Orbiting icons */}
      {icons.map(({ Icon, angle }, index) => {
        const radius = 85;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        
        return (
          <div
            key={index}
            className="absolute w-12 h-12 rounded-2xl flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.1)',
              animation: `float ${3 + index * 0.2}s ease-in-out infinite`,
              animationDelay: `${index * 0.15}s`,
            }}
          >
            <Icon className="w-5 h-5 text-[#4A90D9]" />
          </div>
        );
      })}
      
      {/* Center icon - Chef icon */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl overflow-hidden shadow-glow"
      >
        <img src={appLogo} alt="BudgetBites" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};
