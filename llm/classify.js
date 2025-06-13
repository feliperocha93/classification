import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
  Type,
} from "@google/genai";
import fs from "fs";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const embeddings = JSON.parse(fs.readFileSync("../embeddings.json", "utf8"));

const testEmbeddings = embeddings
  .filter((e) => e.split === "test")
  .map((e) => ".." + e.path.slice(1));

const image = await genai.files.upload({
  file: testEmbeddings[0],
  config: {
    mimeType: "image/jpeg",
  },
});

const response = await genai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: createUserContent([
    createPartFromUri(image.uri, image.mimeType),
    `
You are a classifier that can classify images into one of the following classes: ${[
      ...new Set(embeddings.map((e) => e.class)),
    ].join(", ")}.
Classify the image above and return the class name and the animal color.
Do not return any other information.
    `,
  ]),
  config: {
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
  },
});

console.log(response.text);
