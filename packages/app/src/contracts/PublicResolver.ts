import { Contract } from "ethers";

import PublicResolverAbi from "./abis/PublicResolver.json";

export default function PublicResolver(chainId: number) {
  const address =
    chainId === 1
      ? "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41"
      : "0xf6305c19e814d2a75429Fd637d01F7ee0E77d615";
  return new Contract(address, PublicResolverAbi);
}
