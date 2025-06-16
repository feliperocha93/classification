import fs from "fs";
import knnClassifier from "./classifier.js";

let knowledgeBase = [];

function init() {
  const embeddings = JSON.parse(
    fs.readFileSync("./knn/embeddings.json", "utf8")
  );
  knowledgeBase = embeddings.filter((e) => e.split === "train");
}

async function classify(path, k = 5) {
  return await knnClassifier(path, knowledgeBase, k);
}

export { init, classify };
