import { Contract } from "ethers";

import HexoAbi from "./abis/Hexo.json";

export default function Hexo(chainId: number) {
  const address =
    chainId === 1
      ? "0x819327e005a3ed85f7b634e195b8f25d4a2a45f8"
      : "0x349a3154FbE62Dcba32D522091a87Fca333DC4e9";
  return new Contract(address, HexoAbi);
}
