
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardHoverProps {
  children: ReactNode;
  className?: string;
  imageUrl?: string;
  showOverlay?: boolean;
  onClick?: () => void;
}

const CardHover = ({
  children,
  className,
  imageUrl,
  showOverlay = true,
  onClick,
}: CardHoverProps) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-300 hover-scale subtle-shadow',
        className
      )}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
             style={{ backgroundImage: `url(${imageUrl})` }} />
      )}
      
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent" />
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CardHover;
