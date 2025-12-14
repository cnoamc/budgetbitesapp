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
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <nav className="max-w-md mx-auto">
        <div className="glass rounded-2xl shadow-elevated border border-white/30">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 min-w-[64px]",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "relative transition-all duration-300",
                    isActive && "scale-110"
                  )}>
                    <item.icon className="w-5 h-5" />
                    {isActive && (
                      <div className="absolute -inset-2 bg-primary/10 rounded-xl -z-10" />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-all",
                    isActive && "font-semibold"
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};