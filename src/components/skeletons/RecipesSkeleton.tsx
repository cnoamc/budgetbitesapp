import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const RecipesSkeleton: React.FC = () => {
  return (
    <div className="min-h-dvh bg-background" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 pt-safe">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        
        {/* Search */}
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Categories */}
      <div className="px-6 py-3 flex gap-2 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 rounded-full shrink-0" />
        ))}
      </div>

      {/* Recipe Cards */}
      <div className="px-6 space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

export default RecipesSkeleton;
