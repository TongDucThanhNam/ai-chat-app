import { generateUUID } from "@/lib/utils";
import { DataStreamWriter, tool } from "ai";
import { z } from "zod";
import {
  artifactKinds,
  documentHandlersByArtifactKind,
} from "@/lib/artifacts/server";
import { Session } from "better-auth/types";

interface CreateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const createDocument = ({ session, dataStream }: CreateDocumentProps) =>
  tool({
    // Description for AI Model can understand and use the tool
    description:
      "Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.",
    parameters: z.object({
      title: z.string(),
      kind: z.enum(artifactKinds),
    }),
    execute: async ({ title, kind }) => {
      const id = generateUUID();
      console.log("Creating document:");
      // console.log("Session:", session);

      dataStream.writeData({
        type: "kind",
        content: kind,
      });

      dataStream.writeData({
        type: "id",
        content: id,
      });

      dataStream.writeData({
        type: "title",
        content: title,
      });

      // If a prompt is provided, send it to the data stream
      // if (prompt) {
      //   dataStream.writeData({
      //     type: "prompt",
      //     content: prompt,
      //   });
      // }

      dataStream.writeData({
        type: "clear",
        content: "",
      });

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === kind,
      );

      if (!documentHandler) {
        throw new Error(`No document handler found for kind: ${kind}`);
      }

      await documentHandler.onCreateDocument({
        id,
        title,
        dataStream,
        session,
      });

      dataStream.writeData({ type: "finish", content: "" });

      return {
        id,
        title,
        kind,
        content: "A document was created and is now visible to the user.",
      };
    },
  });
