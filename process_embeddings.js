import fs from "fs";

const files = fs.readdirSync("embeddings").map((f) => `embeddings/${f}`);

let embeddings = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  embeddings = embeddings.concat(data);
}

embeddings.map((e) => {
  e.class = e.path.includes("cat") ? "cat" : "dog";
  e.number = parseInt(/(\d+)/.exec(e.path));
  e.split = e.number < 500 ? "test" : "train";
  return e;
});

fs.writeFileSync("./embeddings.json", JSON.stringify(embeddings));
