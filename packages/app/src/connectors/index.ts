import { AbstractConnector } from "@web3-react/abstract-connector";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  // We support both Rinkeby and Mainnet
  supportedChainIds: [1, 4],
});

export const activateConnector = async (
  web3ReactContext: Web3ReactContextInterface<any>,
  connector: AbstractConnector
) => {
  const { activate } = web3ReactContext;
  activate(connector, undefined, true);
};

export const deactivateConnector = (
  web3ReactContext: Web3ReactContextInterface<any>
) => {
  const { deactivate } = web3ReactContext;
  deactivate();
};

export const eagerConnect = async (
  web3ReactContext: Web3ReactContextInterface<any>
) => {
  injected
    .isAuthorized()
    .then(
      (isAuthorized) =>
        isAuthorized && activateConnector(web3ReactContext, injected)
    );
};
