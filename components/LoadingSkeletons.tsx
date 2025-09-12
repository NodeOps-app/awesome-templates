import React from "react";

export function PromptGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="bg-primary/5 border border-primary/20 rounded-lg p-6 animate-pulse"
        >
          <div className="h-6 bg-primary/20 rounded mb-3"></div>
          <div className="h-4 bg-primary/10 rounded mb-2"></div>
          <div className="h-4 bg-primary/10 rounded mb-4 w-3/4"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 bg-primary/10 rounded px-2 w-16"></div>
            <div className="h-6 bg-primary/10 rounded px-2 w-20"></div>
            <div className="h-6 bg-primary/10 rounded px-2 w-14"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PromptDetailSkeleton() {
  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-2 gap-6">
      {/* Left Column - Prompt Details */}
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-primary/20 rounded mb-2"></div>
          <div className="h-4 bg-primary/10 rounded mb-4 w-1/2"></div>
          <div className="bg-primary/5 border border-primary/10 p-4 rounded">
            <div className="space-y-2">
              <div className="h-4 bg-primary/10 rounded"></div>
              <div className="h-4 bg-primary/10 rounded"></div>
              <div className="h-4 bg-primary/10 rounded w-3/4"></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-6 bg-primary/20 rounded mb-2 w-16"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 bg-primary/10 rounded px-2 w-16"></div>
              <div className="h-6 bg-primary/10 rounded px-2 w-20"></div>
              <div className="h-6 bg-primary/10 rounded px-2 w-14"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Chat Skeleton */}
      <div className="border border-primary/20 p-6 rounded-lg animate-pulse">
        <div className="h-6 bg-primary/20 rounded mb-4"></div>
        <div className="space-y-3 mb-4">
          <div className="h-4 bg-primary/10 rounded w-1/3"></div>
          <div className="h-4 bg-primary/10 rounded w-1/2"></div>
        </div>
        <div className="h-32 bg-primary/5 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="flex-1 h-20 bg-primary/5 rounded"></div>
          <div className="w-20 h-20 bg-primary/10 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Prompt Engine Section */}
      <section className="mb-12 flex flex-col items-center mt-8">
        <div className="h-10 bg-primary/20 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-primary/10 rounded w-96 mb-5 animate-pulse"></div>
        <div className="h-10 bg-primary/20 rounded w-32 animate-pulse"></div>
      </section>

      {/* Trending Prompts Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-primary/20 rounded w-40 animate-pulse"></div>
          <div className="h-8 bg-primary/10 rounded w-20 animate-pulse"></div>
        </div>
        <PromptGridSkeleton />
      </section>
    </div>
  );
}

export function DirectoryPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile Category Filter */}
      <div className="lg:hidden mb-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 animate-pulse">
          <div className="h-6 bg-primary/20 rounded mb-4 w-24"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-8 bg-primary/10 rounded px-3 w-20"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-primary/20 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-primary/10 rounded w-96 animate-pulse"></div>
        </div>
        <PromptGridSkeleton />
      </div>
    </div>
  );
}
