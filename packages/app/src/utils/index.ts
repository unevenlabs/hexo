import { BigNumber } from "ethers";
import { id } from "ethers/lib/utils";

export const capitalize = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1)}`;

export const getTokenId = (color: string, object: string) =>
  BigNumber.from(id(color + object));
