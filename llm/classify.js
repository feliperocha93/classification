import { GoogleGenAI, Type } from "@google/genai";
import fs, { read } from "fs";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const embeddings = JSON.parse(fs.readFileSync("../embeddings.json", "utf8"));

const testPaths = embeddings
  .filter((e) => e.split === "test")
  .map((e) => ".." + e.path.slice(1));

function readImg(path) {
  return fs.readFileSync(path, { encoding: "base64" });
}

const toInlineData = (imgBase64) => {
  return {
    inlineData: {
      mimeType: "image/jpeg",
      data: imgBase64,
    },
  };
};

const prompt = `
You are an expert animal classifier. Given an image of an animal,
classify it into one of the following classes: "cat", "dog".
Also, provide the primary color of the animal in the image.
`;

const config = {
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

async function llmRequest(contents) {
  const response = await genai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
    config,
  });

  return response;
}

async function llmClassifier(path) {
  const imgBase64 = readImg(path);
  const imgInlineData = toInlineData(imgBase64);
  const contents = [imgInlineData, { text: prompt }];
  const response = await llmRequest(contents);
  return await JSON.parse(response.text)[0]["class"];
}

console.log(await llmClassifier(testPaths[0]));
