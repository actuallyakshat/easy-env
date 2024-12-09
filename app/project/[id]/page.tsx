import prisma from "@/db";
import { VariableManager } from "./_components/VariableManager";
import { Badge } from "@/components/ui/badge";

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
    <div className="max-w-screen-xl h-full mx-auto px-4 py-4 md:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-1.5">
            {project.name}
          </h1>
          <Badge variant={"outline"}>
            {project.variables.length} variables
          </Badge>
        </div>
      </div>
      <hr className="my-3" />
      <VariableManager
        projectId={project.id}
        initialVariables={project.variables}
      />
    </div>
  );
}
