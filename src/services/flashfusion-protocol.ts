/**
 * FlashFusion Unknown Unknowns Protocol Service
 * Provides monitoring, tracking, and observability capabilities
 */

import type {
  MonitoringMetrics,
  PODSuccessRate,
  IntegrationHealth,
  TechDebt,
  Incident,
  ScalabilityThreshold,
  DocumentationGap,
  FlashFusionProtocolConfig,
} from "../types/monitoring";

class FlashFusionProtocolService {
  private metrics: MonitoringMetrics;
  private config: FlashFusionProtocolConfig;
  private updateInterval: number | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.metrics = this.initializeMetrics();

    if (this.config.enabled) {
      this.startMonitoring();
    }
  }

  private loadConfig(): FlashFusionProtocolConfig {
    const savedConfig = localStorage.getItem("flashfusion_config");

    if (savedConfig) {
      return JSON.parse(savedConfig);
    }

    return {
      enabled: true,
      updateInterval: 60000, // 1 minute
      retentionPeriod: 30, // 30 days
      alertConfig: {
        enabled: true,
        thresholds: {
          podSuccessRate: 95,
          integrationUptime: 99,
          responseTime: 1000,
          errorRate: 1,
        },
      },
    };
  }

  private initializeMetrics(): MonitoringMetrics {
    const savedMetrics = localStorage.getItem("flashfusion_metrics");

    if (savedMetrics) {
      return JSON.parse(savedMetrics, this.dateReviver);
    }

    return {
      creatorBehaviors: [],
      peakPatterns: [],
      podSuccessRates: [],
      integrationHealth: [],
      techDebt: [],
      incidents: [],
      scalabilityThresholds: [],
      documentationGaps: [],
      lastUpdated: new Date(),
    };
  }

  private dateReviver(key: string, value: any): any {
    const dateFields = [
      "timestamp",
      "lastUpdated",
      "lastBatchTime",
      "lastFailure",
      "dateIdentified",
      "startTime",
      "resolvedTime",
      "lastChecked",
    ];

    if (dateFields.includes(key) && typeof value === "string") {
      return new Date(value);
    }

    return value;
  }

  private saveMetrics(): void {
    localStorage.setItem("flashfusion_metrics", JSON.stringify(this.metrics));
  }

  private saveConfig(): void {
    localStorage.setItem("flashfusion_config", JSON.stringify(this.config));
  }

  public startMonitoring(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      this.collectMetrics();
    }, this.config.updateInterval) as unknown as number;

    // Initial collection
    this.collectMetrics();
  }

  public stopMonitoring(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private collectMetrics(): void {
    // Update peak patterns
    this.updatePeakPatterns();

    // Update scalability thresholds
    this.updateScalabilityThresholds();

    this.metrics.lastUpdated = new Date();
    this.saveMetrics();

    // Check for alerts
    if (this.config.alertConfig.enabled) {
      this.checkAlerts();
    }
  }

  private updatePeakPatterns(): void {
    const now = new Date();
    const currentHour = now.getHours();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Find or create pattern for current timezone
    let pattern = this.metrics.peakPatterns.find(
      (p) => p.timezone === timezone,
    );

    if (!pattern) {
      pattern = {
        timezone,
        peakHours: [],
        loadDistribution: {},
        concurrentUsers: 0,
        timestamp: now,
      };
      this.metrics.peakPatterns.push(pattern);
    }

    // Update load distribution
    pattern.loadDistribution[currentHour] =
      (pattern.loadDistribution[currentHour] || 0) + 1;
    pattern.timestamp = now;

    // Calculate peak hours (top 3 hours with most activity)
    const sortedHours = Object.entries(pattern.loadDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    pattern.peakHours = sortedHours;
  }

  private updateScalabilityThresholds(): void {
    const now = new Date();

    // Simulate performance metrics (in a real app, these would come from actual monitoring)
    const performanceData = this.getPerformanceData();

    const thresholds: ScalabilityThreshold[] = [
      {
        metric: "rls",
        currentValue: performanceData.rlsLatency,
        threshold: 100,
        unit: "ms",
        status: performanceData.rlsLatency > 100 ? "warning" : "normal",
        impactDescription: "Row Level Security query performance",
        lastChecked: now,
      },
      {
        metric: "jwt",
        currentValue: performanceData.jwtProcessing,
        threshold: 50,
        unit: "ms",
        status: performanceData.jwtProcessing > 50 ? "warning" : "normal",
        impactDescription: "JWT token validation and processing time",
        lastChecked: now,
      },
      {
        metric: "api",
        currentValue: performanceData.apiResponseTime,
        threshold: 500,
        unit: "ms",
        status: performanceData.apiResponseTime > 500 ? "warning" : "normal",
        impactDescription: "API endpoint response time",
        lastChecked: now,
      },
    ];

    this.metrics.scalabilityThresholds = thresholds;
  }

  private getPerformanceData() {
    // In a real application, this would collect actual performance metrics
    // For now, we'll simulate some data
    if (typeof performance !== "undefined") {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      return {
        rlsLatency: Math.random() * 150, // Simulated RLS latency
        jwtProcessing: Math.random() * 75, // Simulated JWT processing time
        apiResponseTime: navigation
          ? navigation.responseEnd - navigation.requestStart
          : Math.random() * 800,
      };
    }

    return {
      rlsLatency: Math.random() * 150,
      jwtProcessing: Math.random() * 75,
      apiResponseTime: Math.random() * 800,
    };
  }

  private checkAlerts(): void {
    // Check POD success rates
    this.metrics.podSuccessRates.forEach((pod) => {
      if (pod.successRate < this.config.alertConfig.thresholds.podSuccessRate) {
        console.warn(
          `Alert: POD success rate for ${pod.channel} is ${pod.successRate}%`,
        );
      }
    });

    // Check integration health
    this.metrics.integrationHealth.forEach((integration) => {
      if (
        integration.uptime <
        this.config.alertConfig.thresholds.integrationUptime
      ) {
        console.warn(
          `Alert: Integration ${integration.channelName} uptime is ${integration.uptime}%`,
        );
      }
      if (
        integration.responseTime >
        this.config.alertConfig.thresholds.responseTime
      ) {
        console.warn(
          `Alert: Integration ${integration.channelName} response time is ${integration.responseTime}ms`,
        );
      }
    });
  }

  // Public API methods

  public trackCreatorBehavior(userId: string, _action: string): void {
    const now = new Date();
    let behavior = this.metrics.creatorBehaviors.find(
      (b) => b.userId === userId,
    );

    if (!behavior) {
      behavior = {
        userId,
        batchPatterns: {
          batchSize: 0,
          frequency: "daily",
          averageInterval: 0,
          lastBatchTime: now,
        },
        dailyPatterns: {
          activeHours: [],
          peakHour: now.getHours(),
          activityCount: 0,
          timestamp: now,
        },
      };
      this.metrics.creatorBehaviors.push(behavior);
    }

    behavior.dailyPatterns.activityCount++;
    behavior.dailyPatterns.timestamp = now;

    const currentHour = now.getHours();

    if (!behavior.dailyPatterns.activeHours.includes(currentHour)) {
      behavior.dailyPatterns.activeHours.push(currentHour);
    }

    this.saveMetrics();
  }

  public addPODSuccessRate(data: PODSuccessRate): void {
    const existing = this.metrics.podSuccessRates.findIndex(
      (p) => p.channel === data.channel,
    );

    if (existing >= 0) {
      this.metrics.podSuccessRates[existing] = data;
    } else {
      this.metrics.podSuccessRates.push(data);
    }
    this.saveMetrics();
  }

  public updateIntegrationHealth(data: IntegrationHealth): void {
    const existing = this.metrics.integrationHealth.findIndex(
      (i) => i.channelName === data.channelName,
    );

    if (existing >= 0) {
      this.metrics.integrationHealth[existing] = data;
    } else {
      this.metrics.integrationHealth.push(data);
    }
    this.saveMetrics();
  }

  public addTechDebt(data: TechDebt): void {
    this.metrics.techDebt.push(data);
    this.saveMetrics();
  }

  public updateTechDebt(id: string, updates: Partial<TechDebt>): void {
    const index = this.metrics.techDebt.findIndex((t) => t.id === id);

    if (index >= 0) {
      this.metrics.techDebt[index] = {
        ...this.metrics.techDebt[index],
        ...updates,
      };
      this.saveMetrics();
    }
  }

  public addIncident(data: Incident): void {
    this.metrics.incidents.push(data);
    this.saveMetrics();
  }

  public updateIncident(id: string, updates: Partial<Incident>): void {
    const index = this.metrics.incidents.findIndex((i) => i.id === id);

    if (index >= 0) {
      this.metrics.incidents[index] = {
        ...this.metrics.incidents[index],
        ...updates,
      };
      this.saveMetrics();
    }
  }

  public addDocumentationGap(data: DocumentationGap): void {
    this.metrics.documentationGaps.push(data);
    this.saveMetrics();
  }

  public updateDocumentationGap(
    id: string,
    updates: Partial<DocumentationGap>,
  ): void {
    const index = this.metrics.documentationGaps.findIndex((d) => d.id === id);

    if (index >= 0) {
      this.metrics.documentationGaps[index] = {
        ...this.metrics.documentationGaps[index],
        ...updates,
      };
      this.saveMetrics();
    }
  }

  public getMetrics(): MonitoringMetrics {
    return this.metrics;
  }

  public getConfig(): FlashFusionProtocolConfig {
    return this.config;
  }

  public updateConfig(updates: Partial<FlashFusionProtocolConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();

    if (updates.enabled !== undefined) {
      if (updates.enabled) {
        this.startMonitoring();
      } else {
        this.stopMonitoring();
      }
    }
  }

  public clearOldData(): void {
    const cutoffDate = new Date();

    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionPeriod);

    // Clear old incidents
    this.metrics.incidents = this.metrics.incidents.filter(
      (i) => i.startTime > cutoffDate,
    );

    // Clear resolved tech debt older than retention period
    this.metrics.techDebt = this.metrics.techDebt.filter(
      (t) => t.status !== "resolved" || t.dateIdentified > cutoffDate,
    );

    this.saveMetrics();
  }

  public exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  public importMetrics(data: string): void {
    try {
      const imported = JSON.parse(data, this.dateReviver);

      this.metrics = imported;
      this.saveMetrics();
    } catch (error) {
      console.error("Failed to import metrics:", error);
      throw new Error("Invalid metrics data");
    }
  }
}

// Singleton instance
export const flashFusionProtocol = new FlashFusionProtocolService();
