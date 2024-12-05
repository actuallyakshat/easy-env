import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Folder } from "lucide-react";
import Link from "next/link";
import AddProjectDialog from "./_components/AddProjectDialog";

export default async function Dashboard() {
  const { userId } = auth();
  const projects = await prisma.project.findMany({
    where: {
      userId: userId!,
    },
    include: {
      variables: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="max-w-screen-2xl px-5 w-full mx-auto py-12">
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="font-extrabold text-2xl md:text-4xl">Your Projects</h1>
        <AddProjectDialog />
      </div>
      {projects.length === 0 ? (
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>
              Create your first project to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddProjectDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  {project.name}
                </CardTitle>
                <CardDescription>
                  Last updated:{" "}
                  {new Date(project.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">
                  {project.variables.length} variable
                  {project.variables.length === 1 ? "" : "s"}
                </Badge>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild className="w-full">
                  <Link href={`/project/${project.id}`}>
                    View Project <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
