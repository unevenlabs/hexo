import React, { useContext, useEffect } from "react";
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
import Head from "next/head";

const NotFound = ({ children }: { children: React.ReactNode }) => (
  <p className="w-full text-center font-semibold">{children}</p>
);

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
    state: {
      mintedItems,
      items,
      availableItems,
      ownedItems,
      filter,
      show,
      filteredItems,
    },
    dispatch,
  } = useContext(GlobalContext);

  // Get info about all minted items
  const itemsData = useGetItems();

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

    dispatch({ type: "UPDATE_WEB3", payload: { web3Modal } });

    dispatch({ type: "UPDATE_MINTED_ITEMS", payload: itemsData });

    dispatch({ type: "UPDATE_ITEMS", payload: itemsData });
  }, [itemsData]);

  // Re-run filter when show changes
  useEffect(() => dispatch({ type: "FILTER", payload: filter }), [show]);

  return (
    <div className="relative bg-gray-50">
      <Head>
        <title>Hexo</title>
        <link
          rel="icon"
          type="image/jpeg"
          href="https://www.hexo.codes/images/logo.jpg"
        ></link>
      </Head>
      <Navbar />

      <HeroImages />

      <Hero />

      <Features />

      <Stats />

      <div className="bg-white" id="browse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row flex-wrap mb-4">
            <ShowSelector />

            <Filter />

            <Random mintedItems={mintedItems} />
          </div>

          <div className="flex flex-wrap pt-5 pb-9">
            {filter !== "" ? (
              filteredItems.length === 0 ? (
                <NotFound>No items found</NotFound>
              ) : (
                filteredItems.map((data) => (
                  <Item key={`${data.color}${data.object}`} itemProps={data} />
                ))
              )
            ) : show === "AVAILABLE" ? (
              availableItems.length === 0 ? (
                <NotFound>No available items found</NotFound>
              ) : (
                availableItems.map((data) => (
                  <Item key={`${data.color}${data.object}`} itemProps={data} />
                ))
              )
            ) : show === "OWNED" ? (
              ownedItems.length === 0 ? (
                <NotFound>No owned items found</NotFound>
              ) : (
                ownedItems.map((data) => (
                  <Item key={`${data.color}${data.object}`} itemProps={data} />
                ))
              )
            ) : items.length === 0 ? (
              <NotFound>Loading...</NotFound>
            ) : (
              items.map((data) => (
                <Item key={`${data.color}${data.object}`} itemProps={data} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
