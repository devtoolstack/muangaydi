import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="glass border-white/5 rounded-[40px] overflow-hidden flex flex-col h-full animate-pulse">
      <div className="aspect-[4/5] bg-white/5" />
      <div className="p-8 space-y-4">
        <div className="h-4 bg-white/5 rounded-full w-1/3" />
        <div className="h-8 bg-white/5 rounded-2xl w-full" />
        <div className="flex justify-between items-end pt-4">
          <div className="space-y-2">
            <div className="h-3 bg-white/5 rounded-full w-20" />
            <div className="h-6 bg-white/5 rounded-xl w-24" />
          </div>
          <div className="h-12 w-12 bg-white/5 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
