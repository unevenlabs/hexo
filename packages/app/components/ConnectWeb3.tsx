import { GlobalContext } from "context/GlobalState";
import { providers } from "ethers";
import { Dispatch, Fragment, useContext, useEffect } from "react";
import Web3Modal from "web3modal";
import { Actions, State } from "interfaces/context";

export async function connect(
  web3Modal: Web3Modal,
  dispatch: Dispatch<Actions>
) {
  const provider = await web3Modal.connect();

  const web3Provider = new providers.Web3Provider(provider);

  const signer = web3Provider.getSigner();
  const address = await signer.getAddress();
  const { chainId } = await web3Provider.getNetwork();

  dispatch({
    type: "UPDATE_WEB3",
    payload: {
      provider,
      web3Provider,
      address,
      chainId,
    },
  });
}

export async function disconnect(
  web3Modal: Web3Modal,
  provider: State["web3"]["provider"],
  dispatch: Dispatch<Actions>
) {
  web3Modal.clearCachedProvider();
  if (provider?.disconnect && typeof provider.disconnect === "function") {
    await provider.disconnect();
  }
  dispatch({ type: "RESET_WEB3" });
}

const ConnectWeb3 = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const {
    web3: { address, web3Provider, provider, chainId, web3Modal },
  } = state;

  // Listen to user events
  useEffect(() => {
    if (!!provider?.on) {
      const handleAccountsChanged = (accounts: string[]) =>
        dispatch({
          type: "UPDATE_WEB3",
          payload: { address: accounts[0] },
        });

      const handleChainChanged = (chainId: string) =>
        dispatch({
          type: "UPDATE_WEB3",
          payload: { chainId: parseInt(chainId, 16) },
        });

      const handleDisconnect = () => disconnect(web3Modal, provider, dispatch);

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  return (
    <Fragment>
      {web3Provider && !!address ? (
        <span>
          ({chainId === 1 ? "Mainnet" : "Rinkeby"}){" "}
          {address.slice(0, 6) + "..." + address.slice(-4, -1)}
        </span>
      ) : (
        <button
          className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={() => connect(web3Modal, dispatch)}
        >
          Connect Wallet
        </button>
      )}
    </Fragment>
  );
};

export default ConnectWeb3;
