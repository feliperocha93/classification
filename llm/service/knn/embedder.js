import { pipeline } from "@huggingface/transformers";

export class imgEmbedder {
  static task = "image-feature-extraction";
  static model = "Xenova/clip-vit-base-patch32";
  static options = {
    dtype: "fp32",
  };
  static pooling = "cls";
  static normalize = true;

  static pipeline = null;

  static async loadInstance() {
    if (this.pipeline === null) {
      this.pipeline = await pipeline(this.task, this.model, this.options);
    }
    return this.pipeline;
  }

  static async embedImg(imgPath) {
    const config = {
      pooling: this.pooling,
      normalize: this.normalize,
    };
    return this.pipeline(imgPath, config).then((t) => t.tolist()[0]);
  }
}
