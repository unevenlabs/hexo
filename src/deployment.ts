import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";

type ContractDeploymentParams = {
  name: string;
  from: Signer;
  args?: any[];
};

export const deployContract = async <T extends Contract>({
  name,
  from,
  args,
}: ContractDeploymentParams): Promise<T> => {
  const contractFactory = await ethers.getContractFactory(name, from);
  const contractInstance = await contractFactory.deploy(...(args || []));
  return (await contractInstance.deployed()) as T;
};
