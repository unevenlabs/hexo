import { Contract } from "ethers";

import ReverseRegistrarAbi from "./abis/ReverseRegistrar.json";

export default function ReverseRegistrar(chainId: number) {
  const address =
    chainId === 1
      ? "0x084b1c3c81545d370f3634392de611caabff8148"
      : "0x6f628b68b30dc3c17f345c9dbbb1e483c2b7ae5c";
  return new Contract(address, ReverseRegistrarAbi);
}
