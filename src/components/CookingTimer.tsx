import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CookingTimerProps {
  initialMinutes?: number;
  label?: string;
  onComplete?: () => void;
  onClose?: () => void;
}

export const CookingTimer: React.FC<CookingTimerProps> = ({
  initialMinutes = 5,
  label = 'טיימר',
  onComplete,
  onClose,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create audio element for alarm
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH+Kk5qXkYaCeXN2fYaQmZuYkYqCe3d4fYaSm5qXj4R6dHd9hpKam5iRiX95dnqBi5WZl5KLg3x2eHyFj5aXlJCIgnt4en+IkpaVkoyEfXd5fYaQlZWTj4mBe3h8gYuUlpWSjYWAe3p/h5KWlpKOhoF7en+Fj5WVkpCHgnt6foSNlJWTkYiDfHl+g4yTlZOQiIN8eX6DjZSVkpCIhH15foOMk5WSkYeFfXl+g4yTlJKQiIV9en6DjJOUkpCIhX16f4OMk5SSkYeFfXp/g4yTlJKQiIV9en6DjJOUkpCIhX16f4OMk5SSkIiFfXp+g4yTlJKQiIV9en6DjJOUkpCIhX16f4OMk5SSkIiFfXp/g4yTlJGQiIV9en6DjJOUkpCIhX16f4OMk5SSkIiFfXp+g4yTlJKQiIV9en6DjJOUkpCIhX16f4OMk5SSkIiFfXp+g4yTlJKQiIV9en6DjJOUkpCIhX16f4OMk5SSkIiFfXp+g4yTlJKQiIV9en6DjJOUkpCIhX16f4OMk5SSkIiFfXp+g4yTlJKQiIV9en6DjJOUkpCIhX16f4OMk5SSkIiFfXp+gw==');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            // Play alarm sound
            if (audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
            // Show notification
            toast.success(`⏰ ${label} - הזמן נגמר!`, { duration: 10000 });
            // Vibrate if supported
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, label, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setTotalSeconds(initialMinutes * 60);
    setIsRunning(false);
    setIsComplete(false);
  };

  const progress = 1 - totalSeconds / (initialMinutes * 60);

  return (
    <div 
      className={cn(
        "p-4 rounded-2xl border-2 transition-all",
        isComplete 
          ? "bg-savings/10 border-savings animate-pulse" 
          : "bg-card border-border/50"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isComplete ? "bg-savings/20" : "bg-secondary"
          )}>
            {isComplete ? (
              <Bell className="w-5 h-5 text-savings animate-bounce" />
            ) : (
              <Timer className="w-5 h-5" />
            )}
          </div>
          <span className="font-medium text-sm">{label}</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-4">
        <span className={cn(
          "text-4xl font-bold tabular-nums",
          isComplete && "text-savings"
        )}>
          {formatTime(totalSeconds)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
        <div 
          className={cn(
            "h-full rounded-full transition-all",
            isComplete ? "bg-savings" : "bg-primary"
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          className="rounded-xl px-6"
          onClick={() => setIsRunning(!isRunning)}
          disabled={isComplete}
        >
          {isRunning ? (
            <><Pause className="w-4 h-4 ml-2" /> עצור</>
          ) : (
            <><Play className="w-4 h-4 ml-2" /> התחל</>
          )}
        </Button>
      </div>
    </div>
  );
};
