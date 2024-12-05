"use server";

import prisma from "@/db";

interface createUserProps {
  clerkId: string;
  email: string;
  name: string;
}

export async function getUserDetails({
  clerkId,
  email,
  name,
}: createUserProps) {
  try {
    if (!clerkId || !email || !name)
      return { success: false, error: "Missing required fields" };

    const existingUser = await prisma.user.findUnique({
      where: {
        id: clerkId,
      },
    });

    if (existingUser) return { success: true, user: existingUser };

    const user = await prisma.user.create({
      data: {
        id: clerkId,
        email,
        name,
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return { sucess: false, error: "Failed to create user" };
  }
}

export async function DeleteUser({ clerkId }: { clerkId: string }) {
  try {
    if (!clerkId) return { success: false, data: "Missing clerkId" };

    const userExists = await prisma.user.findUnique({
      where: {
        id: clerkId,
      },
    });

    if (!userExists) return { success: false, data: "User does not exist" };

    const user = await prisma.user.delete({
      where: {
        id: clerkId,
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return { sucess: false, error: "Failed to delete user" };
  }
}
