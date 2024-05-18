import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export function ChatHistory() {
  const router = useRouter();
  const params = useParams<{ chatId: string[] }>();
  const { isLoading, data: chats } = api.chat.list.useQuery();
  const chatId = params.chatId?.[0];

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Card className="fixed left-0 h-full">
      <CardHeader>
        <CardTitle>Chats</CardTitle>
        <CardDescription>Select a chat to view its history</CardDescription>
      </CardHeader>

      {chats?.map((chat) => (
        <div
          key={chat.id}
          className={`cursor-pointer p-4 ${
            chat.threadId === chatId
              ? "bg-primary text-white"
              : "bg-background text-primary"
          }`}
          onClick={() => {
            router.push(`/tools/oliwrite/${chat.id}`);
          }}
        >
          {chat.threadId}
        </div>
      ))}
    </Card>
  );
}
