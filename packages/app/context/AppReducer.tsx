import { Actions, State } from "interfaces/context";

const AppReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case "UPDATE_SHOW":
      return { ...state, show: action.showPayload };
    case "UPDATE_COLOR":
      return { ...state, color: action.payload };
    case "FILTER":
      return { ...state, filter: action.payload };
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
    default:
      return state;
  }
};

export default AppReducer;
