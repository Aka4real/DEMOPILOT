import React from "react";
import { db } from "@/lib/database/prisma";
import { SettingsClientView } from "@/components/settings/SettingsClientView";

export const revalidate = 0;

export default async function SettingsPage() {
  const [keys, auditLogs] = await Promise.all([
    db.listApiKeys("org-default"),
    db.getAuditLogs("org-default"),
  ]);

  return <SettingsClientView initialKeys={keys} initialAuditLogs={auditLogs} />;
}
