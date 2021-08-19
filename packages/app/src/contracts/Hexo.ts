import { Contract } from "ethers";

import HexoAbi from "./abis/Hexo.json";

export default function Hexo(chainId: number) {
  const address =
    chainId === 1
      ? // TODO: Change when deployed to Mainnet
        "0x6b4dAC761fD89664A75A33064e172F7D8c772E0d"
      : "0x6b4dAC761fD89664A75A33064e172F7D8c772E0d";
  return new Contract(address, HexoAbi);
}
