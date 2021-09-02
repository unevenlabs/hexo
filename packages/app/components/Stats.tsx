import { GlobalContext } from "context/GlobalState";
import { useContext } from "react";

const Stats = () => {
  const { state } = useContext(GlobalContext);

  let keys = Object.keys(state.mintedItems);

  const mintedCount = keys.length;

  return (
    <div className="mt-10 pb-8 bg-white sm:pb-16">
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
                  {mintedCount}
                </dd>
              </div>
              <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                  ETH
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-indigo-600">
                  0.01
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
