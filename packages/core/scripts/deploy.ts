import { parseEther } from "ethers/lib/utils";
import { ethers, run } from "hardhat";

import { deployContract } from "../src/deployment";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  const args = [
    parseEther("0.033"),
    "ipfs://bafybeif7xi3sy23t2bacxxeeq2quzbzbfhr6lx7urot2noavftpiyopsiq/",
  ];

  const hexo = await deployContract({
    name: "Hexo",
    from: deployer,
    args,
  });

  // Wait for the deployment block to propagate so that verification won't fail
  await new Promise((resolve) => setTimeout(resolve, 30000));

  await run("verify:verify", {
    address: hexo.address,
    constructorArguments: args,
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
