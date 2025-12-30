import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { triggerHaptic } from '@/hooks/useHaptics';

const navItems = [
  { icon: Home, label: 'בית', path: '/home' },
  { icon: BookOpen, label: 'מתכונים', path: '/recipes' },
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
      className="fixed left-0 right-0 z-50 flex justify-center"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <nav>
        <div 
          ref={navRef}
          className="relative inline-flex justify-center items-center py-2 px-2 rounded-full backdrop-blur-xl bg-neutral-200/60 dark:bg-neutral-900/70 border border-neutral-300/40 dark:border-white/10"
          style={{
            boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.18), inset 0 1px 2px rgba(0, 0, 0, 0.06), inset 0 -1px 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated indicator */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-black/5 dark:bg-white/10"
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
                  "relative flex flex-col items-center gap-0 py-1.5 px-3 rounded-full transition-colors duration-200 z-10",
                  isActive 
                    ? "text-foreground" 
                    : "text-foreground/40 hover:text-foreground/60 active:scale-95"
                )}
              >
                <item.icon 
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
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
