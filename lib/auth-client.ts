import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

// Dynamically get the base URL from the browser
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
};

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: getBaseURL(),

  plugins: [usernameClient()],
});
export const { signIn, signUp, signOut, useSession } = authClient;
