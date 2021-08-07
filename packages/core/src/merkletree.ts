import * as ethers from "ethers";
import MerkleTree from "merkletreejs";

export const constructMerkleTree = (items: string[]) => {
  const keccak256 = (x: Buffer) =>
    Buffer.from(ethers.utils.keccak256(x).slice(2), "hex");
  const leaves = items.map((item) =>
    Buffer.from(ethers.utils.id(item).slice(2), "hex")
  );
  return new MerkleTree(leaves, keccak256, { sortPairs: true });
};
