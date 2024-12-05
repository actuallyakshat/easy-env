"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function addVariable(
  projectId: number,
  name: string,
  value: string
) {
  try {
    const existingVariable = await prisma.variable.findFirst({
      where: {
        AND: {
          projectId,
          name,
        },
      },
    });

    if (existingVariable) return { success: false, error: "Variable exists" };

    const newVariable = await prisma.variable.create({
      data: {
        name,
        value,
        projectId,
      },
    });
    return { success: true, variable: newVariable };
  } catch (error) {
    console.error("Failed to add variable:", error);
    return { success: false, error: "Failed to add variable" };
  }
}

export async function addVariables(
  projectId: number,
  variables: { name: string; value: string }[]
) {
  try {
    await prisma.variable.createMany({
      data: variables.map((v) => ({ ...v, projectId })),
    });
    return { success: true, message: "Variables added successfully" };
  } catch (error) {
    console.error("Failed to add variables:", error);
    return { success: false, error: "Failed to add variables" };
  }
}

export async function getProjectVariables(projectId: number) {
  try {
    const variables = await prisma.variable.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, variables };
  } catch (error) {
    console.error("Failed to fetch variables:", error);
    return { success: false, error: "Failed to fetch variables" };
  }
}
export async function deleteVariable(variableId: number) {
  try {
    await prisma.variable.delete({
      where: { id: variableId },
    });
    return { success: true, message: "Variable deleted successfully" };
  } catch (error) {
    console.error("Failed to delete variable:", error);
    return { success: false, error: "Failed to delete variable" };
  }
}

export async function updateVariable(
  variableId: number,
  name: string,
  value: string
) {
  try {
    await prisma.variable.update({
      where: { id: variableId },
      data: { name, value },
    });
    return { success: true, message: "Variable updated successfully" };
  } catch (error) {
    console.error("Failed to update variable:", error);
    return { success: false, error: "Failed to update variable" };
  }
}

export async function deleteProject(projectId: number) {
  try {
    await prisma.project.delete({
      where: { id: projectId },
    });
    revalidatePath("/project/" + projectId);
    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
