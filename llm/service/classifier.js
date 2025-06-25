import express from "express";

import { classify as KNNClassify, init as KNNinit } from "./knn/api.js";
import { classify as LLMClassify } from "./llm/api.js";

const app = express();
const port = 3000;

app.use(express.json());

KNNinit();

app.get("/", (req, res) => {
  res.send("Hello, this is the classifier service!");
});

app.post("/classify", async (req, res) => {
  const method = req.body?.method.toLowerCase();
  const path = req.body?.path;
  console.log(`Received classification request for method: ${method}`);

  let category;
  if (method === "llm") {
    category = await LLMClassify(path);
  } else if (method === "knn") {
    category = await KNNClassify(path, 5);
  } else {
    return res.send({ error: "Unknown method" });
  }

  res.send({ result: category });
});

app.listen(port, () => {
  console.log(`Classifier service is running at http://localhost:${port}`);
});
