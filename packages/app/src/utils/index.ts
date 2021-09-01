import { BigNumber } from "ethers";
import { id } from "ethers/lib/utils";

export const getTokenId = (color: string, object: string) =>
  BigNumber.from(id(color + object));
