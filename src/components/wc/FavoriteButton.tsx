'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavoritesStore } from '@/lib/stores/wc-stores';
import type { FavoriteKind } from '@/lib/wc/types';

export function FavoriteButton({
  kind,
  id,
  className,
  size = 'md',
}: {
  kind: FavoriteKind;
  id: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { isFavorite, toggle } = useFavoritesStore();
  const fav = isFavorite(kind, id);
  const sizeCls = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-10 w-10' : 'h-9 w-9';
  const iconCls = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <button
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggle(kind, id); }}
      className={cn(
        'rounded-full flex items-center justify-center transition-all',
        sizeCls,
        fav
          ? 'text-[#C8102E] bg-[#C8102E]/10 hover:bg-[#C8102E]/20'
          : 'text-muted-foreground hover:text-[#C8102E] hover:bg-muted',
        className
      )}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={cn(iconCls, fav && 'fill-current')} />
    </button>
  );
}
