"use client";

import AvatarBuilder from "@/components/avatar-builder/AvatarBuilder";

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-fixed">
      <AvatarBuilder />
    </div>
  );
}
