import { useContext, useEffect } from "react";
import { useGetItems } from "src/hooks/items";
import Stats from "components/Stats";
import Hero from "components/Hero";
import HeroImages from "components/HeroImages";
import Features from "components/Features";
import Navbar from "components/Navbar";
import Random from "components/Random";
import { GlobalContext } from "context/GlobalState";
import ShowSelector from "components/ShowSelector";
import Filter from "components/Filter";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { connect } from "components/ConnectWeb3";
import Item from "components/Item";
import colors from "data/colors.json";
import objects from "data/objects.json";

const providerOptions = {
  // Add walletconnect "plug-in"
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    },
  },
};

export default function Index() {
  const {
    state: { mintedItems, items, filter },
    dispatch,
  } = useContext(GlobalContext);

  // Ensure all elements have access to web3Modal
  useEffect(() => {
    let web3Modal: Web3Modal;
    if (typeof window !== "undefined") {
      web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions,
      });
    }

    // Auto-connect from cached data
    if (web3Modal.cachedProvider) {
      connect(web3Modal, dispatch);
    }

    dispatch({
      type: "UPDATE_WEB3",
      payload: {
        web3Modal,
      },
    });
  }, []);

  // Get info about all minted items
  const mintedItemsInfo = useGetItems();

  useEffect(() => {
    if (mintedItemsInfo?.data?.items) {
      const localMintedItems = {};
      mintedItemsInfo.data.items.forEach((item) => {
        let data = { ...item };
        delete data.__typename;
        delete data.id;
        localMintedItems[`${item.color}${item.object}`] = data;
      });

      dispatch({ type: "UPDATE_MINTED_ITEMS", payload: localMintedItems });

      const items = colors.map((color) => {
        return objects.slice(0, 2).map((object) => {
          const data = mintedItems[`${color}${object}`] || null;

          return {
            color,
            object,
            data,
          };
        });
      });

      dispatch({ type: "UPDATE_ITEMS", payload: items.flat() });
    }
  }, [mintedItemsInfo]);

  return (
    <div className="relative bg-gray-50">
      <Navbar />

      <HeroImages />

      <Hero />

      <Features />

      <Stats />

      <div className="bg-white" id="browse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row flex-wrap">
            <ShowSelector />

            <Filter />

            <Random mintedItems={mintedItems} />
          </div>

          {items.map(({ color, object, data }) => (
            <Item
              key={`${color}${object}`}
              color={color}
              object={object}
              data={data}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
