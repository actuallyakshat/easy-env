"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGlobalStore } from "@/context/GlobalContext";
import { createProject } from "../_actions/actions";
import { toast } from "sonner";

export default function AddProjectDialog() {
  const { clientUser } = useGlobalStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit() {
    try {
      if (!clientUser) return;
      if (!name) {
        toast.error("Please enter a project name");
        return;
      }
      setLoading(true);

      const response = await createProject({
        name,
        userId: clientUser.id,
      });
      if (response.success) {
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"}>Add Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Dialog</DialogTitle>
          <DialogDescription>
            Enter the name of your project to get started
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-2">
            <Label>Project&apos;s Name</Label>
            <Input
              placeholder="E-Commerce"
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </div>
          <Button disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
