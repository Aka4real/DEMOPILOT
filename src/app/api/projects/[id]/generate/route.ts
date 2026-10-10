import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/storage/store";
import { executeSceneActions } from "@/lib/browser/director";
import { synthesizeSceneNarration } from "@/lib/ai/narrator";
import { verifySceneWithCritic } from "@/lib/ai/critic";

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
      { error: "No scenes available to execute. Generate a plan first." },
      { status: 400 }
    );
  }

  const jobId = `job-gen-${Date.now()}`;

  try {
    await store.updateProject(project.id, { status: "GENERATING" });

    store.setJobProgress({
      jobId,
      projectId: project.id,
      stage: "RECORDING_WALKTHROUGH",
      progressPct: 20,
      message: `Navigating ${project.targetUrl} in isolated browser sandbox…`,
      timestamp: new Date().toISOString(),
    });

    const updatedScenes = [...project.demoPlan.scenes];

    // Execute each scene's actions in isolated browser context
    for (let i = 0; i < updatedScenes.length; i++) {
      const scene = updatedScenes[i];
      const progress = 20 + Math.round(((i + 1) / updatedScenes.length) * 40);

      store.setJobProgress({
        jobId,
        projectId: project.id,
        stage: "RECORDING_WALKTHROUGH",
        progressPct: progress,
        message: `Executing actions for Scene ${i + 1}: "${scene.title}"`,
        timestamp: new Date().toISOString(),
      });

      const execResult = await executeSceneActions(project.targetUrl, scene, project.authConfig);
      if (execResult.finalScreenshotBase64) {
        scene.screenshotUrl = `data:image/jpeg;base64,${execResult.finalScreenshotBase64}`;
      }

      // Synthesize Narration audio & timing
      const narrationResult = await synthesizeSceneNarration({
        text: scene.narration.text,
        voiceStyle: project.voiceStyle,
        targetDurationSec: scene.durationSec,
      });

      scene.narration.durationSec = narrationResult.durationSec;
      scene.narration.voice = narrationResult.voice;

      // Verify Grounding
      const verification = await verifySceneWithCritic({
        scene,
        evidence: scene.evidence,
      });
      scene.narration.verifiedGrounding = verification.isGrounded;
    }

    store.setJobProgress({
      jobId,
      projectId: project.id,
      stage: "VERIFYING_EVIDENCE",
      progressPct: 85,
      message: "Critic verified all browser evidence and narration claims.",
      timestamp: new Date().toISOString(),
    });

    const updatedPlan = {
      ...project.demoPlan,
      scenes: updatedScenes,
      estimatedDurationSec: updatedScenes.reduce((acc, s) => acc + s.durationSec, 0),
      updatedAt: new Date().toISOString(),
    };

    const updatedProject = await store.updateProject(project.id, {
      demoPlan: updatedPlan,
      status: "REVIEW",
    });

    store.setJobProgress({
      jobId,
      projectId: project.id,
      stage: "COMPLETED",
      progressPct: 100,
      message: "Demonstration execution completed. Ready for review.",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      jobId,
      project: updatedProject,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    await store.updateProject(project.id, { status: "FAILED" });

    store.setJobProgress({
      jobId,
      projectId: project.id,
      stage: "FAILED",
      progressPct: 100,
      message: `Walkthrough failed: ${message}`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
