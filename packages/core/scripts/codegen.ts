import * as ethers from "ethers";
import fs from "fs/promises";

import objects from "./data/objects.json";

const codegenObjects = async () => {
  let solidityCode = "";
  for (const object of objects) {
    const hash = ethers.utils.id(object);
    const comment = `// keccak256("${object}")`;
    const assignment = `objects[${hash}] = 1;`;
    solidityCode = solidityCode + "\n" + comment + "\n" + assignment;
  }
  await fs.writeFile("./scripts/data/objects.sol", solidityCode);
};

const main = async () => {
  await codegenObjects();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
