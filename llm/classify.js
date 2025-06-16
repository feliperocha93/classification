import { GoogleGenAI, Type } from "@google/genai";
import fs, { read } from "fs";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const embeddings = JSON.parse(fs.readFileSync("../embeddings.json", "utf8"));

const testInstances = embeddings
  .filter((e) => e.split === "test")
  .map((e) => {
    return {
      path: ".." + e.path.slice(1),
      trueClass: e.class,
    };
  });

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

function calculateAccuracy(predictedClasses) {
  let correct = 0;

  for (let predicted of predictedClasses) {
    if (predicted.predictedClass === predicted.trueClass) {
      correct++;
    }
  }

  return (correct / predictedClasses.length) * 100;
}

let startIndex = 0;
while (startIndex < testInstances.length) {
  let endIndex = startIndex + 10;

  console.log(`Processing images from ${startIndex} to ${endIndex}...`);

  let request = testInstances
    .slice(startIndex, endIndex)
    .map((i) => llmClassifier(i["path"]));

  await Promise.all(request);

  for (let i = 0; i < testInstances.length; i++) {
    testInstances[i].predictedClass = await request[i];
  }

  startIndex = endIndex;
}

console.log(calculateAccuracy(testInstances));
