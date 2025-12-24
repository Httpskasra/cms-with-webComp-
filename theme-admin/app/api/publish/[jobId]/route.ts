import { NextResponse } from "next/server";
import { enforceDevOnly, getPublishJob } from "../../../../src/lib/publishJobs";

export async function GET(
  _request: Request,
  { params }: { params: { jobId: string } }
) {
  const devGuard = enforceDevOnly();
  if (devGuard) return devGuard;

  const job = getPublishJob(params.jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}
