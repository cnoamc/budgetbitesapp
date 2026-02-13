import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
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
            isActive ? "stroke-[2.5px] fill-primary/15" : "stroke-[1.5px]"
          )} 
        />
        <span className={cn(
          "text-[11px] transition-all duration-200",
          isActive ? "font-semibold" : "font-medium"
        )}>
          {item.label}
        </span>
        {/* Active dot indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute -bottom-0.5 w-[5px] h-[5px] rounded-full bg-primary"
            />
          )}
        </AnimatePresence>
      </button>
    );
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none w-full in-app-browser:sticky"
    >
      <nav 
        className="pointer-events-auto backdrop-blur-xl border-t border-border/30"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          background: 'linear-gradient(to top, hsl(var(--background) / 0.95), hsl(var(--background) / 0.85))',
          boxShadow: '0 -1px 20px 0 hsl(var(--foreground) / 0.05), inset 0 1px 0 0 hsl(var(--background) / 0.5)'
        }}
      >
        <div className="flex items-end justify-around px-2 pt-1">
          {/* Left nav items */}
          {leftNavItems.map(renderNavItem)}

          {/* Center raised button - שפי with glow */}
          <div className="relative flex flex-col items-center flex-1">
            {/* Animated pulsing glow effect - only visible when active */}
            {isCenterActive && (
              <motion.div 
                className="absolute top-0 w-24 h-24 -mt-7 rounded-full pointer-events-none"
                animate={{
                  opacity: [0.6, 0.9, 0.6],
                  scale: [1.05, 1.25, 1.05],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: 'radial-gradient(circle, hsl(210, 100%, 50%) 0%, hsl(210, 100%, 45% / 0.5) 40%, transparent 70%)',
                  filter: 'blur(12px)'
                }}
              />
            )}
            {/* Static inner glow - only visible when active */}
            {isCenterActive && (
              <div 
                className="absolute top-0 w-18 h-18 -mt-5 rounded-full pointer-events-none opacity-60"
                style={{
                  background: 'radial-gradient(circle, hsl(210, 100%, 55% / 0.8) 0%, transparent 60%)',
                  filter: 'blur(8px)'
                }}
              />
            )}
            <motion.button
              onClick={() => handleNavClick(centerItem.path)}
              whileTap={{ scale: 0.95 }}
              animate={!isCenterActive ? {
                scale: [1, 1.06, 1],
                boxShadow: [
                  '0 8px 16px -4px hsla(210, 100%, 40%, 0.3)',
                  '0 10px 24px -4px hsla(210, 100%, 45%, 0.45)',
                  '0 8px 16px -4px hsla(210, 100%, 40%, 0.3)'
                ]
              } : undefined}
              transition={!isCenterActive ? {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              } : undefined}
              className={cn(
                "relative flex items-center justify-center w-14 h-14 -mt-4 rounded-full shadow-lg transition-all duration-200 overflow-hidden",
                isCenterActive 
                  ? "ring-2 ring-white/40 ring-offset-2 ring-offset-background"
                  : "ring-2 ring-white/20"
              )}
              style={{
                background: isCenterActive
                  ? 'linear-gradient(135deg, hsl(210, 100%, 55%) 0%, hsl(210, 85%, 45%) 100%)'
                  : 'linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(210, 80%, 40%) 100%)',
                boxShadow: isCenterActive
                  ? '0 0 30px 8px hsla(210, 100%, 50%, 0.5), 0 8px 24px -4px hsla(210, 100%, 45%, 0.5), 0 4px 12px -2px hsla(210, 100%, 45%, 0.3)'
                  : undefined
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