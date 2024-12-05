import React from "react";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex z-[51] bg-background items-center justify-center">
      <LoaderCircle className="animate-spin size-5" />
    </div>
  );
}
