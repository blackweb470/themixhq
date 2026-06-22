export const Skeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
  );
};

export const ArticleCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
      <Skeleton className="w-24 h-5 mt-2 rounded-full" />
      <Skeleton className="w-full h-7" />
      <Skeleton className="w-3/4 h-7" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
    </div>
  );
};

export const InstagramSkeleton = () => {
  return (
    <Skeleton className="w-full aspect-square rounded-none" />
  );
};

export const AdminRowSkeleton = () => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 px-6">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-1/2 h-5" />
        <Skeleton className="w-1/4 h-4" />
      </div>
      <Skeleton className="w-20 h-8 rounded-full" />
    </div>
  );
};
