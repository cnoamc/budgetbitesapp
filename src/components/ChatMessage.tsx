import React from 'react';
import { cn } from '@/lib/utils';
import chefIcon from '@/assets/chef-icon.png';

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot = true, className }) => {
  return (
    <div className={cn(
      "flex gap-3 animate-slide-up",
      !isBot && "flex-row-reverse",
      className
    )}>
      {isBot && (
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-card">
          <img src={chefIcon} alt="שפי" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className={cn(
        "rounded-2xl px-4 py-3 max-w-[80%]",
        isBot 
          ? "bg-card shadow-card border border-border/50 rounded-tr-none" 
          : "bg-black text-white rounded-tl-none"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
};
