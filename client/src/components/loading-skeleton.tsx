import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Database Info Card Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-64 h-4" />
            </div>
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
        </CardContent>
      </Card>
      
      {/* Table Controls Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <Skeleton className="w-64 h-10" />
              <Skeleton className="w-32 h-10" />
            </div>
            <Skeleton className="w-32 h-6" />
          </div>
        </CardContent>
      </Card>
      
      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b">
            <Skeleton className="w-32 h-5" />
          </div>
          
          <div className="space-y-4 p-6">
            {/* Table Header */}
            <div className="flex space-x-4">
              <Skeleton className="flex-1 h-4" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-28 h-4" />
            </div>
            
            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-28 h-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
