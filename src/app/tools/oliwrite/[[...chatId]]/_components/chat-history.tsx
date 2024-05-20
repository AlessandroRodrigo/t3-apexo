import { Loader2, Menu, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function ChatHistory() {
  const router = useRouter();
  const { isLoading, data: chats } = api.chat.list.useQuery();

  function handleCreateNewChat() {
    router.push("/tools/oliwrite");
  }

  return (
    <>
      <header className="flex h-14 items-center justify-end gap-4 justify-self-end px-4 lg:hidden lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="flex flex-col">
            <SheetHeader className="text-left">
              <SheetTitle>Chats</SheetTitle>
              <SheetDescription>
                Select a chat to view its history
              </SheetDescription>
              <Button
                className="flex items-center gap-2"
                variant="outline"
                onClick={handleCreateNewChat}
              >
                <Pencil className="h-5 w-5" />
                Create new chat
              </Button>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="flex-1">
              <div className="grid items-start space-y-4 px-2 text-sm font-medium lg:px-4">
                <ScrollArea className="h-[70vh]">
                  {chats?.map((chat) => (
                    <ChatHistoryItem key={chat.id} chat={chat} />
                  ))}
                </ScrollArea>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <div className="hidden min-h-screen w-4/12 max-w-96 border-r bg-muted/40 lg:block lg:w-4/12">
        <div className="sticky top-0 flex h-full max-h-screen flex-col gap-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b px-4 lg:gap-4 lg:px-6">
            <div className="shrink">
              <CardTitle>Chats</CardTitle>
              <CardDescription>
                Select a chat to view its history
              </CardDescription>
            </div>

            <Button
              size="icon"
              variant="outline"
              className="mt-0"
              onClick={handleCreateNewChat}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </CardHeader>
          <div className="flex flex-1">
            {isLoading ? (
              <div className="flex h-full flex-1 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <div className="grid flex-1 items-start space-y-4 px-2 text-sm font-medium lg:px-4">
                <ScrollArea className="h-[85vh]">
                  {chats?.map((chat) => (
                    <ChatHistoryItem key={chat.id} chat={chat} />
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface ChatHistoryItemProps {
  chat: {
    id: number;
    threadId: string | null;
    name: string | null;
  };
}

function ChatHistoryItem({ chat }: ChatHistoryItemProps) {
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
                router.push("/tools/oliwrite");
              }
            }}
          />
        )}
      </div>
    </Link>
  );
}
