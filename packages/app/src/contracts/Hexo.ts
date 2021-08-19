import { Contract } from "ethers";

import HexoAbi from "./abis/Hexo.json";

export default function Hexo(chainId: number) {
  const address =
    chainId === 1
      ? // TODO: Change when deployed to Mainnet
        "0xe5f14510238A8B46e1DA14CA736bd0052B359619"
      : "0xe5f14510238A8B46e1DA14CA736bd0052B359619";
  return new Contract(address, HexoAbi);
}
