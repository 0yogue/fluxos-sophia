import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/dashboard/sidebar";
import { OverviewLayer } from "@/components/dashboard/overview-layer";
import { LeaderboardLayer } from "@/components/dashboard/leaderboard-layer";
import { CoachingLayer } from "@/components/dashboard/coaching-layer";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDashboard } from "@/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Calendar } from "lucide-react";

export default function Dashboard() {
  const {
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
  } = useDashboard();

  const layerTitles = {
    overview: 'Visão Geral da Performance',
    leaderboard: 'Análise por Vendedor',
    coaching: 'Análise Qualitativa e Coaching',
  };

  if (isLoadingMetrics) {
    return (
      <div className="min-h-screen flex">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">Não foi possível carregar os dados do dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar activeLayer={activeLayer} onLayerChange={setActiveLayer} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-card shadow-sm border-b border-border p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground mb-1">
                {layerTitles[activeLayer]}
              </h2>
              <p className="text-sm text-muted-foreground">
                A Bússola do Gestor - Visão Geral da Operação
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Select 
                value={filters.period} 
                onValueChange={(value) => updateFilters({ period: value as any })}
              >
                <SelectTrigger className="w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="custom">Período Customizado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeLayer === 'overview' && (
            <OverviewLayer 
              metrics={metrics}
              formatCurrency={formatCurrency}
              formatPercentage={formatPercentage}
              formatTime={formatTime}
            />
          )}
          
          {activeLayer === 'leaderboard' && (
            <LeaderboardLayer 
              salespeople={metrics.salespeople}
              formatCurrency={formatCurrency}
              formatTime={formatTime}
            />
          )}
          
          {activeLayer === 'coaching' && (
            <CoachingLayer 
              conversations={conversations || []}
              salespeople={metrics.salespeople}
              formatTime={formatTime}
            />
          )}
        </div>
      </div>
    </div>
  );
}
