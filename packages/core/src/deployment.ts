import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";

type ContractDeploymentParams = {
  name: string;
  from: Signer;
  args?: any[];
  libraries?: any;
};

export const deployContract = async <T extends Contract>({
  name,
  from,
  args,
  libraries,
}: ContractDeploymentParams): Promise<T> => {
  const contractFactory = await ethers.getContractFactory(name, {
    libraries,
  });
  const contractInstance = await contractFactory
    .connect(from)
    .deploy(...(args || []));
  return (await contractInstance.deployed()) as T;
};
