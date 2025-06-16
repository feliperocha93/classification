import { cos_sim } from "@huggingface/transformers";
import embedImg from "./embedder.js";

function compare(testEmbedding, knowledgeBase) {
  let distances = [];

  for (let embedding of knowledgeBase) {
    const distance = cos_sim(testEmbedding, embedding.embedding);

    distances.push({
      distance,
      class: embedding.class,
    });
  }

  return distances;
}

function getKNearestNeighbors(distances, k = 5) {
  return distances.sort((a, b) => a.distance - b.distance).slice(0, k);
}

function countClasses(knn) {
  const classCounts = {};

  for (let neighbor of knn) {
    if (!classCounts[neighbor.class]) {
      classCounts[neighbor.class] = 0;
    }
    classCounts[neighbor.class]++;
  }

  return classCounts;
}

function getMaxClass(classCounts) {
  let maxClass = null;
  let maxCount = 0;

  for (let className in classCounts) {
    if (classCounts[className] > maxCount) {
      maxCount = classCounts[className];
      maxClass = className;
    }
  }

  return maxClass;
}

export default async function knnClassifier(path, knowledgeBase, k = 5) {
  const embedding = await embedImg(path);
  const distances = compare(embedding, knowledgeBase);
  const knn = getKNearestNeighbors(distances, k);
  const classCounts = countClasses(knn);
  const predictedClass = getMaxClass(classCounts);
  return predictedClass;
}
