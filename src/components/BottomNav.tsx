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
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto pointer-events-auto">
        <div 
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide rounded-[20px] border border-white/40"
          style={{
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
          }}
        >
          <div className="flex justify-around items-center h-[60px] px-3 min-w-max">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl transition-all duration-300 min-w-[68px]",
                    isActive 
                      ? "text-primary" 
                      : "text-foreground/50 hover:text-foreground/70 active:scale-95"
                  )}
                >
                  <div className={cn(
                    "relative transition-all duration-300",
                    isActive && "scale-110"
                  )}>
                    <item.icon 
                      className={cn(
                        "w-[22px] h-[22px] transition-all duration-300",
                        isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"
                      )} 
                    />
                    {isActive && (
                      <div 
                        className="absolute -inset-2.5 rounded-xl -z-10 transition-all duration-300"
                        style={{
                          background: 'rgba(47, 128, 237, 0.12)'
                        }}
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] transition-all duration-300",
                    isActive ? "font-semibold text-primary" : "font-medium"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};
