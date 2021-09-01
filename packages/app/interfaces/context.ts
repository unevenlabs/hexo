import React from "react";
import Web3Modal from "web3modal";

export type GlobalContextType = {
  state: State;
  dispatch: React.Dispatch<Actions>;
};

export interface IWeb3 {
  address?: string;
  chainId?: number;
  provider?: any;
  web3Provider?: any;
  web3Modal?: Web3Modal;
}

export interface Item {
  color: string;
  object: string;
  data: {
    generation: number | undefined;
    customImageURI: string | undefined;
    owner: string | undefined;
  };
}

export type State = {
  show: "ALL" | "AVAILABLE" | "OWNED";
  filter: string;
  color: string;
  web3: IWeb3;
  mintedItems: {};
  items: Item[];
  filteredItems: Item[];
  availableItems: Item[];
  ownedItems: Item[];
};

export type Actions = {
  type:
    | "UPDATE_SHOW"
    | "FILTER"
    | "UPDATE_COLOR"
    | "UPDATE_WEB3"
    | "RESET_WEB3"
    | "UPDATE_MINTED_ITEMS"
    | "UPDATE_ITEMS";
  payload?: any;
  showPayload?: State["show"];
};
