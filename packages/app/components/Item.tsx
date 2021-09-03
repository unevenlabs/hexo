import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { GlobalContext } from "context/GlobalState";
import { Fragment, useContext, useState } from "react";
import {
  claimSubdomains,
  mintItems,
  setCustomImageURI,
  setReverseRecord,
  setAvatar,
} from "src/actions";
import { connect } from "./ConnectWeb3";
import Image from "next/image";
import { getTokenId } from "../src/utils";

type ItemProps = {
  color: string;
  object: string;
  data: {
    generation: number;
    customImageURI: string;
    owner: string;
  } | null;
};

export default function Item({ itemProps }: { itemProps: ItemProps }) {
  const { state, dispatch } = useContext(GlobalContext);
  const { color, object, data } = itemProps;
  const {
    mintedItems,
    web3: { web3Provider, web3Modal, address },
  } = state;

  const [open, setOpen] = useState(false);

  const [newCustomImageURI, setNewCustomImageURI] = useState(
    (!!data && data.customImageURI) ||
      `https://hexo.codes/images/${color}/${object}.svg`
  );

  return (
    <>
      <div className="float-left mr-2 mb-2 object-cover rounded-lg bg-white w-24 hover:shadow-xl">
        <Image
          key={`${color}-${object}`}
          width={100}
          height={100}
          title={`${color.charAt(0).toUpperCase() + color.slice(1)} ${
            object.charAt(0).toUpperCase() + object.slice(1)
          }`}
          src={`/images/${color}/${object}.svg`}
          alt={`${color}-${object}`}
          onClick={() => setOpen(!open)}
          quality={1}
        />
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div
            className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
            style={{ fontSize: 0 }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden md:inline-block md:align-middle md:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <div className="flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
                <div className="w-full relative flex items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="w-full grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:gap-x-8">
                    <div className="sm:col-span-4 lg:col-span-5">
                      <div className="aspect-w-2 aspect-h-2 rounded-lg bg-gray-100 overflow-hidden ">
                        <img
                          src={newCustomImageURI}
                          alt={`${color}-${object}`}
                          className="object-center object-cover"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-8 lg:col-span-7">
                      <h2 className="capitalize text-2xl font-extrabold text-gray-900 sm:pr-12">
                        {`${color} ${object}`}
                      </h2>
                      <p className="text-gray-500">
                        {`${color}${object}.hexo.eth`}
                      </p>
                      <p className="text-2xl text-gray-900">0.01 ETH</p>

                      {data.owner === null ? (
                        <button
                          className="mt-5 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={async () => {
                            if (!web3Provider) {
                              connect(web3Modal, dispatch);
                            } else {
                              let tx = await mintItems(
                                web3Provider.getSigner(),
                                [{ color, object }]
                              );

                              await tx.wait();

                              // Get info about all minted items
                              const itemsData = { ...mintedItems };

                              itemsData[`${color}${object}`] = {
                                color,
                                customImageURI: "",
                                generation: 0,
                                object,
                                owner: address,
                              };

                              dispatch({
                                type: "UPDATE_MINTED_ITEMS",
                                payload: itemsData,
                              });

                              dispatch({
                                type: "UPDATE_ITEMS",
                                payload: itemsData,
                              });
                            }
                          }}
                        >
                          Mint
                        </button>
                      ) : (
                        <div className="mt-4">
                          <p className="text-sm text-gray-700">
                            Generation: {data.generation + 1}
                          </p>
                          {data.owner && (
                            <p className="text-sm text-gray-700">
                              Owner: {data.owner}
                            </p>
                          )}
                          <p className="text-sm text-gray-700">
                            Links:{" "}
                            <a
                              href={`https://opensea.io/assets/0x819327e005a3ed85f7b634e195b8f25d4a2a45f8/${getTokenId(
                                color,
                                object
                              )}`}
                              className="text-indigo-600 hover:text-indigo-500 mr-2"
                              target="_blank"
                            >
                              OpenSea
                            </a>
                            |{" "}
                            <a
                              href={`https://etherscan.io/token/0x819327e005a3ed85f7b634e195b8f25d4a2a45f8?a=${getTokenId(
                                color,
                                object
                              )}`}
                              className="text-indigo-600 hover:text-indigo-500 ml-1"
                              target="_blank"
                            >
                              Etherscan
                            </a>
                          </p>
                        </div>
                      )}

                      <div className="mt-3">
                        <span className="mr-2 text-sm text-gray-700">
                          Set ENS:
                        </span>
                        <span className="relative z-0 inline-flex shadow-sm rounded-md">
                          <button
                            type="button"
                            className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            onClick={async () => {
                              if (!web3Provider) {
                                connect(web3Modal, dispatch);
                              } else {
                                if (
                                  !data.owner ||
                                  !address ||
                                  data.owner.toLowerCase() !==
                                    address.toLowerCase()
                                ) {
                                  alert("You are not the owner");
                                } else {
                                  await claimSubdomains(
                                    web3Provider.getSigner(),
                                    [{ color, object }]
                                  );
                                }
                              }
                            }}
                          >
                            Resolver
                          </button>
                          <button
                            type="button"
                            className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            onClick={async () => {
                              if (!web3Provider) {
                                connect(web3Modal, dispatch);
                              } else {
                                if (
                                  !data.owner ||
                                  !address ||
                                  data.owner.toLowerCase() !==
                                    address.toLowerCase()
                                ) {
                                  alert("You are not the owner");
                                } else {
                                  if (data.customImageURI) {
                                    await setAvatar(
                                      web3Provider.getSigner(),
                                      { color, object },
                                      data.customImageURI
                                    );
                                  } else {
                                    await setAvatar(
                                      web3Provider.getSigner(),
                                      { color, object },
                                      `https://www.hexo.codes/images/${color}/${object}.svg`
                                    );
                                  }
                                }
                              }
                            }}
                          >
                            Avatar
                          </button>
                          <button
                            type="button"
                            className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            onClick={async () => {
                              if (!web3Provider) {
                                connect(web3Modal, dispatch);
                              } else {
                                if (
                                  !data.owner ||
                                  !address ||
                                  data.owner.toLowerCase() !==
                                    address.toLowerCase()
                                ) {
                                  alert("You are not the owner");
                                } else {
                                  await setReverseRecord(
                                    web3Provider.getSigner(),
                                    {
                                      color,
                                      object,
                                    }
                                  );
                                }
                              }
                            }}
                          >
                            Reverse Record
                          </button>
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="flex gap-2 items-center mr-2 text-sm text-gray-700">
                          <span className="whitespace-nowrap">
                            Set Image URL:
                          </span>
                          <div className="flex gap-2 w-full">
                            <input
                              type="text"
                              className="w-5/6 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                              placeholder={newCustomImageURI}
                              onChange={(event) =>
                                setNewCustomImageURI(event.target.value)
                              }
                            />
                            <button
                              type="button"
                              className="w-1/6 lg:float-right items-center rounded-md px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={async () => {
                                if (!web3Provider) {
                                  connect(web3Modal, dispatch);
                                } else {
                                  if (
                                    !data.owner ||
                                    !address ||
                                    data.owner.toLowerCase() !==
                                      address.toLowerCase()
                                  ) {
                                    alert("You are not the owner");
                                  } else {
                                    let tx = await setCustomImageURI(
                                      web3Provider.getSigner(),
                                      { color, object },
                                      newCustomImageURI
                                    );

                                    await tx.wait();

                                    // Get info about all minted items
                                    const itemsData = { ...mintedItems };

                                    itemsData[`${color}${object}`] = {
                                      color,
                                      customImageURI: newCustomImageURI,
                                      generation: 0,
                                      object,
                                      owner: address,
                                    };

                                    dispatch({
                                      type: "UPDATE_MINTED_ITEMS",
                                      payload: itemsData,
                                    });

                                    dispatch({
                                      type: "UPDATE_ITEMS",
                                      payload: itemsData,
                                    });
                                  }
                                }
                              }}
                            >
                              Set
                            </button>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
