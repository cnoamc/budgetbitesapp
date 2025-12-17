import React from 'react';
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

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-4 pt-2 z-50 px-4">
      <nav className="max-w-md mx-auto">
        <div 
          className="flex justify-around items-center py-3 px-2 rounded-[28px] backdrop-blur-xl bg-white/70 dark:bg-black/60 border border-white/30 dark:border-white/10 shadow-lg"
          style={{
            boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-2xl transition-all duration-200",
                  isActive 
                    ? "text-foreground bg-black/5 dark:bg-white/10" 
                    : "text-foreground/50 hover:text-foreground/70 active:scale-95"
                )}
              >
                <item.icon 
                  className={cn(
                    "w-6 h-6 transition-all duration-200",
                    isActive ? "stroke-[2px]" : "stroke-[1.5px]"
                  )} 
                />
                <span className={cn(
                  "text-[10px] transition-all duration-200",
                  isActive ? "font-semibold" : "font-medium"
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