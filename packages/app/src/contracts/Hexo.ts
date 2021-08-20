import { Contract } from "ethers";

import HexoAbi from "./abis/Hexo.json";

export default function Hexo(chainId: number) {
  const address =
    chainId === 1
      ? // TODO: Change when deployed to Mainnet
        "0x03abae7f74CB7ac257c23E850d4dcB748b7a9244"
      : "0x03abae7f74CB7ac257c23E850d4dcB748b7a9244";
  return new Contract(address, HexoAbi);
}
