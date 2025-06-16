import { classify, init } from "./knn/api.js";

const example =
  "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRYsTCZAfCg8v3AWG5JJy68Nge5gIUdaQNl7bZ81RHjOKEqQ2sDGVpCYrAj-aFvjJdMor8MlmPYDXYwwsAvfKa6gw";

await init();
const oi = await classify(example, 5);

console.log(oi);
