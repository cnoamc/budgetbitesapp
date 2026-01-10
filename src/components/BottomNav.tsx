import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { triggerHaptic } from '@/hooks/useHaptics';

const navItems = [
  { icon: Home, label: 'בית', path: '/home' },
  { icon: BookOpen, label: 'מתכונים', path: '/recipes' },
  { icon: MessageCircle, label: 'שפי', path: '/chat' },
  { icon: TrendingUp, label: 'התקדמות', path: '/progress' },
  { icon: User, label: 'פרופיל', path: '/profile' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = navItems.findIndex(item => item.path === location.pathname);

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex] && navRef.current) {
      const activeItem = itemRefs.current[activeIndex];
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = activeItem!.getBoundingClientRect();
      
      setIndicatorStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
      });
    }
  }, [activeIndex, location.pathname]);

  const handleNavClick = (path: string) => {
    triggerHaptic('light');
    navigate(path);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingBottom: 'max(0.75rem, var(--safe-bottom))' }}
    >
      <nav className="pointer-events-auto">
        <div 
          ref={navRef}
          className="relative inline-flex justify-center items-center py-3 px-3 rounded-full backdrop-blur-md bg-white/50 dark:bg-neutral-900/50 border border-white/60 dark:border-white/15 overflow-hidden"
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
          
          {/* Animated indicator */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute top-1.5 bottom-1.5 rounded-full bg-black/8 dark:bg-white/12"
              initial={false}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            />
          )}

          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                ref={el => itemRefs.current[index] = el}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 px-4 rounded-full transition-colors duration-200 z-10",
                  isActive 
                    ? "text-foreground" 
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
          })}
        </div>
      </nav>
    </div>
  );
};
