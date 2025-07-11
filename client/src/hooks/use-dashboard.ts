import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardFilters, DashboardLayer, PerformanceMetrics } from '@/types/dashboard';

export function useDashboard() {
  const [activeLayer, setActiveLayer] = useState<DashboardLayer>('overview');
  const [filters, setFilters] = useState<DashboardFilters>({
    period: '7days'
  });

  const queryFilters = useMemo(() => {
    const params: Record<string, string> = {};
    
    if (filters.startDate) {
      params.startDate = filters.startDate.toISOString();
    }
    if (filters.endDate) {
      params.endDate = filters.endDate.toISOString();
    }
    if (filters.salespersonId) {
      params.salespersonId = filters.salespersonId.toString();
    }
    
    return params;
  }, [filters]);

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery<PerformanceMetrics>({
    queryKey: ['/api/performance', queryFilters],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['/api/conversations', filters],
    enabled: activeLayer === 'coaching',
  });

  const updateFilters = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${Math.round(remainingSeconds)}s`;
  };

  return {
    activeLayer,
    setActiveLayer,
    filters,
    updateFilters,
    metrics,
    conversations,
    isLoadingMetrics,
    isLoadingConversations,
    formatCurrency,
    formatPercentage,
    formatTime,
  };
}
