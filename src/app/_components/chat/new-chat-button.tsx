"use client";

import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export function NewChatButton() {
  const router = useRouter();

  function handleCreateNewChat() {
    void router.push("/tools/oliwrite");
  }

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="mt-0 hidden md:flex"
        onClick={handleCreateNewChat}
      >
        <Plus className="h-5 w-5" />
      </Button>
      <Button
        className="flex items-center gap-2 lg:hidden"
        variant="outline"
        onClick={handleCreateNewChat}
      >
        <Pencil className="h-5 w-5" />
        Create new chat
      </Button>
    </>
  );
}
