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
    <div className="fixed left-0 right-0 z-50 flex justify-center" style={{ bottom: '0.5rem' }}>
      <nav>
        <div 
          ref={navRef}
          className="relative inline-flex justify-center items-center py-2 px-2 rounded-full backdrop-blur-xl bg-secondary/80 dark:bg-card/80 border border-border/50 dark:border-border/30 shadow-elevated"
        >
          {/* Animated indicator */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-primary/10 dark:bg-primary/20"
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