import React, { createContext, useReducer } from "react";
import { GlobalContextType, State } from "interfaces/context";
import AppReducer from "./AppReducer";

const initialState: State = {
  show: "ALL",
  filter: "",
  color: "black",
  limit: 30,
  web3: {},
  mintedItems: {},
  items: [],
  filteredItems: [],
  availableItems: [],
  ownedItems: [],
};

export const GlobalContext = createContext<GlobalContextType>({
  state: initialState,
  dispatch: () => null,
});

export const GlobalProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
