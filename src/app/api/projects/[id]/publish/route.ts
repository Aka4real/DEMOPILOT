import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/storage/store";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}));
    const { customSlug } = body;

    const manifest = await store.publishDemo(params.id, customSlug);
    if (!manifest) {
      return NextResponse.json(
        { error: "Could not publish demo. Verify project has valid scenes." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      slug: manifest.slug,
      demoUrl: `/demo/${manifest.slug}`,
      manifest,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
