"use client";

import { Loader2, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";

interface Props {
  chat: RouterOutputs["chat"]["list"][number];
}

export function ChatHistoryItem({ chat }: Props) {
  const utils = api.useUtils();
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId?.[0];
  const { mutateAsync: deleteChat, isPending: isDeleting } =
    api.chat.deleteById.useMutation({
      onSuccess: () => {
        void utils.chat.list.invalidate();
      },
    });

  return (
    <Link
      href={`/tools/oliwrite/${chat.threadId}`}
      key={chat.id}
      className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg px-4 py-2 transition-all"
    >
      <span
        className={cn(
          "max-w-[200px] truncate text-white hover:text-primary",
          chatId === chat.threadId ? "text-primary" : "text-white",
        )}
      >
        {chat.name ?? "Untitled"}
      </span>
      <div className="opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0">
        {isDeleting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash
            className="h-5 w-5 cursor-pointer text-white transition-colors hover:text-red-500"
            onClick={(event) => {
              event.preventDefault();
              void deleteChat({ id: chat.id });

              if (chatId === chat.threadId) {
                void router.push("/tools/oliwrite");
              }
            }}
          />
        )}
      </div>
    </Link>
  );
}
