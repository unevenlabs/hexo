import { Signer } from "ethers";

import Hexo from "../contracts/Hexo";
import ReverseRegistrar from "../contracts/ReverseRegistrar";
import { getTokenId } from "../utils";

type Item = {
  color: string;
  object: string;
};

export const buyItems = async (signer: Signer, items: Item[]) => {
  const chainId = await signer.getChainId();
  const hexo = Hexo(chainId);

  const price = await hexo.connect(signer).price();

  return hexo.connect(signer).buyItems(
    items.map((item) => item.color),
    items.map((item) => item.object),
    { value: price.mul(items.length) }
  );
};

export const claimENSSubdomains = async (signer: Signer, items: Item[]) => {
  const chainId = await signer.getChainId();
  const hexo = Hexo(chainId);

  return hexo.connect(signer).claimENSSubdomains(
    items.map((item) => item.color),
    items.map((item) => item.object)
  );
};

export const setCustomImageURI = async (
  signer: Signer,
  item: Item,
  imageURI: string
) => {
  const chainId = await signer.getChainId();
  const hexo = Hexo(chainId);

  return hexo
    .connect(signer)
    .setCustomImageURI(getTokenId(item.color, item.object), imageURI);
};

export const setReverseRecord = async (signer: Signer, item: Item) => {
  const chainId = await signer.getChainId();
  const reverseRegistrar = ReverseRegistrar(chainId);

  return reverseRegistrar
    .connect(signer)
    .setName(`${item.color}${item.object}.hexo.eth`);
};
