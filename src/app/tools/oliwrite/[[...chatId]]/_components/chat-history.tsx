import { Loader2, Menu, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
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
  const { isLoading, data: chats } = api.chat.list.useQuery();

  return isLoading ? (
    <div>Loading...</div>
  ) : (
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
            <SheetHeader>
              <SheetTitle>Chats</SheetTitle>
              <SheetDescription>
                Select a chat to view its history
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="flex-1">
              <div className="grid items-start space-y-4 px-2 text-sm font-medium lg:px-4">
                {chats?.map((chat) => (
                  <ChatHistoryItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <div className="sticky top-0 hidden min-h-screen w-4/12 max-w-72 border-r bg-muted/40 lg:block lg:w-3/12">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <CardHeader className="flex border-b px-4 lg:px-6">
            <CardTitle>Chats</CardTitle>
            <CardDescription>Select a chat to view its history</CardDescription>
          </CardHeader>
          <div className="flex-1">
            <div className="grid items-start space-y-4 px-2 text-sm font-medium lg:px-4">
              {chats?.map((chat) => (
                <ChatHistoryItem key={chat.id} chat={chat} />
              ))}
            </div>
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
      className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg transition-all"
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
          <Loader2 className="h-5 w-5" />
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
