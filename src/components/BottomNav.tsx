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
    <div className="fixed bottom-0 left-0 right-0 pb-4 pt-2 z-50 px-4">
      <nav className="max-w-md mx-auto">
        <div 
          ref={navRef}
          className="relative flex justify-around items-center py-2 px-2 rounded-[28px] backdrop-blur-xl bg-neutral-200/80 dark:bg-neutral-900/85 border border-neutral-300/50 dark:border-white/10 shadow-lg"
          style={{
            boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.05) inset'
          }}
        >
          {/* Animated indicator */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute top-2 bottom-2 rounded-2xl bg-black/5 dark:bg-white/10"
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
                  "relative flex flex-col items-center gap-0.5 py-2 px-5 rounded-2xl transition-colors duration-200 z-10",
                  isActive 
                    ? "text-foreground" 
                    : "text-foreground/40 hover:text-foreground/60 active:scale-95"
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