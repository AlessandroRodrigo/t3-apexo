import { type WebhookEvent } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import { Webhook } from "svix";
import { env } from "~/env";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  // Get the headers
  const svix_id = req.headers.get("svix-id")!;
  const svix_timestamp = req.headers.get("svix-timestamp")!;
  const svix_signature = req.headers.get("svix-signature")!;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response(
      JSON.stringify({
        error: "Error occured -- no svix headers",
      }),
      { status: 400 },
    );
  }

  // Get the body
  const buffer = await req.arrayBuffer();
  const body = new TextDecoder().decode(buffer);

  // Create a new Svix instance with your secret.
  console.log(env.CLERK_WEBHOOK_SECRET);
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
    return new Response(JSON.stringify(err), { status: 400 });
  }

  const eventType = evt.type;
  if (eventType === "user.updated") {
    const result = await handleUserCreatedEvent(evt);

    if (!result) {
      return new Response(
        JSON.stringify({
          error: "Error occured -- no result",
        }),
        { status: 500 },
      );
    }
  }

  return new Response(null, { status: 200 });
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
