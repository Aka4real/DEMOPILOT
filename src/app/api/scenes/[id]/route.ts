import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/storage/store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await store.updateScene(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Scene not found" }, { status: 404 });
    }
    return NextResponse.json({ scene: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scene update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
