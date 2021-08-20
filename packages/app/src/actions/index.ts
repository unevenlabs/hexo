import { Signer, constants } from "ethers";

import Hexo from "../contracts/Hexo";
import ReverseRegistrar from "../contracts/ReverseRegistrar";
import { getTokenId } from "../utils";

type Item = {
  color: string;
  object: string;
};

export const mintItems = async (signer: Signer, items: Item[]) => {
  const chainId = await signer.getChainId();
  const hexo = Hexo(chainId);

  for (const item of items) {
    const owner = await hexo.ownerOf(getTokenId(item.color, item.object));
    if (owner !== constants.AddressZero) {
      throw new Error("Item already minted");
    }
  }

  const price = await hexo.connect(signer).price();

  return hexo.connect(signer).mintItems(
    items.map((item) => item.color),
    items.map((item) => item.object),
    { value: price.mul(items.length) }
  );
};

export const claimSubdomains = async (signer: Signer, items: Item[]) => {
  const chainId = await signer.getChainId();
  const hexo = Hexo(chainId);

  const signerAddress = await signer.getAddress();
  for (const item of items) {
    const owner = await hexo.ownerOf(getTokenId(item.color, item.object));
    if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
      throw new Error("Item not owned");
    }
  }

  return hexo.connect(signer).claimSubdomains(
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

  const signerAddress = await signer.getAddress();
  const owner = await hexo.ownerOf(getTokenId(item.color, item.object));
  if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
    throw new Error("Item not owned");
  }

  return hexo
    .connect(signer)
    .setCustomImageURI(getTokenId(item.color, item.object), imageURI);
};

export const setReverseRecord = async (signer: Signer, item: Item) => {
  const chainId = await signer.getChainId();
  const hexo = Hexo(chainId);
  const reverseRegistrar = ReverseRegistrar(chainId);

  const signerAddress = await signer.getAddress();
  const owner = await hexo.ownerOf(getTokenId(item.color, item.object));
  if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
    throw new Error("Item not owned");
  }

  return reverseRegistrar
    .connect(signer)
    .setName(`${item.color}${item.object}.hexo.eth`);
};
