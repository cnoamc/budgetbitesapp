import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'בית', path: '/home' },
  { icon: BookOpen, label: 'מתכונים', path: '/recipes' },
  { icon: TrendingUp, label: 'התקדמות', path: '/progress' },
  { icon: User, label: 'פרופיל', path: '/profile' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-6 pt-2 z-50 pointer-events-none bg-gradient-to-t from-background via-background/80 to-transparent">
      <nav className="max-w-md mx-auto pointer-events-auto px-8">
        <div 
          ref={scrollRef}
          className="flex justify-between items-center"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 transition-all duration-200",
                  isActive 
                    ? "text-foreground" 
                    : "text-foreground/40 hover:text-foreground/60 active:scale-95"
                )}
              >
                <item.icon 
                  className={cn(
                    "w-6 h-6 transition-all duration-200",
                    isActive ? "stroke-[1.5px]" : "stroke-[1.25px]"
                  )} 
                />
                <span className={cn(
                  "text-[11px] transition-all duration-200",
                  isActive ? "font-medium" : "font-normal"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
