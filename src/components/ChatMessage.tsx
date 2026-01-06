import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot = true, className }) => {
  return (
    <div className={cn(
      "flex gap-3 animate-slide-up",
      isBot ? "justify-start" : "justify-end",
      className
    )}>
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
