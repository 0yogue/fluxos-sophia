import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardLayer } from "@/types/dashboard";
import { BarChart3, Trophy, Search } from "lucide-react";

interface SidebarProps {
  activeLayer: DashboardLayer;
  onLayerChange: (layer: DashboardLayer) => void;
}

const layers = [
  {
    id: 'overview' as const,
    label: 'Visão Geral (Cockpit)',
    icon: BarChart3,
    description: 'Panorama da operação'
  },
  {
    id: 'leaderboard' as const,
    label: 'Análise por Vendedor',
    icon: Trophy,
    description: 'Performance individual'
  },
  {
    id: 'coaching' as const,
    label: 'Análise Qualitativa',
    icon: Search,
    description: 'Conversas detalhadas'
  }
];

export function Sidebar({ activeLayer, onLayerChange }: SidebarProps) {
  return (
    <div className="w-64 bg-card shadow-lg border-r border-border">
      <div className="p-6">
        <h1 className="text-xl font-bold text-card-foreground">Bússola do Gestor</h1>
        <p className="text-sm text-muted-foreground">Dashboard de Performance</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-6 py-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Camadas de Análise
          </h2>
        </div>
        
        <div className="space-y-1 px-3">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            
            return (
              <Button
                key={layer.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto py-3 px-3",
                  isActive && "bg-primary text-primary-foreground",
                  !isActive && "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => onLayerChange(layer.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">{layer.label}</div>
                  <div className="text-xs opacity-70">{layer.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
