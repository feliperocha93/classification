import { cos_sim } from "@huggingface/transformers";
import fs from "fs";

const embeddings = JSON.parse(fs.readFileSync("embeddings.json", "utf8"));
const trainEmbeddings = embeddings.filter((e) => e.split === "train");
const testEmbeddings = embeddings.filter((e) => e.split === "test");

function compare(testEmbedding, trainEmbeddings) {
  let distances = [];

  for (let trainEmbedding of trainEmbeddings) {
    const distance = cos_sim(testEmbedding.embedding, trainEmbedding.embedding);

    distances.push({
      distance,
      class: trainEmbedding.class,
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

function knnClassifier(testEmbedding, k = 5) {
  const distances = compare(testEmbedding, trainEmbeddings.slice(0, 50));
  const knn = getKNearestNeighbors(distances, k);
  const classCounts = countClasses(knn);
  const predictedClass = getMaxClass(classCounts);
  return predictedClass;
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

let predictedClasses = [];

for (let testEmbedding of testEmbeddings) {
  const predictedClass = knnClassifier(testEmbedding);

  predictedClasses.push({
    predictedClass,
    trueClass: testEmbedding.class,
  });
}

console.log(calculateAccuracy(predictedClasses).toFixed(2) + "% accuracy");
