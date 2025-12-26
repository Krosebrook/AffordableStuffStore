/**
 * Worker System for Async Generation with Retry Logic
 *
 * Manages background job processing for asset generation
 * Implements retry logic for failed jobs
 */

import type { GenerationJob, AssetType } from "@/types/flashfusion";

export class WorkerService {
  private jobs: Map<string, GenerationJob> = new Map();
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds
  private readonly FAILURE_SIMULATION_RATE = 0.1; // 10% failure rate for testing
  private readonly MAX_SIMULATION_RETRIES = 2; // Fail on first 2 attempts for testing

  /**
   * Create a new generation job
   */
  createJob(
    type: AssetType,
    orgId: string,
    userId: string,
    prompt: string,
    parameters: Record<string, unknown> = {},
  ): GenerationJob {
    const job: GenerationJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type,
      orgId,
      userId,
      prompt,
      parameters,
      status: "queued",
      retryCount: 0,
      maxRetries: this.maxRetries,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobs.set(job.id, job);
    this.processJob(job.id);

    return job;
  }

  /**
   * Process a job with retry logic
   */
  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);

    if (!job) return;

    try {
      // Update status to processing
      job.status = "processing";
      job.updatedAt = new Date();
      this.jobs.set(jobId, job);

      // Simulate job processing
      await this.executeJob(job);

      // Mark as completed
      job.status = "completed";
      job.resultAssetId = `asset_${Date.now()}`;
      job.updatedAt = new Date();
      this.jobs.set(jobId, job);
    } catch (error) {
      // Handle failure
      job.retryCount++;
      job.updatedAt = new Date();

      if (job.retryCount < job.maxRetries) {
        // Retry with exponential backoff
        const delay = this.retryDelay * Math.pow(2, job.retryCount - 1);

        job.status = "queued";
        job.error = error instanceof Error ? error.message : "Unknown error";
        this.jobs.set(jobId, job);

        console.log(
          `Retrying job ${jobId} (attempt ${job.retryCount}/${job.maxRetries}) in ${delay}ms`,
        );

        setTimeout(() => this.processJob(jobId), delay);
      } else {
        // Max retries reached
        job.status = "failed";
        job.error = error instanceof Error ? error.message : "Unknown error";
        this.jobs.set(jobId, job);

        console.error(
          `Job ${jobId} failed after ${job.retryCount} retries:`,
          job.error,
        );
      }
    }
  }

  /**
   * Execute the actual job processing
   */
  private async executeJob(job: GenerationJob): Promise<void> {
    // Simulate processing time based on asset type
    const processingTimes: Record<AssetType, number> = {
      text: 2000,
      image: 3000,
      video: 5000,
      music: 4000,
    };

    await new Promise((resolve) =>
      setTimeout(resolve, processingTimes[job.type]),
    );

    // Simulate random failures for testing retry logic
    if (Math.random() < this.FAILURE_SIMULATION_RATE && job.retryCount < this.MAX_SIMULATION_RETRIES) {
      throw new Error("Simulated processing error");
    }

    console.log(`Job ${job.id} executed successfully`);
  }

  /**
   * Get job status
   */
  getJob(jobId: string): GenerationJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs for an organization
   */
  getJobsByOrg(orgId: string): GenerationJob[] {
    return Array.from(this.jobs.values()).filter((job) => job.orgId === orgId);
  }

  /**
   * Get jobs by status
   */
  getJobsByStatus(status: GenerationJob["status"]): GenerationJob[] {
    return Array.from(this.jobs.values()).filter(
      (job) => job.status === status,
    );
  }

  /**
   * Cancel a job
   */
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);

    if (!job || job.status === "completed" || job.status === "failed") {
      return false;
    }

    job.status = "failed";
    job.error = "Cancelled by user";
    job.updatedAt = new Date();
    this.jobs.set(jobId, job);

    return true;
  }

  /**
   * Clear completed and failed jobs older than specified time
   */
  cleanupJobs(olderThanMs: number = 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [jobId, job] of this.jobs.entries()) {
      if (
        (job.status === "completed" || job.status === "failed") &&
        now - job.updatedAt.getTime() > olderThanMs
      ) {
        this.jobs.delete(jobId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Singleton instance
let workerServiceInstance: WorkerService | null = null;

export function getWorkerService(): WorkerService {
  if (!workerServiceInstance) {
    workerServiceInstance = new WorkerService();
  }

  return workerServiceInstance;
}
