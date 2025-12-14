import React from 'react';
import { ShoppingCart, UtensilsCrossed, ChefHat, TrendingUp, Bell } from 'lucide-react';

const icons = [
  { Icon: ShoppingCart, angle: 0 },
  { Icon: UtensilsCrossed, angle: 72 },
  { Icon: ChefHat, angle: 144 },
  { Icon: TrendingUp, angle: 216 },
  { Icon: Bell, angle: 288 },
];

export const IconOrbit: React.FC = () => {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Orbit ring */}
      <div className="absolute inset-0 rounded-full border-2 border-white/20" />
      
      {/* Center glow */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 blur-xl" />
      
      {/* Orbiting icons */}
      {icons.map(({ Icon, angle }, index) => {
        const radius = 80;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        
        return (
          <div
            key={index}
            className="absolute w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <Icon className="w-6 h-6 text-primary" />
          </div>
        );
      })}
      
      {/* Center icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl flex items-center justify-center">
        <ChefHat className="w-8 h-8 text-primary-foreground" />
      </div>
    </div>
  );
};
