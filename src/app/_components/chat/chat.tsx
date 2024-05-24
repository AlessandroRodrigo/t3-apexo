"use client";

import { useUser } from "@clerk/nextjs";
import { type Message, useAssistant } from "ai/react";
import { CornerDownLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";

interface Props {
  chatId?: string;
}

export function Chat({ chatId }: Props) {
  const { user } = useUser();
  const router = useRouter();
  const apiUtils = api.useUtils();
  const { data: loadedMessages, isLoading: messagesLoading } =
    api.chat.getMessagesByThreadId.useQuery(
      { threadId: chatId },
      {
        enabled: !!chatId,
      },
    );

  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    setMessages,
    threadId,
  } = useAssistant({ api: "/api/assistant", threadId: chatId });
  const { mutateAsync: createChat } = api.chat.create.useMutation({
    onSuccess: () => {
      router.push(`/tools/oliwrite/${threadId}`);
      void apiUtils.chat.list.invalidate();
    },
  });

  useEffect(() => {
    if (loadedMessages) {
      const convertedMessages = loadedMessages.map((m) => ({
        ...m,
        content: m.content
          .map((c) => {
            if (c.type === "text") {
              return c.text.value;
            }

            return "";
          })
          .flat()
          .join(" "),
      }));
      setMessages(convertedMessages);
    }
  }, [loadedMessages, setMessages]);

  const isLoading = status === "in_progress";

  useEffect(() => {
    if (!chatId && threadId && !isLoading) {
      void createChat({
        threadId,
        messages: messages.map((message) => ({
          content: message.content,
          role: message.role,
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, createChat, isLoading, threadId]);

  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-4">
      <div className="flex w-full max-w-[900px] justify-between">
        {messagesLoading ? (
          <div className="flex w-full flex-1 items-center justify-center py-16">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex w-full flex-1 flex-col">
            {messages.length === 0 && (
              <Card className="mx-4 mt-4">
                <CardHeader>
                  <CardTitle>OliWrite Pro</CardTitle>
                  <CardDescription>
                    Elevate your social media game with OliWrite Pro, an
                    advanced AI inspired by our top scriptwriting expert. This
                    powerful tool crafts creative and engaging scripts tailored
                    to captivate your audience. Don’t miss out on transforming
                    your posts and staying ahead of the competition with the
                    unparalleled quality and innovation of OliWrite Pro.
                    Experience the difference and take your content to the next
                    level!
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <div className="mx-4 mt-4">
              {messages.map((m: Message, index: number) => (
                <div key={m.id}>
                  <div className="flex items-start gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={m.role === "user" ? user?.imageUrl : undefined}
                      />
                      <AvatarFallback>
                        <div className="h-full w-full bg-gradient-to-tr from-primary to-green-300" />
                      </AvatarFallback>
                    </Avatar>
                    {m.role !== "data" && (
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          hr: () => <div className="my-4" />,
                        }}
                        className="whitespace-pre-wrap"
                      >
                        {m.content}
                      </Markdown>
                    )}
                  </div>
                  {index !== messages.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 w-full max-w-[700px] space-y-4 border-t bg-background px-2 py-2 shadow-lg sm:rounded-t-xl sm:border md:px-4 md:py-4">
        <form onSubmit={submitMessage}>
          <div className="flex max-h-60 w-full grow items-center justify-center overflow-hidden bg-background px-2 sm:rounded-md sm:border md:px-4">
            <textarea
              disabled={isLoading}
              value={input}
              placeholder="Type your message here..."
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void submitMessage();
                }
              }}
              className="no-scrollbar h-16 min-h-[60px] w-full resize-none bg-transparent py-[1.3rem] focus-within:outline-none sm:text-sm"
            />
            <Button
              size="icon"
              className="h-9 w-10 md:w-9"
              disabled={isLoading}
            >
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
