import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { useWeb3React } from '@web3-react/core'
import { Fragment } from 'react'
import { activateConnector, injected } from '../src/connectors'

const Navbar = () => {
  const web3ReactContext = useWeb3React()
  const { account, active, chainId } = web3ReactContext

  return (
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
                      ({chainId === 1 ? 'Mainnet' : 'Rinkeby'}){' '}
                      {account.slice(0, 6) + '...' + account.slice(-4, -1)}
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
                        src="images/logo.svg"
                        alt="Hexo"
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
                          ({chainId === 1 ? 'Mainnet' : 'Rinkeby'}){' '}
                          {account.slice(0, 6) + '...' + account.slice(-4, -1)}
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
  )
}

export default Navbar
