"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EffortSize, ProjectStatus } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth";

// ── Types for actions ────────────────────────────────────────
export type ActionResult = {
  success: boolean;
  message: string;
  projectId?: string;
};

// ── Create a new project ─────────────────────────────────────
export async function createProject(formData: {
  title: string;
  description?: string;
  businessValue: string;
  impactScore: number;
  urgencyScore: number;
  effortSize: EffortSize;
  calculatedPriority: number;
}): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role === 'GUEST') {
      return { success: false, message: "Unauthorized to create projects." };
    }

    const project = await prisma.project.create({
      data: {
        title: formData.title,
        description: formData.description || null,
        businessValue: formData.businessValue,
        impactScore: formData.impactScore,
        urgencyScore: formData.urgencyScore,
        effortSize: formData.effortSize,
        calculatedPriority: formData.calculatedPriority,
        status: ProjectStatus.draft,
        authorId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return {
      success: true,
      message: "Project created successfully!",
      projectId: project.id,
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : "";
    console.error("Error creating project:", errMsg);
    console.error("Stack:", errStack);
    return {
      success: false,
      message: `Failed to create project: ${errMsg}`,
    };
  }
}

// ── Get all projects ─────────────────────────────────────────
export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// ── Get dashboard stats ──────────────────────────────────────
export async function getDashboardStats() {
  try {
    const [total, pendingReview, inProgress, recentProjects] =
      await Promise.all([
        prisma.project.count(),
        prisma.project.count({
          where: {
            status: { in: [ProjectStatus.draft, ProjectStatus.analyzing] },
          },
        }),
        prisma.project.count({
          where: {
            status: { in: [ProjectStatus.in_progress, ProjectStatus.qa] },
          },
        }),
        prisma.project.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return { total, pendingReview, inProgress, recentProjects };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { total: 0, pendingReview: 0, inProgress: 0, recentProjects: [] };
  }
}

// ── Update project status ────────────────────────────────────
export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return { success: false, message: "Unauthorized. Only ADMIN can update project status." };
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return { success: true, message: `Status updated to ${status}` };
  } catch (error) {
    console.error("Error updating project status:", error);
    return { success: false, message: "Failed to update status." };
  }
}

// ── Delete a project ─────────────────────────────────────────
export async function deleteProject(projectId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return { success: false, message: "Unauthorized. Only ADMIN can delete projects." };
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return { success: true, message: "Project deleted." };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, message: "Failed to delete project." };
  }
}
