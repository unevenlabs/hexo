import { id } from "ethers/lib/utils";
import { ethers } from "hardhat";

import colors from "../data/colors.json";
import objects from "../data/objects.json";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  const hexo = await ethers.getContractAt(
    "Hexo",
    "0xe5f14510238A8B46e1DA14CA736bd0052B359619"
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
