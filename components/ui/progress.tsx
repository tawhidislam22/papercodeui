'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const safeMax = max > 0 ? max : 100;
    const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));

    return (
      <div
        ref={ref}
        className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
        {...props}
      >
        <div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
