import {
  multiSessionClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** the base url of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    // Optional: Specify the name of the organization table
    organizationClient({
      // Optional: Specify the name of the organization table
    }),
    // Optional: Multi-session plugin
    multiSessionClient(),
  ],
});

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  organization,
  useListOrganizations,
  useActiveOrganization,
} = authClient;

export type ActiveOrganization = typeof authClient.$Infer.ActiveOrganization;
export type Session = typeof authClient.$Infer.Session;
