import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { triggerHaptic } from '@/hooks/useHaptics';
import shefiIcon from '@/assets/shefi-icon.png';

const leftNavItems = [
  { icon: Home, label: 'בית', path: '/home' },
  { icon: BookOpen, label: 'מתכונים', path: '/recipes' },
];

const rightNavItems = [
  { icon: TrendingUp, label: 'התקדמות', path: '/progress' },
  { icon: User, label: 'פרופיל', path: '/profile' },
];

const centerItem = { label: 'שפי', path: '/chat' };

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    triggerHaptic('light');
    navigate(path);
  };

  const isCenterActive = location.pathname === centerItem.path;

  const renderNavItem = (item: { icon: React.ElementType; label: string; path: string }) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        key={item.path}
        onClick={() => handleNavClick(item.path)}
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-200",
          isActive 
            ? "text-primary" 
            : "text-muted-foreground hover:text-foreground/70 active:scale-95"
        )}
      >
        <item.icon 
          className={cn(
            "w-6 h-6 transition-all duration-200",
            isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
          )} 
        />
        <span className={cn(
          "text-[11px] transition-all duration-200",
          isActive ? "font-semibold" : "font-medium"
        )}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none in-app-browser:sticky"
    >
      <nav 
        className="pointer-events-auto backdrop-blur-xl border-t border-white/20"
        style={{ 
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, hsl(var(--background) / 0.85), hsl(var(--background) / 0.7))',
          boxShadow: '0 -1px 20px 0 hsl(var(--foreground) / 0.05), inset 0 1px 0 0 hsl(var(--background) / 0.5)'
        }}
      >
        <div className="flex items-end justify-around px-2 pt-1">
          {/* Left nav items */}
          {leftNavItems.map(renderNavItem)}

          {/* Center raised button - שפי with glow */}
          <div className="relative flex flex-col items-center flex-1">
            {/* Glow effect behind button */}
            <div 
              className="absolute top-0 w-20 h-20 -mt-6 rounded-full blur-xl opacity-50 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)'
              }}
            />
            <motion.button
              onClick={() => handleNavClick(centerItem.path)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center justify-center w-14 h-14 -mt-4 rounded-full shadow-lg transition-all duration-200 overflow-hidden",
                isCenterActive && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
              )}
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(210, 80%, 45%) 100%)',
                boxShadow: '0 8px 24px -4px hsla(var(--primary), 0.5), 0 4px 12px -2px hsla(var(--primary), 0.3), 0 0 20px 2px hsla(var(--primary), 0.2)'
              }}
            >
              <img 
                src={shefiIcon} 
                alt="שפי" 
                className="w-10 h-10 object-cover rounded-full"
              />
            </motion.button>
            <span className={cn(
              "text-[11px] mt-1 transition-all duration-200",
              isCenterActive ? "font-semibold text-primary" : "font-medium text-muted-foreground"
            )}>
              שפי
            </span>
          </div>

          {/* Right nav items */}
          {rightNavItems.map(renderNavItem)}
        </div>
      </nav>
    </div>
  );
};
