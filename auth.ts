import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/database";
import { userTable, sessionTable, accountTable, verificationTable } from "@/lib/db/schema/authSchema";
import { multiSession, organization } from "better-auth/plugins";
// import { Redis } from "@upstash/redis";

// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });

export const auth = betterAuth({
  session: {
    // Optional: Session configuration
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
    preserveSessionInDatabase: true,
  },
  user: {
    // Optional: User configuration
  },
  account: {
    // Optional: Account configuration
  },
  appName: "Mycelium",
  emailVerification: {},
  // secondaryStorage: {
  //   get: async (key) => {
  //     // Retrieve a value from Redis
  //     const value = await redis.get(key);
  //     // If value is null, return null
  //     if (value === null) return null;
  //     // Try to parse as JSON, fallback to string
  //     try {
  //       return JSON.parse(value as string);
  //     } catch {
  //       return value;
  //     }
  //   },
  //   set: async (key, value, ttl) => {
  //     // Store a value in Redis with optional TTL
  //     let storeValue: string;
  //     // If value is an object, stringify it
  //     if (typeof value === "object" && value !== null) {
  //       storeValue = JSON.stringify(value);
  //     } else {
  //       storeValue = String(value);
  //     }
  //     // Set with or without TTL
  //     if (typeof ttl === "number") {
  //       await redis.set(key, storeValue, { ex: ttl });
  //     } else {
  //       await redis.set(key, storeValue);
  //     }
  //   },
  //   delete: async (key) => {
  //     // Delete a key from Redis
  //     await redis.del(key);
  //   },
  // },
  plugins: [
    organization({
      // Optional: Configure the organization
    }),
    multiSession({
      // Optional: Configure the multi-session
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
    },
  }),
  advanced: {
    generateId: () => {
      return crypto.randomUUID();
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
});
