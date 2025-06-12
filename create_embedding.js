import { pipeline } from "@huggingface/transformers";
import fs from "fs";

const imgEmbedder = await pipeline(
  "image-feature-extraction",
  "Xenova/clip-vit-base-patch32",
  {
    dtype: "fp32",
  }
);

async function embedImg(imgs) {
  return imgEmbedder(imgs, { pooling: "cls", normalize: true }).then((t) =>
    t.tolist()
  );
}

const images = fs.readdirSync("train").map((f) => `train/${f}`);

let startIndex = 0;

while (startIndex < images.length) {
  let endIndex = startIndex + 500;

  console.log(`Processing images from ${startIndex} to ${endIndex}...`);

  let imagesToEmbed = images.slice(startIndex, endIndex);

  const embeddings = await embedImg(imagesToEmbed);
  const output = [];

  for (let i = 0; i < embeddings.length; i++) {
    output.push({
      path: images[startIndex + i],
      embedding: embeddings[i],
    });
  }

  fs.writeFileSync(
    `embeddings/${startIndex}_${endIndex}.json`,
    JSON.stringify(output, null, 2)
  );

  startIndex = endIndex;
}
