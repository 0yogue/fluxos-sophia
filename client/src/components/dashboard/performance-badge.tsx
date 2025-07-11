import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PerformanceBadgeProps {
  value: number;
  type: 'percentage' | 'time' | 'score';
  className?: string;
}

export function PerformanceBadge({ value, type, className }: PerformanceBadgeProps) {
  const getVariant = () => {
    if (type === 'percentage') {
      if (value >= 12) return 'success';
      if (value >= 8) return 'warning';
      return 'destructive';
    }
    
    if (type === 'time') {
      if (value <= 120) return 'success'; // 2 minutes
      if (value <= 300) return 'warning'; // 5 minutes
      return 'destructive';
    }
    
    if (type === 'score') {
      if (value >= 80) return 'success';
      if (value >= 60) return 'warning';
      return 'destructive';
    }
    
    return 'secondary';
  };

  const formatValue = () => {
    if (type === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    
    if (type === 'time') {
      if (value < 60) return `${Math.round(value)}s`;
      const minutes = Math.floor(value / 60);
      const seconds = Math.round(value % 60);
      return `${minutes}m ${seconds}s`;
    }
    
    if (type === 'score') {
      return `${Math.round(value)}%`;
    }
    
    return value.toString();
  };

  const variant = getVariant();
  
  return (
    <Badge
      variant={variant === 'success' ? 'default' : variant === 'warning' ? 'secondary' : 'destructive'}
      className={cn(
        variant === 'success' && "bg-green-100 text-green-800 hover:bg-green-200",
        variant === 'warning' && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        className
      )}
    >
      {formatValue()}
    </Badge>
  );
}
