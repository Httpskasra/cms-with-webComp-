import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const CDN_REFRESH_URL =
  process.env.CDN_REFRESH_URL || "http://localhost:4000/refresh-cache";
const AUDIT_LOG_PATH = path.join(process.cwd(), "app", "publish-audit.log");
const jobs = new Map<string, PublishJob>();

export type PublishJobStatus = "queued" | "running" | "completed" | "failed";

export interface PublishJob {
  id: string;
  component: string;
  requestedBy: string;
  status: PublishJobStatus;
  createdAt: string;
  updatedAt: string;
  message?: string;
  error?: string;
}

const DEV_ONLY_ERROR = "Admin publish endpoint is only available in development";

export function enforceDevOnly() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: DEV_ONLY_ERROR }, { status: 403 });
  }
  return null;
}

export function startPublishJob({
  component,
  requestedBy,
}: {
  component: string;
  requestedBy: string;
}) {
  const now = new Date().toISOString();
  const job: PublishJob = {
    id: randomUUID(),
    component,
    requestedBy,
    status: "queued",
    createdAt: now,
    updatedAt: now,
    message: "Job enqueued",
  };
  jobs.set(job.id, job);
  runJob(job).catch((err: unknown) => {
    job.status = "failed";
    job.error = err instanceof Error ? err.message : String(err);
    job.updatedAt = new Date().toISOString();
    job.message = job.message || "Unexpected error while running job";
  });
  return job;
}

export function getPublishJob(jobId: string) {
  return jobs.get(jobId) || null;
}

async function runJob(job: PublishJob) {
  updateJob(job, "running", "Calling CDN invalidation endpoint");
  try {
    const response = await fetch(CDN_REFRESH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath: "api/theme.json", component: job.component }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`CDN responded with ${response.status}: ${errorBody}`);
    }
    updateJob(job, "completed", "CDN cache purged successfully");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    updateJob(job, "failed", "CDN cache purge failed", message);
  }
  await appendAudit(job);
}

function updateJob(
  job: PublishJob,
  status: PublishJobStatus,
  message: string,
  error?: string
) {
  job.status = status;
  job.message = message;
  job.updatedAt = new Date().toISOString();
  if (error) job.error = error;
  jobs.set(job.id, job);
}

async function appendAudit(job: PublishJob) {
  const entry = {
    jobId: job.id,
    component: job.component,
    requestedBy: job.requestedBy,
    status: job.status,
    message: job.message,
    error: job.error,
    timestamp: job.updatedAt,
  };

  await fs.appendFile(AUDIT_LOG_PATH, JSON.stringify(entry) + "\n", "utf8");
}
