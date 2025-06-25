import { GoogleGenAI } from "@google/genai";

import { prompt, config } from "./config.js";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function readImg(path) {
  const response = await fetch(path);
  const buffer = await response.arrayBuffer();
  const imageBase64 = Buffer.from(buffer).toString("base64");

  return imageBase64;
}

const toInlineData = (imgBase64) => {
  return {
    inlineData: {
      mimeType: "image/jpeg",
      data: imgBase64,
    },
  };
};

export async function llmRequest(contents) {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    throw new Error("GOOGLE_GENAI_API_KEY is not set");
  }
  const response = await genai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
    config,
  });

  return response;
}

export default async function llmClassifier(path) {
  const imgBase64 = await readImg(path);
  const imgInlineData = toInlineData(imgBase64);
  const contents = [imgInlineData, { text: prompt }];
  const response = await llmRequest(contents);
  return await JSON.parse(response.text)[0]["class"];
}
