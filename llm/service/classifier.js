import express from "express";
import cors from "cors";

import { classify as KNNClassify, init as KNNinit } from "./knn/api.js";
import { classify as LLMClassify } from "./llm/api.js";

const app = express();
const port = 3000;

KNNinit();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

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
    const k = req.body?.k || 5;
    category = await KNNClassify(path, k);
  } else {
    return res.send(400).send({ error: "Unknown method" });
  }

  res.send({ result: category });
});

app.listen(port, () => {
  console.log(`Classifier service is running at http://localhost:${port}`);
});
