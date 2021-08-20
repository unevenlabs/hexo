import { store } from "@graphprotocol/graph-ts";

import { Item } from "../generated/schema";
import {
  CustomImageURISet,
  ItemBought,
  Transfer,
} from "../generated/Hexo/Hexo";

let ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export function handleCustomImageURISet(event: CustomImageURISet): void {
  let tokenId = event.params.tokenId.toString();

  let item = Item.load(tokenId);
  item.customImageURI = event.params.customImageURI;
  item.save();
}

export function handleItemBought(event: ItemBought): void {
  let tokenId = event.params.tokenId.toString();

  let item = Item.load(tokenId);
  if (!item) {
    item = new Item(tokenId);
  }
  item.color = event.params.color;
  item.object = event.params.object;
  item.generation = event.params.generation;
  item.customImageURI = "";
  item.owner = event.params.buyer.toHex();
  item.save();
}

export function handleTransfer(event: Transfer): void {
  let tokenId = event.params.tokenId.toString();
  let from = event.params.from.toHex();
  let to = event.params.to.toHex();

  if (from != ADDRESS_ZERO) {
    let item = Item.load(tokenId);
    item.owner = to;
    if (item.owner == ADDRESS_ZERO) {
      store.remove("Item", tokenId);
    } else {
      item.save();
    }
  }
}
