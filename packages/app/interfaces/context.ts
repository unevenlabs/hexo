import React from "react";

export type GlobalContextType = {
  state: State;
  dispatch: React.Dispatch<Actions>;
};

export interface IWeb3 {
  address?: string;
  chainId?: number;
  provider?: any;
  web3Provider?: any;
}

export type State = {
  show: "ALL" | "AVAILABLE" | "OWNED";
  filter: string;
  color: string;
  web3: IWeb3;
};

export type Actions = {
  type:
    | "UPDATE_SHOW"
    | "FILTER"
    | "UPDATE_COLOR"
    | "UPDATE_WEB3"
    | "RESET_WEB3";
  payload?: any;
  showPayload?: State["show"];
};
