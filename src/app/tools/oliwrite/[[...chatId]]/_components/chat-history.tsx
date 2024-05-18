import { Loader2, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export function ChatHistory() {
  const { isLoading, data: chats } = api.chat.list.useQuery();

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Card className="fixed left-0 h-full">
      <CardHeader>
        <CardTitle>Chats</CardTitle>
        <CardDescription>Select a chat to view its history</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {chats?.map((chat) => <ChatHistoryItem key={chat.id} chat={chat} />)}
      </CardContent>
    </Card>
  );
}

interface ChatHistoryItemProps {
  chat: {
    id: number;
    threadId: string | null;
  };
}

function ChatHistoryItem({ chat }: ChatHistoryItemProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const params = useParams<{ chatId: string[] }>();
  const chatId = params.chatId?.[0];
  const { mutateAsync: deleteChat, isPending: isDeleting } =
    api.chat.deleteById.useMutation({
      onSuccess: () => {
        void utils.chat.list.invalidate();
      },
    });

  return (
    <div
      key={chat.id}
      className={`flex cursor-pointer items-center gap-2 rounded-md p-2 ${
        chat.threadId === chatId && "bg-muted text-white"
      } group w-[250px] max-w-[250px] hover:bg-muted hover:text-white`}
      onClick={() => {
        router.push(`/tools/oliwrite/${chat.threadId}`);
      }}
    >
      <span className="max-w-[200px] truncate">{chat.threadId}</span>
      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        {isDeleting ? (
          <Loader2 className="h-5 w-5" />
        ) : (
          <Trash
            className="h-5 w-5 transition-colors hover:text-red-500"
            onClick={() => {
              void deleteChat({ id: chat.id });
            }}
          />
        )}
      </div>
    </div>
  );
}
