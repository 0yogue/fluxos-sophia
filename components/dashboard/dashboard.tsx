'use client'

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
import type { DashboardLayer } from "@/types/dashboard";

export function Dashboard() {
  const [activeLayer, setActiveLayer] = useState<DashboardLayer>('overview');
  const { data, isLoading, error, filters, updateFilters } = useDashboard();

  const layerTitles = {
    overview: 'Visão Geral',
    leaderboard: 'Ranking Individual',
    coaching: 'Análise Qualitativa'
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-background">
        <div className="w-64 bg-card shadow-lg border-r border-border p-6">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24 mb-6" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Não foi possível carregar os dados do dashboard. Tente novamente.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
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
          {activeLayer === 'overview' && data && (
            <OverviewLayer
              metrics={data}
              formatCurrency={formatCurrency}
              formatPercentage={formatPercentage}
              formatTime={formatTime}
            />
          )}
          
          {activeLayer === 'leaderboard' && data && (
            <LeaderboardLayer
              salespeople={data.salespeople}
              formatCurrency={formatCurrency}
              formatTime={formatTime}
            />
          )}
          
          {activeLayer === 'coaching' && data && (
            <CoachingLayer
              conversations={data.conversations}
              salespeople={data.salespeople}
              formatTime={formatTime}
            />
          )}
        </div>
      </div>
    </div>
  );
}