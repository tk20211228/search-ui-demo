"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex gap-8 px-4 py-8 max-w-7xl mx-auto w-full"
    >
      {/* Left Side - Search Results Skeleton */}
      <div className="flex-1 space-y-6">
        <div className="h-8 w-32 bg-muted/20 rounded animate-pulse" />
        
        {/* Result Cards */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-6 w-48 bg-muted/20 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-muted/10 rounded animate-pulse" />
                </div>
                <div className="h-10 w-10 rounded-full bg-muted/10 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted/10 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted/10 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-muted/10 rounded animate-pulse" />
              </div>
              
              <div className="flex gap-4 text-sm">
                <div className="h-4 w-24 bg-muted/10 rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Search Form Skeleton */}
      <div className="w-80 sticky top-8 h-fit">
        <div className="border border-border rounded-lg p-6 space-y-6">
          <div className="h-6 w-32 bg-muted/20 rounded animate-pulse" />
          
          {/* Form Fields */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted/10 rounded animate-pulse" />
                <div className="h-10 w-full bg-muted/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
          
          {/* Search Button */}
          <div className="h-10 w-full bg-muted/20 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}