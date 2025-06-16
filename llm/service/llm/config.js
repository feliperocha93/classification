import { Type } from "@google/genai";

export const prompt = `
You are an expert animal classifier. Given an image of an animal,
classify it into one of the following classes: "cat", "dog".
Also, provide the primary color of the animal in the image.
`;

export const config = {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        class: {
          type: Type.STRING,
          description: "The predicted class of the image.",
        },
        color: {
          type: Type.STRING,
          description: "The predicted color of the animal in the image.",
        },
      },
    },
  },
};
