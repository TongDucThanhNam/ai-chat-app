import { Artifact } from "@/components/artifact/create-artifact";
import { CopyIcon, RedoIcon, UndoIcon } from "@/components/icons/icons";
import { ImageEditor } from "@/components/artifact/image/image-editor";
import { toast } from "sonner";

export const imageArtifact = new Artifact({
  kind: "image",
  description: "Useful for image generation",
  initialize: async ({ documentId, setMetadata }) => {
    // For example, initialize the artifact with default metadata.
    setMetadata({
      info: `Document ${documentId} initialized.`,
    });
  },
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "image-delta") {
      setArtifact((draftArtifact: any) => ({
        ...draftArtifact,
        content: streamPart.content as string,
        isVisible: true,
        status: "streaming",
      }));
    }
  },
  content: ImageEditor,
  actions: [
    {
      icon: <UndoIcon size={18} />,
      description: "View Previous version",
      onClick: ({ handleVersionChange }) => {
        handleVersionChange("prev");
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: "View Next version",
      onClick: ({ handleVersionChange }) => {
        handleVersionChange("next");
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
  ],
  toolbar: [
    {
      description: "Undo",
      icon: <UndoIcon size={18} />,
      onClick: ({ appendMessage }) => {},
    },
    {
      description: "Redo",
      icon: <RedoIcon size={18} />,
      onClick: ({ appendMessage }) => {},
    },
    {
      description: "Copy",
      icon: <CopyIcon size={18} />,
      onClick: ({ appendMessage }) => {},
    },
  ],
});
