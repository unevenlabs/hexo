import { SearchIcon } from "@heroicons/react/outline";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

const Filter = () => {
  const { dispatch } = useContext(GlobalContext);

  return (
    <div className="flex-1 pt-4">
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="search"
          name="filter-items"
          id="filter-items"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="Filter"
          onChange={(event) =>
            dispatch({ type: "FILTER", payload: event.target.value })
          }
        />
      </div>
    </div>
  );
};

export default Filter;
