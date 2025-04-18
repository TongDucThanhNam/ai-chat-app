"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  getProjectsByUserId,
  createProject,
  updateProject,
  deleteProject,
  getChatsByProjectId,
} from "@/lib/db/queries";
import { headers } from "next/headers";

export async function getUserProjects() {
  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getProjectsByUserId(session.user.id);
}

export async function createNewProject(name: string) {
  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const project = await createProject(session.user.id, name);

  revalidatePath("/chat");
  return project;
}

export async function updateProjectDetails(id: string, name: string) {
  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const project = await updateProject(id, name);

  revalidatePath("/chat");
  return project;
}

export async function deleteProjectById(id: string) {
  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await deleteProject(id);

  revalidatePath("/chat");
  return { success: true };
}

export async function getProjectChats(projectId: string) {
  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getChatsByProjectId(projectId);
}
