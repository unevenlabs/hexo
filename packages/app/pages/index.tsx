import { Popover, Transition } from "@headlessui/react";
import {
  MenuIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { XCircleIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { Fragment, useEffect, useState } from "react";

import Item from "../src/components/Item";
import { activateConnector, injected } from "../src/connectors";
import { useGetItems } from "../src/hooks/items";

import colors from "../data/colors.json";
import objects from "../data/objects.json";

const features = [
  {
    name: "On-chain Metadata!",
    description: "Premium JSON served straight from the contract",
  },
  {
    name: "reddragon.hexo.eth",
    description:
      "Every Hexo comes with an ENS name and one-click reverse record setup",
  },
  {
    name: "Look Ma, I'm a DAO!",
    description:
      "Vote on new colors / objects to add, or new default images, in the Snapshot voting portal",
  },
  {
    name: "Updateable images!",
    description: "Owners can override the basic default image with their own",
  },
];

export default function Index() {
  const web3ReactContext = useWeb3React();
  const { account, active, chainId } = web3ReactContext;

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
  const [showAll, setShowAll] = useState(true);
  const [showAvailable, setShowAvailable] = useState(false);
  const [showOwned, setShowOwned] = useState(false);
  const [nameFilter, setNameFilter] = useState("");

  return (
    <div className="relative bg-gray-50">
      <Popover className="relative bg-white shadow">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
                <div className="flex justify-start lg:w-0 lg:flex-1">
                  <a href="#">
                    <img
                      className="h-8 w-auto sm:h-10 float-left"
                      src="images/logo.svg"
                      alt=""
                    />
                  </a>
                  <Popover.Group
                    as="nav"
                    className="hidden md:flex space-x-10 pl-10 pt-2"
                  >
                    <a
                      href="#browse"
                      className="text-base font-medium text-gray-500 hover:text-gray-900"
                    >
                      Browse Hexos
                    </a>
                    <a
                      href="https://discord.gg/XveChR6bsE"
                      target="_blank"
                      className="text-base font-medium text-gray-500 hover:text-gray-900"
                    >
                      Discord
                    </a>
                    <a
                      href="https://github.com/unevenlabs/hexo"
                      target="_blank"
                      className="text-base font-medium text-gray-500 hover:text-gray-900"
                    >
                      Github
                    </a>
                  </Popover.Group>
                </div>
                <div className="-mr-2 -my-2 md:hidden">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open menu</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>

                <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                  {active ? (
                    <>
                      <span>
                        ({chainId === 1 ? "Mainnet" : "Rinkeby"}){" "}
                        {account.slice(0, 6) + "..." + account.slice(-4, -1)}
                      </span>
                    </>
                  ) : (
                    <button
                      className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      onClick={() =>
                        activateConnector(web3ReactContext, injected)
                      }
                    >
                      Connect Wallet
                    </button>
                  )}
                </div>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              enter="duration-200 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                focus
                static
                className="absolute top-0 inset-x-0 z-10 p-2 transition transform origin-top-right md:hidden"
              >
                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                  <div className="pt-5 pb-6 px-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                          alt="Workflow"
                        />
                      </div>
                      <div className="-mr-2">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Close menu</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                  </div>
                  <div className="py-6 px-5 space-y-6">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      <a
                        href="#browse"
                        className="text-base font-medium text-gray-500 hover:text-gray-900"
                      >
                        Browse Hexos
                      </a>
                      <a
                        href="https://discord.gg/XveChR6bsE"
                        target="_blank"
                        className="text-base font-medium text-gray-500 hover:text-gray-900"
                      >
                        Discord
                      </a>
                      <a
                        href="https://github.com/unevenlabs/hexo"
                        target="_blank"
                        className="text-base font-medium text-gray-500 hover:text-gray-900"
                      >
                        Github
                      </a>
                    </div>
                    <div>
                      {active ? (
                        <>
                          <span>
                            ({chainId === 1 ? "Mainnet" : "Rinkeby"}){" "}
                            {account.slice(0, 6) +
                              "..." +
                              account.slice(-4, -1)}
                          </span>
                        </>
                      ) : (
                        <button
                          className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                          onClick={() =>
                            activateConnector(web3ReactContext, injected)
                          }
                        >
                          Connect Wallet
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      <main className="mt-16 mx-auto pb-10 max-w-7xl px-4 sm:mt-16 sm:px-6 lg:mt-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-gray-900">Hello, what's your</span>
                <span className="block text-indigo-600">Hexo</span>
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Unique combos of basic colors and objects that form universally
              recognizable NFT identities.
            </p>
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Mint
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Looks Rare
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto rounded-lg shadow-xl w-5/12">
              <img
                className="object-cover rounded-lg bg-white"
                src="images/red/dragon.svg"
                alt=""
              />
              <div className="text-2xl text-center my-3">
                <h3>Red Dragon</h3>
              </div>
            </div>
            <div className="relative mx-auto rounded-lg shadow-xl w-5/12">
              <img
                className="object-cover rounded-lg bg-white"
                src="images/orange/basketball.svg"
                alt=""
              />
              <div className="text-2xl text-center my-3">
                <h3>Orange Basketball</h3>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Infinite possible JPEGs
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              With a Hexo, you don't just own a single image. You own a
              namespace that can be visually represented however you want.
            </p>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto rounded-lg shadow-xl w-3/12">
              <img
                className="object-cover rounded-lg bg-white"
                src="images/red/dragon.svg"
                alt=""
              />
            </div>
            <div className="relative mx-auto rounded-lg shadow-xl w-3/12">
              <img
                className="object-cover rounded-lg bg-white"
                src="images/dragonbit.png"
                alt=""
              />
            </div>
            <div className="relative mx-auto rounded-lg shadow-xl w-3/12">
              <img
                className="object-cover rounded-lg bg-white"
                src="images/3ddragon.png"
                alt=""
              />
            </div>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <p className="mt-10 text-xl text-gray-500">Hi, I'm Red Dragon</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 pt-12 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Standard ERC-721, with some fun bonuses
            </h2>
          </div>

          <dl className="mt-16 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <CheckIcon
                    className="absolute h-6 w-6 text-green-500"
                    aria-hidden="true"
                  />
                  <p className="ml-9 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-9 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-10 pb-12 bg-white sm:pb-16">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-5">
                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Colors
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-indigo-600">
                    11
                  </dd>
                </div>
                <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Objects
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-indigo-600">
                    303
                  </dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Total Supply
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-indigo-600">
                    3333
                  </dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Minted
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-indigo-600">
                    0
                  </dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    ETH
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-indigo-600">
                    0.033
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white" id="browse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap">
            {/* All/Available/Owned filtering */}
            <div className="flex-1">
              <span className="relative z-0 inline-flex shadow-sm rounded-md">
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  onClick={() => {
                    setShowAll(true);
                    setShowAvailable(false);
                    setShowOwned(false);
                  }}
                >
                  All
                </button>

                <button
                  type="button"
                  className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  onClick={() => {
                    setShowAll(false);
                    setShowAvailable(true);
                    setShowOwned(false);
                  }}
                >
                  Available
                </button>

                <button
                  type="button"
                  className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  onClick={() => {
                    setShowAll(false);
                    setShowAvailable(false);
                    setShowOwned(true);
                  }}
                >
                  Owned
                </button>
              </span>
            </div>

            {/* Name filtering */}
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="filter-items"
                  id="filter-items"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Filter"
                  onChange={(event) => setNameFilter(event.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <XCircleIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Random mint */}
            <div className="flex-1">
              <button
                type="button"
                className="float-right items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Mint
              </button>
              <select
                id="random"
                name="random"
                className="float-right pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-l-md"
                defaultValue="1 Random"
              >
                <option>1 random</option>
                <option>2 random</option>
                <option>3 random</option>
              </select>
            </div>
          </div>

          {/* Show items */}
          <div>
            <dl className="mt-16">
              {colors.map((color, i) =>
                objects.map((object, j) => {
                  if(i>10 || j>10) return null // hack to limit items while testing
                  // First, check if the item was minted
                  const mintedItem = mintedItems[color + object];
                  const renderedItem = (
                    <Item
                      key={color + object}
                      color={color}
                      object={object}
                      generation={mintedItem?.generation}
                      customImageURI={mintedItem?.customImageURI}
                      owner={mintedItem?.owner}
                    />
                  );

                  // If name filtering is on, prioritize it
                  if (
                    nameFilter &&
                    nameFilter !== "" &&
                    !(color + object).includes(nameFilter)
                  ) {
                    return null;
                  }

                  if (showAll) {
                    // Show all items
                    return renderedItem;
                  } else if (showAvailable) {
                    // Only show items that were not yet minted
                    return !mintedItem ? renderedItem : null;
                  } else if (showOwned) {
                    // Only show items owner by the current account
                    return mintedItem &&
                      mintedItem.owner === account.toLowerCase()
                      ? renderedItem
                      : null;
                  }

                  return null;
                })
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
