import prisma from "@/db";
import { VariableManager } from "./_components/VariableManager";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function Project({ params }: ProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      variables: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) return <div>Project not found</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-3">{project.name}</h1>
      <hr className="pb-6" />
      <VariableManager
        projectId={project.id}
        initialVariables={project.variables}
      />
    </div>
  );
}
