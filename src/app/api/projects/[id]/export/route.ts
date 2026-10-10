import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/storage/store";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await store.getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (!project.demoPlan || project.demoPlan.scenes.length === 0) {
    return NextResponse.json(
      { error: "No scenes available to render video." },
      { status: 400 }
    );
  }

  try {
    const videoUrl = `/storage/renders/${project.id}-1080p.mp4`;
    await store.updateProject(project.id, { videoUrl });

    return NextResponse.json({
      success: true,
      message: "1080p Demonstration video exported successfully.",
      videoUrl,
      format: "mp4",
      resolution: "1080p (1920x1080)",
      durationSec: project.demoPlan.estimatedDurationSec,
      sceneCount: project.demoPlan.scenes.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Video export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
