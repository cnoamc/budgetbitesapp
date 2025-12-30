import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="min-h-dvh bg-background" dir="rtl">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 pt-safe">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3 pb-4">
        {/* Daily Tip */}
        <Skeleton className="h-12 w-full rounded-xl" />

        {/* Today's Recommendation */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>

        {/* Quick Recipes */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>

        {/* Milestones */}
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </div>
  );
};

export default HomeSkeleton;
