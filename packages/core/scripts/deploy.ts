import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

import { deployContract } from "../src/deployment";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  const hexo = await deployContract({
    name: "Hexo",
    from: deployer,
    args: [
      parseEther("0.08"),
      "https://hexo-ptrwtts.vercel.app/api/metadata/",
      "https://hexo-ptrwtts.vercel.app/api/image/",
    ],
  });

  console.log(`Deployed at ${hexo.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
