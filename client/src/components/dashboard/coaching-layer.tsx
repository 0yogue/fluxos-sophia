import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PerformanceBadge } from "./performance-badge";
import { ConversationModal } from "./conversation-modal";
import { ConversationData, SalespersonPerformance } from "@/types/dashboard";
import { Eye, Check, X } from "lucide-react";

interface CoachingLayerProps {
  conversations: ConversationData[];
  salespeople: SalespersonPerformance[];
  formatTime: (seconds: number) => string;
}

export function CoachingLayer({ conversations, salespeople, formatTime }: CoachingLayerProps) {
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [filters, setFilters] = useState({
    salesperson: 'all',
    score: 'all',
    result: 'all',
    responseTime: 'all',
  });

  const filteredConversations = conversations?.filter(conv => {
    if (filters.salesperson !== 'all' && conv.salespersonId !== parseInt(filters.salesperson)) {
      return false;
    }
    if (filters.score !== 'all') {
      if (filters.score === 'high' && (conv.scriptScore || 0) < 90) return false;
      if (filters.score === 'medium' && ((conv.scriptScore || 0) < 70 || (conv.scriptScore || 0) >= 90)) return false;
      if (filters.score === 'low' && (conv.scriptScore || 0) >= 70) return false;
    }
    if (filters.result !== 'all') {
      if (filters.result === 'sale' && !conv.hasSale) return false;
      if (filters.result === 'no-sale' && conv.hasSale) return false;
    }
    if (filters.responseTime !== 'all') {
      const responseTime = conv.responseTime || 0;
      if (filters.responseTime === 'fast' && responseTime > 120) return false;
      if (filters.responseTime === 'medium' && (responseTime <= 120 || responseTime > 300)) return false;
      if (filters.responseTime === 'slow' && responseTime <= 300) return false;
    }
    return true;
  }) || [];

  const getSalespersonName = (salespersonId: number) => {
    const salesperson = salespeople.find(s => s.id === salespersonId);
    return salesperson?.name || 'Desconhecido';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros Avançados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={filters.salesperson} onValueChange={(value) => setFilters(prev => ({ ...prev, salesperson: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Vendedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Vendedores</SelectItem>
                {salespeople.map(person => (
                  <SelectItem key={person.id} value={person.id.toString()}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.score} onValueChange={(value) => setFilters(prev => ({ ...prev, score: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Scores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Scores</SelectItem>
                <SelectItem value="high">&gt; 90% (Excelente)</SelectItem>
                <SelectItem value="medium">70-90% (Bom)</SelectItem>
                <SelectItem value="low">&lt; 70% (Precisa Melhoria)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.result} onValueChange={(value) => setFilters(prev => ({ ...prev, result: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as Conversas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Conversas</SelectItem>
                <SelectItem value="sale">Apenas Vendas</SelectItem>
                <SelectItem value="no-sale">Apenas Não-Vendas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.responseTime} onValueChange={(value) => setFilters(prev => ({ ...prev, responseTime: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os FOCO" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os FOCO</SelectItem>
                <SelectItem value="fast">&lt; 2min (Rápido)</SelectItem>
                <SelectItem value="medium">2-5min (Médio)</SelectItem>
                <SelectItem value="slow">&gt; 5min (Lento)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle>Conversas Detalhadas ({filteredConversations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vendedor</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">FOCO</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resultado</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversations.map((conversation) => (
                  <tr key={conversation.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium">#{conversation.id}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {formatDate(new Date(conversation.startedAt))}
                    </td>
                    <td className="py-4 px-4">{getSalespersonName(conversation.salespersonId)}</td>
                    <td className="py-4 px-4">
                      {conversation.scriptScore && (
                        <PerformanceBadge 
                          value={conversation.scriptScore} 
                          type="score"
                        />
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {conversation.responseTime && formatTime(conversation.responseTime)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {conversation.hasSale ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${conversation.hasSale ? 'text-green-600' : 'text-red-600'}`}>
                          {conversation.hasSale ? 'Venda' : 'Não Venda'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedConversation(conversation)}
                        className="text-primary hover:text-primary/80"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Modal */}
      {selectedConversation && (
        <ConversationModal
          conversation={selectedConversation}
          salesperson={salespeople.find(s => s.id === selectedConversation.salespersonId)}
          onClose={() => setSelectedConversation(null)}
          formatTime={formatTime}
        />
      )}
    </div>
  );
}
