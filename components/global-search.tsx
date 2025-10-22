'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
  Search, 
  User, 
  Clock, 
  Shield, 
  FileText,
  Calendar,
  Bell,
  Loader2
} from 'lucide-react';
import { searchService, SearchResult } from '@/lib/search-service';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  user: User,
  time_entry: Clock,
  audit: Shield,
  approval: FileText,
  vacation: Calendar,
  reminder: Bell,
};

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    users: SearchResult[];
    time_entries: SearchResult[];
    audit_logs: SearchResult[];
    total: number;
  }>({
    users: [],
    time_entries: [],
    audit_logs: [],
    total: 0,
  });
  const [isSearching, setIsSearching] = useState(false);

  // Atajo de teclado Ctrl+K / Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Búsqueda con debounce
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults({ users: [], time_entries: [], audit_logs: [], total: 0 });
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchService.performLocalSearch(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    router.push(result.url);
  };

  const renderResultGroup = (
    title: string,
    results: SearchResult[],
    type: keyof typeof iconMap
  ) => {
    if (results.length === 0) return null;

    const Icon = iconMap[type];

    return (
      <>
        <CommandGroup heading={title}>
          {results.map((result) => (
            <CommandItem
              key={`${result.type}-${result.id}`}
              value={`${result.type}-${result.id}-${result.title}`}
              onSelect={() => handleSelect(result)}
              className="flex items-start gap-3 py-3"
            >
              <div className="mt-0.5">
                <Icon className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {result.title}
                  </p>
                  {result.metadata?.status && (
                    <Badge variant="outline" className="text-xs">
                      {result.metadata.status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {result.description}
                </p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
      </>
    );
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center border-b px-3">
        {isSearching ? (
          <Loader2 className="mr-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
        ) : (
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        )}
        <CommandInput
          placeholder="Buscar empleados, registros, logs..."
          value={query}
          onValueChange={setQuery}
        />
      </div>
      <CommandList>
        <CommandEmpty>
          {query.length < 2
            ? 'Escribe al menos 2 caracteres para buscar...'
            : 'No se encontraron resultados.'}
        </CommandEmpty>

        {renderResultGroup('Empleados', results.users, 'user')}
        {renderResultGroup('Registros de Tiempo', results.time_entries, 'time_entry')}
        {renderResultGroup('Logs de Auditoría', results.audit_logs, 'audit')}

        {results.total > 0 && (
          <div className="px-2 py-3 text-center text-xs text-gray-500 border-t">
            {results.total} resultado{results.total !== 1 ? 's' : ''} encontrado{results.total !== 1 ? 's' : ''}
          </div>
        )}
      </CommandList>

      {/* Shortcuts hint */}
      <div className="border-t p-2 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">↓</kbd>
              <span>navegar</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">↵</kbd>
              <span>seleccionar</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Esc</kbd>
              <span>cerrar</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">
              {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">K</kbd>
            <span>para abrir</span>
          </div>
        </div>
      </div>
    </CommandDialog>
  );
}
