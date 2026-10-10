import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/storage/store";
import { crawlWebsite } from "@/lib/browser/crawler";
import { analyzeWebsiteWithGemini } from "@/lib/ai/analyzer";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await store.getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const jobId = `job-analyze-${Date.now()}`;

  try {
    await store.updateProject(project.id, { status: "ANALYZING" });

    store.setJobProgress({
      jobId,
      projectId: project.id,
      stage: "CONNECTING_WEBSITE",
      progressPct: 15,
      message: `Establishing connection to ${project.targetUrl}…`,
      timestamp: new Date().toISOString(),
    });

    // 1. Crawl website using Playwright with SSRF protection
    const crawlResult = await crawlWebsite(project.targetUrl, 3, project.authConfig);

    store.setJobProgress({
      jobId,
      projectId: project.id,
      stage: "MAPPING_PAGES",
      progressPct: 45,
      message: `Discovered ${crawlResult.pages.length} pages and navigation hierarchy.`,
      timestamp: new Date().toISOString(),
    });

    store.setJobProgress({
      jobId,
      projectId: project.id,
      stage: "ANALYZING_PRODUCT",
      progressPct: 75,
      message: "Extracting core features and grounding evidence with Gemini…",
      timestamp: new Date().toISOString(),
    });

    // 2. Analyze product structure with Gemini
    const productModel = await analyzeWebsiteWithGemini({
      url: project.targetUrl,
      pages: crawlResult.pages,
      objective: project.objective,
    });
    productModel.projectId = project.id;

    // 3. Update project
    const updated = await store.updateProject(project.id, {
      status: "READY",
      name: productModel.productName || project.name,
      productModel,
    });

    store.setJobProgress({
      jobId,
      projectId: project.id,
      stage: "COMPLETED",
      progressPct: 100,
      message: "Product analysis completed with verified evidence.",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      jobId,
      project: updated,
      productModel,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    await store.updateProject(project.id, { status: "FAILED" });

    store.setJobProgress({
      jobId,
      projectId: project.id,
      stage: "FAILED",
      progressPct: 100,
      message: `Analysis failed: ${message}`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
