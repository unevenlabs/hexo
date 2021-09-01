import { Actions, Item, State } from "interfaces/context";

// TODO: use better filtering with npm package
function filterItems(items: Item[], filter: string) {
  return items.filter(
    (item) => item.color.includes(filter) || item.object.includes(filter)
  );
}

const AppReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case "UPDATE_SHOW":
      return { ...state, show: action.showPayload };
    case "UPDATE_COLOR":
      return { ...state, color: action.payload };
    case "FILTER":
      if (action.payload !== "") {
        let filteredItems: Item[] = [];
        switch (state.show) {
          case "ALL":
            filteredItems = filterItems(state.items, action.payload);
            return { ...state, filter: action.payload, filteredItems };
          case "AVAILABLE":
            filteredItems = filterItems(state.availableItems, action.payload);
            return { ...state, filter: action.payload, filteredItems };
          case "OWNED":
            filteredItems = filterItems(state.ownedItems, action.payload);
            return { ...state, filter: action.payload, filteredItems };
        }
      }
      return { ...state, filter: action.payload, filteredItems: [] };
    case "UPDATE_WEB3":
      return {
        ...state,
        web3: {
          ...state.web3,
          ...action.payload,
        },
      };
    case "RESET_WEB3":
      // Clear everything, but the web3Modal
      return { ...state, web3: { web3Modal: state.web3.web3Modal } };
    case "UPDATE_MINTED_ITEMS":
      return { ...state, mintedItems: action.payload };
    case "UPDATE_ITEMS":
      const items = action.payload;
      const availableItems = items.filter(({ data }) => data === null);
      const ownedItems = items.filter(
        ({ data }) =>
          !!data &&
          data.owner.toLowerCase() === state.web3.address.toLowerCase()
      );
      return { ...state, items, availableItems, ownedItems };
    default:
      return state;
  }
};

export default AppReducer;
