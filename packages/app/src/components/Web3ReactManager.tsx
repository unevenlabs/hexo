import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";

import { eagerConnect } from "../connectors";

export default function Web3ReactManager({ children }) {
  const web3ReactContext = useWeb3React();

  useEffect(() => {
    eagerConnect(web3ReactContext);
  }, []);

  return children;
}
