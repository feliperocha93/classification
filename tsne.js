import TSNE from "tsne-js";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

let embeddings = JSON.parse(fs.readFileSync("embeddings.json", "utf8"));

let tsneInput = [];

for (let embedding of embeddings) {
  if (embedding.number > 500 && embedding.number < 1000) {
    tsneInput.push(embedding);
  }
}

let model = new TSNE({
  dim: 2,
  perplexity: 30.0,
  earlyExaggeration: 4.0,
  learningRate: 100.0,
  nIter: 1000,
  metric: "euclidean",
});

model.init({
  data: tsneInput.map((e) => e.embedding),
  type: "dense",
});

model.run();

let output = model.getOutput();

let csv = [];

for (let i = 0; i < output.length; i++) {
  csv.push({
    class: tsneInput[i].class == "dog" ? "brown" : "gray",
    x: output[i][0],
    y: output[i][1],
  });
}

const csvWriter = createObjectCsvWriter({
  path: "tsne_output.csv",
  header: [
    { id: "class", title: "color" },
    { id: "x", title: "X" },
    { id: "y", title: "Y" },
  ],
});

await csvWriter.writeRecords(csv);
