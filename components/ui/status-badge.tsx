import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-smooth",
  {
    variants: {
      status: {
        success: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        pending: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
        active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
        inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      },
      pulse: {
        true: "relative",
        false: "",
      },
    },
    defaultVariants: {
      status: "info",
      pulse: false,
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ 
  status, 
  pulse = false, 
  icon, 
  children, 
  className 
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status, pulse }), className)}>
      {pulse && (
        <span className="absolute inset-0 animate-ping rounded-full opacity-75" 
              style={{ 
                backgroundColor: 'currentColor',
                opacity: 0.15 
              }} 
        />
      )}
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
