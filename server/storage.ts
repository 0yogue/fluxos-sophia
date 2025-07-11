import { 
  salespeople, 
  conversations, 
  scriptSteps,
  type Salesperson, 
  type Conversation, 
  type ScriptStep,
  type InsertSalesperson, 
  type InsertConversation, 
  type InsertScriptStep 
} from "@shared/schema";

export interface IStorage {
  // Salespeople
  getSalespeople(): Promise<Salesperson[]>;
  getSalesperson(id: number): Promise<Salesperson | undefined>;
  createSalesperson(salesperson: InsertSalesperson): Promise<Salesperson>;
  
  // Conversations
  getConversations(filters?: {
    salespersonId?: number;
    startDate?: Date;
    endDate?: Date;
    hasSale?: boolean;
    minScore?: number;
    maxScore?: number;
  }): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Script Steps
  getScriptSteps(conversationId: number): Promise<ScriptStep[]>;
  createScriptStep(scriptStep: InsertScriptStep): Promise<ScriptStep>;
  
  // Performance Analytics
  getPerformanceMetrics(filters?: {
    startDate?: Date;
    endDate?: Date;
    salespersonId?: number;
  }): Promise<any>;
}

export class MemStorage implements IStorage {
  private salespeople: Map<number, Salesperson> = new Map();
  private conversations: Map<number, Conversation> = new Map();
  private scriptSteps: Map<number, ScriptStep> = new Map();
  private currentSalespersonId = 1;
  private currentConversationId = 1;
  private currentScriptStepId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize salespeople
    const mockSalespeople: Salesperson[] = [
      { id: 1, name: "Maria Silva", email: "maria@company.com", avatar: "MS", isActive: true },
      { id: 2, name: "João Oliveira", email: "joao@company.com", avatar: "JO", isActive: true },
      { id: 3, name: "Ana Santos", email: "ana@company.com", avatar: "AS", isActive: true },
      { id: 4, name: "Pedro Costa", email: "pedro@company.com", avatar: "PC", isActive: true },
    ];

    mockSalespeople.forEach(person => {
      this.salespeople.set(person.id, person);
    });
    this.currentSalespersonId = 5;

    // Initialize conversations with realistic data
    const mockConversations: Conversation[] = [
      // Maria's conversations (top performer)
      {
        id: 1287,
        salespersonId: 1,
        customerId: "cust_001",
        customerName: "Ana Silva",
        startedAt: new Date("2025-01-11T14:30:00"),
        endedAt: new Date("2025-01-11T14:40:00"),
        duration: 10,
        responseTime: 125, // 2m 05s
        hasSale: true,
        saleAmount: 520.00,
        scriptScore: 87,
        sentiment: "positive",
        transcript: "Conversa completa aqui...",
        llmAnalysis: JSON.stringify({
          strengths: ["Criou ótimo rapport inicial", "Rápida e precisa nas respostas"],
          improvements: ["Usar mais prova social", "Trabalhar objeções antes da oferta"],
          steps: {
            greeting: true,
            videoPitch: true,
            objectionHandling: false,
            alternatives: true,
            socialProof: false
          }
        })
      },
      {
        id: 1288,
        salespersonId: 1,
        customerId: "cust_012",
        customerName: "Carlos Mendes",
        startedAt: new Date("2025-01-11T15:20:00"),
        endedAt: new Date("2025-01-11T15:35:00"),
        duration: 15,
        responseTime: 90,
        hasSale: true,
        saleAmount: 780.00,
        scriptScore: 92,
        sentiment: "positive",
        transcript: "Conversa excelente com fechamento...",
        llmAnalysis: JSON.stringify({
          strengths: ["Excelente uso de prova social", "Contornou objeções perfeitamente"],
          improvements: ["Pode acelerar um pouco o ritmo"],
          steps: {
            greeting: true,
            videoPitch: true,
            objectionHandling: true,
            alternatives: true,
            socialProof: true
          }
        })
      },
      {
        id: 1289,
        salespersonId: 1,
        customerId: "cust_013",
        customerName: "Beatriz Santos",
        startedAt: new Date("2025-01-11T16:45:00"),
        endedAt: new Date("2025-01-11T17:00:00"),
        duration: 15,
        responseTime: 110,
        hasSale: false,
        saleAmount: null,
        scriptScore: 85,
        sentiment: "neutral",
        transcript: "Cliente não estava pronto para comprar...",
        llmAnalysis: JSON.stringify({
          strengths: ["Manteve profissionalismo", "Seguiu script corretamente"],
          improvements: ["Poderia ter insistido mais na urgência"],
          steps: {
            greeting: true,
            videoPitch: true,
            objectionHandling: true,
            alternatives: true,
            socialProof: false
          }
        })
      },
      // João's conversations (needs improvement)
      {
        id: 1286,
        salespersonId: 2,
        customerId: "cust_002",
        customerName: "Roberto Lima",
        startedAt: new Date("2025-01-11T12:15:00"),
        endedAt: new Date("2025-01-11T12:30:00"),
        duration: 15,
        responseTime: 260, // 4m 20s
        hasSale: false,
        saleAmount: null,
        scriptScore: 45,
        sentiment: "negative",
        transcript: "Conversa sem venda...",
        llmAnalysis: JSON.stringify({
          strengths: ["Persistente"],
          improvements: ["Melhorar tempo de resposta", "Seguir script mais rigorosamente"],
          steps: {
            greeting: true,
            videoPitch: false,
            objectionHandling: false,
            alternatives: true,
            socialProof: false
          }
        })
      },
      {
        id: 1290,
        salespersonId: 2,
        customerId: "cust_014",
        customerName: "Fernanda Costa",
        startedAt: new Date("2025-01-11T13:30:00"),
        endedAt: new Date("2025-01-11T13:50:00"),
        duration: 20,
        responseTime: 180,
        hasSale: false,
        saleAmount: null,
        scriptScore: 52,
        sentiment: "neutral",
        transcript: "Cliente interessado mas não fechou...",
        llmAnalysis: JSON.stringify({
          strengths: ["Manteve cliente interessado", "Boa explicação do produto"],
          improvements: ["Não ofereceu vídeo chamada", "Perdeu oportunidade de fechamento"],
          steps: {
            greeting: true,
            videoPitch: false,
            objectionHandling: false,
            alternatives: false,
            socialProof: false
          }
        })
      },
      // Ana's conversations (good performer)
      {
        id: 1291,
        salespersonId: 3,
        customerId: "cust_015",
        customerName: "Diego Martins",
        startedAt: new Date("2025-01-11T10:20:00"),
        endedAt: new Date("2025-01-11T10:35:00"),
        duration: 15,
        responseTime: 95,
        hasSale: true,
        saleAmount: 650.00,
        scriptScore: 78,
        sentiment: "positive",
        transcript: "Boa conversa com fechamento...",
        llmAnalysis: JSON.stringify({
          strengths: ["Rápida no atendimento", "Boa técnica de fechamento"],
          improvements: ["Pode melhorar uso de prova social", "Mais detalhes sobre o produto"],
          steps: {
            greeting: true,
            videoPitch: true,
            objectionHandling: true,
            alternatives: true,
            socialProof: false
          }
        })
      },
      {
        id: 1292,
        salespersonId: 3,
        customerId: "cust_016",
        customerName: "Juliana Pereira",
        startedAt: new Date("2025-01-11T11:10:00"),
        endedAt: new Date("2025-01-11T11:25:00"),
        duration: 15,
        responseTime: 140,
        hasSale: false,
        saleAmount: null,
        scriptScore: 72,
        sentiment: "neutral",
        transcript: "Cliente com dúvidas sobre entrega...",
        llmAnalysis: JSON.stringify({
          strengths: ["Paciência com as dúvidas", "Explicou bem o processo"],
          improvements: ["Poderia ter oferecido desconto", "Não usou urgência"],
          steps: {
            greeting: true,
            videoPitch: true,
            objectionHandling: false,
            alternatives: true,
            socialProof: false
          }
        })
      },
      // Pedro's conversations (average)
      {
        id: 1293,
        salespersonId: 4,
        customerId: "cust_017",
        customerName: "Marcos Oliveira",
        startedAt: new Date("2025-01-11T09:15:00"),
        endedAt: new Date("2025-01-11T09:30:00"),
        duration: 15,
        responseTime: 200,
        hasSale: true,
        saleAmount: 450.00,
        scriptScore: 65,
        sentiment: "positive",
        transcript: "Conversa padrão com fechamento...",
        llmAnalysis: JSON.stringify({
          strengths: ["Conseguiu fechar", "Manteve cliente interessado"],
          improvements: ["Tempo de resposta alto", "Pode melhorar score do script"],
          steps: {
            greeting: true,
            videoPitch: false,
            objectionHandling: true,
            alternatives: false,
            socialProof: false
          }
        })
      }
    ];

    mockConversations.forEach(conv => {
      this.conversations.set(conv.id, conv);
    });
    this.currentConversationId = 1294;
  }

  async getSalespeople(): Promise<Salesperson[]> {
    return Array.from(this.salespeople.values());
  }

  async getSalesperson(id: number): Promise<Salesperson | undefined> {
    return this.salespeople.get(id);
  }

  async createSalesperson(salesperson: InsertSalesperson): Promise<Salesperson> {
    const id = this.currentSalespersonId++;
    const newSalesperson: Salesperson = { 
      ...salesperson, 
      id,
      avatar: salesperson.avatar || null,
      isActive: salesperson.isActive ?? true
    };
    this.salespeople.set(id, newSalesperson);
    return newSalesperson;
  }

  async getConversations(filters?: {
    salespersonId?: number;
    startDate?: Date;
    endDate?: Date;
    hasSale?: boolean;
    minScore?: number;
    maxScore?: number;
  }): Promise<Conversation[]> {
    let conversations = Array.from(this.conversations.values());

    if (filters) {
      if (filters.salespersonId) {
        conversations = conversations.filter(c => c.salespersonId === filters.salespersonId);
      }
      if (filters.startDate) {
        conversations = conversations.filter(c => c.startedAt >= filters.startDate!);
      }
      if (filters.endDate) {
        conversations = conversations.filter(c => c.startedAt <= filters.endDate!);
      }
      if (filters.hasSale !== undefined) {
        conversations = conversations.filter(c => c.hasSale === filters.hasSale);
      }
      if (filters.minScore !== undefined) {
        conversations = conversations.filter(c => c.scriptScore !== null && c.scriptScore >= filters.minScore!);
      }
      if (filters.maxScore !== undefined) {
        conversations = conversations.filter(c => c.scriptScore !== null && c.scriptScore <= filters.maxScore!);
      }
    }

    return conversations.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const newConversation: Conversation = { 
      ...conversation, 
      id,
      duration: conversation.duration || null,
      responseTime: conversation.responseTime || null,
      endedAt: conversation.endedAt || null,
      saleAmount: conversation.saleAmount || null,
      scriptScore: conversation.scriptScore || null,
      sentiment: conversation.sentiment || null,
      transcript: conversation.transcript || null,
      llmAnalysis: conversation.llmAnalysis || null,
      customerName: conversation.customerName || null,
      hasSale: conversation.hasSale ?? false
    };
    this.conversations.set(id, newConversation);
    return newConversation;
  }

  async getScriptSteps(conversationId: number): Promise<ScriptStep[]> {
    return Array.from(this.scriptSteps.values()).filter(s => s.conversationId === conversationId);
  }

  async createScriptStep(scriptStep: InsertScriptStep): Promise<ScriptStep> {
    const id = this.currentScriptStepId++;
    const newScriptStep: ScriptStep = { 
      ...scriptStep, 
      id,
      completed: scriptStep.completed ?? false,
      notes: scriptStep.notes || null
    };
    this.scriptSteps.set(id, newScriptStep);
    return newScriptStep;
  }

  async getPerformanceMetrics(filters?: {
    startDate?: Date;
    endDate?: Date;
    salespersonId?: number;
  }): Promise<any> {
    const conversations = await this.getConversations(filters);
    const salespeople = await this.getSalespeople();
    
    const totalConversations = conversations.length;
    const totalSales = conversations.filter(c => c.hasSale).length;
    const totalRevenue = conversations.reduce((sum, c) => sum + (c.saleAmount || 0), 0);
    const conversionRate = totalConversations > 0 ? (totalSales / totalConversations) * 100 : 0;
    
    const avgResponseTime = conversations.reduce((sum, c) => sum + (c.responseTime || 0), 0) / totalConversations;
    const avgScriptScore = conversations.reduce((sum, c) => sum + (c.scriptScore || 0), 0) / totalConversations;
    
    // Qualified leads (conversations with good sentiment or script score > 70)
    const qualifiedLeads = conversations.filter(c => 
      c.sentiment === 'positive' || (c.scriptScore && c.scriptScore > 70)
    ).length;

    // Performance by salesperson
    const performanceBySalesperson = salespeople.map(person => {
      const personConversations = conversations.filter(c => c.salespersonId === person.id);
      const personSales = personConversations.filter(c => c.hasSale).length;
      const personRevenue = personConversations.reduce((sum, c) => sum + (c.saleAmount || 0), 0);
      const personConversionRate = personConversations.length > 0 ? (personSales / personConversations.length) * 100 : 0;
      const personAvgResponseTime = personConversations.length > 0 ? 
        personConversations.reduce((sum, c) => sum + (c.responseTime || 0), 0) / personConversations.length : 0;
      const personAvgScriptScore = personConversations.length > 0 ? 
        personConversations.reduce((sum, c) => sum + (c.scriptScore || 0), 0) / personConversations.length : 0;
      const personAvgDuration = personConversations.length > 0 ? 
        personConversations.reduce((sum, c) => sum + (c.duration || 0), 0) / personConversations.length : 0;

      return {
        ...person,
        conversationsCount: personConversations.length,
        salesCount: personSales,
        revenue: personRevenue,
        conversionRate: personConversionRate,
        avgResponseTime: personAvgResponseTime,
        avgScriptScore: personAvgScriptScore,
        avgDuration: personAvgDuration
      };
    });

    return {
      overview: {
        totalRevenue,
        totalSales,
        totalConversations,
        conversionRate,
        qualifiedLeads,
        avgResponseTime,
        avgScriptScore
      },
      salespeople: performanceBySalesperson,
      conversations
    };
  }
}

export const storage = new MemStorage();
