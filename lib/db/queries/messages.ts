// ----------------------------------------------------------------
// Message queries
import { Message, messageTable } from "@/lib/db/schema";
import { asc, eq, desc } from "drizzle-orm";
import { db } from "@/config/db";
import { Message as DBMessage } from "@/lib/db/schema/messageSchema";
import { documentTable } from "@/lib/db/schema";
import { ArtifactKind } from "@/components/artifact/artifact";

export async function saveMessages({
  myMessages,
}: {
  myMessages: Array<DBMessage>;
}) {
  try {
    return await db.insert(messageTable).values(myMessages);
  } catch (error) {
    console.error("Failed to save messageTable in database", error);
    throw error;
  }
}

export async function getMessagesByChatId({
  id,
}: {
  id: string;
}): Promise<Message[]> {
  try {
    return await db
      .select()
      .from(messageTable)
      .where(eq(messageTable.chatId, id))
      .orderBy(asc(messageTable.createdAt));
  } catch (error) {
    console.error("Failed to get messageTable by chat id from database", error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    console.log("Trying to save document in database", {
      id,
      title,
      kind,
      content,
      userId,
    });

    return await db.insert(documentTable).values({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to save document in database");
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(documentTable)
      .where(eq(documentTable.id, id))
      .orderBy(asc(documentTable.createdAt));

    return documents;
  } catch (error) {
    console.error("Failed to get document by id from database");
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(documentTable)
      .where(eq(documentTable.id, id))
      .orderBy(desc(documentTable.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error("Failed to get document by id from database");
    throw error;
  }
}

// export async function deleteDocumentsByIdAfterTimestamp({
//   id,
//   timestamp,
// }: {
//   id: string;
//   timestamp: Date;
// }) {
//   try {
//     await db
//       .delete(suggestion)
//       .where(
//         and(
//           eq(suggestion.documentId, id),
//           gt(suggestion.documentCreatedAt, timestamp),
//         ),
//       );

//     return await db
//       .delete(document)
//       .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
//   } catch (error) {
//     console.error(
//       "Failed to delete documents by id after timestamp from database",
//     );
//     throw error;
//   }
// }
