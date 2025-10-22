'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');

  return (
    <Button
      variant="outline"
      className="relative w-full md:w-64 justify-start text-sm text-muted-foreground hover:bg-gray-50"
      onClick={onClick}
    >
      <Search className="mr-2 h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">Buscar...</span>
      <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
        <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>K
      </kbd>
    </Button>
  );
}
