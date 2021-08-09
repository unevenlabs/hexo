/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  BookmarkAltIcon,
  CalendarIcon,
  ChartBarIcon,
  CursorClickIcon,
  MenuIcon,
  PhoneIcon,
  PlayIcon,
  RefreshIcon,
  ShieldCheckIcon,
  SupportIcon,
  ViewGridIcon,
  XIcon,
} from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/outline'

const features = [
  {
    name: 'On-chain Metadata!',
    description: 'Premium JSON served straight from the contract.',
  },  
  {
    name: 'reddragon.hexo.eth',
    description: 'Every Hexo comes with an ENS name and one-click reverse record setup',
  },
  { 
    name: 'Look Ma, I\'m a DAO!', 
    description: 'Vote on new colors / objects to add, or new default images, in the Snapshot voting portal' },

  {
    name: 'Updateable images!',
    description: 'Owners can override the (deliverately basic) default image with their own.',
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
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
                </div>
                <div className="-mr-2 -my-2 md:hidden">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open menu</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
                <Popover.Group as="nav" className="hidden md:flex space-x-10">

                  <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                    Features
                  </a>
                  <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                    Browse
                  </a>
                  <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                    Discord
                  </a>

                </Popover.Group>
                <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                  <a
                    href="#"
                    className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Connect Wallet
                  </a>
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
                    <div className="mt-6">
                      <nav className="grid gap-y-8">
                        {features.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                          >
                            <item.icon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                            <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                  <div className="py-6 px-5 space-y-6">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Pricing
                      </a>

                      <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Docs
                      </a>
                    </div>
                    <div>
                      <a
                        href="#"
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Connect Wallet
                      </a>
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
                  <span className="block text-gray-900">Hi, what's your</span>
                  <span className="block text-indigo-600">Hexo Code?</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Unique combos of basic colors and objects that form universally recognizable NFT identities. 
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
                  Learn More
                </a>
              </div>
            </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto rounded-lg shadow-xl w-5/12">
                <img className="object-cover rounded-lg bg-white" src="images/red/dragon.svg" alt="" />
                  <div className="text-2xl text-center my-3">
                    <h3>Red Dragon</h3>
                  </div>
              </div>
              <div className="relative mx-auto rounded-lg shadow-xl w-5/12">
                <img className="object-cover rounded-lg bg-white" src="images/orange/basketball.svg" alt="" />
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
            <h2 className="text-3xl font-extrabold text-gray-900">Infinite possible JPEGs</h2>
            <p className="mt-4 text-lg text-gray-500">
              With a Hexo, you don't just own a single image. You own a namespace that can be visually represented however you want.
            </p>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto rounded-lg shadow-xl w-3/12">
                <img className="object-cover rounded-lg bg-white" src="images/red/dragon.svg" alt="" />
              </div>
              <div className="relative mx-auto rounded-lg shadow-xl w-3/12">
                <img className="object-cover rounded-lg bg-white" src="images/dragonbit.png" alt="" />
              </div>
              <div className="relative mx-auto rounded-lg shadow-xl w-3/12">
                <img className="object-cover rounded-lg bg-white" src="images/3ddragon.png" alt="" />
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
                  <CheckIcon className="absolute h-6 w-6 text-green-500" aria-hidden="true" />
                  <p className="ml-9 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-9 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl> 
      </div>
        <div className="mt-10 pb-12 bg-white sm:pb-16">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-4">
                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Colors</dt>
                  <dd className="order-1 text-5xl font-extrabold text-indigo-600">11</dd>
                </div>
                <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Objects</dt>
                  <dd className="order-1 text-5xl font-extrabold text-indigo-600">303</dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Total Supply</dt>
                  <dd className="order-1 text-5xl font-extrabold text-indigo-600">3333</dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Minted</dt>
                  <dd className="order-1 text-5xl font-extrabold text-indigo-600">0</dd>
                </div>
              </dl>
            </div>
          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
