import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { chats } from "~/server/db/schema";

export const chatRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return db.query.chats.findMany().execute();
  }),
  create: publicProcedure
    .input(
      z.object({
        threadId: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return db
        .insert(chats)
        .values({
          threadId: input.threadId,
          userId: 1,
        })
        .execute();
    }),
  getMessagesByThreadId: publicProcedure
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
      );
      result.push(...messageIterator.data);

      while (messageIterator.hasNextPage()) {
        messageIterator = await messageIterator.getNextPage();
        result.push(...messageIterator.data);
      }

      return result;
    }),
});
