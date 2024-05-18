"use client";

import { type Message, useAssistant } from "ai/react";
import { CornerDownLeft } from "lucide-react";
import Markdown from "react-markdown";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function ScriptWriterPage() {
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: "/api/assistant" });

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-muted/50">
      <div className="flex max-w-6xl flex-col justify-between">
        <div className="mb-28 flex h-full w-[900px] flex-col pt-8">
          {messages.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>OliWrite Pro</CardTitle>
                <CardDescription>
                  Elevate your social media game with OliWrite Pro, an advanced
                  AI inspired by our top scriptwriting expert. This powerful
                  tool crafts creative and engaging scripts tailored to
                  captivate your audience. Don’t miss out on transforming your
                  posts and staying ahead of the competition with the
                  unparalleled quality and innovation of OliWrite Pro.
                  Experience the difference and take your content to the next
                  level!
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {messages.map((m: Message, index: number) => (
            <div key={m.id}>
              <strong>{`${m.role}: `}</strong>
              {m.role !== "data" && <Markdown>{m.content}</Markdown>}
              {index !== messages.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>

        {status === "in_progress" && <div />}

        <div className="fixed bottom-0 left-1/2 w-[900px] -translate-x-1/2 transform space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <form onSubmit={submitMessage}>
            <div className="flex max-h-60 w-full grow items-center justify-center overflow-hidden bg-background px-4 sm:rounded-md sm:border">
              <textarea
                disabled={status !== "awaiting_message"}
                value={input}
                placeholder="Type your message here..."
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void submitMessage();
                  }
                }}
                className="h-16 min-h-[60px] w-full resize-none bg-transparent py-[1.3rem] focus-within:outline-none sm:text-sm"
              />
              <Button size="icon" className="h-9 w-9">
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
