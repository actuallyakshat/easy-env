"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addVariable } from "../actions/addVariable";

export function AddVariableForm({ projectId }: { projectId: number }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addVariable(projectId, name, value);
    if (result.success) {
      setName("");
      setValue("");
      router.refresh();
    } else {
      // Handle error (e.g., show an error message)
      console.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Variable Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., API_KEY"
          required
        />
      </div>
      <div>
        <Label htmlFor="value">Variable Value</Label>
        <Input
          id="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g., your-secret-key"
          required
          type="password"
        />
      </div>
      <Button type="submit">Add Variable</Button>
    </form>
  );
}
