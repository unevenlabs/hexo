import { id } from "ethers/lib/utils";
import { ethers } from "hardhat";

import colors from "../data/colors.json";
import objects from "../data/objects.json";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  const hexo = await ethers.getContractAt(
    "Hexo",
    "0x349a3154FbE62Dcba32D522091a87Fca333DC4e9"
  );

  await hexo.connect(deployer).addColors(colors.map(id));
  await hexo.connect(deployer).addObjects(objects.map(id));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
