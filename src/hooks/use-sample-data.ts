/**
 * Hook to initialize sample monitoring data for demonstration purposes
 */

import { useEffect } from "react";

import { flashFusionProtocol } from "@/services/flashfusion-protocol";

export const useInitializeSampleData = () => {
  useEffect(() => {
    // Check if data already exists
    const metrics = flashFusionProtocol.getMetrics();

    // Only initialize if no data exists
    if (
      metrics.podSuccessRates.length === 0 &&
      metrics.integrationHealth.length === 0 &&
      metrics.techDebt.length === 0
    ) {
      // Initialize sample POD success rates
      flashFusionProtocol.addPODSuccessRate({
        channel: "Printful",
        totalOrders: 1245,
        successfulOrders: 1198,
        failedOrders: 47,
        successRate: 96.2,
        averageProcessingTime: 45.3,
        lastUpdated: new Date(),
      });

      flashFusionProtocol.addPODSuccessRate({
        channel: "Printify",
        totalOrders: 892,
        successfulOrders: 834,
        failedOrders: 58,
        successRate: 93.5,
        averageProcessingTime: 52.1,
        lastUpdated: new Date(),
      });

      flashFusionProtocol.addPODSuccessRate({
        channel: "Teespring",
        totalOrders: 567,
        successfulOrders: 551,
        failedOrders: 16,
        successRate: 97.2,
        averageProcessingTime: 38.7,
        lastUpdated: new Date(),
      });

      // Initialize integration health
      flashFusionProtocol.updateIntegrationHealth({
        channelName: "Stripe Payment Gateway",
        status: "healthy",
        uptime: 99.95,
        failureCount: 2,
        responseTime: 145,
        errorRate: 0.05,
      });

      flashFusionProtocol.updateIntegrationHealth({
        channelName: "Shopify API",
        status: "degraded",
        uptime: 98.2,
        lastFailure: new Date(Date.now() - 3600000 * 12), // 12 hours ago
        failureCount: 7,
        responseTime: 850,
        errorRate: 1.8,
      });

      flashFusionProtocol.updateIntegrationHealth({
        channelName: "AWS S3 Storage",
        status: "healthy",
        uptime: 99.99,
        failureCount: 0,
        responseTime: 89,
        errorRate: 0.01,
      });

      flashFusionProtocol.updateIntegrationHealth({
        channelName: "Email Service (SendGrid)",
        status: "healthy",
        uptime: 99.7,
        failureCount: 3,
        responseTime: 234,
        errorRate: 0.3,
      });

      // Initialize tech debt
      flashFusionProtocol.addTechDebt({
        id: "td-001",
        title: "Upgrade React Router to v7",
        description:
          "Current version has known performance issues with nested routes",
        severity: "medium",
        category: "maintainability",
        dateIdentified: new Date(Date.now() - 86400000 * 14), // 14 days ago
        estimatedEffort: 8,
        status: "planned",
      });

      flashFusionProtocol.addTechDebt({
        id: "td-002",
        title: "Implement rate limiting on API endpoints",
        description:
          "No rate limiting currently in place, exposing system to potential abuse",
        severity: "high",
        category: "security",
        dateIdentified: new Date(Date.now() - 86400000 * 7), // 7 days ago
        estimatedEffort: 16,
        status: "in-progress",
      });

      flashFusionProtocol.addTechDebt({
        id: "td-003",
        title: "Optimize database queries for product search",
        description:
          "Current queries are causing slow response times on large datasets",
        severity: "high",
        category: "performance",
        dateIdentified: new Date(Date.now() - 86400000 * 21), // 21 days ago
        estimatedEffort: 24,
        status: "identified",
      });

      // Initialize incidents
      flashFusionProtocol.addIncident({
        id: "inc-001",
        title: "Shopify API Intermittent Timeouts",
        description:
          "Users experiencing intermittent failures when syncing products",
        severity: "medium",
        status: "investigating",
        startTime: new Date(Date.now() - 3600000 * 8), // 8 hours ago
        affectedSystems: ["Shopify API", "Product Sync Service"],
      });

      // Initialize documentation gaps
      flashFusionProtocol.addDocumentationGap({
        id: "doc-001",
        area: "db_access",
        title: "Database Access Patterns",
        description:
          "No documentation on preferred database access methods (API vs MCP)",
        priority: "high",
        status: "identified",
        dateIdentified: new Date(Date.now() - 86400000 * 5), // 5 days ago
      });

      flashFusionProtocol.addDocumentationGap({
        id: "doc-002",
        area: "real_time_metrics",
        title: "Real-time Metrics Collection",
        description:
          "Missing documentation on how to access real-time system metrics",
        priority: "medium",
        status: "identified",
        dateIdentified: new Date(Date.now() - 86400000 * 3), // 3 days ago
      });

      flashFusionProtocol.addDocumentationGap({
        id: "doc-003",
        area: "live_system_state",
        title: "Live System State Monitoring",
        description:
          "No guide on monitoring live system state and health checks",
        priority: "high",
        status: "in-progress",
        assignee: "DevOps Team",
        dateIdentified: new Date(Date.now() - 86400000 * 10), // 10 days ago
      });

      // Track some creator behavior
      flashFusionProtocol.trackCreatorBehavior("user-001", "product_create");
      flashFusionProtocol.trackCreatorBehavior("user-002", "batch_upload");
    }
  }, []);
};
