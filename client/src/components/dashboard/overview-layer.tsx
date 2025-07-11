import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KPICard } from "./kpi-card";
import { PerformanceMetrics } from "@/types/dashboard";
import { 
  DollarSign, 
  ShoppingCart, 
  Percent, 
  MessageSquare, 
  Clock, 
  Star,
  Info,
  CheckCircle
} from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OverviewLayerProps {
  metrics: PerformanceMetrics;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
  formatTime: (seconds: number) => string;
}

export function OverviewLayer({ metrics, formatCurrency, formatPercentage, formatTime }: OverviewLayerProps) {
  const { overview, salespeople } = metrics;
  
  // Prepare scatter plot data
  const scatterData = salespeople.map(person => ({
    name: person.name,
    scriptScore: person.avgScriptScore,
    conversionRate: person.conversionRate,
  }));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Visão Geral da Performance
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Panorama completo da operação de vendas em 30 segundos. Identifique rapidamente a saúde geral do seu time e onde estão os gargalos.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">KPIs Essenciais</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-muted-foreground">Funil de Análise</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-muted-foreground">Correlação Qualidade/Resultado</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <div className="text-4xl">🧭</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <KPICard
          title="Total de Vendas"
          value={formatCurrency(overview.totalRevenue)}
          trend={{ value: 15, isPositive: true }}
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          iconColor="bg-green-100"
        />
        
        <KPICard
          title="Nº de Vendas"
          value={overview.totalSales.toString()}
          trend={{ value: 10, isPositive: true }}
          icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
          iconColor="bg-blue-100"
        />
        
        <KPICard
          title="Taxa de Conversão"
          value={formatPercentage(overview.conversionRate)}
          trend={{ value: 2, isPositive: false }}
          icon={<Percent className="h-5 w-5 text-yellow-600" />}
          iconColor="bg-yellow-100"
        />
        
        <KPICard
          title="Conversas Iniciadas"
          value={overview.totalConversations.toString()}
          trend={{ value: 8, isPositive: true }}
          icon={<MessageSquare className="h-5 w-5 text-purple-600" />}
          iconColor="bg-purple-100"
        />
        
        <KPICard
          title="FOCO Médio"
          value={formatTime(overview.avgResponseTime)}
          icon={<Clock className="h-5 w-5 text-green-600" />}
          iconColor="bg-green-100"
        />
        
        <KPICard
          title="Score Médio Script"
          value={formatPercentage(overview.avgScriptScore)}
          icon={<Star className="h-5 w-5 text-orange-600" />}
          iconColor="bg-orange-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Conversas Iniciadas</span>
                  <span className="text-sm font-bold">{overview.totalConversations}</span>
                </div>
                <Progress value={100} className="h-3" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Leads Qualificados</span>
                  <span className="text-sm font-bold">{overview.qualifiedLeads}</span>
                </div>
                <Progress 
                  value={(overview.qualifiedLeads / overview.totalConversations) * 100} 
                  className="h-3"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Negócios Fechados</span>
                  <span className="text-sm font-bold">{overview.totalSales}</span>
                </div>
                <Progress 
                  value={(overview.totalSales / overview.totalConversations) * 100} 
                  className="h-3"
                />
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Insight:</strong> Taxa de qualificação de{' '}
                {formatPercentage((overview.qualifiedLeads / overview.totalConversations) * 100)}{' '}
                está {(overview.qualifiedLeads / overview.totalConversations) * 100 > 25 ? 'acima' : 'abaixo'} da média do setor (25%).
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Quality vs Results Correlation */}
        <Card>
          <CardHeader>
            <CardTitle>Qualidade vs. Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="scriptScore" 
                    name="Score do Script"
                    type="number"
                    domain={[0, 100]}
                    label={{ value: 'Score do Script (%)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="conversionRate" 
                    name="Taxa de Conversão"
                    type="number"
                    domain={[0, 'dataMax + 2']}
                    label={{ value: 'Taxa de Conversão (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${typeof value === 'number' ? value.toFixed(1) : value}%`, 
                      name === 'conversionRate' ? 'Taxa de Conversão' : 'Score do Script'
                    ]}
                    labelFormatter={(label) => `Vendedor: ${label}`}
                  />
                  <Scatter 
                    data={scatterData} 
                    fill="hsl(var(--primary))"
                    name="Vendedores"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Correlação Positiva:</strong> Vendedores com maior aderência ao script têm 40% mais conversões.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
