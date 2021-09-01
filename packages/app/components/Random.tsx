import _ from "lodash";
import { useContext, useState } from "react";

import { mintItems } from "src/actions";

import colors from "data/colors.json";
import objects from "data/objects.json";
import { GlobalContext } from "context/GlobalState";
import { connect } from "./ConnectWeb3";

type Props = {
  mintedItems: { [item: string]: any };
};

const Random = ({ mintedItems }: Props) => {
  const { state, dispatch } = useContext(GlobalContext);
  const {
    web3: { web3Provider, web3Modal },
  } = state;
  const [count, setCount] = useState(1);

  return (
    <div className="flex-1 pt-4">
      <button
        type="button"
        className="lg:float-right items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={async () => {
          if (!web3Provider) {
            connect(web3Modal, dispatch);
          } else {
            let allItems = [];
            for (const color of colors) {
              for (const object of objects) {
                allItems.push({ color, object });
              }
            }
            allItems = _.shuffle(allItems);

            const numAvailable =
              allItems.length - Object.keys(mintedItems).length;
            if (count > numAvailable) {
              alert("Not enough available items");
              return;
            }

            const itemsToMint = [];
            for (const item of allItems) {
              if (!mintedItems[item.color + item.object]) {
                itemsToMint.push(item);
              }
              if (itemsToMint.length === count) {
                break;
              }
            }

            await mintItems(web3Provider.getSigner(), itemsToMint);
          }
        }}
      >
        Mint
      </button>
      <select
        id="random"
        name="random"
        className="float-left lg:float-right pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-l-md"
        defaultValue={count}
        onChange={(event) => setCount(Number(event.target.value))}
      >
        <option value="1">1 random</option>
        <option value="2">2 random</option>
        <option value="3">3 random</option>
        <option value="4">4 random</option>
        <option value="5">5 random</option>
      </select>
    </div>
  );
};

export default Random;
