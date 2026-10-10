import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/storage/store";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const demo = await store.getInteractiveDemo(params.slug);
  if (!demo) {
    return NextResponse.json({ error: "Demo not found" }, { status: 404 });
  }
  return NextResponse.json({ demo });
}
