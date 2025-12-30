import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProgressSkeleton: React.FC = () => {
  return (
    <div className="min-h-dvh bg-background p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-safe">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>

      {/* Skill Level */}
      <Skeleton className="h-32 w-full rounded-2xl mb-4" />

      {/* Quick Summary */}
      <Skeleton className="h-24 w-full rounded-2xl mb-4" />

      {/* Weekly Goals */}
      <Skeleton className="h-48 w-full rounded-2xl mb-4" />

      {/* Monthly Summary */}
      <Skeleton className="h-28 w-full rounded-2xl" />
    </div>
  );
};

export default ProgressSkeleton;
