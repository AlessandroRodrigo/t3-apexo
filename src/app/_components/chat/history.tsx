import { Loader2, Menu } from "lucide-react";
import { Suspense } from "react";
import { ChatHistoryItem } from "~/app/_components/chat/history-item";
import { NewChatButton } from "~/app/_components/chat/new-chat-button";
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
import { api } from "~/trpc/server";

export function ChatHistory() {
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
              <NewChatButton />
            </SheetHeader>
            <Separator className="my-4" />
            <Suspense
              fallback={
                <div className="flex flex-1 items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              }
            >
              <ChatList />
            </Suspense>
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

            <NewChatButton />
          </CardHeader>
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            }
          >
            <ChatList />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function ChatList() {
  const chats = await api.chat.list();

  return (
    <div className="flex flex-1">
      <div className="grid flex-1 items-start space-y-4 px-2 text-sm font-medium lg:px-4">
        <ScrollArea className="h-[70svh] lg:h-[80svh]">
          {chats?.map((chat) => <ChatHistoryItem key={chat.id} chat={chat} />)}
        </ScrollArea>
      </div>
    </div>
  );
}
