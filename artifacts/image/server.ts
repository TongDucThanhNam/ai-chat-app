import { imageGen } from "@/app/actions/runware";
import { artifactsPromptForImage } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";
import { generateText } from "ai";

export const imageDocumentHandler = createDocumentHandler<"image">({
  kind: "image",
  onCreateDocument: async ({ title, dataStream }) => {
    console.log("Creating image document...");

    // Use LLM model to describe the image
    const { text: imagePrompt } = await generateText({
      model: myProvider.languageModel("chat-model"),
      system: artifactsPromptForImage,
      prompt: title,
    });

    // After get the prompt, generate the image
    const images = await imageGen({
      positivePrompt: imagePrompt,
      negativePrompt: "bad quality",
      height: 512,
      width: 512,
    });

    // console.log("Generated images:", images);

    const imageURL = images[0] || "";

    if (!imageURL) {
      throw new Error("Image generation failed");
    }
    console.log("Generated image URL:", imageURL);

    dataStream.writeData({
      type: "image-delta",
      content: imageURL,
    });

    return imageURL;
  },
  onUpdateDocument: async ({ description, dataStream }) => {
    console.log("Updating image document...");

    // Use LLM model to describe the image
    const { text: imagePrompt } = await generateText({
      model: myProvider.languageModel("artifact-model"),
      system: artifactsPromptForImage,
      prompt: description,
    });

    // After get the prompt, generate the image
    const images = await imageGen({
      positivePrompt: imagePrompt,
      negativePrompt: "bad quality",
      height: 512,
      width: 512,
    });

    console.log("Generated images:", images);

    const imageURL = images[0] || "";

    if (!imageURL) {
      throw new Error("Image generation failed");
    }
    // console.log("Generated image URL:", imageURL);

    dataStream.writeData({
      type: "image-delta",
      content: imageURL,
    });

    return imageURL;
  },
});
