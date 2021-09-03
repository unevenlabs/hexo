import { Actions, Item, State } from "interfaces/context";
import colors from "data/colors.json";
import objects from "data/objects.json";

// TODO: use better filtering with npm package
function filterItems(items: Item[], filter: string) {
  return items.filter(
    ({ color, object }) =>
      color.includes(filter) ||
      object.includes(filter) ||
      `${color}${object}`.includes(filter)
  );
}

const AppReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case "UPDATE_SHOW":
      return { ...state, show: action.showPayload };
    case "UPDATE_COLOR":
      return { ...state, color: action.payload };
    case "FILTER":
      if (action.payload && action.payload !== "") {
        action.payload = action.payload.toLowerCase();
        let filteredItems: Item[] = [];
        switch (state.show) {
          case "ALL":
            filteredItems = filterItems(state.items, action.payload);
            return {
              ...state,
              filter: action.payload,
              filteredItems,
              limit: 303,
            };
          case "AVAILABLE":
            filteredItems = filterItems(state.availableItems, action.payload);
            return {
              ...state,
              filter: action.payload,
              filteredItems,
              limit: 303,
            };
          case "OWNED":
            filteredItems = filterItems(state.ownedItems, action.payload);
            return {
              ...state,
              filter: action.payload,
              filteredItems,
              limit: 303,
            };
        }
      }
      return {
        ...state,
        filter: action.payload,
        filteredItems: [],
        limit: 303,
      };
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
      const mintedItems = state.mintedItems || {};
      if (action.payload.data) {
        action.payload.data.items.forEach((item) => {
          let data = { ...item };
          delete data.__typename;
          delete data.id;
          mintedItems[`${item.color}${item.object}`] = data;
        });
      }
      return { ...state, mintedItems };
    case "UPDATE_ITEMS":
      const items = colors
        .map((color) => {
          return objects.map((object) => {
            const data = action.payload?.[`${color}${object}`] ||
              state.mintedItems?.[`${color}${object}`] || {
                color: null,
                customImageURI: null,
                generation: null,
                object: null,
                owner: null,
              };

            return {
              color,
              object,
              data,
            };
          });
        })
        .flat();
      const availableItems = items.filter(
        ({ data: { owner } }) => owner === null
      );
      const ownedItems = items.filter(
        ({ data: { owner } }) =>
          owner !== null &&
          state.web3.address &&
          owner.toLowerCase() === state.web3.address.toLowerCase()
      );
      return { ...state, items, availableItems, ownedItems };
    case "UPDATE_LIMIT":
      return { ...state, limit: state.limit + 303 };
    default:
      return state;
  }
};

export default AppReducer;
