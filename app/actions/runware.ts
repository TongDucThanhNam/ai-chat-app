"use server";

import { v4 as uuidv4 } from "uuid";

export interface ImageGenOptions {
  positivePrompt?: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  model?: string;
  numberResults?: number;
}

export async function imageGen(
  options: ImageGenOptions = {
    positivePrompt: "a beautiful landscape",
    negativePrompt: "bad weather",
    width: 512,
    height: 512,
  },
): Promise<string[]> {
  console.log("imageGen called with options:", options);

  // Get API key from environment variable
  const apiKey = process.env.RUNWARE_API_KEY;

  if (!apiKey) {
    throw new Error("RUNWARE_API_KEY environment variable is not set");
  }

  // Generate a unique task UUID
  const taskUUID = uuidv4();

  // Prepare the request payload
  const payload = [
    {
      taskType: "authentication",
      apiKey,
    },
    {
      taskType: "imageInference",
      taskUUID,
      width: options.width || 1024, // Default width if not provided
      height: options.height || 1024, // Default height if not provided
      numberResults: options.numberResults || 1, // Default number of results
      outputFormat: "JPEG", // Default output format
      steps: 4, // Default steps
      CFGScale: 1, // Default CFG scale
      scheduler: "Euler Beta", // Default scheduler
      outputType: ["URL"], // Always request URL output
      includeCost: true, // Include cost information in the response
      positivePrompt: options.positivePrompt || "", // Use provided positive prompt or empty string
      negativePrompt: options.negativePrompt || "", // Use provided negative prompt or empty string
      model: options.model || "rundiffusion:110@101", // Default model
    },
  ];

  try {
    // Make the API request with proper connection handling
    const controller = new AbortController();
    const signal = controller.signal;

    const response = await fetch("https://api.runware.ai/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Connection: "close", // Explicitly close the connection after use
      },
      body: JSON.stringify(payload),
      signal,
      keepalive: false, // Prevent connection reuse
    });

    // Set a timeout to abort the request if it takes too long
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      // Parse the response
      const result = await response.json();
      // Check if the response is ok
      if (!response.ok) {
        throw new Error(
          `API request failed with status: ${response.status} ${response.statusText}`,
        );
      }

      // Check for errors
      if (!result.data) {
        throw new Error(result.error || "Unknown error occurred");
      }

      // Extract and return image URLs
      const imageUrls = result.data
        .filter((item: any) => item.taskType === "imageInference")
        .map((item: any) => item.imageURL);

      console.log("Generated images:", imageUrls);
      return imageUrls;
    } finally {
      // Clean up the timeout
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
}
