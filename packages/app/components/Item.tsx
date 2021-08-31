import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useWeb3React } from "@web3-react/core";
import { Fragment, useState } from "react";

import {
  claimSubdomains,
  mintItems,
  setAvatar,
  setCustomImageURI,
  setReverseRecord,
} from "../src/actions";
import { capitalize } from "../src/utils";

type ItemProps = {
  color: string;
  object: string;
  generation: number | undefined;
  customImageURI: string | undefined;
  owner: string | undefined;
};

export default function Item({
  color,
  object,
  generation,
  customImageURI,
  owner,
}: ItemProps) {
  const { account, library } = useWeb3React();

  const [open, setOpen] = useState(false);
  const [newCustomImageURI, setNewCustomImageURI] = useState(
    customImageURI || `images/${color}/${object}.svg`
  );

  return (
    <>
      <img
        key={`${color}-${object}`}
        className="float-left mr-2 mb-2 object-cover rounded-lg bg-white w-24 hover:shadow-xl"
        src={`images/${color}/${object}.svg`}
        alt={`${color}-${object}`}
        onClick={() => setOpen(!open)}
      />
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
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
                          src={
                            customImageURI || `images/${color}/${object}.svg`
                          }
                          alt={`${color}-${object}`}
                          className="object-center object-cover"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-8 lg:col-span-7">
                      <h2 className="text-2xl font-extrabold text-gray-900 sm:pr-12">
                        {`${capitalize(color)} ${capitalize(object)}`}
                      </h2>
                      <p className="text-gray-500">
                        {`${color}${object}.hexo.eth`}
                      </p>
                      <p className="text-2xl text-gray-900">0.01 ETH</p>

                      {!owner && (
                        <button
                          className="mt-5 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={async () => {
                            if (!account || !library) {
                              return alert("Wallet not connected");
                            }

                            await mintItems(library.getSigner(account), [
                              { color, object },
                            ]);
                          }}
                        >
                          Mint
                        </button>
                      )}
                      <div className="mt-5">
                        {generation !== undefined && (
                          <p className="text-sm text-gray-700">
                            Generation: {generation + 1}
                          </p>
                        )}
                        {owner && (
                          <p className="text-sm text-gray-700">
                            Owner: {owner}
                          </p>
                        )}
                        <p className="text-sm text-gray-700">
                          Links:{" "}
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-500 mr-2"
                          >
                            OpenSea
                          </a>
                          |{" "}
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-500 ml-1"
                          >
                            Etherscan
                          </a>
                        </p>
                      </div>

                      <div className="mt-3">
                        <span className="mr-2 text-sm  text-gray-700">
                          Set ENS:{" "}
                        </span>
                        <span className="relative z-0 inline-flex shadow-sm rounded-md">
                          <button
                            type="button"
                            className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            onClick={async () => {
                              if (!account || !library) {
                                return alert("Wallet not connected");
                              }

                              if (
                                !owner ||
                                !account ||
                                owner.toLowerCase() !== account.toLowerCase()
                              ) {
                                alert("You are not the owner");
                                return;
                              }

                              await claimSubdomains(
                                library.getSigner(account),
                                [{ color, object }]
                              );
                            }}
                          >
                            Resolver
                          </button>
                          <button
                            type="button"
                            className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            onClick={async () => {
                              if (!account || !library) {
                                return alert("Wallet not connected");
                              }

                              if (
                                !owner ||
                                !account ||
                                owner.toLowerCase() !== account.toLowerCase()
                              ) {
                                alert("You are not the owner");
                                return;
                              }

                              await setAvatar(
                                library.getSigner(account),
                                { color, object },
                                // TODO: This should be set from the UI
                                "https://custom-url"
                              );
                            }}
                          >
                            Avatar
                          </button>
                          <button
                            type="button"
                            className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            onClick={async () => {
                              if (!account || !library) {
                                return alert("Wallet not connected");
                              }

                              if (
                                !owner ||
                                !account ||
                                owner.toLowerCase() !== account.toLowerCase()
                              ) {
                                alert("You are not the owner");
                                return;
                              }

                              await setReverseRecord(
                                library.getSigner(account),
                                { color, object }
                              );
                            }}
                          >
                            Reverse Record
                          </button>
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="mr-2 text-sm text-gray-700">
                          Set Image URL:{" "}
                          <div className="w-full">
                            <input
                              type="text"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full block sm:text-sm border-gray-300 rounded-md"
                              placeholder={newCustomImageURI}
                              onChange={(event) =>
                                setNewCustomImageURI(event.target.value)
                              }
                            />
                            <button
                              type="button"
                              className="lg:float-right items-center w-full px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={async () => {
                                if (!account || !library) {
                                  return alert("Wallet not connected");
                                }

                                if (
                                  !owner ||
                                  !account ||
                                  owner.toLowerCase() !== account.toLowerCase()
                                ) {
                                  alert("You are not the owner");
                                  return;
                                }

                                await setCustomImageURI(
                                  library.getSigner(account),
                                  { color, object },
                                  newCustomImageURI
                                );
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
