import llmClassifier from "./classifier.js";

async function classify(path) {
  return await llmClassifier(path);
}

export { classify };
