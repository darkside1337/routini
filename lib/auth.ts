/* 
  lib/auth.ts
*/
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins/username";
import { nextCookies } from "better-auth/next-js";
import prisma from "./db";
import { generateUsername } from "./helpers";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      displayName: {
        type: "string",
        required: false,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "email-password"],
    },
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "",
    process.env.NEXT_PUBLIC_APP_URL || "",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://192.168.1.*:*",
    "http://192.168.*.*:*",
    "https://*.ngrok-free.app",
    "https://*.ngrok-free.dev",
    "https://*.trycloudflare.com",
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
      ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",")
      : []),
  ].filter(Boolean),
  plugins: [username({}), nextCookies()],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.name && !user.username) {
            const generatedUsername = generateUsername(user.name);
            await prisma.user.update({
              where: { id: user.id },
              data: { username: generatedUsername, displayName: user.name },
            });
          }
        },
      },
    },
  },
});
