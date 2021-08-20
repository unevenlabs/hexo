import { BigNumber } from "ethers";
import { id } from "ethers/lib/utils";
import fs from "fs";

import colors from "../data/colors.json";
import objects from "../data/objects.json";

const main = async () => {
  for (const color of colors) {
    for (const object of objects) {
      const tokenId = BigNumber.from(id(color + object));
      fs.copyFile(
        `./public/images/${color}/${object}.svg`,
        `./public/images/tokens/${tokenId.toString()}`,
        () => {}
      );
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
