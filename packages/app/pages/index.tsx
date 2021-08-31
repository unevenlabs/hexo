import { useWeb3React } from "@web3-react/core";
import { useContext, useEffect, useState } from "react";

import { useGetItems } from "../src/hooks/items";

import colors from "../data/colors.json";
import objects from "../data/objects.json";

import Item from "../components/Item";
import Stats from "../components/Stats";
import Hero from "../components/Hero";
import HeroImages from "../components/HeroImages";
import Features from "../components/Features";
import Navbar from "../components/Navbar";
import Random from "../components/Random";
import { GlobalContext } from "../context/GlobalState";
import ShowSelector from "../components/ShowSelector";
import Filter from "../components/Filter";

export default function Index() {
  const {
    state: { show, filter },
  } = useContext(GlobalContext);
  const web3ReactContext = useWeb3React();
  const { account } = web3ReactContext;

  // Get info about all minted items
  const mintedItemsInfo = useGetItems();
  const [mintedItems, setMintedItems] = useState({} as any);
  useEffect(() => {
    if (mintedItemsInfo?.data?.items) {
      const localMintedItems = {};
      for (const item of mintedItemsInfo.data.items) {
        localMintedItems[item.color + item.object] = {
          color: item.color,
          object: item.object,
          generation: item.generation,
          customImageURI: item.customImageURI,
          owner: item.owner,
        };
      }
      setMintedItems(localMintedItems);
    }
  }, [mintedItemsInfo]);

  // Filters for items
  const [selectedColor, setselectedColor] = useState("black");

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

            {/* Random mint */}
            <Random mintedItems={mintedItems} />
          </div>

          <label className="sr-only" htmlFor="color">
            Select Color
          </label>
          <select
            id="color"
            name="color"
            onChange={(e) => setselectedColor(e.target.value)}
          >
            <option defaultValue="" disabled>
              Choose a color
            </option>
            {colors.map((color) => (
              <option key={color} value={color} className="capitalize">
                {color}
              </option>
            ))}
          </select>

          {/* Show items */}
          <div>
            <dl className="mt-16">
              {objects.map((object) => {
                // First, check if the item was minted
                const mintedItem = mintedItems[selectedColor + object];
                const renderedItem = (
                  <Item
                    key={selectedColor + object}
                    color={selectedColor}
                    object={object}
                    generation={mintedItem?.generation}
                    customImageURI={mintedItem?.customImageURI}
                    owner={mintedItem?.owner}
                  />
                );

                // If name filtering is on, prioritize it
                if (
                  filter !== "" &&
                  !(selectedColor + object).includes(filter)
                ) {
                  return null;
                }

                if (show === "ALL") {
                  // Show all items
                  return renderedItem;
                } else if (show === "AVAILABLE") {
                  // Only show items that were not yet minted
                  return !mintedItem ? renderedItem : null;
                } else if (show === "OWNED") {
                  // Only show items owner by the current account
                  return mintedItem &&
                    mintedItem.owner === account.toLowerCase()
                    ? renderedItem
                    : null;
                }

                return null;
              })}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
