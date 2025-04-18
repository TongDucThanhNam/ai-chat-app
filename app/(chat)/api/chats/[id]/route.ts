import { headers } from "next/headers";
import { auth } from "@/auth";
import {
  getProjectsByUserId,
  getUnassignedChatsByUserId,
} from "@/lib/db/queries";

export async function GET() {
  console.log("Get project API");
  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session || !session.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const projects = await getProjectsByUserId(session.user.id);
  const unassignedChat = await getUnassignedChatsByUserId(session.user.id);
  return Response.json({ projects, unassignedChat });
}
