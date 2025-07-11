import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PerformanceBadge } from "./performance-badge";
import { SalespersonPerformance } from "@/types/dashboard";
import { Trophy, AlertTriangle, TrendingUp } from "lucide-react";

interface LeaderboardLayerProps {
  salespeople: SalespersonPerformance[];
  formatCurrency: (value: number) => string;
  formatTime: (seconds: number) => string;
}

export function LeaderboardLayer({ salespeople, formatCurrency, formatTime }: LeaderboardLayerProps) {
  const sortedSalespeople = [...salespeople].sort((a, b) => b.conversionRate - a.conversionRate);
  
  const topPerformers = sortedSalespeople.slice(0, 2);
  const needsCoaching = sortedSalespeople.filter(p => p.conversionRate < 8 || p.avgScriptScore < 60);

  const getPerformanceLevel = (person: SalespersonPerformance) => {
    if (person.conversionRate >= 12 && person.avgScriptScore >= 80) return 'Top Performer';
    if (person.conversationsCount > 180) return 'Alto Volume';
    if (person.conversionRate < 8 || person.avgScriptScore < 60) return 'Precisa Coaching';
    return 'Bom Desempenho';
  };

  const getAvatarColor = (conversionRate: number) => {
    if (conversionRate >= 12) return 'bg-green-500';
    if (conversionRate >= 8) return 'bg-blue-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Performance por Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vendedor</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Conversas</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vendas</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Taxa Conversão</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">FOCO</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score Script</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Duração Média</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedSalespeople.map((person, index) => (
                  <tr key={person.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className={getAvatarColor(person.conversionRate)}>
                          <AvatarFallback className="text-white font-medium">
                            {person.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{person.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {getPerformanceLevel(person)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">{person.conversationsCount}</td>
                    <td className="py-4 px-4">{person.salesCount}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Progress 
                          value={Math.min(person.conversionRate, 20)} 
                          className="w-16 h-2"
                        />
                        <PerformanceBadge 
                          value={person.conversionRate} 
                          type="percentage"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <PerformanceBadge 
                        value={person.avgResponseTime} 
                        type="time"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <PerformanceBadge 
                        value={person.avgScriptScore} 
                        type="score"
                      />
                    </td>
                    <td className="py-4 px-4">{formatTime(person.avgDuration * 60)}</td>
                    <td className="py-4 px-4 font-medium">{formatCurrency(person.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformers.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="font-medium">{person.name}</span>
                </div>
                <span className="text-sm text-green-600">
                  {person.conversionRate >= 12 && person.avgScriptScore >= 80 
                    ? 'Alta conversão + Script' 
                    : 'Alto volume + Resultado'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <span>Oportunidades de Melhoria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {needsCoaching.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="font-medium">{person.name}</span>
                </div>
                <span className="text-sm text-red-600">
                  {person.conversionRate < 8 ? 'Baixa conversão' : 'Script'} 
                  {person.avgResponseTime > 300 ? ' + FOCO' : ''}
                </span>
              </div>
            ))}
            
            {needsCoaching.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Foco no treinamento de script e agilidade de resposta
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
