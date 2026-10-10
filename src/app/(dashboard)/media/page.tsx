import React from "react";
import { store } from "@/lib/storage/store";
import { MediaLibraryView } from "@/components/media/MediaLibraryView";

export const revalidate = 0;

export default async function MediaPage() {
  const projects = await store.getProjects();

  return <MediaLibraryView initialProjects={projects} />;
}
