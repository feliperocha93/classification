import fs from "fs";
import knnClassifier from "./classifier.js";
import { imgEmbedder } from "./embedder.js";

let knowledgeBase = [];

async function init() {
  const embeddings = JSON.parse(
    fs.readFileSync("./knn/embeddings.json", "utf8")
  );
  knowledgeBase = embeddings.filter((e) => e.split === "train");

  await imgEmbedder.loadInstance();
}

async function classify(path, k = 5) {
  return await knnClassifier(path, knowledgeBase, k);
}

export { init, classify };
