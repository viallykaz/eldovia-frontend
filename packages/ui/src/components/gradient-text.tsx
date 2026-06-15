'use client';

import { cn } from '../lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className,
  from = 'from-orange-500',
  via,
  to = 'to-amber-400',
  animate = false,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        from,
        via,
        to,
        animate && 'animate-gradient bg-[length:200%_auto]',
        className,
      )}
    >
      {children}
    </span>
  );
}
