import * as ethers from "ethers";

const { HashZero } = ethers.constants;
const { concat, keccak256, toUtf8Bytes } = ethers.utils;

export const namehash = (labels: string[]): string => {
  if (labels.length === 0) {
    return HashZero;
  } else {
    return keccak256(
      concat([namehash(labels.slice(1)), keccak256(toUtf8Bytes(labels[0]))])
    );
  }
};
