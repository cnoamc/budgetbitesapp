import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

// Enhanced skeleton components for loading states
interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => (
  <div className={cn("animate-pulse bg-muted rounded-xl p-4", className)}>
    <div className="flex gap-3">
      <div className="w-14 h-14 bg-muted-foreground/20 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
        <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
      </div>
    </div>
  </div>
);

interface PageSkeletonProps {
  hasHeader?: boolean;
  cards?: number;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ hasHeader = true, cards = 3 }) => (
  <div className="screen-container pt-safe pb-safe-24 bg-background">
    <div className="p-4 space-y-4">
      {hasHeader && (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-12 bg-muted-foreground/20 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted-foreground/20 rounded w-1/3" />
            <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
          </div>
        </div>
      )}
      
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export { Skeleton, SkeletonCard, PageSkeleton };
