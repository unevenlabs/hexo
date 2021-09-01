import { useContext } from "react";
import { GlobalContext } from "context/GlobalState";

const ShowSelector = () => {
  const {
    state: { show },
    dispatch,
  } = useContext(GlobalContext);

  return (
    // All/Available/Owned filtering
    <div className="flex-1 pt-4">
      <span className="relative z-0 inline-flex shadow-sm rounded-md">
        <button
          type="button"
          className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
            show === "ALL"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => dispatch({ type: "UPDATE_SHOW", showPayload: "ALL" })}
        >
          All
        </button>

        <button
          type="button"
          className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300  text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
            show === "AVAILABLE"
              ? "bg-indigo-600 text-white"
              : " bg-white text-gray-700"
          }`}
          onClick={() =>
            dispatch({ type: "UPDATE_SHOW", showPayload: "AVAILABLE" })
          }
        >
          Available
        </button>

        <button
          type="button"
          className={`-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
            show === "OWNED"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() =>
            dispatch({ type: "UPDATE_SHOW", showPayload: "OWNED" })
          }
        >
          Owned
        </button>
      </span>
    </div>
  );
};

export default ShowSelector;
