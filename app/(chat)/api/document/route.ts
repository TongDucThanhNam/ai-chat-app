import { auth } from "@/auth";
import type { ArtifactKind } from "@/components/artifact/artifact";
import {
  // deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from "@/lib/db/queries";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  }); // console.log("Session: ", session);

  if (!session || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  if (!document) {
    console.log("Document not found");
    return new Response("Not Found", { status: 404 });
  }

  // console.log("Document vs Session", document.userId, session.user.id);

  if (document.userId !== session.user.id) {
    console.log("This is not your document");
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json(documents, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  }); // console.log("Session: ", session);

  if (!session?.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const {
    content,
    title,
    kind,
  }: { content: string; title: string; kind: ArtifactKind } =
    await request.json();

  const documents = await getDocumentsById({ id: id });

  if (documents.length > 0) {
    const [document] = documents;

    if (document.userId !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  const document = await saveDocument({
    id,
    content,
    title,
    kind,
    userId: session.user.id,
  });

  if (!document) {
    return new Response("Failed to save document", { status: 500 });
  }

  return Response.json(document, { status: 200 });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const { timestamp }: { timestamp: string } = await request.json();

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  }); // console.log("Session: ", session);

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  if (document.userId !== session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // await deleteDocumentsByIdAfterTimestamp({
  //   id,
  //   timestamp: new Date(timestamp),
  // });
  console.log("Deleting documents but not implement yet");

  return new Response("Deleted", { status: 200 });
}
