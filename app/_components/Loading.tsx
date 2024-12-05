import React from "react";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen fixed w-screen flex z-[101] bg-background items-center justify-center">
      <LoaderCircle className="animate-spin size-5" />
    </div>
  );
}
