import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  tablesFilter: ["t3-apexo_*"],
} satisfies Config;
