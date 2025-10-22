import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: 'default' | 'card' | 'inline';
}

export function ErrorState({
  title = 'Error al cargar datos',
  message,
  onRetry,
  variant = 'card'
}: ErrorStateProps) {
  const content = (
    <div className={`text-center ${variant === 'inline' ? 'py-6' : 'py-12'}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      )}
    </div>
  );

  if (variant === 'card') {
    return <Card className="p-6">{content}</Card>;
  }

  if (variant === 'inline') {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-4">
        {content}
      </div>
    );
  }

  return content;
}
