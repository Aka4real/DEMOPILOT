import { NextRequest } from "next/server";
import { store } from "@/lib/storage/store";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  let isClosed = false;

  const checkInterval = setInterval(async () => {
    if (isClosed) return;

    if (jobId) {
      const progress = store.getJobProgress(jobId);
      if (progress) {
        const payload = `data: ${JSON.stringify(progress)}\n\n`;
        await writer.write(encoder.encode(payload)).catch(() => {
          isClosed = true;
          clearInterval(checkInterval);
        });

        if (progress.stage === "COMPLETED" || progress.stage === "FAILED") {
          isClosed = true;
          clearInterval(checkInterval);
          writer.close().catch(() => {});
        }
      }
    } else {
      // Send current project state
      const project = await store.getProjectById(params.id);
      if (project) {
        const payload = `data: ${JSON.stringify({ status: project.status })}\n\n`;
        await writer.write(encoder.encode(payload)).catch(() => {
          isClosed = true;
          clearInterval(checkInterval);
        });
      }
    }
  }, 800);

  // Safety timeout after 5 minutes
  setTimeout(() => {
    if (!isClosed) {
      isClosed = true;
      clearInterval(checkInterval);
      writer.close().catch(() => {});
    }
  }, 300000);

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
