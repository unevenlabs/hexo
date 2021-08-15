import { Signer } from "ethers";

import Hexo from "../contracts/Hexo";

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

export default async function (signer: Signer, items: Item[]) {
  const chainId = await signer.getChainId();
  const hexo = Hexo(chainId);

  return hexo.connect(signer).claimENSSubdomains(
    items.map((item) => item.color),
    items.map((item) => item.object)
  );
}
