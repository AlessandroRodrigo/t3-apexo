import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { chats } from "~/server/db/schema";

export const chatRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users
      .findFirst({
        where: (users, { eq }) => eq(users.clerkId, ctx.auth.userId),
      })
      .execute();

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return db.query.chats
      .findMany({
        where: (chats, { eq }) => eq(chats.userId, user?.id),
      })
      .execute();
  }),
  create: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await db.query.users
        .findFirst({
          where: (users, { eq }) => eq(users.clerkId, ctx.auth.userId),
        })
        .execute();

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });

      const nameGenerated = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Generate a simple and objective name for this chat, at max 3 words",
          },
          {
            role: "user",
            content: input.messages.map((message) => message.content).join(" "),
          },
        ],
      });

      return db
        .insert(chats)
        .values({
          threadId: input.threadId,
          name: nameGenerated.choices[0]?.message.content,
          userId: user.id,
        })
        .execute();
    }),
  getMessagesByThreadId: protectedProcedure
    .input(
      z.object({
        threadId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.threadId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "threadId is required",
        });
      }

      const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });

      const result = [];
      let messageIterator = await openai.beta.threads.messages.list(
        input.threadId,
        {
          order: "asc",
        },
      );
      result.push(...messageIterator.data);

      while (messageIterator.hasNextPage()) {
        messageIterator = await messageIterator.getNextPage();
        result.push(...messageIterator.data);
      }

      return result;
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ input }) => {
      return db.delete(chats).where(eq(chats.id, input.id)).execute();
    }),
});
