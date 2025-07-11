export interface PerformanceMetrics {
  overview: {
    totalRevenue: number;
    totalSales: number;
    totalConversations: number;
    conversionRate: number;
    qualifiedLeads: number;
    avgResponseTime: number;
    avgScriptScore: number;
  };
  salespeople: SalespersonPerformance[];
  conversations: ConversationData[];
}

export interface SalespersonPerformance {
  id: number;
  name: string;
  email: string;
  avatar: string;
  conversationsCount: number;
  salesCount: number;
  revenue: number;
  conversionRate: number;
  avgResponseTime: number;
  avgScriptScore: number;
  avgDuration: number;
}

export interface ConversationData {
  id: number;
  salespersonId: number;
  customerId: string;
  customerName: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  responseTime?: number;
  hasSale: boolean;
  saleAmount?: number;
  scriptScore?: number;
  sentiment?: string;
  transcript?: string;
  llmAnalysis?: string;
}

export interface DashboardFilters {
  period: 'today' | '7days' | '30days' | 'custom';
  startDate?: Date;
  endDate?: Date;
  salespersonId?: number;
  hasSale?: boolean;
  minScore?: number;
  maxScore?: number;
  responseTimeFilter?: 'fast' | 'medium' | 'slow';
}

export type DashboardLayer = 'overview' | 'leaderboard' | 'coaching';
