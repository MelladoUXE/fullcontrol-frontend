import { LucideIcon } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  gradient?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  action,
  gradient = 'from-blue-600 to-cyan-600',
  children
}: PageHeaderProps) {
  return (
    <Card className={`bg-gradient-to-r ${gradient} p-6 text-white shadow-xl transition-smooth`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <Icon className="h-8 w-8" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-white/90 mt-2">{description}</p>
            )}
          </div>
        </div>
        
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 transition-smooth"
            variant="outline"
          >
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
      
      {children && <div className="mt-4">{children}</div>}
    </Card>
  );
}
