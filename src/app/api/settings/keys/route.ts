import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/prisma";

export async function GET() {
  const keys = await db.listApiKeys("org-default");
  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Key name is required" }, { status: 400 });
    }

    const { keyRecord, secret } = await db.createApiKey("org-default", name.trim());
    await db.logAuditEvent(
      "org-default",
      "API_KEY_CREATED",
      "API_KEY",
      keyRecord.id,
      { name: keyRecord.name, maskedKey: keyRecord.maskedKey }
    );

    return NextResponse.json({ key: keyRecord, secret }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create API key";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("id");
    if (!keyId) {
      return NextResponse.json({ error: "Key ID is required" }, { status: 400 });
    }

    const success = await db.revokeApiKey("org-default", keyId);
    if (!success) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    await db.logAuditEvent(
      "org-default",
      "API_KEY_REVOKED",
      "API_KEY",
      keyId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to revoke API key";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
