'use client';

import { useEffect, useState, useRef } from 'react';
import { loadActivityLog, ActivityLog } from '@/lib/activitySession';

export function ContributionGraph() {
  const [activityLog, setActivityLog] = useState<ActivityLog>({});
  const [weeks, setWeeks] = useState(53); // Default to ~1 year
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load activity on mount
  useEffect(() => {
    setActivityLog(loadActivityLog());
  }, []);

  // Calculate generic weeks based on width
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWeeks = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Cell width (12px) + gap (4px) = 16px
        // We want to fill the width.
        const possibleWeeks = Math.floor(width / 16);
        setWeeks(Math.max(10, possibleWeeks)); // At least 10 weeks
      }
    };

    updateWeeks();
    window.addEventListener('resize', updateWeeks);
    return () => window.removeEventListener('resize', updateWeeks);
  }, []);

  // Generate days based on weeks
  const totalDays = weeks * 7;
  const days = [];
  const today = new Date();
  // Adjust to end on today? Or end of week?
  // Usually contribution graph ends on today.
  // We want the last column to be "this week".
  // Let's generate backwards from today.
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  // Get color intensity based on count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted/40';
    if (count <= 2) return 'bg-primary/30';
    if (count <= 5) return 'bg-primary/60';
    if (count <= 10) return 'bg-primary/80';
    return 'bg-primary shadow-[0_0_8px_rgba(29,185,84,0.6)]';
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex gap-1 flex-wrap h-[112px] content-start flex-col">
          {days.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const count = activityLog[dateStr] || 0;
            return (
              <div
                key={dateStr}
                className={`w-3 h-3 rounded-sm ${getColor(count)} transition-all hover:scale-125 cursor-default relative group`}
              >
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap bg-popover text-popover-foreground text-xs px-2 py-1 rounded border shadow-md">
                  {dateStr}: {count} contributions
                 </div>
              </div>
            );
          })}
      </div>
      <div className="flex items-center justify-end text-xs text-muted-foreground gap-1 mt-2">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-muted/40" />
        <div className="w-3 h-3 rounded-sm bg-primary/30" />
        <div className="w-3 h-3 rounded-sm bg-primary/60" />
        <div className="w-3 h-3 rounded-sm bg-primary/80" />
        <div className="w-3 h-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
