import { Contract } from "ethers";

import HexoAbi from "./abis/Hexo.json";

export default function Hexo(chainId: number) {
  const address =
    chainId === 1
      ? // TODO: Change when deployed to Mainnet
        "0x26e014a8256BFBc5f4136c01b0C189D329969aA8"
      : "0x26e014a8256BFBc5f4136c01b0C189D329969aA8";
  return new Contract(address, HexoAbi);
}
