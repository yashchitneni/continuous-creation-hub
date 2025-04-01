
import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          {
            'bg-muted text-muted-foreground hover:bg-muted/80': variant === 'default',
            'bg-jungle text-primary-foreground hover:bg-jungle/90': variant === 'primary',
            'bg-cambridge text-secondary-foreground hover:bg-cambridge/90': variant === 'secondary',
            'bg-green-600 text-white hover:bg-green-700': variant === 'success',
            'bg-yellow-500 text-white hover:bg-yellow-600': variant === 'warning',
            'border border-border text-foreground hover:bg-muted/10': variant === 'outline',
            'text-xs px-2 py-0.5': size === 'sm',
            'text-sm px-2.5 py-0.5': size === 'md',
            'text-sm px-3 py-1': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Tag.displayName = 'Tag';
