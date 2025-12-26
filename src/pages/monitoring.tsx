import type { MonitoringMetrics } from "@/types/monitoring";

import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { flashFusionProtocol } from "@/services/flashfusion-protocol";
import { useInitializeSampleData } from "@/hooks/use-sample-data";

export default function MonitoringPage() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<MonitoringMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize sample data
  useInitializeSampleData();

  useEffect(() => {
    // Load initial metrics
    const loadMetrics = () => {
      const data = flashFusionProtocol.getMetrics();

      setMetrics(data);
      setLoading(false);
    };

    loadMetrics();

    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "healthy":
      case "normal":
      case "resolved":
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "warning":
      case "degraded":
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "critical":
      case "failed":
      case "open":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "high":
      case "critical":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  if (loading || !metrics) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>
              <Trans t={t}>loading_metrics</Trans>
            </h1>
          </div>
        </section>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-6 py-8 md:py-10">
        <div className="max-w-7xl mx-auto w-full px-4">
          <h1 className={title()}>
            <Trans t={t}>flashfusion_monitoring</Trans>
          </h1>
          <p className="text-default-500 mt-2">
            <Trans t={t}>flashfusion_subtitle</Trans>
          </p>
          <p className="text-sm text-default-400 mt-1">
            Last updated: {metrics.lastUpdated.toLocaleString()}
          </p>

          {/* Peak Patterns */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              <Trans t={t}>peak_patterns</Trans>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.peakPatterns.map((pattern, index) => (
                <div
                  key={index}
                  className="border border-default-200 rounded-lg p-4 bg-content1"
                >
                  <h3 className="font-semibold mb-2">
                    Timezone: {pattern.timezone}
                  </h3>
                  <p className="text-sm text-default-500 mb-2">
                    Peak Hours: {pattern.peakHours.join(", ")}
                  </p>
                  <p className="text-sm text-default-500">
                    Concurrent Users: {pattern.concurrentUsers}
                  </p>
                </div>
              ))}
              {metrics.peakPatterns.length === 0 && (
                <p className="text-default-400">
                  No peak pattern data available
                </p>
              )}
            </div>
          </div>

          {/* POD Success Rates */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              <Trans t={t}>pod_success_rates</Trans>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.podSuccessRates.map((pod, index) => (
                <div
                  key={index}
                  className="border border-default-200 rounded-lg p-4 bg-content1"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{pod.channel}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        pod.successRate >= 95
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : pod.successRate >= 80
                            ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                            : "bg-red-500/10 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {pod.successRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-default-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        pod.successRate >= 95
                          ? "bg-green-500"
                          : pod.successRate >= 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${pod.successRate}%` }}
                    />
                  </div>
                  <div className="text-sm text-default-500">
                    <p>Total Orders: {pod.totalOrders}</p>
                    <p>Successful: {pod.successfulOrders}</p>
                    <p>Failed: {pod.failedOrders}</p>
                    <p>Avg Processing Time: {pod.averageProcessingTime}s</p>
                  </div>
                </div>
              ))}
              {metrics.podSuccessRates.length === 0 && (
                <p className="text-default-400">
                  No POD success rate data available
                </p>
              )}
            </div>
          </div>

          {/* Integration Health */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              <Trans t={t}>integration_health</Trans>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.integrationHealth.map((integration, index) => (
                <div
                  key={index}
                  className="border border-default-200 rounded-lg p-4 bg-content1"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{integration.channelName}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(integration.status)}`}
                    >
                      {integration.status}
                    </span>
                  </div>
                  <div className="text-sm text-default-500">
                    <p>Uptime: {integration.uptime.toFixed(2)}%</p>
                    <p>Response Time: {integration.responseTime}ms</p>
                    <p>Error Rate: {integration.errorRate.toFixed(2)}%</p>
                    <p>Failures: {integration.failureCount}</p>
                    {integration.lastFailure && (
                      <p className="text-red-600 dark:text-red-400">
                        Last Failure: {integration.lastFailure.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {metrics.integrationHealth.length === 0 && (
                <p className="text-default-400">
                  No integration health data available
                </p>
              )}
            </div>
          </div>

          {/* Scalability Thresholds */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              <Trans t={t}>scalability_thresholds</Trans>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.scalabilityThresholds.map((threshold, index) => (
                <div
                  key={index}
                  className="border border-default-200 rounded-lg p-4 bg-content1"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold uppercase">
                      {threshold.metric}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(threshold.status)}`}
                    >
                      {threshold.status}
                    </span>
                  </div>
                  <div className="text-sm text-default-500 mb-2">
                    <p>
                      Current: {threshold.currentValue.toFixed(2)}{" "}
                      {threshold.unit}
                    </p>
                    <p>
                      Threshold: {threshold.threshold} {threshold.unit}
                    </p>
                  </div>
                  <div className="w-full bg-default-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        threshold.status === "normal"
                          ? "bg-green-500"
                          : threshold.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min((threshold.currentValue / threshold.threshold) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-default-400">
                    {threshold.impactDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Debt */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              <Trans t={t}>tech_debt</Trans>
            </h2>
            <div className="space-y-3">
              {metrics.techDebt
                .filter((t) => t.status !== "resolved")
                .map((debt) => (
                  <div
                    key={debt.id}
                    className="border border-default-200 rounded-lg p-4 bg-content1"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold">{debt.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityClass(debt.severity)}`}
                          >
                            {debt.severity}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-default-200">
                            {debt.category}
                          </span>
                        </div>
                        <p className="text-sm text-default-500 mb-2">
                          {debt.description}
                        </p>
                        <div className="flex gap-4 text-xs text-default-400 flex-wrap">
                          <span>Effort: {debt.estimatedEffort}h</span>
                          <span>Status: {debt.status}</span>
                          <span>
                            Identified:{" "}
                            {debt.dateIdentified.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {metrics.techDebt.filter((t) => t.status !== "resolved")
                .length === 0 && (
                <p className="text-default-400">No active tech debt items</p>
              )}
            </div>
          </div>

          {/* Incidents */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              <Trans t={t}>incidents</Trans>
            </h2>
            <div className="space-y-3">
              {metrics.incidents
                .filter((i) => i.status !== "closed")
                .map((incident) => (
                  <div
                    key={incident.id}
                    className="border border-default-200 rounded-lg p-4 bg-content1"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold">{incident.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityClass(incident.severity)}`}
                          >
                            {incident.severity}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-default-200">
                            {incident.status}
                          </span>
                        </div>
                        <p className="text-sm text-default-500 mb-2">
                          {incident.description}
                        </p>
                        <div className="text-xs text-default-400">
                          <p>Started: {incident.startTime.toLocaleString()}</p>
                          {incident.resolvedTime && (
                            <p>
                              Resolved: {incident.resolvedTime.toLocaleString()}
                            </p>
                          )}
                          <p>Affected: {incident.affectedSystems.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {metrics.incidents.filter((i) => i.status !== "closed").length ===
                0 && <p className="text-default-400">No active incidents</p>}
            </div>
          </div>

          {/* Documentation Gaps */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              <Trans t={t}>documentation_gaps</Trans>
            </h2>
            <div className="space-y-3">
              {metrics.documentationGaps
                .filter((g) => g.status !== "completed")
                .map((gap) => (
                  <div
                    key={gap.id}
                    className="border border-default-200 rounded-lg p-4 bg-content1"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold">{gap.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityClass(gap.priority)}`}
                          >
                            {gap.priority}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-default-200">
                            {gap.area}
                          </span>
                        </div>
                        <p className="text-sm text-default-500 mb-2">
                          {gap.description}
                        </p>
                        <div className="flex gap-4 text-xs text-default-400 flex-wrap">
                          <span>Status: {gap.status}</span>
                          {gap.assignee && (
                            <span>Assignee: {gap.assignee}</span>
                          )}
                          <span>
                            Identified:{" "}
                            {gap.dateIdentified.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {metrics.documentationGaps.filter((g) => g.status !== "completed")
                .length === 0 && (
                <p className="text-default-400">No active documentation gaps</p>
              )}
            </div>
          </div>

          {/* Creator Behaviors */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              <Trans t={t}>creator_behaviors</Trans>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.creatorBehaviors.map((behavior, index) => (
                <div
                  key={index}
                  className="border border-default-200 rounded-lg p-4 bg-content1"
                >
                  <h3 className="font-semibold mb-2">
                    User: {behavior.userId}
                  </h3>
                  <div className="border-t border-default-200 my-2" />
                  <div className="text-sm text-default-500">
                    <p className="font-medium mb-1">Daily Patterns:</p>
                    <p>
                      Activity Count: {behavior.dailyPatterns.activityCount}
                    </p>
                    <p>Peak Hour: {behavior.dailyPatterns.peakHour}:00</p>
                    <p>
                      Active Hours:{" "}
                      {behavior.dailyPatterns.activeHours.join(", ")}
                    </p>
                    <div className="border-t border-default-200 my-2" />
                    <p className="font-medium mb-1">Batch Patterns:</p>
                    <p>Frequency: {behavior.batchPatterns.frequency}</p>
                    <p>Batch Size: {behavior.batchPatterns.batchSize}</p>
                    <p>
                      Avg Interval: {behavior.batchPatterns.averageInterval}h
                    </p>
                  </div>
                </div>
              ))}
              {metrics.creatorBehaviors.length === 0 && (
                <p className="text-default-400">
                  No creator behavior data available
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
