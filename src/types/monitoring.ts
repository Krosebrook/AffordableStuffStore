/**
 * FlashFusion Unknown Unknowns Protocol Types
 * Defines interfaces for comprehensive system monitoring and observability
 */

export interface CreatorBehavior {
  userId: string;
  batchPatterns: {
    batchSize: number;
    frequency: "daily" | "weekly" | "monthly";
    averageInterval: number; // in hours
    lastBatchTime: Date;
  };
  dailyPatterns: {
    activeHours: number[];
    peakHour: number;
    activityCount: number;
    timestamp: Date;
  };
}

export interface PeakPattern {
  timezone: string;
  peakHours: number[];
  loadDistribution: Record<number, number>; // hour -> load percentage
  concurrentUsers: number;
  timestamp: Date;
}

export interface PODSuccessRate {
  channel: string;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  successRate: number; // percentage
  averageProcessingTime: number; // in seconds
  lastUpdated: Date;
}

export interface IntegrationHealth {
  channelName: string;
  status: "healthy" | "degraded" | "failed";
  uptime: number; // percentage
  lastFailure?: Date;
  failureCount: number;
  responseTime: number; // in milliseconds
  errorRate: number; // percentage
}

export interface TechDebt {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "security" | "performance" | "maintainability" | "scalability";
  dateIdentified: Date;
  estimatedEffort: number; // in hours
  status: "identified" | "planned" | "in-progress" | "resolved";
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  startTime: Date;
  resolvedTime?: Date;
  affectedSystems: string[];
  rootCause?: string;
  resolution?: string;
}

export interface ScalabilityThreshold {
  metric: "rls" | "jwt" | "database" | "api" | "cache";
  currentValue: number;
  threshold: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  impactDescription: string;
  lastChecked: Date;
}

export interface DocumentationGap {
  id: string;
  area:
    | "db_access"
    | "real_time_metrics"
    | "live_system_state"
    | "api"
    | "mcp"
    | "other";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee?: string;
  status: "identified" | "in-progress" | "completed";
  dateIdentified: Date;
}

export interface MonitoringMetrics {
  creatorBehaviors: CreatorBehavior[];
  peakPatterns: PeakPattern[];
  podSuccessRates: PODSuccessRate[];
  integrationHealth: IntegrationHealth[];
  techDebt: TechDebt[];
  incidents: Incident[];
  scalabilityThresholds: ScalabilityThreshold[];
  documentationGaps: DocumentationGap[];
  lastUpdated: Date;
}

export interface AlertConfig {
  enabled: boolean;
  thresholds: {
    podSuccessRate: number; // minimum acceptable percentage
    integrationUptime: number; // minimum acceptable percentage
    responseTime: number; // maximum acceptable milliseconds
    errorRate: number; // maximum acceptable percentage
  };
}

export interface FlashFusionProtocolConfig {
  enabled: boolean;
  updateInterval: number; // in milliseconds
  retentionPeriod: number; // in days
  alertConfig: AlertConfig;
}
