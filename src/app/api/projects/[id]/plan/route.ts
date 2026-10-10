import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/storage/store";
import { generateDemoPlanWithGemini } from "@/lib/ai/planner";
import { verifySceneWithCritic } from "@/lib/ai/critic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await store.getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (!project.productModel) {
    return NextResponse.json(
      { error: "Product must be analyzed before generating a demonstration plan." },
      { status: 400 }
    );
  }

  try {
    const demoPlan = await generateDemoPlanWithGemini({
      projectId: project.id,
      productModel: project.productModel,
      objective: project.objective,
      presentationStyle: project.presentationStyle,
      voiceStyle: project.voiceStyle,
    });

    // Run Critic verification across all generated scenes
    for (const scene of demoPlan.scenes) {
      const verification = await verifySceneWithCritic({
        scene,
        evidence: scene.evidence,
      });
      scene.narration.verifiedGrounding = verification.isGrounded;
    }

    const updated = await store.updateProject(project.id, {
      demoPlan,
      status: "READY",
    });

    return NextResponse.json({
      project: updated,
      demoPlan,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Planning failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
