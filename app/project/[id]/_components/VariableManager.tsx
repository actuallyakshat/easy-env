"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Download, Edit, Eye, EyeOff, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  addVariables,
  deleteProject,
  deleteVariable,
  getProjectVariables,
  updateVariable,
} from "../_actions/actions";

interface Variable {
  id: number;
  name: string;
  value: string;
}

export function VariableManager({
  projectId,
  initialVariables,
}: {
  projectId: number;
  initialVariables: Variable[];
}) {
  const [variables, setVariables] = useState<Variable[]>(initialVariables);
  const [input, setInput] = useState("");
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [revealedValues, setRevealedValues] = useState<Record<number, boolean>>(
    {}
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newVariables = input
      .split("\n")
      .map((line) => {
        const [name, value] = line.split("=").map((s) => s.trim());
        return { name, value };
      })
      .filter((v) => v.name && v.value);

    if (newVariables.length === 0) {
      toast.error("No valid variables found");
      return;
    }

    const duplicates = newVariables.filter((newVar) =>
      variables.some((existingVar) => existingVar.name === newVar.name)
    );

    if (duplicates.length > 0) {
      toast.error(
        `Duplicate keys found: ${duplicates.map((d) => d.name).join(", ")}`
      );
      return;
    }

    const newVarNames = newVariables.map((v) => v.name);
    const internalDuplicates = newVarNames.filter(
      (name, index) => newVarNames.indexOf(name) !== index
    );

    if (internalDuplicates.length > 0) {
      toast.error(
        `Duplicate keys in input: ${Array.from(
          new Set(internalDuplicates)
        ).join(", ")}`
      );
      return;
    }

    const result = await addVariables(projectId, newVariables);
    if (result.success) {
      toast.success(result.message);
      setInput("");
      const updatedVariables = await getProjectVariables(projectId);
      if (updatedVariables.success && updatedVariables.variables) {
        setVariables(updatedVariables.variables);
      }
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteVariable = async (variableId: number) => {
    const result = await deleteVariable(variableId);
    if (result.success) {
      toast.success(result.message);
      setVariables(variables.filter((v) => v.id !== variableId));
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateVariable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariable) return;

    const result = await updateVariable(
      editingVariable.id,
      editingVariable.name,
      editingVariable.value
    );
    if (result.success) {
      toast.success(result.message);
      setVariables(
        variables.map((v) =>
          v.id === editingVariable.id ? editingVariable : v
        )
      );
      setIsEditDialogOpen(false);
      setEditingVariable(null);
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteProject = async () => {
    const result = await deleteProject(projectId);
    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  const downloadEnv = () => {
    const envContent = variables.map((v) => `${v.name}=${v.value}`).join("\n");
    const blob = new Blob([envContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, ".env");
    toast.success("Downloaded .env file");
  };

  const toggleRevealValue = (id: number) => {
    setRevealedValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Project Variables</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Project</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                project and all its variables.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject}>
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Add New Variables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="variables"
                  className="text-sm text-muted-foreground"
                >
                  Variables (one per line, KEY=VALUE format)
                </Label>
                <Textarea
                  id="variables"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="API_KEY=your-secret-key&#10;DATABASE_URL=your-database-url"
                  className="min-h-[200px] resize-none noscrollbar"
                />
              </div>
              <Button type="submit" className="w-full">
                Add Variables
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Project Variables
            </CardTitle>
            <Button variant="outline" size="sm" onClick={downloadEnv}>
              <Download className="h-4 w-4 mr-2" />
              Download .env
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {variables.map((variable) => (
                  <div
                    key={variable.id}
                    className="flex flex-col space-y-1 rounded-lg border p-3 text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">
                        {variable.name}
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRevealValue(variable.id)}
                        >
                          {revealedValues[variable.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Dialog
                          open={isEditDialogOpen}
                          onOpenChange={setIsEditDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingVariable(variable)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Variable</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={handleUpdateVariable}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingVariable?.name || ""}
                                  onChange={(e) =>
                                    setEditingVariable((prev) =>
                                      prev
                                        ? { ...prev, name: e.target.value }
                                        : null
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-value">Value</Label>
                                <Input
                                  id="edit-value"
                                  value={editingVariable?.value || ""}
                                  onChange={(e) =>
                                    setEditingVariable((prev) =>
                                      prev
                                        ? { ...prev, value: e.target.value }
                                        : null
                                    )
                                  }
                                />
                              </div>
                              <Button type="submit">Update Variable</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the variable.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteVariable(variable.id)
                                }
                              >
                                Delete Variable
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="text-xs overflow-hidden text-ellipsis text-muted-foreground">
                      {revealedValues[variable.id]
                        ? variable.value
                        : variable.value.slice(0, 30).replace(/./g, "•")}
                    </div>
                  </div>
                ))}
                {variables.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No variables added yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
