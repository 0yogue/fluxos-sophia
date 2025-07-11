import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConversationData, SalespersonPerformance } from "@/types/dashboard";
import { Check, X, User, Bot } from "lucide-react";

interface ConversationModalProps {
  conversation: ConversationData;
  salesperson?: SalespersonPerformance;
  onClose: () => void;
  formatTime: (seconds: number) => string;
}

export function ConversationModal({ conversation, salesperson, onClose, formatTime }: ConversationModalProps) {
  const llmAnalysis = conversation.llmAnalysis ? JSON.parse(conversation.llmAnalysis) : null;

  // Mock transcript for demonstration
  const mockTranscript = [
    { id: 1, sender: 'salesperson', message: 'Olá! 😊 Meu nome é Maria, tudo bem com você?', timestamp: '14:30:12' },
    { id: 2, sender: 'customer', message: 'Oi Maria! Estou interessado nos óculos multifocais.', timestamp: '14:30:45' },
    { id: 3, sender: 'salesperson', message: 'Perfeito! Vou te ajudar a encontrar o óculos ideal para você. Para isso, preciso saber um pouco mais sobre suas necessidades. Você já usa óculos atualmente?', timestamp: '14:31:10' },
    { id: 4, sender: 'customer', message: 'Uso sim, mas só para longe. Agora preciso para perto também.', timestamp: '14:31:30' },
    { id: 5, sender: 'salesperson', message: 'Entendo perfeitamente! O multifocal é mesmo a solução ideal para você. Que tal agendarmos uma consulta por vídeo chamada para eu poder te mostrar nossas opções? É gratuito e você ainda ganha frete grátis! 🎁', timestamp: '14:32:15' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden" aria-describedby="conversation-modal-description">
        <DialogHeader>
          <DialogTitle>
            Análise Detalhada da Conversa #{conversation.id}
          </DialogTitle>
        </DialogHeader>
        <div id="conversation-modal-description" className="sr-only">
          Análise completa da conversa incluindo transcrição e insights do LLM
        </div>
        
        <div className="flex h-[calc(90vh-120px)]">
          {/* Transcript Section */}
          <div className="flex-1 overflow-y-auto border-r border-border pr-6">
            <h3 className="text-lg font-semibold mb-4">Transcrição Completa</h3>
            <div className="space-y-4">
              {mockTranscript.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.sender === 'salesperson' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>
                      {message.sender === 'salesperson' ? (salesperson?.avatar || 'S') : 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className={`p-3 rounded-lg ${message.sender === 'salesperson' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Section */}
          <div className="w-96 pl-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Análise do LLM</h3>
            
            {/* Summary Card */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Score Final</span>
                    <span className={`text-lg font-bold ${getScoreColor(conversation.scriptScore || 0)}`}>
                      {conversation.scriptScore || 0}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sentimento</span>
                    <span className="text-sm">
                      {conversation.sentiment} {getSentimentEmoji(conversation.sentiment || 'neutral')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">FOCO Médio</span>
                    <span className="text-sm">{formatTime(conversation.responseTime || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Script Checklist */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-base">Checklist do Script</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {llmAnalysis?.steps && Object.entries(llmAnalysis.steps).map(([key, completed]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {completed ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Strengths */}
            {llmAnalysis?.strengths && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-base text-green-600">Pontos Fortes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {llmAnalysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Opportunities */}
            {llmAnalysis?.improvements && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-orange-600">Oportunidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {llmAnalysis.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
