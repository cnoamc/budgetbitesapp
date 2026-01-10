import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { triggerHaptic } from '@/hooks/useHaptics';

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
          "relative flex flex-col items-center gap-1 py-2 px-5 rounded-2xl transition-all duration-200",
          isActive 
            ? "text-foreground bg-black/8 dark:bg-white/12" 
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
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingBottom: 'max(0.75rem, var(--safe-bottom))' }}
    >
      <nav className="pointer-events-auto">
        <div 
          className="relative inline-flex justify-center items-center py-2 px-2 rounded-full backdrop-blur-md bg-white/50 dark:bg-neutral-900/50 border border-white/60 dark:border-white/15 overflow-visible"
          style={{
            boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Glass reflection effect */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)',
            }}
          />
          
          {/* Left nav items */}
          {leftNavItems.map(renderNavItem)}

          {/* Center raised button - שפי */}
          <div className="relative mx-2">
            <motion.button
              onClick={() => handleNavClick(centerItem.path)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center justify-center w-14 h-14 -mt-5 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-200",
                isCenterActive && "ring-2 ring-white/50 ring-offset-2 ring-offset-transparent"
              )}
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(210, 80%, 45%) 100%)',
                boxShadow: '0 8px 24px -4px hsla(var(--primary), 0.4), 0 4px 8px -2px hsla(var(--primary), 0.2)'
              }}
            >
              <span className="text-base font-bold">שפי</span>
            </motion.button>
          </div>

          {/* Right nav items */}
          {rightNavItems.map(renderNavItem)}
        </div>
      </nav>
    </div>
  );
};
