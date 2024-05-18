import { Webhook } from "svix";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { type NextApiRequest, type NextApiResponse } from "next";
import { buffer } from "micro";
import { env } from "~/env";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405);
    return;
  }

  // Get the headers
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    res.status(400).json({ error: "Error occured -- no svix headers" });
    return;
  }

  // Get the body
  const body = (await buffer(req))?.toString();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    res.status(400).json({ Error: err });
    return;
  }

  const eventType = evt.type;
  if (eventType === "user.created") {
    const result = await handleUserCreatedEvent(evt);

    if (!result) {
      res.status(500);
      return;
    }
  }

  res.status(200);
}

async function handleUserCreatedEvent(evt: WebhookEvent) {
  const userCreated = evt.data;

  if (!userCreated.id) return;

  return db
    .insert(users)
    .values({
      clerkId: userCreated.id,
    })
    .returning()
    .get();
}
