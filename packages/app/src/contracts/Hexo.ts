import { Contract } from "ethers";

import HexoAbi from "./abis/Hexo.json";

export default function Hexo(chainId: number) {
  const address =
    chainId === 1
      ? // TODO: Change when deployed to Mainnet
        "0x349a3154FbE62Dcba32D522091a87Fca333DC4e9"
      : "0x349a3154FbE62Dcba32D522091a87Fca333DC4e9";
  return new Contract(address, HexoAbi);
}
