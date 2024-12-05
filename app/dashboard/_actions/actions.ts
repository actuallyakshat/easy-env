"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function createProject({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) {
  if (!name || !userId)
    return { success: false, message: "Missing required fields" };

  try {
    const project = await prisma.project.create({
      data: {
        name,
        userId,
      },
    });

    revalidatePath("/dashboard");

    return { success: true, message: "Project created", project };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create project" };
  }
}
