import type { Salesperson, Conversation, ScriptStep, InsertSalesperson, InsertConversation, InsertScriptStep } from '@/shared/schema'

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
    const salespeople = [
      { id: 1, name: 'Maria Silva', email: 'maria@empresa.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c8c2?w=150&h=150&fit=crop&crop=face' },
      { id: 2, name: 'João Santos', email: 'joao@empresa.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
      { id: 3, name: 'Ana Costa', email: 'ana@empresa.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
      { id: 4, name: 'Pedro Oliveira', email: 'pedro@empresa.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }
    ];

    salespeople.forEach(person => {
      this.salespeople.set(person.id, person);
    });

    // Initialize conversations with realistic data
    const conversations = [
      {
        id: 1289,
        salespersonId: 1,
        customerId: 'CUST001',
        customerName: 'Carlos Mendes',
        startedAt: new Date('2024-01-15T10:30:00'),
        endedAt: new Date('2024-01-15T11:15:00'),
        duration: 2700,
        responseTime: 45,
        hasSale: true,
        saleAmount: 850,
        scriptScore: 88,
        sentiment: 'positive',
        transcript: 'Cliente: Olá, estou interessado no produto premium.\nMaria: Perfeito! Vou te mostrar todas as vantagens do nosso produto premium...',
        llmAnalysis: 'Pontos fortes: Excelente abertura, identificou necessidades rapidamente, apresentou benefícios claros. Áreas de melhoria: Poderia ter explorado mais objeções.'
      },
      {
        id: 1290,
        salespersonId: 1,
        customerId: 'CUST002',
        customerName: 'Fernanda Lima',
        startedAt: new Date('2024-01-15T14:20:00'),
        endedAt: new Date('2024-01-15T15:00:00'),
        duration: 2400,
        responseTime: 30,
        hasSale: true,
        saleAmount: 650,
        scriptScore: 92,
        sentiment: 'positive',
        transcript: 'Cliente: Preciso de uma solução para minha empresa.\nMaria: Claro! Primeiro, me conte um pouco sobre sua empresa...',
        llmAnalysis: 'Pontos fortes: Perguntou sobre necessidades específicas, fez apresentação personalizada, fechou com confiança. Áreas de melhoria: Tempo de resposta poderia ser menor.'
      },
      {
        id: 1291,
        salespersonId: 1,
        customerId: 'CUST003',
        customerName: 'Roberto Ferreira',
        startedAt: new Date('2024-01-15T16:45:00'),
        endedAt: new Date('2024-01-15T17:20:00'),
        duration: 2100,
        responseTime: 60,
        hasSale: false,
        saleAmount: 0,
        scriptScore: 75,
        sentiment: 'neutral',
        transcript: 'Cliente: Estou comparando opções no mercado.\nMaria: Entendo, que tal eu te mostrar nossos diferenciais...',
        llmAnalysis: 'Pontos fortes: Boa apresentação dos diferenciais, manteve interesse do cliente. Áreas de melhoria: Não criou senso de urgência, poderia ter tratado objeções melhor.'
      },
      {
        id: 1292,
        salespersonId: 2,
        customerId: 'CUST004',
        customerName: 'Lucia Alves',
        startedAt: new Date('2024-01-15T09:15:00'),
        endedAt: new Date('2024-01-15T10:10:00'),
        duration: 3300,
        responseTime: 120,
        hasSale: false,
        saleAmount: 0,
        scriptScore: 45,
        sentiment: 'negative',
        transcript: 'Cliente: Não sei se esse produto é para mim.\nJoão: Ah, mas é sim! Todos nossos clientes adoram...',
        llmAnalysis: 'Pontos fortes: Tentou ser entusiasta. Áreas de melhoria: Não ouviu as objeções, foi muito insistente, não fez perguntas de descoberta.'
      },
      {
        id: 1293,
        salespersonId: 2,
        customerId: 'CUST005',
        customerName: 'Paulo Souza',
        startedAt: new Date('2024-01-15T11:30:00'),
        endedAt: new Date('2024-01-15T12:45:00'),
        duration: 4500,
        responseTime: 180,
        hasSale: false,
        saleAmount: 0,
        scriptScore: 38,
        sentiment: 'negative',
        transcript: 'Cliente: Qual é o preço?\nJoão: É R$ 800, mas posso fazer um desconto...',
        llmAnalysis: 'Pontos fortes: Ofereceu desconto. Áreas de melhoria: Apresentou preço muito cedo, não mostrou valor antes, perdeu controle da conversa.'
      },
      {
        id: 1294,
        salespersonId: 3,
        customerId: 'CUST006',
        customerName: 'Mariana Castro',
        startedAt: new Date('2024-01-15T13:00:00'),
        endedAt: new Date('2024-01-15T13:40:00'),
        duration: 2400,
        responseTime: 90,
        hasSale: true,
        saleAmount: 450,
        scriptScore: 78,
        sentiment: 'positive',
        transcript: 'Cliente: Estou procurando algo básico.\nAna: Perfeito! Nosso plano básico tem tudo que você precisa...',
        llmAnalysis: 'Pontos fortes: Identificou necessidade por produto básico, fez venda adequada. Áreas de melhoria: Poderia ter explorado upsell.'
      },
      {
        id: 1295,
        salespersonId: 3,
        customerId: 'CUST007',
        customerName: 'Ricardo Nunes',
        startedAt: new Date('2024-01-15T15:30:00'),
        endedAt: new Date('2024-01-15T16:15:00'),
        duration: 2700,
        responseTime: 75,
        hasSale: false,
        saleAmount: 0,
        scriptScore: 65,
        sentiment: 'neutral',
        transcript: 'Cliente: Preciso pensar um pouco mais.\nAna: Sem problema, quando você gostaria que eu entre em contato?',
        llmAnalysis: 'Pontos fortes: Respeitou tempo do cliente, agendou follow-up. Áreas de melhoria: Poderia ter tratado objeções antes de aceitar adiamento.'
      },
      {
        id: 1296,
        salespersonId: 4,
        customerId: 'CUST008',
        customerName: 'Isabela Ramos',
        startedAt: new Date('2024-01-15T17:00:00'),
        endedAt: new Date('2024-01-15T17:35:00'),
        duration: 2100,
        responseTime: 50,
        hasSale: true,
        saleAmount: 750,
        scriptScore: 85,
        sentiment: 'positive',
        transcript: 'Cliente: Quero saber mais sobre o produto premium.\nPedro: Ótima escolha! Deixe-me te mostrar todos os benefícios...',
        llmAnalysis: 'Pontos fortes: Apresentação clara, boa argumentação, fechou com segurança. Áreas de melhoria: Poderia ter explorado mais necessidades específicas.'
      }
    ];

    conversations.forEach(conv => {
      this.conversations.set(conv.id, conv);
    });

    this.currentSalespersonId = 5;
    this.currentConversationId = 1297;
  }

  async getSalespeople(): Promise<Salesperson[]> {
    return Array.from(this.salespeople.values());
  }

  async getSalesperson(id: number): Promise<Salesperson | undefined> {
    return this.salespeople.get(id);
  }

  async createSalesperson(salesperson: InsertSalesperson): Promise<Salesperson> {
    const newSalesperson: Salesperson = { 
      id: this.currentSalespersonId++, 
      ...salesperson 
    };
    this.salespeople.set(newSalesperson.id, newSalesperson);
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
        conversations = conversations.filter(c => (c.scriptScore || 0) >= filters.minScore!);
      }
      if (filters.maxScore !== undefined) {
        conversations = conversations.filter(c => (c.scriptScore || 0) <= filters.maxScore!);
      }
    }

    return conversations;
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const newConversation: Conversation = { 
      id: this.currentConversationId++, 
      ...conversation 
    };
    this.conversations.set(newConversation.id, newConversation);
    return newConversation;
  }

  async getScriptSteps(conversationId: number): Promise<ScriptStep[]> {
    return Array.from(this.scriptSteps.values()).filter(s => s.conversationId === conversationId);
  }

  async createScriptStep(scriptStep: InsertScriptStep): Promise<ScriptStep> {
    const newScriptStep: ScriptStep = { 
      id: this.currentScriptStepId++, 
      ...scriptStep 
    };
    this.scriptSteps.set(newScriptStep.id, newScriptStep);
    return newScriptStep;
  }

  async getPerformanceMetrics(filters?: {
    startDate?: Date;
    endDate?: Date;
    salespersonId?: number;
  }): Promise<any> {
    const conversations = await this.getConversations(filters);
    const salespeople = await this.getSalespeople();

    const totalRevenue = conversations.reduce((sum, conv) => sum + (conv.saleAmount || 0), 0);
    const totalSales = conversations.filter(conv => conv.hasSale).length;
    const totalConversations = conversations.length;
    const conversionRate = totalConversations > 0 ? (totalSales / totalConversations) * 100 : 0;
    const qualifiedLeads = conversations.filter(conv => (conv.scriptScore || 0) >= 70).length;
    const avgResponseTime = conversations.reduce((sum, conv) => sum + (conv.responseTime || 0), 0) / conversations.length;
    const avgScriptScore = conversations.reduce((sum, conv) => sum + (conv.scriptScore || 0), 0) / conversations.length;

    const salespersonPerformance = salespeople.map(person => {
      const personConversations = conversations.filter(conv => conv.salespersonId === person.id);
      const personSales = personConversations.filter(conv => conv.hasSale);
      const personRevenue = personConversations.reduce((sum, conv) => sum + (conv.saleAmount || 0), 0);
      const personConversionRate = personConversations.length > 0 ? (personSales.length / personConversations.length) * 100 : 0;
      const personAvgResponseTime = personConversations.length > 0 ? 
        personConversations.reduce((sum, conv) => sum + (conv.responseTime || 0), 0) / personConversations.length : 0;
      const personAvgScriptScore = personConversations.length > 0 ? 
        personConversations.reduce((sum, conv) => sum + (conv.scriptScore || 0), 0) / personConversations.length : 0;
      const personAvgDuration = personConversations.length > 0 ? 
        personConversations.reduce((sum, conv) => sum + (conv.duration || 0), 0) / personConversations.length : 0;

      return {
        id: person.id,
        name: person.name,
        email: person.email,
        avatar: person.avatar,
        conversationsCount: personConversations.length,
        salesCount: personSales.length,
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
      salespeople: salespersonPerformance,
      conversations: conversations
    };
  }
}

export const storage = new MemStorage();