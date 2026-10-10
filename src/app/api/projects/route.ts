import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/storage/store";
import { validateTargetUrl } from "@/lib/security/ssrf";

export async function GET() {
  const projects = await store.getProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, targetUrl, objective, presentationStyle, voiceStyle, authConfig } = body;

    if (!targetUrl) {
      return NextResponse.json({ error: "Website URL is required." }, { status: 400 });
    }

    const validation = await validateTargetUrl(targetUrl);
    if (!validation.isValid || !validation.sanitizedUrl) {
      return NextResponse.json(
        { error: validation.errorMessage || "SSRF security check failed for this URL." },
        { status: 400 }
      );
    }

    const projectName = name?.trim() || new URL(validation.sanitizedUrl).hostname;

    const project = await store.createProject({
      name: projectName,
      targetUrl: validation.sanitizedUrl,
      objective: objective || "product_overview",
      presentationStyle: presentationStyle || "concise",
      voiceStyle: voiceStyle || "professional",
      authConfig,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
