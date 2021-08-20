import { Contract } from "ethers";

import HexoAbi from "./abis/Hexo.json";

export default function Hexo(chainId: number) {
  const address =
    chainId === 1
      ? // TODO: Change when deployed to Mainnet
        "0xf1cA53EAFa2ce45AEC945B633A589d507Ce1f6Dd"
      : "0xf1cA53EAFa2ce45AEC945B633A589d507Ce1f6Dd";
  return new Contract(address, HexoAbi);
}
